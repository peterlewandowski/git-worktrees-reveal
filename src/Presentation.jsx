import { useCallback, useEffect, useState } from 'react';
import { Deck, Fragment, Slide } from '@revealjs/react';
import RevealNotes from 'reveal.js/plugin/notes';
import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';

const SOURCE_LINKS = {
  git: 'https://git-scm.com/docs/git-worktree',
  vscode: 'https://code.visualstudio.com/docs/sourcecontrol/branches-worktrees',
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

function SourceControlPanel() {
  return (
    <div className="vscode-window">
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
      <p>Create a worktree. Open it. Let Copilot Chat work there.</p>
      <div className="demo-checklist">
        <span><b>01</b> Source Control</span>
        <Chevron />
        <span><b>02</b> Create Worktree</span>
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

function PromptBubble({ label, text, response }) {
  return (
    <div className="prompt-bubble">
      <span>{label}</span>
      <p>{text}</p>
      <small>{response}</small>
    </div>
  );
}

function ProductivityLane({ role, title, branch, prompt, status, tone = 'blue' }) {
  return (
    <div className={`productivity-lane productivity-lane--${tone}`}>
      <div className="lane-role">{role}</div>
      <div className="productivity-lane-main">
        <strong>{title}</strong>
        <code>{branch}</code>
        <span>{prompt}</span>
      </div>
      <div className="lane-status">
        <i />
        {status}
      </div>
    </div>
  );
}

function ExampleCard({ number, title, text, prompt }) {
  return (
    <div className="workflow-example">
      <span>{number}</span>
      <strong>{title}</strong>
      <p>{text}</p>
      <code>{prompt}</code>
    </div>
  );
}

function CopilotWorkspaceVisual() {
  return (
    <div className="ai-workspace-grid">
      <div className="ai-workspace-map">
        <RepoBadge label="app-repo" compact />
        <div className="ai-lanes">
          <ProductivityLane
            role="YOU"
            title="Keep building checkout"
            branch="feature/checkout"
            prompt="No stash. No reset. Stay in flow."
            status="Open"
            tone="navy"
          />
          <Fragment asChild animation="fade-up" index={1}>
            <ProductivityLane
              role="CHAT"
              title="Fix production receipt bug"
              branch="hotfix/receipt-total"
              prompt="Copilot Chat works in the hotfix worktree."
              status="Review"
              tone="blue"
            />
          </Fragment>
          <Fragment asChild animation="fade-up" index={2}>
            <ProductivityLane
              role="CHAT"
              title="Generate regression tests"
              branch="tests/receipt-total"
              prompt="Ask for tests without touching the fix."
              status="Ready"
              tone="accent"
            />
          </Fragment>
        </div>
      </div>
      <div className="prompt-stack">
        <PromptBubble
          label="COPILOT CHAT"
          text="Find the failing path for receipt totals and propose the smallest fix."
          response="Works in ../receipt-fix"
        />
        <PromptBubble
          label="COPILOT CHAT"
          text="Add focused tests for the rounding edge case."
          response="Works in ../receipt-tests"
        />
      </div>
    </div>
  );
}

function ExampleGrid() {
  return (
    <div className="workflow-example-grid">
      <Fragment asChild animation="fade-up" index={1}>
        <ExampleCard
          number="01"
          title="Hotfix without derailing the feature"
          text="Open a hotfix worktree, ask Copilot Chat for a narrow patch, and keep the original feature window untouched."
          prompt="Fix the failing receipt total test with the smallest change."
        />
      </Fragment>
      <Fragment asChild animation="fade-up" index={2}>
        <ExampleCard
          number="02"
          title="Tests in a sibling workspace"
          text="Let Chat draft regression tests while your implementation branch remains clean enough to reason about."
          prompt="Generate tests for this bug using the existing test style."
        />
      </Fragment>
      <Fragment asChild animation="fade-up" index={3}>
        <ExampleCard
          number="03"
          title="Risky refactor as a reversible spike"
          text="Ask for the cleanup in a throwaway worktree. Keep it if it helps; delete the worktree if it gets noisy."
          prompt="Refactor this module for readability without changing behavior."
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
          title={<>Give Copilot Chat<br /><span className="title-accent">its own workspace.</span></>}
          lead="Less branch juggling. More focused AI-assisted work."
          className="intro-slide"
        >
          <BranchNetwork />
        </SlideFrame>
        <aside className="notes">
          <strong>0:00-0:20</strong><br />
          This version is about productivity, not memorizing Git commands. Worktrees give Copilot Chat
          and similar coding tools a clean workspace so you can keep your main task open and let the
          next task happen somewhere else.
        </aside>
      </Slide>

      <Slide data-timing="35">
        <SlideFrame
          number={2}
          eyebrow="THE SHIFT"
          title="Branches name work. Worktrees create places to work."
          lead="AI tools get more useful when every task has a clean lane."
        >
          <div className="model-grid">
            <WorktreeMap />
            <div className="model-explanation ai-principles">
              <div className="model-point">
                <span>01</span>
                <p><strong>Your feature stays open.</strong><br />No stash, reset, or reorientation.</p>
              </div>
              <div className="model-point">
                <span>02</span>
                <p><strong>Copilot gets clean context.</strong><br />The prompt, diff, tests, and branch line up.</p>
              </div>
              <div className="model-point">
                <span>03</span>
                <p><strong>Review stays deliberate.</strong><br />Each result is isolated until you merge it.</p>
              </div>
            </div>
          </div>
        </SlideFrame>
        <aside className="notes">
          <strong>0:20-0:55</strong><br />
          Keep the explanation short: a branch is the line of work, a worktree is the checked-out
          workspace. That matters with AI because the tool can work against a clean branch and folder
          while your current editor state remains intact.
        </aside>
      </Slide>

      <Slide data-timing="45">
        <SlideFrame
          number={3}
          eyebrow="THE PRODUCTIVITY LOOP"
          title="One repo. Several useful AI conversations."
          lead="Give every prompt a workspace that matches the task."
        >
          <CopilotWorkspaceVisual />
          <p className="fine-print">
            Under the hood: separate working directories, shared repository data, separate review points.
          </p>
        </SlideFrame>
        <aside className="notes">
          <strong>0:55-1:40</strong><br />
          The productivity loop: identify a task, create a clean worktree, use Copilot Chat there, run
          the tests there, then review that specific diff. This avoids mixing the AI-generated work with
          whatever you were doing before. Source: <a href={SOURCE_LINKS.git}>{SOURCE_LINKS.git}</a>
        </aside>
      </Slide>

      <Slide data-timing="35">
        <SlideFrame
          number={4}
          eyebrow="THE TOOLING"
          title="VS Code makes the workspace switch feel natural."
          lead="Our demo uses VS Code Source Control, then Copilot Chat inside the new worktree."
        >
          <div className="vscode-layout">
            <SourceControlPanel />
            <div className="vscode-actions">
              <Fragment asChild animation="fade-left" index={2}>
                <div className="action-card">
                  <span>01</span>
                  <strong>Open a lane</strong>
                  <p>Create a worktree for the task.</p>
                </div>
              </Fragment>
              <Fragment asChild animation="fade-left" index={3}>
                <div className="action-card">
                  <span>02</span>
                  <strong>Prompt there</strong>
                  <p>Ask Chat with clean context.</p>
                </div>
              </Fragment>
              <Fragment asChild animation="fade-left" index={4}>
                <div className="action-card">
                  <span>03</span>
                  <strong>Review diff</strong>
                  <p>Keep, merge, or discard.</p>
                </div>
              </Fragment>
            </div>
          </div>
        </SlideFrame>
        <aside className="notes">
          <strong>1:40-2:15</strong><br />
          The demo is still VS Code-based. The point is not to teach the menu; it is to show that the
          second workspace can be opened, prompted, tested, and reviewed without disturbing the first.
          VS Code exposes worktrees in Source Control, while Git remains the primitive underneath.<br /><br />
          Source: <a href={SOURCE_LINKS.vscode}>{SOURCE_LINKS.vscode}</a>
        </aside>
      </Slide>

      <Slide backgroundColor="#00175A" data-timing="90">
        <DemoCue />
        <aside className="notes">
          <strong>2:15-3:45 - LIVE DEMO</strong><br />
          1. In the current repo, open Source Control and choose Worktrees &gt; Create Worktree.<br />
          2. Create a branch such as demo/receipt-tests in a sibling folder.<br />
          3. Open the new worktree in a second VS Code window.<br />
          4. Ask Copilot Chat for a small focused test or bugfix.<br />
          5. Show the original window: its working files remain undisturbed.<br /><br />
          CLI fallback: git worktree add -b demo/receipt-tests ../receipt-tests main
        </aside>
      </Slide>

      <Slide data-timing="45">
        <SlideFrame
          number={6}
          eyebrow="EXAMPLES"
          title="Three workflows that feel better with worktrees."
          lead="Use AI help without turning one branch into a pile of experiments."
        >
          <ExampleGrid />
        </SlideFrame>
        <aside className="notes">
          <strong>3:45-4:30</strong><br />
          These are practical day-to-day examples: a hotfix, tests, and a risky refactor. The common
          pattern is that the AI work happens in a task-specific workspace, so the output is easier to
          inspect and easier to throw away if it does not help. Some Copilot CLI background sessions can
          create isolated worktrees automatically.<br /><br />
          Source: <a href={SOURCE_LINKS.agents}>{SOURCE_LINKS.agents}</a>
        </aside>
      </Slide>

      <Slide data-timing="30">
        <SlideFrame
          number={7}
          eyebrow="THE TAKEAWAY"
          title={<>Better prompts need<br /><span className="title-accent">better boundaries.</span></>}
          lead="Worktrees turn AI-assisted tasks into clean, reviewable units of work."
          className="closing-slide"
        >
          <div className="takeaway-grid">
            <Takeaway number="01" title="Stay in flow" text="Your active feature remains open." />
            <Takeaway number="02" title="Prompt with context" text="Chat works inside the right branch and folder." />
            <Takeaway number="03" title="Review cleanly" text="Each AI result has its own diff." />
          </div>
          <CodeInset title="MENTAL MODEL" className="closing-code">
            {`task -> worktree -> prompt -> test -> review`}
          </CodeInset>
        </SlideFrame>
        <aside className="notes">
          <strong>4:30-5:00</strong><br />
          The close: worktrees are productivity infrastructure for AI coding tools. They keep context
          intact, make prompts more grounded, and make generated changes easier to review.
        </aside>
      </Slide>
      </Deck>
    </div>
  );
}
