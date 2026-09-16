import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CirclePlay,
  Clock3,
  Copy,
  FileText,
  Filter,
  Headphones,
  Highlighter,
  Home,
  LayoutList,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  allActions,
  allHighlights,
  formatTime,
  meetings,
  type ActionItem,
  type Highlight,
  type Meeting,
  type Status,
} from "./data";

const iconMap: Record<string, any> = {
  Home,
  LayoutList,
  Highlighter,
  Target,
  Search,
  CalendarDays,
  Settings,
};
function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark">
        <Sparkles size={15} />
      </span>
      <span>
        Meeting<span>IQ</span>
      </span>
    </Link>
  );
}
function Shell({
  children,
  onRecord,
}: {
  children: React.ReactNode;
  onRecord: () => void;
}) {
  const location = useLocation();
  const [mobile, setMobile] = useState(false);
  const primaryNav = [
    { to: "/", label: "Home", icon: "Home" },
    { to: "/meetings", label: "Meetings", icon: "LayoutList" },
    { to: "/calendar", label: "Calendar", icon: "CalendarDays" },
  ];
  const workspaceNav = [
    { to: "/highlights", label: "Highlights", icon: "Highlighter" },
    { to: "/action-items", label: "Action items", icon: "Target" },
    { to: "/search", label: "Search", icon: "Search" },
  ];
  const renderNav = (items: typeof primaryNav) => items.map((n) => {
    const Icon = iconMap[n.icon];
    return <NavLink key={n.to} to={n.to} end={n.to === "/"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setMobile(false)}><Icon size={16} /><span>{n.label}</span>{n.label === "Highlights" && <b className="nav-count">{allHighlights().length}</b>}</NavLink>;
  });
  return (
    <div className="app-shell">
      <aside className={mobile ? "sidebar open" : "sidebar"}>
        <div className="sidebar-top">
          <Logo />
          <button
            className="icon-button mobile-close"
            onClick={() => setMobile(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav><div className="nav-label">Workspace</div>{renderNav(primaryNav)}<div className="nav-label">Library</div>{renderNav(workspaceNav)}<div className="nav-label">Collections</div><button className="nav-link muted-link"><Plus size={15}/><span>New folder</span></button><div className="nav-label">Connections</div><NavLink to="/calendar" className="nav-link"><Zap size={15}/><span>Integrations</span></NavLink></nav>
        <div className="sidebar-bottom">
          <NavLink to="/settings" className="nav-link">
            <Settings size={17} />
            <span>Settings</span>
          </NavLink>
          <div className="profile">
            <div className="avatar">AM</div>
            <div>
              <strong>Alex Morgan</strong>
              <small>Free workspace</small>
            </div>
            <MoreHorizontal size={16} />
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            onClick={() => setMobile(true)}
          >
            <Menu size={19} />
          </button>
          <div className="crumb">
            {location.pathname === "/"
              ? "Workspace overview"
              : location.pathname.split("/")[1]?.replace("-", " ")}
          </div>
          <div className="top-actions">
            <Link to="/search" className="top-search">
              <Search size={16} /> <span>Search meetings</span>
              <kbd>⌘ K</kbd>
            </Link>
            <button className="record-button" onClick={onRecord}>
              <span className="record-dot" /> Record
            </button>
            <button className="icon-button">
              <Bell size={18} />
            </button>
            <div className="avatar avatar-small">AM</div>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
function PageTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
      </div>
      {children && <div className="title-actions">{children}</div>}
    </div>
  );
}
function Metric({ label, value, note, icon: Icon, tone }: any) {
  return (
    <div className="metric">
      <div className={`metric-icon ${tone}`}>
        <Icon size={17} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}
function MeetingRow({
  meeting,
  compact = false,
}: {
  meeting: Meeting;
  compact?: boolean;
}) {
  return (
    <Link
      to={`/meetings/${meeting.id}`}
      className={`meeting-row ${compact ? "compact" : ""}`}
    >
      <div className="meeting-mark"><CalendarDays size={16}/></div>
      <div className="meeting-main">
        <div className="row-title">
          <strong>{meeting.title}</strong>
          <span className="source">
            <span className="source-dot" /> {meeting.source}
          </span>
        </div>
        <p>{meeting.summary}</p>
        <div className="row-meta"><span className="avatar-stack">{meeting.participants.slice(0,4).map(p=><span key={p.name} className="mini-avatar" style={{background:p.color}}>{p.initials.slice(0,1)}</span>)}{meeting.participants.length>4&&<span className="mini-avatar more">+{meeting.participants.length-4}</span>}</span>
          <span><CalendarDays size={12}/>{meeting.date} · {meeting.time}</span>
          <span>
            <Clock3 size={13} />
            {Math.round(meeting.duration / 60)} min
          </span>
          <span>
            <Users size={13} />
            {meeting.participants.length} participants
          </span>
          <span>{meeting.type}</span>
        </div>
      </div>
      <div className="row-stats"><span className="row-hover">Open <ArrowLeft size={12} className="rotate"/></span>
        <span>
          <MessageSquare size={14} /> {meeting.actionItems.length}
        </span>
        <span>
          <Highlighter size={14} /> {meeting.highlights.length}
        </span>
        <ChevronDown size={16} />
      </div>
    </Link>
  );
}
function HomePage({ onRecord }: { onRecord: () => void }) {
  const [ask, setAsk] = useState("");
  const [answer, setAnswer] = useState("");
  const askIt = () => {
    if (!ask.trim()) return;
    const q = ask.toLowerCase();
    setAnswer(
      q.includes("onboard")
        ? "The team identified setup friction as the clearest retention opportunity and agreed to prioritize guided onboarding before expanding enterprise AI."
        : q.includes("owner")
          ? "Sarah owns the onboarding funnel review and customer feedback group. David owns the enterprise AI beta architecture."
          : q.includes("launch")
            ? "The enterprise AI beta is targeted for October, with launch messaging due September 20."
            : "Across the workspace, the strongest thread is turning customer feedback into a more focused onboarding and launch plan.",
    );
  };
  return (
    <>
      <PageTitle eyebrow="Monday, September 15" title="Good afternoon, Sumukhi">
        <button className="button primary" onClick={onRecord}>
          <CirclePlay size={16} /> Record
        </button>
      </PageTitle>
      <p className="lede">Your meeting workspace, ready when you are.</p>
      <section className="next-meeting"><div><div className="eyebrow">Up next · in 20 minutes</div><h2>Q3 Product Strategy Review</h2><p><Clock3 size={14}/> 10:00 AM – 11:00 AM <span>·</span><Users size={14}/> 8 participants <span>·</span> Microsoft Teams</p></div><div className="next-actions"><button className="button subtle">Join</button><button className="button primary" onClick={onRecord}><CirclePlay size={14}/> Record</button></div></section>
      <div className="home-grid">
        <section className="panel upcoming">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Your calendar</div>
              <h2>Upcoming meetings</h2>
            </div>
            <Link to="/calendar" className="text-link">
              View calendar <ArrowLeft size={14} className="rotate" />
            </Link>
          </div>
          {[
            ["10:00 AM", "Product Design Sync", "Google Meet"],
            ["11:30 AM", "Customer Discovery", "Zoom"],
            ["2:00 PM", "Q3 Product Strategy Review", "Microsoft Teams"],
          ].map((x, i) => (
            <div className="upcoming-row" key={x[1]}>
              <time>{x[0]}</time>
              <div>
                <strong>{x[1]}</strong>
                <span>{x[2]}</span>
              </div>
              <span className={`calendar-pill c${i}`}>
                {i === 0 ? "Design" : i === 1 ? "Customer" : "Strategy"}
              </span>
            </div>
          ))}
        </section>
        <section className="ask-card">
          <div className="eyebrow">MeetingIQ intelligence</div>
          <h2>Ask across your meetings</h2>
          <p>Get a quick answer from your searchable meeting history.</p>
          <div className="ask-input">
            <Search size={17} />
            <input
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askIt()}
              placeholder="What did we decide about the launch?"
            />
            <button onClick={askIt}>
              <ArrowLeft size={16} className="rotate" />
            </button>
          </div>
          {answer ? (
            <div className="answer">
              <Sparkles size={15} />
              <span>{answer}</span>
            </div>
          ) : (
            <div className="suggestions">
              <button
                onClick={() => setAsk("What did we decide about onboarding?")}
              >
                Onboarding priorities <ArrowLeft size={13} className="rotate" />
              </button>
              <button
                onClick={() => setAsk("Who owns the enterprise AI beta?")}
              >
                Action owners <ArrowLeft size={13} className="rotate" />
              </button>
            </div>
          )}
        </section>
      </div>
      <section className="panel recent">
        <div className="panel-head">
          <div>
            <div className="eyebrow">Meeting history</div>
            <h2>Recent meetings</h2>
          </div>
          <Link to="/meetings" className="text-link">
            View all <ArrowLeft size={14} className="rotate" />
          </Link>
        </div>
        {meetings.slice(0, 4).map((m) => (
          <MeetingRow key={m.id} meeting={m} />
        ))}
      </section>
    </>
  );
}
function MeetingsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const shown = meetings.filter(
    (m) =>
      (filter === "All" || m.type === filter) &&
      m.title.toLowerCase().includes(search.toLowerCase()),
  );
  const groups = [
    { label: "Today", items: shown.slice(0, 1) },
    { label: "This week", items: shown.slice(1, 4) },
    { label: "Earlier", items: shown.slice(4) },
  ].filter((group) => group.items.length);
  return (
    <>
      <PageTitle eyebrow="Workspace" title="Meetings">
        <button className="button subtle">
          <Filter size={15} /> Filters
        </button>
      </PageTitle>
      <div className="library-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            placeholder="Search meetings"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="segmented">
          {["All", "Strategy", "Customer", "Planning"].map((f) => (
            <button
              className={filter === f ? "selected" : ""}
              onClick={() => setFilter(f)}
              key={f}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="meeting-list grouped-meetings">
        {shown.length ? groups.map((group) => <section className="meeting-group" key={group.label}><div className="group-label"><span>{group.label}</span><b>{group.items.length}</b></div>{group.items.map((m) => <MeetingRow key={m.id} meeting={m} />)}</section>) : (
          <div className="empty">
            <Search size={28} />
            <h3>No meetings found</h3>
            <p>Try another title or filter.</p>
          </div>
        )}
      </div>
    </>
  );
}
function Player({ meeting, current, setCurrent, playing, setPlaying }: any) {
  const [speed, setSpeed] = useState(1);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () =>
        setCurrent((c: number) =>
          c >= meeting.duration ? (setPlaying(false), 0) : c + speed,
        ),
      1000,
    );
    return () => clearInterval(id);
  }, [playing, speed, meeting.duration, setCurrent, setPlaying]);
  return (
    <div className="player">
      <div className={`recording-stage ${playing ? "is-playing" : ""}`}><div className="stage-top"><span><span className="recording-live"/> {playing ? "Playing meeting" : "Meeting recording"}</span><span>{meeting.source} · {meeting.participants.length} participants</span></div><div className="video-grid">{meeting.participants.map((p: any, i: number)=><div className={`video-tile ${i === Math.floor((current / meeting.duration) * meeting.participants.length) ? "speaking" : ""}`} key={p.name}><span className="video-avatar" style={{background:p.color}}>{p.initials}</span><span className="video-name">{p.name}</span>{i === 0 && <span className="mic-state"><Activity size={11}/></span>}</div>)}</div></div>
      <input
        className="timeline"
        type="range"
        min="0"
        max={meeting.duration}
        value={current}
        onChange={(e) => setCurrent(Number(e.target.value))}
      />
      <div className="player-controls">
        <button className="play-button" onClick={() => setPlaying(!playing)}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <span className="timecode">
          {formatTime(current)} <em>/ {formatTime(meeting.duration)}</em>
        </span>
        <div className="player-spacer" />
        <VolumeIcon />
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
        </select>
        <button className="icon-button" title="More player options">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
function VolumeIcon() {
  return (
    <div className="volume">
      <Activity size={16} />
      <span>Simulated audio</span>
    </div>
  );
}
function seventy(n: number) {
  return n;
}
function MeetingPage({ onHighlight }: { onHighlight: (h: Highlight) => void }) {
  const { id } = useParams();
  const meeting = meetings.find((m) => m.id === id);
  const [tab, setTab] = useState("Summary");
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState("");
  const [template, setTemplate] = useState("Standard");
  const [selected, setSelected] = useState<string | null>(null);
  const [actionStatuses, setActionStatuses] = useState<Record<string, Status>>({});
  const activeLine = [...meeting?.transcript ?? []].reverse().find((line) => line.time <= current)?.id;
  if (!meeting)
    return (
      <div className="empty">
        <h2>Meeting not found</h2>
        <Link to="/meetings" className="button primary">
          Back to meetings
        </Link>
      </div>
    );
  const jump = (time: number) => {
    setCurrent(time);
    setPlaying(false);
    setTab("Transcript");
    setTimeout(
      () =>
        document
          .getElementById(`line-${time}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      30,
    );
  };
  const templates: Record<string, string> = {
    Standard: meeting.summary,
    "Executive Brief":
      "The team aligned on a focused Q3 sequence: fix onboarding first, then launch a measured enterprise AI beta in October. Capacity and customer evidence are the gating factors.",
    "Project Update":
      "Onboarding is the immediate workstream. David is preparing beta architecture, Sarah is recruiting feedback teams, and Marketing is shaping an October narrative.",
    "Customer Call":
      "Customers reach value once setup is complete. The feedback group will validate guided onboarding and measure time to first useful answer.",
    "Sales Review":
      "Enterprise demand is strong for AI workspace capabilities, with predictable pricing and procurement guardrails required for conversion.",
  };
  const filtered = meeting.transcript.filter((x) =>
    x.text.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="back-link">
        <Link to="/meetings">
          <ArrowLeft size={15} /> All meetings
        </Link>
      </div>
      <PageTitle title={meeting.title}>
        <Link className="button subtle" to={`/share/${meeting.id}`}>
          <Share2 size={15} /> Share
        </Link>
        <button className="button primary" onClick={() => setPlaying(!playing)}>
          {playing ? <Pause size={15} /> : <Play size={15} />}{" "}
          {playing ? "Pause" : "Play"}
        </button>
        <button className="icon-button header-more" title="More meeting actions"><MoreHorizontal size={18}/></button>
      </PageTitle>
      <div className="meeting-meta hero-meta"><div className="avatar-stack hero-avatars">{meeting.participants.map(p=><span className="mini-avatar" key={p.name} style={{background:p.color}}>{p.initials.slice(0,1)}</span>)}</div>
        <span>
          <CalendarDays size={14} /> {meeting.date} · {meeting.time}
        </span>
        <span>
          <Clock3 size={14} /> 60 min
        </span>
        <span>
          <Users size={14} /> {meeting.participants.length} participants
        </span>
        <span>
          <span className="source-dot" /> {meeting.source}
        </span>
      </div>
      <Player
        meeting={meeting}
        current={current}
        setCurrent={setCurrent}
        playing={playing}
        setPlaying={setPlaying}
      />
      <div className="meeting-tabs">
        {["Summary", "Transcript", "Ask MeetingIQ", "Highlights", "Action Items"].map((t) => (
          <button
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            <span>{t}</span>
            {t === "Highlights" && meeting.highlights.length > 0 ? (
              <b>{meeting.highlights.length}</b>
            ) : null}
          </button>
        ))}
      </div>
      {tab === "Summary" && (
        <div className="detail-grid">
          <section className="panel overview-main">
            <div className="panel-head">
              <div>
                <div className="eyebrow">AI summary</div>
                <h2>Meeting summary</h2>
              </div>
              <div className="select-wrap">
                <Sparkles size={14} />
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  {Object.keys(templates).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="summary">{templates[template]}</p>
            <div className="section-divider" />
            <div className="eyebrow">Key takeaways</div>
            <ul className="takeaways"><li>Onboarding friction is the clearest retention opportunity.</li><li>The enterprise AI beta is targeted for October.</li><li>Two engineers will move onto the onboarding initiative.</li></ul>
            <div className="section-divider" />
            <div className="eyebrow">Topics</div>
            <div className="topic-list">
              {meeting.topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    setQuery(topic);
                    setTab("Transcript");
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
            <div className="section-divider" />
            <div className="eyebrow">Decisions</div>
            <div className="decisions">
              {meeting.decisions.map((d) => (
                <button
                  className="decision"
                  key={d.text}
                  onClick={() => jump(d.time)}
                >
                  <span className="decision-icon">
                    <Check size={14} />
                  </span>
                  <span>
                    <strong>{d.text}</strong>
                    <small>Jump to {formatTime(d.time)}</small>
                  </span>
                  <ArrowLeft size={15} className="rotate" />
                </button>
              ))}
            </div>
          </section>
          <aside className="side-stack">
            <div className="panel">
              <div className="eyebrow">Highlights</div>
              <h3>Key moments</h3>
              <div className="summary-highlights">{meeting.highlights.map(h=><button key={h.id} onClick={()=>jump(h.time)}><strong>{formatTime(h.time)}</strong><span>{h.quote}</span></button>)}</div>
            </div>
            <div className="panel context-actions"><div className="context-heading"><div><div className="eyebrow">Follow-through</div><h3>Action items</h3></div><span>{meeting.actionItems.length}</span></div>{meeting.actionItems.slice(0,3).map(a=><button className="context-action" key={a.id} onClick={()=>jump(a.time)}><span className={`context-check ${a.status === "Completed" ? "done" : ""}`}>{a.status === "Completed" ? <Check size={10}/> : ""}</span><span><strong>{a.task}</strong><small>{a.owner} · {a.due}</small></span></button>)}</div>
            <div className="panel participants-panel">
              <div className="eyebrow">Participants</div>
              <h3>{meeting.participants.length} people</h3>
              <div className="participant-list">
                {meeting.participants.map((p) => (
                  <div key={p.name}>
                    <span className="avatar" style={{ background: p.color }}>
                      {p.initials}
                    </span>
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.role}</small>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel accent-panel">
              <Sparkles size={17} />
              <strong>Ask about this meeting</strong>
              <p>Try “What are the biggest risks?”</p>
              <button
                className="button light"
                onClick={() => setTab("Transcript")}
              >
                Open transcript
              </button>
            </div>
          </aside>
        </div>
      )}
      {tab === "Transcript" && (
        <div className="transcript-layout">
          <section className="panel transcript-panel">
            <div className="transcript-tools">
              <div>
                <div className="eyebrow">Live transcript</div>
                <h2>{meeting.transcript.length} moments</h2>
              </div>
              <div className="search-field small">
                <Search size={15} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find in transcript"
                />
              </div>
            </div>
            <div className="transcript-list">
              {filtered.map((line) => (
                <div
                  id={`line-${line.time}`}
                  className={`transcript-line ${selected === line.id ? "selected" : ""} ${activeLine === line.id ? "playing" : ""}`}
                  key={line.id}
                  onClick={() => {
                    setSelected(line.id);
                    setCurrent(line.time);
                  }}
                >
                  <button
                    className="timestamp"
                    onClick={(e) => {
                      e.stopPropagation();
                      jump(line.time);
                    }}
                  >
                    {formatTime(line.time)}
                  </button>
                  <div
                    className="speaker-dot"
                    style={{
                      background: meeting.participants.find(
                        (p) => p.name === line.speaker,
                      )?.color,
                    }}
                  />
                  <div className="line-copy">
                    <strong>{line.speaker}</strong>
                    <p>{highlightText(line.text, query)}</p>
                  </div>
                  <button
                    className="line-action"
                    title="Save highlight"
                    onClick={(e) => {
                      e.stopPropagation();
                      const note = window.prompt(
                        "Add a note to this highlight",
                        "Important moment",
                      );
                      if (note !== null)
                        onHighlight({
                          id: `h-${Date.now()}`,
                          meetingId: meeting.id,
                          time: line.time,
                          speaker: line.speaker,
                          quote: line.text,
                          note,
                        });
                    }}
                  >
                    <Highlighter size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <aside className="panel transcript-aside">
            <div className="eyebrow">Transcript actions</div>
            <h3>Make the moment useful</h3>
            <p>
              Click a timestamp to sync the player, or save a highlight for your
              team.
            </p>
            <div className="aside-note">
              <Highlighter size={16} />
              <span>
                Highlights show up in your workspace and can be shared.
              </span>
            </div>
          </aside>
        </div>
      )}
      {tab === "Ask MeetingIQ" && <MeetingAsk meeting={meeting} onJump={jump} />}
      {tab === "Highlights" && (
        <HighlightsList highlights={meeting.highlights} onJump={jump} />
      )}{" "}
      {tab === "Action Items" && (
        <ActionsList actions={meeting.actionItems.map((action) => ({ ...action, status: actionStatuses[action.id] || action.status }))} onStatus={(actionId) => setActionStatuses((current) => { const action = meeting.actionItems.find((item) => item.id === actionId); if (!action) return current; const status = current[actionId] || action.status; return { ...current, [actionId]: status === "Completed" ? "Open" : "Completed" }; })} />
      )}
    </>
  );
}
function MeetingAsk({ meeting, onJump }: { meeting: Meeting; onJump: (time: number) => void }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const ask = (value = question) => {
    if (!value.trim()) return;
    setQuestion(value);
    const q = value.toLowerCase();
    setAnswer(q.includes("risk") ? "The main risk is focus: the team wants onboarding healthier before broadening the enterprise AI launch. Engineering capacity and customer evidence are the constraints." : q.includes("owner") || q.includes("owns") || q.includes("action") ? "Sarah owns the onboarding funnel review and customer feedback group. David owns the beta architecture, while Priya owns launch messaging." : q.includes("launch") || q.includes("when") ? "The enterprise AI beta is targeted for October, with onboarding improvements first in the sequence." : "The meeting centered on retention, onboarding friction, and a measured enterprise AI beta. The team agreed on a clear Q3 sequence.");
  };
  return <div className="ask-workspace"><section className="panel ask-main"><div className="ask-heading"><div className="ai-spark"><Sparkles size={17}/></div><div><div className="eyebrow">Meeting intelligence</div><h2>Ask MeetingIQ</h2><p>Ask anything about this meeting.</p></div></div><div className="ask-question"><input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key === "Enter" && ask()} placeholder="What were the main decisions?"/><button onClick={()=>ask()}><ArrowLeft size={16} className="rotate"/></button></div>{answer ? <div className="ask-answer"><div className="eyebrow">Answer</div><p>{answer}</p><div className="answer-sources"><span>Sources</span><button onClick={()=>onJump(1452)}>24:12</button><button onClick={()=>onJump(1874)}>31:14</button></div></div> : <div className="ask-suggestions">{["What were the main decisions?","What risks were discussed?","Who owns onboarding?","When is the enterprise beta?"] .map(q=><button key={q} onClick={()=>ask(q)}>{q}<ArrowLeft size={13} className="rotate"/></button>)}</div>}</section><aside className="panel ask-side"><div className="eyebrow">Meeting context</div><h3>{meeting.title}</h3><p>{meeting.participants.length} participants · {formatTime(meeting.duration)} · {meeting.source}</p><div className="ask-context-row"><Highlighter size={15}/><span>{meeting.highlights.length} saved highlights</span></div><div className="ask-context-row"><Target size={15}/><span>{meeting.actionItems.length} action items</span></div></aside></div>;
}
function highlightText(text: string, q: string) {
  if (!q) return text;
  const parts = text.split(
    new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"),
  );
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? <mark key={i}>{p}</mark> : p,
      )}
    </>
  );
}
function HighlightsList({
  highlights,
  onJump,
}: {
  highlights: Highlight[];
  onJump: (n: number) => void;
}) {
  return (
    <div className="highlight-grid">
      {highlights.map((h) => (
        <div className="highlight-card" key={h.id}>
          <div className="highlight-top">
            <Highlighter size={16} />
            <button onClick={() => onJump(h.time)}>
              {formatTime(h.time)} <ArrowLeft size={13} className="rotate" />
            </button>
          </div>
          <p>“{h.quote}”</p>
          <strong>{h.speaker}</strong>
          <small>{h.note}</small>
        </div>
      ))}
    </div>
  );
}
function ActionsList({
  actions,
  onStatus,
}: {
  actions: ActionItem[];
  onStatus: (id: string) => void;
}) {
  return (
    <div className="panel actions-panel">
      <div className="panel-head">
        <div>
          <div className="eyebrow">Follow-through</div>
          <h2>Action items</h2>
        </div>
        <span className="muted">{actions.length} from this meeting</span>
      </div>
      {actions.map((a) => (
        <div className="action-row" key={a.id}>
          <button
            className={`check-box ${a.status === "Completed" ? "done" : ""}`}
            onClick={() => onStatus(a.id)}
          >
            {a.status === "Completed" && <Check size={13} />}
          </button>
          <div>
            <strong className={a.status === "Completed" ? "strike" : ""}>
              {a.task}
            </strong>
            <small>
              {a.owner} · Due {a.due} ·{" "}
              <span
                className={`status ${a.status.replace(" ", "-").toLowerCase()}`}
              >
                {a.status}
              </span>
            </small>
          </div>
          <button className="icon-button">
            <MoreHorizontal size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
function HighlightsPage() {
  const [, setTick] = useState(0);
  const highlights = allHighlights();
  return (
    <>
      <PageTitle eyebrow="Workspace" title="Highlights">
        <span className="muted">{highlights.length} saved moments</span>
      </PageTitle>
      <div className="highlight-grid workspace-highlights">
        {highlights.map((h) => {
          const m = meetings.find((x) => x.id === h.meetingId)!;
          return (
            <Link
              to={`/meetings/${m.id}?t=${h.time}`}
              className="highlight-card"
              key={h.id}
            >
              <div className="highlight-top">
                <span>
                  <Highlighter size={16} /> {m.title}
                </span>
                <span>
                  {formatTime(h.time)}{" "}
                  <ArrowLeft size={13} className="rotate" />
                </span>
              </div>
              <p>“{h.quote}”</p>
              <strong>{h.speaker}</strong>
              <small>{h.note}</small>
            </Link>
          );
        })}
      </div>
    </>
  );
}
function ActionItemsPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [filter, setFilter] = useState("All");
  const actions = allActions()
    .map((a) => ({ ...a, status: statuses[a.id] || a.status }))
    .filter((a) => filter === "All" || a.status === filter);
  const update = (id: string) =>
    setStatuses((s) => {
      const a = allActions().find((x) => x.id === id)!;
      const now = s[id] || a.status;
      return { ...s, [id]: now === "Completed" ? "Open" : "Completed" };
    });
  return (
    <>
      <PageTitle eyebrow="Workspace" title="Action items">
        <button className="button subtle">
          <Filter size={15} /> Filter
        </button>
      </PageTitle>
      <div className="segmented action-filters">
        {["All", "Open", "In progress", "Completed"].map((f) => (
          <button
            className={filter === f ? "selected" : ""}
            onClick={() => setFilter(f)}
            key={f}
          >
            {f}
          </button>
        ))}
      </div>
      <ActionsList actions={actions} onStatus={update} />
    </>
  );
}
function SearchPage() {
  const [q, setQ] = useState("enterprise");
  const results = useMemo(() => {
    const query = q.toLowerCase();
    return meetings
      .flatMap((m) => [
        { kind: "Meeting", title: m.title, text: m.summary, time: 0, id: m.id },
        ...m.transcript
          .filter((t) => t.text.toLowerCase().includes(query))
          .map((t) => ({
            kind: "Transcript",
            title: m.title,
            text: t.text,
            time: t.time,
            id: m.id,
          })),
        ...m.actionItems
          .filter((a) => `${a.task} ${a.owner}`.toLowerCase().includes(query))
          .map((a) => ({
            kind: "Action item",
            title: m.title,
            text: `${a.task} · ${a.owner}`,
            time: a.time,
            id: m.id,
          })),
      ])
      .filter(
        (x) =>
          x.title.toLowerCase().includes(query) ||
          x.text.toLowerCase().includes(query),
      );
  }, [q]);
  return (
    <>
      <PageTitle eyebrow="Workspace" title="Search your meetings" />
      <div className="global-search">
        <Search size={20} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for a topic, person, or decision"
        />
        <kbd>⌘ K</kbd>
      </div>
      <div className="search-summary">
        <strong>{results.length} results</strong>
        <span>for “{q}”</span>
      </div>
      <div className="search-results">
        {results.map((r, i) => (
          <Link
            className="search-result"
            to={`/meetings/${r.id}${r.time ? `?t=${r.time}` : ""}`}
            key={i}
          >
            <div className="result-icon">
              <FileText size={16} />
            </div>
            <div>
              <span className="result-type">
                {r.kind} · {r.time ? formatTime(r.time) : "Meeting overview"}
              </span>
              <strong>{r.title}</strong>
              <p>{r.text}</p>
            </div>
            <ArrowLeft size={15} className="rotate" />
          </Link>
        ))}
        {!results.length && (
          <div className="empty">
            <Search size={28} />
            <h3>No results for “{q}”</h3>
            <p>Try enterprise, onboarding, launch, Sarah, or pricing.</p>
          </div>
        )}
      </div>
    </>
  );
}
function CalendarPage() {
  const [connected, setConnected] = useState(false);
  return (
    <>
      <PageTitle eyebrow="Workspace" title="Calendar">
        <button className="button primary" onClick={() => setConnected(true)}>
          <Plus size={15} /> Connect calendar
        </button>
      </PageTitle>
      <div className="calendar-banner">
        <div className="calendar-symbol">
          <CalendarDays size={24} />
        </div>
        <div>
          <h2>
            {connected
              ? "Calendar connected"
              : "Bring your meetings into focus"}
          </h2>
          <p>
            {connected
              ? "Your upcoming meetings are now visible in MeetingIQ."
              : "Connect a calendar to automatically prepare MeetingIQ for your day."}
          </p>
        </div>
        <span className={`connection ${connected ? "connected" : ""}`}>
          {connected ? (
            <>
              <Check size={13} /> Connected
            </>
          ) : (
            "Not connected"
          )}
        </span>
      </div>
      <div className="integration-grid">
        {[
          "Google Calendar",
          "Microsoft Outlook",
          "Zoom",
          "Google Meet",
          "Microsoft Teams",
        ].map((x, i) => (
          <div className="integration" key={x}>
            <div className={`integration-icon i${i}`}>{x[0]}</div>
            <div>
              <strong>{x}</strong>
              <small>{connected && i < 2 ? "Connected" : "Available"}</small>
            </div>
            <button
              className="button subtle"
              onClick={() => setConnected(true)}
            >
              {connected && i < 2 ? "Manage" : "Connect"}
            </button>
          </div>
        ))}
      </div>
      <section className="panel calendar-list">
        <div className="eyebrow">Monday, September 15</div>
        <h2>Today’s schedule</h2>
        {[
          ["10:00 AM", "Product Design Sync", "Design team"],
          ["11:30 AM", "Customer Discovery", "Customer team"],
          ["2:00 PM", "Q3 Product Strategy Review", "Leadership team"],
        ].map((x) => (
          <div className="calendar-event" key={x[1]}>
            <time>{x[0]}</time>
            <div>
              <strong>{x[1]}</strong>
              <small>{x[2]} · MeetingIQ will be ready to join</small>
            </div>
            <span className="event-dot" />
          </div>
        ))}
      </section>
    </>
  );
}
function SettingsPage() {
  return (
    <>
      <PageTitle eyebrow="Workspace" title="Settings" />
      <div className="settings-grid">
        <section className="panel">
          <div className="eyebrow">Profile</div>
          <h2>Your workspace</h2>
          <div className="setting-profile">
            <div className="avatar avatar-large">AM</div>
            <div>
              <strong>Alex Morgan</strong>
              <small>alex@meetingiq.demo</small>
            </div>
            <button className="button subtle">Edit profile</button>
          </div>
        </section>
        <section className="panel">
          <div className="eyebrow">Preferences</div>
          <h2>Recording defaults</h2>
          {[
            "Join meetings automatically",
            "Send summary after processing",
            "Include speaker names in clips",
          ].map((x, i) => (
            <label className="toggle-row" key={x}>
              <span>
                <strong>{x}</strong>
                <small>
                  {i === 0
                    ? "For meetings on your connected calendar"
                    : i === 1
                      ? "Keep your team in the loop"
                      : "Make clips easier to follow"}
                </small>
              </span>
              <input type="checkbox" defaultChecked={i !== 2} />
              <i />
            </label>
          ))}
        </section>
      </div>
    </>
  );
}
function SharePage() {
  const { id } = useParams();
  const meeting = meetings.find((m) => m.id === id) || meetings[0];
  return (
    <div className="share-page">
      <Logo />
      <div className="share-card">
        <div className="share-brand">
          <span className="logo-mark">
            <Sparkles size={15} />
          </span>
          <span>Shared from MeetingIQ</span>
        </div>
        <div className="eyebrow">Meeting clip · {meeting.source}</div>
        <h1>{meeting.title}</h1>
        <p className="share-message">
          A moment worth sharing from the strategy review.
        </p>
        <div className="clip-player">
          <button className="play-button">
            <Play size={18} />
          </button>
          <div>
            <strong>Enterprise AI beta target moved to October</strong>
            <span>42:18 – 43:07 · Alex Morgan</span>
          </div>
        </div>
        <div className="share-excerpt">
          <div className="eyebrow">Transcript excerpt</div>
          <p>
            “Agreed. Let’s make the enterprise AI beta an October target, with
            onboarding improvements first in the sequence.”
          </p>
        </div>
        <div className="share-footer">
          <span>MeetingIQ · Searchable knowledge for every team</span>
          <button
            className="button primary"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            <Copy size={15} /> Copy link
          </button>
        </div>
      </div>
    </div>
  );
}
function RecordModal({ close }: { close: () => void }) {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - (startedAt ?? Date.now())) / 1000)), 250);
    const finish = window.setTimeout(() => setDone(true), 4200);
    return () => { clearInterval(id); clearTimeout(finish); };
  }, [recording, startedAt]);
  return (
    <div className="modal-backdrop">
      <div className="record-modal">
        <button className="modal-close icon-button" onClick={close}>
          <X size={18} />
        </button>
        {done ? (
          <>
            <div className="success-mark">
              <Check size={22} />
            </div>
            <div className="eyebrow">Meeting ready</div>
            <h2>Your recording is processed</h2>
            <p>
              We created a transcript, summary, and action items from your
              simulated recording.
            </p>
            <Link
              to="/meetings/q3-strategy"
              className="button primary"
              onClick={close}
            >
              Open meeting <ArrowLeft size={15} className="rotate" />
            </Link>
          </>
        ) : (
          <>
            <div className={`record-orb ${recording ? "recording" : ""}`}>
              <span>{recording ? "REC" : "+"}</span>
            </div>
            <div className="eyebrow">
              {recording ? "Recording in progress" : "Quick capture"}
            </div>
            <h2>
              {recording ? "Capturing your meeting" : "Start a new recording"}
            </h2>
            <p>
              {recording
                ? "Live transcript preview is being prepared. This demo simulates the capture layer."
                : "Record a conversation and let MeetingIQ turn it into searchable knowledge."}
            </p>
            {recording && (
              <div className="live-preview">
                <span className="live-dot" /> <strong>{formatTime(elapsed)}</strong>
                <span>“Let’s talk through today’s priorities…”</span>
              </div>
            )}
            <button
              className={`button ${recording ? "danger" : "primary"} full`}
              onClick={() => { setStartedAt(Date.now()); setRecording(true); }}
            >
              {recording ? (
                <>
                  <Activity size={15} /> Stop and process
                </>
              ) : (
                <>
                  <CirclePlay size={15} /> Start recording
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
export default function App() {
  const [record, setRecord] = useState(false);
  const [customHighlights, setCustomHighlights] = useState<Highlight[]>([]);
  const addHighlight = (h: Highlight) => {
    setCustomHighlights((x) => [...x, h]);
    meetingState(h);
  };
  return (
    <Shell onRecord={() => setRecord(true)}>
      {record && <RecordModal close={() => setRecord(false)} />}
      <Routes>
        <Route
          path="/"
          element={<HomePage onRecord={() => setRecord(true)} />}
        />
        <Route path="/meetings" element={<MeetingsPage />} />
        <Route
          path="/meetings/:id"
          element={<MeetingPage onHighlight={addHighlight} />}
        />
        <Route path="/highlights" element={<HighlightsPage />} />
        <Route path="/action-items" element={<ActionItemsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/share/:id" element={<SharePage />} />
        <Route
          path="*"
          element={<HomePage onRecord={() => setRecord(true)} />}
        />
      </Routes>
    </Shell>
  );
}
function meetingState(h: Highlight) {
  const meeting = meetings.find((m) => m.id === h.meetingId);
  if (meeting && !meeting.highlights.some((x) => x.id === h.id))
    meeting.highlights.push(h);
}
