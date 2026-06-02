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
  ['01', 'Stash', 'Save the half-finished thought.'],
  ['02', 'Checkout', 'Make room for the fire drill.'],
  ['03', 'Rebuild', 'Coffee-sized pause.'],
  ['04', 'Return', 'Wait. What was I doing?'],
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

function IDEPath({ children }) {
  return (
    <div className="ide-path">
      {children}
    </div>
  );
}

function IDEPathStep({ number, children, active = false }) {
  return (
    <div className={`ide-path-step ${active ? 'ide-path-step--active' : ''}`}>
      <span>{number}</span>
      <strong>{children}</strong>
    </div>
  );
}

function IDECard({ ide, eyebrow, tone, note, children }) {
  return (
    <div className={`ide-card ide-card--${tone}`}>
      <div className="ide-card-topline">
        <div className="ide-mark" aria-hidden="true">{'<>'}</div>
        <div>
          <span>{eyebrow}</span>
          <strong>{ide}</strong>
        </div>
      </div>
      {children}
      <div className="ide-card-note">
        <span className="checkmark">✓</span>
        {note}
      </div>
    </div>
  );
}

function IDEWorkflowVisual() {
  return (
    <div className="ide-workflow">
      <div className="ide-workflow-cards">
        <Fragment asChild animation="fade-right" index={1}>
          <IDECard
            ide="VS Code"
            eyebrow="SOURCE CONTROL"
            tone="vscode"
            note="Create, open, compare"
          >
            <IDEPath>
              <IDEPathStep number="01">Repositories</IDEPathStep>
              <Chevron />
              <IDEPathStep number="02" active>Create Worktree...</IDEPathStep>
            </IDEPath>
          </IDECard>
        </Fragment>

        <div className="ide-connector" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <Fragment asChild animation="fade-left" index={2}>
          <IDECard
            ide="IntelliJ IDEA"
            eyebrow="GIT TOOL WINDOW"
            tone="intellij"
            note="New, open, remove"
          >
            <IDEPath>
              <IDEPathStep number="01">Worktrees</IDEPathStep>
              <Chevron />
              <IDEPathStep number="02" active>New Worktree...</IDEPathStep>
            </IDEPath>
          </IDECard>
        </Fragment>
      </div>

      <Fragment asChild animation="fade-up" index={3}>
        <div className="git-core">
          <div className="git-core-label">THE SHARED PRIMITIVE</div>
          <code>git worktree add</code>
          <span>same repository · another workspace</span>
        </div>
      </Fragment>
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
      <h2>Give the next task<br />its own lane.</h2>
      <p>Create a worktree. Open it. Keep your first desk untouched.</p>
      <div className="demo-checklist">
        <span><b>01</b> Source Control</span>
        <Chevron />
        <span><b>02</b> New workspace</span>
        <Chevron />
        <span><b>03</b> Open + work</span>
      </div>
    </div>
  );
}

const LANE_DATA = [
  {
    role: 'YOU',
    title: 'Current feature',
    branch: 'feature/payment-flow',
    path: './your-repo',
    status: 'Focused',
    tone: 'navy',
  },
  {
    role: 'YOU',
    title: 'Urgent fix',
    branch: 'hotfix/receipt',
    path: '../receipt-fix',
    status: 'Isolated',
    tone: 'blue',
  },
  {
    role: 'AGENT',
    title: 'Background task',
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
          title={<>One repo.<br /><span className="title-accent">More room to think.</span></>}
          lead="When a second task arrives, keep the first one exactly where you left it."
          className="intro-slide"
        >
          <BranchNetwork />
        </SlideFrame>
        <aside className="notes">
          <strong>0:00-0:20</strong><br />
          We have all had the moment: you are halfway through one task and another one arrives.
          A worktree lets that second task have its own workspace without disturbing the first.
          Today: the Git primitive, the VS Code workflow, and why this matters even more with agents.
        </aside>
      </Slide>

      <Slide data-timing="35">
        <SlideFrame
          number={2}
          eyebrow="THE PROBLEM"
          title="The expensive part is getting interrupted."
          lead="Urgent work should not clear the desk you were already using."
        >
          <InterruptionFlow />
          <Fragment asChild animation="fade-up" index={5}>
            <div className="clone-note">
              <strong>A second clone?</strong>
              <span>It works. It also starts a small collection.</span>
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
          lead="Each task gets its own checked-out files. Git shares the repository underneath."
        >
          <div className="model-grid">
            <WorktreeMap />
            <div className="model-explanation">
              <div className="model-point">
                <span>01</span>
                <p><strong>Share the expensive bits.</strong><br />Git objects + refs</p>
              </div>
              <div className="model-point">
                <span>02</span>
                <p><strong>Keep the desks separate.</strong><br />Files + index + <code>HEAD</code></p>
              </div>
              <CodeInset>
                {`git worktree add -b hotfix ../hotfix main
git worktree list
git worktree remove ../hotfix`}
              </CodeInset>
            </div>
          </div>
          <p className="fine-print">
            Guardrail: a branch generally cannot be checked out in multiple worktrees at the same time.
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
          title="Use the IDE you already know."
          lead="VS Code and IntelliJ IDEA surface the workflow. Git stays underneath."
        >
          <IDEWorkflowVisual />
        </SlideFrame>
        <aside className="notes">
          <strong>1:40-2:15</strong><br />
          The workflow is not tied to one editor. VS Code exposes worktrees from Source Control:
          create a worktree, open it in a new window, compare changes, and migrate changes if needed.
          IntelliJ IDEA exposes worktrees from the Git tool window: create, open, and remove them there.
          The IDE makes the primitive discoverable; Git stays underneath.<br /><br />
          Sources: <a href={SOURCE_LINKS.vscode}>{SOURCE_LINKS.vscode}</a><br />
          <a href={SOURCE_LINKS.intellij}>{SOURCE_LINKS.intellij}</a>
        </aside>
      </Slide>

      <Slide backgroundColor="#00175A" data-timing="90">
        <DemoCue />
        <aside className="notes">
          <strong>2:15-3:45 - LIVE DEMO</strong><br />
          1. In the current repo, open Source Control and choose Worktrees &gt; Create Worktree.<br />
          2. Create a branch such as demo/copilot-note in a sibling folder.<br />
          3. Open the new worktree in a second VS Code window.<br />
          4. Ask Copilot Chat for a small focused change.<br />
          5. Show the original window: its working files remain undisturbed.<br /><br />
          CLI fallback: git worktree add -b demo/copilot-note ../copilot-note main
        </aside>
      </Slide>

      <Slide data-timing="45">
        <SlideFrame
          number={6}
          eyebrow="THE AGENT ERA"
          title="Now every task can have a lane."
          lead="Your fix stays small. Your feature stays open. Your agent task stays reviewable."
        >
          <ParallelLanes />
          <Fragment asChild animation="fade-up" index={4}>
            <div className="agent-note">
              <span className="agent-note-label">NEXT STEP</span>
              <p>
                Some agent workflows, including Copilot CLI background sessions in VS Code, can create
                isolated worktrees automatically.
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
          title={<>Stop clearing your desk.<br /><span className="title-accent">Add a workspace.</span></>}
          lead="Three Git commands. One calmer way to work."
          className="closing-slide"
        >
          <div className="takeaway-grid">
            <Takeaway number="01" title="Stay focused" text="Leave the first task where it is." />
            <Takeaway number="02" title="Add a lane" text="Give the next task its own workspace." />
            <Takeaway number="03" title="Review calmly" text="Merge only what is ready." />
          </div>
          <CodeInset title="REMEMBER THESE THREE" className="closing-code">
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
