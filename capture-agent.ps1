param(
    [Parameter()]
    [string] $TranscriptPath = "${env:APPDATA}\Code\User\workspaceStorage\a7a25d08bd1265e45bc2805c1f9231be\GitHub.copilot-chat\transcripts",

    [string] $LogDirectory = (Join-Path $PSScriptRoot '.agent-logs')
)

$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path $LogDirectory | Out-Null

$sessionStates = @{}
$pendingPromptBySession = @{}

function Get-TranscriptFiles {
    if (Test-Path $TranscriptPath -PathType Container) {
        return @(Get-ChildItem -Path $TranscriptPath -Filter *.jsonl -File | Select-Object -ExpandProperty FullName)
    }
    if (Test-Path $TranscriptPath -PathType Leaf) {
        return @($TranscriptPath)
    }
    return @()
}

function Get-SessionId($filePath) {
    return [IO.Path]::GetFileNameWithoutExtension($filePath)
}

function Get-ModelName($record) {
    if ($null -eq $record -or $null -eq $record.data) {
        return 'unknown'
    }
    foreach ($property in @('model', 'modelId', 'modelName')) {
        if ($record.data.PSObject.Properties.Name -contains $property -and $record.data.$property) {
            return [string] $record.data.$property
        }
    }
    return 'unknown'
}

function Get-Text($record) {
    if ($null -eq $record -or $null -eq $record.data) {
        return ''
    }
    foreach ($property in @('content', 'message')) {
        if ($record.data.PSObject.Properties.Name -contains $property) {
            return [string] $record.data.$property
        }
    }
    return ''
}

function Ensure-LogFile($sessionId, $promptTimestamp) {
    $logPath = Join-Path $LogDirectory ((Get-Date).ToUniversalTime().ToString('yyyy-MM-dd_HH-mm-ss') + "_$sessionId.md")
    if (-not (Test-Path $logPath)) {
        @(
            '---'
            "session_id: $sessionId"
            "date: $($promptTimestamp.Substring(0, 10))"
            'author: unknown'
            'model: unknown'
            'tool: github-copilot-vscode'
            "project: $([IO.Path]::GetFileName($PSScriptRoot))"
            'total_exchanges: 0'
            "first_prompt_time: $promptTimestamp"
            "last_prompt_time: $promptTimestamp"
            '---'
            ''
            "# Session Log - $($promptTimestamp.Substring(0, 10))"
            ''
        ) | Set-Content -Encoding utf8 $logPath
    }
    return $logPath
}

function Write-Entry($sessionId, $promptRecord, $responseRecord) {
    $timestamp = ([datetime]::Parse($promptRecord.timestamp)).ToUniversalTime().ToString('o')
    $responseTimestamp = ([datetime]::Parse($responseRecord.timestamp)).ToUniversalTime().ToString('o')
    $model = Get-ModelName $responseRecord
    $logPath = Ensure-LogFile $sessionId $timestamp
    $number = ([regex]::Matches((Get-Content -Raw $logPath), '\[LOG_ENTRY type=PROMPT')).Count + 1
    Add-Content -Encoding utf8 $logPath @(
        "[LOG_ENTRY type=PROMPT num=$number session=$sessionId]"
        "timestamp: $timestamp"
        "model: $model"
        ''
        (Get-Text $promptRecord)
        ''
        "[LOG_ENTRY type=RESPONSE num=$number session=$sessionId]"
        "timestamp: $responseTimestamp"
        "model: $model"
        ''
        (Get-Text $responseRecord)
        ''
    )
    $header = @(
        '---'
        "session_id: $sessionId"
        "date: $($timestamp.Substring(0, 10))"
        'author: unknown'
        "model: $model"
        'tool: github-copilot-vscode'
        "project: $([IO.Path]::GetFileName($PSScriptRoot))"
        'total_exchanges: 0'
        "first_prompt_time: $timestamp"
        "last_prompt_time: $responseTimestamp"
        '---'
    )
    $existing = Get-Content -Raw $logPath
    if ($existing -match 'total_exchanges: 0') {
        $content = $existing -replace 'total_exchanges: 0', 'total_exchanges: 1'
        $content = $content -replace 'last_prompt_time: .*', "last_prompt_time: $responseTimestamp"
        Set-Content -Encoding utf8 $logPath $content
    }
}

function Read-NewRecords {
    param([string]$FilePath)
    if (-not (Test-Path $FilePath)) { return }

    $resolved = (Resolve-Path -LiteralPath $FilePath).Path
    $sessionId = Get-SessionId $resolved
    if (-not $sessionStates.ContainsKey($resolved)) {
        $sessionStates[$resolved] = @{}
    }
    $seen = $sessionStates[$resolved]

    foreach ($line in Get-Content -LiteralPath $resolved) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        try { $record = $line | ConvertFrom-Json } catch { continue }
        if ($null -eq $record -or $null -eq $record.id) { continue }
        if ($seen.ContainsKey($record.id)) { continue }
        $seen[$record.id] = $true

        if ($record.type -eq 'user.message') {
            $pendingPromptBySession[$sessionId] = $record
            continue
        }

        if ($record.type -eq 'assistant.message') {
            $pendingPrompt = $null
            if ($pendingPromptBySession.ContainsKey($sessionId)) {
                $pendingPrompt = $pendingPromptBySession[$sessionId]
                $pendingPromptBySession.Remove($sessionId)
            }

            $toolRequests = @()
            if ($record.data -and $record.data.PSObject.Properties.Name -contains 'toolRequests') {
                $toolRequests = @($record.data.toolRequests)
            }
            $responseText = Get-Text $record
            if ($pendingPrompt -and $toolRequests.Count -eq 0 -and $responseText) {
                Write-Entry -sessionId $sessionId -promptRecord $pendingPrompt -responseRecord $record
            }
        }
    }
}

foreach ($file in Get-TranscriptFiles) {
    Read-NewRecords -FilePath $file
}

$watchRoot = if ((Test-Path $TranscriptPath -PathType Container)) { $TranscriptPath } else { Split-Path $TranscriptPath }
$fileFilter = if ((Test-Path $TranscriptPath -PathType Container)) { '*.jsonl' } else { [IO.Path]::GetFileName($TranscriptPath) }

$watcher = New-Object IO.FileSystemWatcher $watchRoot, $fileFilter
$watcher.NotifyFilter = [IO.NotifyFilters]::LastWrite -bor [IO.NotifyFilters]::FileName -bor [IO.NotifyFilters]::CreationTime
$watcher.EnableRaisingEvents = $true

$action = {
    param($sender, $eventArgs)
    try {
        $path = $eventArgs.FullPath
        if ($path -and (Test-Path $path) -and $path.EndsWith('.jsonl')) {
            Read-NewRecords -FilePath $path
        }
    }
    catch {
        Write-Error $_
    }
}

$changedRegistration = Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action
$createdRegistration = Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action
try {
    while ($true) { Wait-Event -Timeout 5 | Out-Null }
}
finally {
    Unregister-Event -SubscriptionId $changedRegistration.Id
    Unregister-Event -SubscriptionId $createdRegistration.Id
    $watcher.Dispose()
}