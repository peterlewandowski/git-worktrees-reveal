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
  ['01', 'Stash', 'Almost finished...'],
  ['02', 'Checkout', 'Urgent fix, naturally.'],
  ['03', 'Rebuild', 'Dependencies say hello.'],
  ['04', 'Return', 'Now, where was I?'],
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

function WorkspaceDesk({ label, branch, path, tone = 'blue' }) {
  return (
    <div className={`workspace-desk workspace-desk--${tone}`}>
      <div className="desk-screen">
        <span />
        <span />
        <span />
      </div>
      <div className="desk-copy">
        <span>{label}</span>
        <strong>{branch}</strong>
        <code>{path}</code>
      </div>
    </div>
  );
}

function BranchVsWorktree() {
  return (
    <div className="branch-compare">
      <div className="compare-card compare-card--branches">
        <div className="compare-heading">
          <span>BRANCHES</span>
          <strong>Name the work</strong>
        </div>
        <div className="branch-pointer-map" aria-label="Several branches leading to one active workspace">
          <div className="pointer-lines">
            <span className="pointer pointer--feature">feature</span>
            <span className="pointer pointer--main">main</span>
            <span className="pointer pointer--hotfix">hotfix</span>
          </div>
          <div className="pointer-trunk" />
          <WorkspaceDesk label="ONE CHECKED-OUT DESK" branch="feature" path="./your-repo" tone="navy" />
        </div>
        <p>Cheap pointers. Usually one active checkout.</p>
      </div>

      <div className="compare-plus" aria-hidden="true">+</div>

      <Fragment asChild animation="fade-left" index={1}>
        <div className="compare-card compare-card--worktrees">
          <div className="compare-heading">
            <span>WORKTREES</span>
            <strong>Give each task a desk</strong>
          </div>
          <div className="desk-stack">
            <WorkspaceDesk label="CURRENT FEATURE" branch="feature" path="./your-repo" tone="navy" />
            <WorkspaceDesk label="URGENT FIX" branch="hotfix" path="../hotfix" tone="blue" />
            <WorkspaceDesk label="AGENT TASK" branch="agent-task" path="../agent-task" tone="accent" />
          </div>
          <p>Same repo. Separate files, index, and <code>HEAD</code>.</p>
        </div>
      </Fragment>
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

function SourceControlPanel({ compact = false }) {
  return (
    <div className={`vscode-window ${compact ? 'ide-window--compact' : ''}`}>
      <div className="vscode-titlebar">
        <span className="traffic-lights"><i /><i /><i /></span>
        <strong>your-repo</strong>
        <span>Visual Studio Code</span>
      </div>
      <div className="vscode-content">
        <div className="activity-bar">
          <span className="activity-icon">⌕</span>
          <span className="activity-icon activity-icon--active">⑂</span>
          <span className="activity-icon">▷</span>
          <span className="activity-icon">⌁</span>
        </div>
        <div className="source-panel">
          <div className="panel-heading">
            <strong>SOURCE CONTROL</strong>
            <span>•••</span>
          </div>
          <div className="repo-row">
            <Chevron />
            <strong>your-repo</strong>
            <span className="branch-chip">feature</span>
          </div>
          <div className="panel-section">
            <Chevron />
            <strong>CHANGES</strong>
            <span className="count-pill">2</span>
          </div>
          <div className="file-row"><span>M</span> src/payment.ts</div>
          <div className="file-row"><span>M</span> src/checkout.tsx</div>
          <Fragment asChild animation="fade-up" index={1}>
            <div className="worktrees-menu">
              <div className="menu-title"><span>⑂</span> Worktrees</div>
              <div className="menu-item menu-item--active">＋ Create Worktree...</div>
              <div className="menu-item">↗ Open Worktree</div>
              <div className="menu-item">⇄ Compare with Worktree</div>
            </div>
          </Fragment>
        </div>
        <div className="editor-panel">
          <div className="editor-tab">payment.ts <span>×</span></div>
          <div className="editor-lines">
            <span><i>1</i><b>export</b> async function submitPayment() &#123;</span>
            <span><i>2</i>&nbsp;&nbsp;<b>const</b> request = await buildRequest();</span>
            <span><i>3</i>&nbsp;&nbsp;<b>return</b> gateway.submit(request);</span>
            <span><i>4</i>&#125;</span>
          </div>
          <div className="editor-callout">
            <span className="checkmark">✓</span>
            Same Git primitive. Less ceremony.
          </div>
        </div>
      </div>
    </div>
  );
}

function IntelliJPanel() {
  return (
    <div className="intellij-window ide-window--compact">
      <div className="intellij-titlebar">
        <span className="traffic-lights"><i /><i /><i /></span>
        <strong>your-repo</strong>
        <span>IntelliJ IDEA</span>
      </div>
      <div className="intellij-content">
        <div className="intellij-sidebar">
          <span className="jetbrains-icon jetbrains-icon--active">G</span>
          <span className="jetbrains-icon">P</span>
          <span className="jetbrains-icon">T</span>
        </div>
        <div className="intellij-git-panel">
          <div className="intellij-panel-heading">
            <strong>GIT</strong>
            <span>•••</span>
          </div>
          <div className="intellij-row"><Chevron /><strong>Log</strong></div>
          <div className="intellij-row"><Chevron /><strong>Console</strong></div>
          <div className="intellij-row intellij-row--active"><Chevron /><strong>Worktrees</strong></div>
          <div className="intellij-worktree"><span>⑂</span> your-repo <small>feature</small></div>
          <Fragment asChild animation="fade-up" index={1}>
            <div className="intellij-menu">
              <div className="intellij-menu-title"><span>⑂</span> Worktrees</div>
              <div className="intellij-menu-item intellij-menu-item--active">＋ New Worktree...</div>
              <div className="intellij-menu-item">↗ Open in New Window</div>
              <div className="intellij-menu-item">− Remove Worktree</div>
            </div>
          </Fragment>
        </div>
        <div className="intellij-editor">
          <div className="intellij-tab">PaymentService.kt <span>×</span></div>
          <div className="intellij-lines">
            <span><i>1</i><b>class</b> PaymentService &#123;</span>
            <span><i>2</i>&nbsp;&nbsp;<b>fun</b> submit() &#123;</span>
            <span><i>3</i>&nbsp;&nbsp;&nbsp;&nbsp;gateway.send()</span>
            <span><i>4</i>&nbsp;&nbsp;&#125;</span>
            <span><i>5</i>&#125;</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IDEMockup({ name, eyebrow, note, children }) {
  return (
    <div className="ide-mockup">
      <div className="ide-mockup-heading">
        <div>
          <span>{eyebrow}</span>
          <strong>{name}</strong>
        </div>
        <small>{note}</small>
      </div>
      {children}
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
      <h2>Open an agent lane<br />in VS Code.</h2>
      <p>Create a worktree. Open a second window. Let Copilot Chat work there.</p>
      <div className="demo-checklist">
        <span><b>01</b> Source Control</span>
        <Chevron />
        <span><b>02</b> Agent Worktree</span>
        <Chevron />
        <span><b>03</b> Open + Chat</span>
      </div>
    </div>
  );
}

const LANE_DATA = [
  {
    role: 'YOU',
    title: 'Current feature',
    branch: 'feature/pricing',
    path: './your-repo',
    status: 'Focused',
    tone: 'navy',
  },
  {
    role: 'AGENT',
    title: 'Test lane',
    branch: 'agent/pricing-tests',
    path: '../pricing-tests',
    status: 'Review',
    tone: 'blue',
  },
  {
    role: 'AGENT',
    title: 'Docs lane',
    branch: 'agent/pricing-docs',
    path: '../pricing-docs',
    status: 'Draft',
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

function ClosingWorkflow() {
  return (
    <div className="closing-workflow">
      <div className="closing-panel closing-panel--problem">
        <span className="closing-kicker">THE BOTTLENECK</span>
        <strong>One working folder carries every interruption</strong>
        <div className="context-loop" aria-label="Old context switching loop">
          <span>stash</span>
          <span>checkout</span>
          <span>rebuild</span>
          <span>reorient</span>
        </div>
        <p>Branches are cheap. Rebuilding your mental context is the expensive part.</p>
      </div>

      <div className="closing-transfer" aria-hidden="true">
        <span />
        <strong>becomes</strong>
        <span />
      </div>

      <div className="closing-panel closing-panel--workflow">
        <span className="closing-kicker">THE WORKFLOW UPGRADE</span>
        <strong>One repo becomes focused lanes of work</strong>
        <div className="lane-stack" aria-label="Focused worktree lanes">
          <span><i />You: current feature</span>
          <span><i />Agent: focused task</span>
          <span><i />Reviewer: clean diff</span>
        </div>
        <p>Humans and agents can move in parallel without disturbing today's workspace.</p>
      </div>
    </div>
  );
}

function AgentLaneCard({ number, title, text, prompt }) {
  return (
    <div className="agent-lane-card">
      <span>{number}</span>
      <strong>{title}</strong>
      <p>{text}</p>
      <code>{prompt}</code>
    </div>
  );
}

function AgentLaneExamples() {
  return (
    <div className="agent-lane-grid">
      <Fragment asChild animation="fade-up" index={1}>
        <AgentLaneCard
          number="01"
          title="One agent writes tests"
          text="Give an agent a test-only lane. Its output is easy to review because the diff has one purpose."
          prompt="Add coverage for monthly, annual, and promo pricing edge cases."
        />
      </Fragment>
      <Fragment asChild animation="fade-up" index={2}>
        <AgentLaneCard
          number="02"
          title="One agent drafts docs"
          text="Keep docs and product language in a separate lane until you know which implementation survives."
          prompt="Document the new behavior and call out any assumptions."
        />
      </Fragment>
      <Fragment asChild animation="fade-up" index={3}>
        <AgentLaneCard
          number="03"
          title="One agent investigates a bug"
          text="Let the agent explore logs, add notes, or try a fix without interrupting the branch you are shaping."
          prompt="Find why trial pricing fails when the coupon expires."
        />
      </Fragment>
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
          eyebrow="AI + GIT WORKTREES"
          title={<>One repo.<br /><span className="title-accent">Multiple possibilities.</span></>}
          lead="Less branch juggling. More AI-powered development."
          className="intro-slide"
        >
          <BranchNetwork />
        </SlideFrame>
        <aside className="notes">
          <strong>0:00-0:20</strong><br />
          The opening: one repository can support multiple active AI-assisted tasks without forcing us
          to constantly stash, checkout, and rebuild context. This version is about how worktrees make
          AI-powered development more practical.
        </aside>
      </Slide>

      <Slide data-timing="35">
        <SlideFrame
          number={2}
          eyebrow="THE SHIFT"
          title="Worktrees enable truly agent-assisted development."
          lead="Branches name the work. Worktrees give humans and agents separate places to do it."
        >
          <BranchVsWorktree />
          <div className="agent-thesis">
            <strong>Productivity gain:</strong>
            <span>multiple focused tasks, clean context, reviewable diffs.</span>
          </div>
        </SlideFrame>
        <aside className="notes">
          <strong>0:20-0:55</strong><br />
          Keep this short. Branches are the unit of work. Worktrees are the working directories that let
          those units happen at the same time. That is the unlock for agent workflows.
        </aside>
      </Slide>

      <Slide data-timing="45">
        <SlideFrame
          number={3}
          eyebrow="THE MENTAL MODEL"
          title="Parallel workflow becomes a practical habit."
          lead="Use worktrees for human context switching today. Use isolated workspaces for agent tasks as the workflow grows."
        >
          <ParallelLanes />
          <Fragment asChild animation="fade-up" index={4}>
            <div className="agent-note">
              <span className="agent-note-label">WHAT CHANGES</span>
              <p>
                Your active feature stays open while each agent-sized task gets a scoped branch,
                folder, prompt, and review point.
              </p>
            </div>
          </Fragment>
          <p className="fine-print">
            The value is not more generated code. The value is cleaner parallel work.
          </p>
        </SlideFrame>
        <aside className="notes">
          <strong>0:55-1:40</strong><br />
          This slide is the core story: worktrees turn parallel AI help into practical review lanes.
          The human feature stays open, and agent tasks happen in scoped branches and folders.<br /><br />
          Source: <a href={SOURCE_LINKS.git}>{SOURCE_LINKS.git}</a>
        </aside>
      </Slide>

      <Slide data-timing="35">
        <SlideFrame
          number={4}
          eyebrow="THE WORKFLOW"
          title="Your IDE is already worktree-enabled."
          lead="VS Code and IntelliJ IDEA both surface worktrees. Our demo will use VS Code."
        >
          <div className="ide-mockup-grid">
            <IDEMockup name="VS Code" eyebrow="SOURCE CONTROL" note="Demo path">
              <SourceControlPanel compact />
            </IDEMockup>
            <IDEMockup name="IntelliJ IDEA" eyebrow="GIT TOOL WINDOW" note="Same primitive">
              <IntelliJPanel />
            </IDEMockup>
          </div>
        </SlideFrame>
        <aside className="notes">
          <strong>1:40-2:15</strong><br />
          The point: this is IDE-supported, not just a CLI trick. VS Code and IntelliJ IDEA both expose
          worktrees in source control tooling. The demo is VS Code because it is the current path, but
          the mental model transfers.<br /><br />
          Sources: <a href={SOURCE_LINKS.vscode}>{SOURCE_LINKS.vscode}</a><br />
          <a href={SOURCE_LINKS.intellij}>{SOURCE_LINKS.intellij}</a>
        </aside>
      </Slide>

      <Slide backgroundColor="#00175A" data-timing="90">
        <DemoCue />
        <aside className="notes">
          <strong>2:15-3:45 - LIVE DEMO</strong><br />
          1. In VS Code Source Control, create a worktree for an agent-sized task.<br />
          2. Open the new worktree in a second VS Code window.<br />
          3. Use Copilot Chat in that window as the agent lane.<br />
          4. Ask for a small focused change, such as tests or docs.<br />
          5. Show the original window: its working files remain undisturbed.<br /><br />
          CLI fallback: git worktree add -b demo/agent-tests ../agent-tests main
        </aside>
      </Slide>

      <Slide data-timing="45">
        <SlideFrame
          number={6}
          eyebrow="THE AGENT ERA"
          title="Three agent lanes worth trying."
          lead="The best use cases have clear scope and easy review."
        >
          <AgentLaneExamples />
        </SlideFrame>
        <aside className="notes">
          <strong>3:45-4:30</strong><br />
          These are the strongest examples from the review: tests, docs, and bug investigation. They
          are scoped, useful, and easy to review. Some Copilot workflows can also create isolated
          worktrees automatically.<br /><br />
          Source: <a href={SOURCE_LINKS.agents}>{SOURCE_LINKS.agents}</a>
        </aside>
      </Slide>

      <Slide data-timing="30">
        <SlideFrame
          number={7}
          eyebrow="THE TAKEAWAY"
          title={<>Stop juggling context.<br /><span className="title-accent">Add a lane.</span></>}
          lead="Worktrees solve the main problem: one busy workspace trying to hold every feature, fix, experiment, and agent task."
          className="closing-slide"
        >
          <ClosingWorkflow />
          <div className="takeaway-grid takeaway-grid--closing">
            <Takeaway number="01" title="Preserve momentum" text="Keep your current work open while the next task starts elsewhere." />
            <Takeaway number="02" title="Delegate cleanly" text="Give each agent one branch, one folder, and one reviewable goal." />
            <Takeaway number="03" title="Merge selectively" text="Promote only the work that improves the codebase." />
          </div>
          <div className="closing-final-line">
            Efficiency gain: fewer resets, clearer delegation, cleaner reviews.
          </div>
        </SlideFrame>
        <aside className="notes">
          <strong>4:30-5:00</strong><br />
          Tie it back to the problem: the team was not blocked because branches were hard. The team
          was losing time to one working folder carrying too many jobs. Worktrees give humans and
          agents separate lanes, so the output is easier to review and safer to merge.
        </aside>
      </Slide>
      </Deck>
    </div>
  );
}
