import { useCallback, useEffect, useState } from 'react';
import { Deck, Fragment, Slide } from '@revealjs/react';
import RevealNotes from 'reveal.js/plugin/notes';
import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';

const SOURCE_LINKS = {
  git: 'https://git-scm.com/docs/git-worktree',
  vscode: 'https://code.visualstudio.com/docs/sourcecontrol/branches-worktrees',
  intellij: 'https://www.jetbrains.com/help/idea/use-git-worktrees.html',
  agents: 'https://code.visualstudio.com/docs/copilot/agents/background-agents',
};

function getInitialTheme() {
  return new URLSearchParams(window.location.search).get('theme') === 'dark'
    ? 'dark'
    : 'light';
}

function ThemeToggle({ theme, onToggle }) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${nextTheme} mode (D)`}
    >
      <span className="theme-toggle-icon" aria-hidden="true" />
      <span>{nextTheme === 'dark' ? 'Dark' : 'Light'}</span>
      <kbd>D</kbd>
    </button>
  );
}

function SlideFrame({
  number,
  eyebrow = 'GIT WORKTREES',
  title,
  lead,
  children,
  footer = 'More room to work',
  className = '',
}) {
  return (
    <div className={`slide-frame ${className}`}>
      <div className="slide-topline">
        <span className="eyebrow">{eyebrow}</span>
        <span className="slide-number">{String(number).padStart(2, '0')}</span>
      </div>
      <div className="slide-heading">
        <h2>{title}</h2>
        {lead && <p className="slide-lead">{lead}</p>}
      </div>
      <div className="slide-body">{children}</div>
      <div className="slide-footer">
        <span>{footer}</span>
        <span className="footer-rule" />
        <span>git worktree</span>
      </div>
    </div>
  );
}

function RepoBadge({ label = 'your-repo', compact = false }) {
  return (
    <div className={`repo-badge ${compact ? 'repo-badge--compact' : ''}`}>
      <span className="repo-icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{label}</span>
    </div>
  );
}

function FolderCard({ branch, path, tone = 'primary', meta, className = '' }) {
  return (
    <div className={`folder-card folder-card--${tone} ${className}`}>
      <div className="folder-tab" />
      <span className="folder-kicker">{meta ?? 'WORKSPACE'}</span>
      <strong>{branch}</strong>
      <span className="folder-path">{path}</span>
    </div>
  );
}

function BranchNetwork() {
  return (
    <div className="branch-network" aria-label="One repository branching into three workspaces">
      <svg viewBox="0 0 1000 390" role="img">
        <path className="branch-trunk" d="M 120 196 H 310" />
        <path className="branch branch--main" d="M 310 196 C 410 196 420 72 545 72 H 885" />
        <path className="branch branch--hotfix" d="M 310 196 H 885" />
        <path className="branch branch--agent" d="M 310 196 C 410 196 420 320 545 320 H 885" />
        <circle className="branch-dot branch-dot--root" cx="120" cy="196" r="15" />
        <circle className="branch-dot branch-dot--primary" cx="310" cy="196" r="11" />
        <circle className="branch-dot branch-dot--main" cx="572" cy="72" r="10" />
        <circle className="branch-dot branch-dot--hotfix" cx="572" cy="196" r="10" />
        <circle className="branch-dot branch-dot--agent" cx="572" cy="320" r="10" />
      </svg>
      <div className="branch-origin">
        <RepoBadge />
        <span>one shared repository</span>
      </div>
      <div className="branch-label branch-label--main">
        <strong>feature</strong>
        <span>./your-repo</span>
      </div>
      <div className="branch-label branch-label--hotfix">
        <strong>hotfix</strong>
        <span>../hotfix</span>
      </div>
      <div className="branch-label branch-label--agent">
        <strong>agent-task</strong>
        <span>../agent-task</span>
      </div>
    </div>
  );
}

const INTERRUPTION_STEPS = [
  ['01', 'Pause', 'You were on a roll.'],
  ['02', 'Switch', 'A new branch takes over the desk.'],
  ['03', 'Rebuild', 'Your tools reset the mood.'],
  ['04', 'Recover', 'Then you find your way back.'],
];

function InterruptionFlow() {
  return (
    <div className="interruption-flow">
      <div className="flow-start">
        <div className="flow-window">
          <span className="window-dot" />
          <span className="window-dot" />
          <span className="window-dot" />
          <div className="code-lines">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <strong>feature/payment-flow</strong>
        <span>Deep in the work</span>
      </div>
      <div className="flow-steps">
        {INTERRUPTION_STEPS.map(([number, title, caption], index) => (
          <Fragment key={title} asChild animation="fade-up" index={index + 1}>
            <div className="flow-step">
              <span className="step-number">{number}</span>
              <strong>{title}</strong>
              <small>{caption}</small>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function WorktreeMap() {
  return (
    <div className="worktree-map">
      <div className="shared-repo">
        <RepoBadge label=".git" compact />
        <strong>shared repository data</strong>
        <span>objects + refs</span>
      </div>
      <div className="map-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="workspace-stack">
        <FolderCard branch="feature" path="./your-repo" tone="navy" meta="CURRENT WORK" />
        <Fragment asChild animation="fade-right" index={1}>
          <FolderCard branch="hotfix" path="../hotfix" tone="blue" meta="URGENT FIX" />
        </Fragment>
        <Fragment asChild animation="fade-right" index={2}>
          <FolderCard branch="docs" path="../docs" tone="accent" meta="SMALL TASK" />
        </Fragment>
      </div>
    </div>
  );
}

function CodeInset({ children, title = 'TERMINAL', className = '' }) {
  return (
    <div className={`code-inset ${className}`}>
      <div className="code-title">
        <span className="prompt-dot" />
        <span>{title}</span>
      </div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Chevron() {
  return <span className="chevron" aria-hidden="true">›</span>;
}

const EDITOR_OPTIONS = [
  {
    name: 'VS Code',
    entry: 'Source Control',
    detail: 'Create worktree',
    note: 'Open another window when the new task lands.',
    tone: 'navy',
    badge: 'VS',
  },
  {
    name: 'IntelliJ',
    entry: 'Git Branches',
    detail: 'Use worktrees',
    note: 'Same Git idea, just surfaced in a different place.',
    tone: 'blue',
    badge: 'IJ',
  },
  {
    name: 'Terminal',
    entry: 'git worktree',
    detail: 'add • list • remove',
    note: 'Perfect when you want the primitive with no extra UI.',
    tone: 'accent',
    badge: '>_',
  },
];

function EditorShowcase() {
  return (
    <div className="editor-showcase">
      <div className="editor-spark">
        <div className="spark-line">
          <span className="spark-dot" />
          <span className="spark-track" />
          <span className="spark-dot spark-dot--end" />
        </div>
        <strong>Same habit. Different doorway.</strong>
        <p>Start in the editor you already trust, then let Git keep the work separated.</p>
      </div>
      <div className="editor-cards">
        {EDITOR_OPTIONS.map((option, index) => (
          <Fragment key={option.name} asChild animation="fade-up" index={index + 1}>
            <div className={`editor-card editor-card--${option.tone}`}>
              <div className="editor-card-topline">
                <span className="editor-badge">{option.badge}</span>
                <span>{option.name}</span>
              </div>
              <strong>{option.entry}</strong>
              <div className="editor-detail">{option.detail}</div>
              <p>{option.note}</p>
            </div>
          </Fragment>
        ))}
        <Fragment asChild animation="fade-left" index={4}>
          <div className="editor-card editor-card--ghost">
            <span className="editor-kicker">What matters</span>
            <strong>New branch. New folder. Old focus stays put.</strong>
          </div>
        </Fragment>
      </div>
    </div>
  );
}

function DemoCue() {
  return (
    <div className="demo-cue">
      <div className="demo-kicker">LIVE DEMO</div>
      <div className="demo-branch">
        <span className="demo-dot" />
        <span className="demo-line" />
        <span className="demo-dot demo-dot--end" />
      </div>
      <h2>Protect your flow.<br />Open a fresh lane.</h2>
      <p>Create a worktree, open it in your editor, and make one tiny change there.</p>
      <div className="demo-checklist">
        <span><b>01</b> Create</span>
        <Chevron />
        <span><b>02</b> Open</span>
        <Chevron />
        <span><b>03</b> Change</span>
      </div>
    </div>
  );
}

const LANE_DATA = [
  {
    role: 'YOU',
    title: 'Deep focus',
    branch: 'feature/payment-flow',
    path: './your-repo',
    status: 'Still in flow',
    tone: 'navy',
  },
  {
    role: 'TEAMMATE',
    title: 'Quick fix',
    branch: 'hotfix/receipt',
    path: '../receipt-fix',
    status: 'Ready to review',
    tone: 'blue',
  },
  {
    role: 'AGENT',
    title: 'Background draft',
    branch: 'agent/add-tests',
    path: '../agent-add-tests',
    status: 'Review when ready',
    tone: 'accent',
  },
];

function ParallelLanes() {
  return (
    <div className="parallel-lanes">
      {LANE_DATA.map((lane, index) => (
        <Fragment key={lane.branch} asChild animation="fade-up" index={index + 1}>
          <div className={`parallel-lane parallel-lane--${lane.tone}`}>
            <div className="lane-role">{lane.role}</div>
            <div className="lane-content">
              <strong>{lane.title}</strong>
              <code>{lane.branch}</code>
              <span>{lane.path}</span>
            </div>
            <div className="lane-status">
              <i />
              {lane.status}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function Takeaway({ number, title, text }) {
  return (
    <div className="takeaway">
      <span>{number}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export function Presentation() {
  const [theme, setTheme] = useState(getInitialTheme);
  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    const url = new URL(window.location.href);
    if (theme === 'dark') {
      url.searchParams.set('theme', 'dark');
    } else {
      url.searchParams.delete('theme');
    }
    window.history.replaceState({}, '', url);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLElement
        && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

      if (!isTyping && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  return (
    <div className="presentation-shell" data-theme={theme}>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <Deck
        plugins={[RevealNotes]}
        config={{
          width: 1280,
          height: 720,
          hash: true,
          controls: true,
          controlsLayout: 'edges',
          progress: true,
          center: false,
          transition: 'fade',
          backgroundTransition: 'fade',
          totalTime: 300,
        }}
      >
      <Slide data-timing="20">
        <SlideFrame
          number={1}
          eyebrow="GIT WORKTREES"
          title={<>One repo.<br /><span className="title-accent">More breathing room.</span></>}
          lead="Stay in the zone on one task while the next task gets a workspace of its own."
          className="intro-slide"
        >
          <BranchNetwork />
        </SlideFrame>
        <aside className="notes">
          <strong>0:00-0:20</strong><br />
          We have all had the moment: you are halfway through one task and another one arrives.
          A worktree lets that second task have its own workspace without disturbing the first.
          Today: the Git primitive, a few editor entry points, and why this matters even more with agents.
        </aside>
      </Slide>

      <Slide data-timing="35">
        <SlideFrame
          number={2}
          eyebrow="THE PROBLEM"
          title="You were in the zone. Then the ping arrived."
          lead="The branch is cheap. Losing your flow in one crowded working directory is the expensive part."
        >
          <InterruptionFlow />
          <Fragment asChild animation="fade-up" index={5}>
            <div className="clone-note">
              <strong>You can clone again.</strong>
              <span>It works, but now you are carrying another full repo around too.</span>
            </div>
          </Fragment>
        </SlideFrame>
        <aside className="notes">
          <strong>0:20-0:55</strong><br />
          Branches themselves are inexpensive. The real tax is context switching in a single working
          directory. Stash, checkout, rebuild, and then later reconstruct your mental state. Another
          clone is a valid escape hatch, but it creates extra setup and duplicated repository data.
        </aside>
      </Slide>

      <Slide data-timing="45">
        <SlideFrame
          number={3}
          eyebrow="THE MENTAL MODEL"
          title="Same repo. Separate desks."
          lead="Each task gets its own files and branch while Git keeps the shared history underneath."
        >
          <div className="model-grid">
            <WorktreeMap />
            <div className="model-explanation">
              <div className="model-point">
                <span>01</span>
                <p><strong>Share the repo core.</strong><br />Reuse objects and refs.</p>
              </div>
              <div className="model-point">
                <span>02</span>
                <p><strong>Separate the workspace.</strong><br />Each worktree has its own files, index, and <code>HEAD</code>.</p>
              </div>
              <CodeInset>
                {`git worktree add -b hotfix ../hotfix main
