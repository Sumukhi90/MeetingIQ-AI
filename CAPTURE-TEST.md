# Capture Test

Status: **BLOCKED: canary not yet sent**

Tool: GitHub Copilot in VS Code.

Model: The active serving model is not exposed in the local transcript or model catalog. The capture records `unknown` rather than guessing.

Mechanism: A PowerShell `FileSystemWatcher` monitors the Copilot transcript JSONL file and appends completed prompt/response pairs to `.agent-logs/`. No prompt/response lifecycle hook is exposed by the installed Copilot extension. The watcher is in [capture-agent.ps1](capture-agent.ps1).

Config changed: None. VS Code/Copilot has no project-level hook configuration for this event in the installed extension.

Expected log path: `.agent-logs/YYYY-MM-DD_HH-MM-SS_<session-id>.md`.

Canary entries: Not available yet. This environment does not let the agent send a new user prompt or open a second Copilot session, and the current agent transcript exposes assistant/tool events but no `user.message` records. A human must send the two canaries in separate sessions while the watcher is running.

Tried first: Inspected the installed Copilot extension for lifecycle hooks, inspected the workspace debug log and transcript store, and checked the model catalog. The catalog contains available models only; it does not identify the serving model for this turn.