git worktree list
git worktree remove ../hotfix`}
              </CodeInset>
            </div>
          </div>
          <p className="fine-print">
            Usually one active branch per worktree keeps everything predictable.
          </p>
        </SlideFrame>
        <aside className="notes">
          <strong>0:55-1:40</strong><br />
          This is the whole mental model: one repository, more than one checked-out workspace.
          Linked worktrees share repository data while keeping per-worktree state such as HEAD and the
          index separate. A branch is generally checked out in one worktree at a time.<br /><br />
          Source: <a href={SOURCE_LINKS.git}>{SOURCE_LINKS.git}</a>
        </aside>
      </Slide>

      <Slide data-timing="35">
        <SlideFrame
          number={4}
          eyebrow="THE WORKFLOW"
          title="Pick your editor. Keep the habit."
          lead="VS Code, IntelliJ, or the terminal all ride on the same Git primitive."
        >
          <EditorShowcase />
        </SlideFrame>
        <aside className="notes">
          <strong>1:40-2:15</strong><br />
          The friendly part is that you do not need one blessed tool here. VS Code exposes worktrees from
          Source Control, IntelliJ surfaces them from its Git UI, and the CLI is still the same tiny set
          of commands underneath.<br /><br />
          Sources: <a href={SOURCE_LINKS.vscode}>{SOURCE_LINKS.vscode}</a><br />
          <a href={SOURCE_LINKS.intellij}>{SOURCE_LINKS.intellij}</a>
        </aside>
      </Slide>

      <Slide backgroundColor="#00175A" data-timing="90">
        <DemoCue />
        <aside className="notes">
          <strong>2:15-3:45 - LIVE DEMO</strong><br />
          1. In the current repo, open your editor's Git/worktree entry point and create a worktree.<br />
          2. Create a branch such as demo/copilot-note in a sibling folder.<br />
          3. Open the new worktree in a second window.<br />
          4. Make one small focused change there.<br />
          5. Show the original window: its working files remain undisturbed.<br /><br />
          CLI fallback: git worktree add -b demo/copilot-note ../copilot-note main
        </aside>
      </Slide>

      <Slide data-timing="45">
        <SlideFrame
          number={6}
          eyebrow="THE AGENT ERA"
          title="Humans and agents both like clear lanes."
          lead="Separate workspaces make handoffs calmer, reviews cleaner, and parallel work easier to trust."
        >
          <ParallelLanes />
          <Fragment asChild animation="fade-up" index={4}>
            <div className="agent-note">
              <span className="agent-note-label">NEXT STEP</span>
              <p>
                However the work starts, the review moment stays the same: inspect it, compare it, then
                choose what to merge.
              </p>
            </div>
          </Fragment>
        </SlideFrame>
        <aside className="notes">
          <strong>3:45-4:30</strong><br />
          The manual workflow already helps with interruptions. It also gives agent tasks a clean
          boundary: each task has its own workspace, branch, and review point. Separately, current
          Copilot CLI background sessions in VS Code can use worktree isolation automatically. That is
          one product workflow, not a claim that every coding agent automatically uses worktrees.<br /><br />
          Source: <a href={SOURCE_LINKS.agents}>{SOURCE_LINKS.agents}</a>
        </aside>
      </Slide>

      <Slide data-timing="30">
        <SlideFrame
          number={7}
          eyebrow="THE TAKEAWAY"
          title={<>Protect the flow.<br /><span className="title-accent">Add a workspace.</span></>}
          lead="One small Git primitive makes parallel work feel calmer, clearer, and easier to review."
          className="closing-slide"
        >
          <div className="takeaway-grid">
            <Takeaway number="01" title="Keep momentum" text="Leave the current task exactly where it is." />
            <Takeaway number="02" title="Split work cleanly" text="Give the new task its own branch and folder." />
            <Takeaway number="03" title="Merge on purpose" text="Review the result when the work is ready." />
          </div>
          <CodeInset title="THREE COMMANDS" className="closing-code">
            {`git worktree add
git worktree list
git worktree remove`}
          </CodeInset>
        </SlideFrame>
        <aside className="notes">
          <strong>4:30-5:00</strong><br />
          Three things to remember: preserve context, isolate concurrent work, and review deliberately.
          The CLI is small: add, list, remove. VS Code makes it approachable. Agents make the primitive
          increasingly useful. Thank you.
        </aside>
      </Slide>
      </Deck>
    </div>
  );
}
