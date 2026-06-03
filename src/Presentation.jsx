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
            title="Stable implementation"
            branch="feature/search"
            prompt="Keep the version you trust open."
            status="Open"
            tone="navy"
          />
          <Fragment asChild animation="fade-up" index={1}>
            <ProductivityLane
              role="CHAT"
              title="Try a refactor"
              branch="experiment/search-refactor"
              prompt="Let Chat reorganize the module safely."
              status="Compare"
              tone="blue"
            />
          </Fragment>
          <Fragment asChild animation="fade-up" index={2}>
            <ProductivityLane
              role="CHAT"
              title="Try an alternate fix"
              branch="experiment/search-alt"
              prompt="Ask for a smaller patch in another lane."
              status="Decide"
              tone="accent"
            />
          </Fragment>
        </div>
      </div>
      <div className="prompt-stack">
        <PromptBubble
          label="COPILOT CHAT"
          text="Refactor this search module for readability, but keep behavior unchanged."
          response="Experiment A"
        />
        <PromptBubble
          label="COPILOT CHAT"
          text="Find the smallest fix for the flaky ranking test without refactoring."
          response="Experiment B"
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
          title="Compare two AI solutions"
          text="Ask for a broad refactor in one worktree and a minimal patch in another. Compare the diffs, not the vibes."
          prompt="A: refactor for clarity. B: smallest safe fix."
        />
      </Fragment>
      <Fragment asChild animation="fade-up" index={2}>
        <ExampleCard
          number="02"
          title="Sandbox dependency upgrades"
          text="Let Chat update a dependency, adjust imports, and run tests in a lane you can delete if the blast radius is too big."
          prompt="Upgrade this package and fix compile/test failures."
        />
      </Fragment>
      <Fragment asChild animation="fade-up" index={3}>
        <ExampleCard
          number="03"
          title="Review generated code in isolation"
          text="Open the generated result next to your trusted workspace and inspect only the relevant diff."
          prompt="Summarize what changed and what I should verify."
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
          title={<>Turn AI output into<br /><span className="title-accent">reviewable experiments.</span></>}
          lead="Worktrees let you try bold ideas without gambling your active workspace."
          className="intro-slide"
        >
          <BranchNetwork />
        </SlideFrame>
        <aside className="notes">
          <strong>0:00-0:20</strong><br />
          This version is about safe experimentation. Copilot Chat and similar tools can move fast, but
          the human still needs a clean way to compare, review, and decide.
        </aside>
      </Slide>

      <Slide data-timing="35">
        <SlideFrame
          number={2}
          eyebrow="THE SHIFT"
          title="AI can generate options. Worktrees help you choose."
          lead="Keep one trusted workspace, then test experiments beside it."
        >
          <div className="model-grid">
            <WorktreeMap />
            <div className="model-explanation ai-principles">
              <div className="model-point">
                <span>01</span>
                <p><strong>Try more ideas.</strong><br />Refactor, patch, upgrade, or investigate.</p>
              </div>
              <div className="model-point">
                <span>02</span>
                <p><strong>Keep ideas separated.</strong><br />Each experiment has its own branch and diff.</p>
              </div>
              <div className="model-point">
                <span>03</span>
                <p><strong>Promote only the winner.</strong><br />Delete the worktree when it does not help.</p>
              </div>
            </div>
          </div>
        </SlideFrame>
        <aside className="notes">
          <strong>0:20-0:55</strong><br />
          The short explanation: keep your trusted branch open, create separate worktrees for generated
          experiments, and choose based on tests and diffs.
        </aside>
      </Slide>

      <Slide data-timing="45">
        <SlideFrame
          number={3}
          eyebrow="THE PRODUCTIVITY LOOP"
          title="One repo. Multiple safe experiments."
          lead="Let AI produce options, then compare them like an engineer."
        >
          <CopilotWorkspaceVisual />
          <p className="fine-print">
            Under the hood: separate working directories, shared repository data, separate review points.
          </p>
        </SlideFrame>
        <aside className="notes">
          <strong>0:55-1:40</strong><br />
          The productivity loop: trusted workspace, experiment workspace, prompt, test, compare. This
          makes AI output less magical and more reviewable. Source: <a href={SOURCE_LINKS.git}>{SOURCE_LINKS.git}</a>
        </aside>
      </Slide>

      <Slide data-timing="35">
        <SlideFrame
          number={4}
          eyebrow="THE TOOLING"
          title="VS Code becomes the experiment switchboard."
          lead="Open the experiment next to the trusted branch, then ask Copilot Chat to work there."
        >
          <div className="vscode-layout">
            <SourceControlPanel />
            <div className="vscode-actions">
              <Fragment asChild animation="fade-left" index={2}>
                <div className="action-card">
                  <span>01</span>
                  <strong>Fork the idea</strong>
                  <p>Create an experiment worktree.</p>
                </div>
              </Fragment>
              <Fragment asChild animation="fade-left" index={3}>
                <div className="action-card">
                  <span>02</span>
                  <strong>Try it there</strong>
                  <p>Prompt, test, and iterate.</p>
                </div>
              </Fragment>
              <Fragment asChild animation="fade-left" index={4}>
                <div className="action-card">
                  <span>03</span>
                  <strong>Compare</strong>
                  <p>Pick the safer result.</p>
                </div>
              </Fragment>
            </div>
          </div>
        </SlideFrame>
        <aside className="notes">
          <strong>1:40-2:15</strong><br />
          In the demo, show the original workspace as the trusted version and the new worktree as the
          experiment. Ask Copilot Chat to change the experiment, then compare the result before merging.<br /><br />
          Source: <a href={SOURCE_LINKS.vscode}>{SOURCE_LINKS.vscode}</a>
        </aside>
      </Slide>

      <Slide backgroundColor="#00175A" data-timing="90">
        <DemoCue />
        <aside className="notes">
          <strong>2:15-3:45 - LIVE DEMO</strong><br />
          1. In the current repo, open Source Control and choose Worktrees &gt; Create Worktree.<br />
          2. Create a branch such as demo/search-refactor in a sibling folder.<br />
          3. Open the new worktree in a second VS Code window.<br />
          4. Ask Copilot Chat for a small refactor or alternate fix.<br />
          5. Show the original window: its working files remain undisturbed.<br /><br />
          CLI fallback: git worktree add -b demo/search-refactor ../search-refactor main
        </aside>
      </Slide>

      <Slide data-timing="45">
        <SlideFrame
          number={6}
          eyebrow="EXAMPLES"
          title="Three experiments that are safer in a worktree."
          lead="The goal is not more generated code. It is better choices."
        >
          <ExampleGrid />
        </SlideFrame>
        <aside className="notes">
          <strong>3:45-4:30</strong><br />
          These examples make worktrees feel like a lab bench: compare two solutions, sandbox a risky
          upgrade, and review generated code away from your trusted workspace.<br /><br />
          Source: <a href={SOURCE_LINKS.agents}>{SOURCE_LINKS.agents}</a>
        </aside>
      </Slide>

      <Slide data-timing="30">
        <SlideFrame
          number={7}
          eyebrow="THE TAKEAWAY"
          title={<>Use AI boldly.<br /><span className="title-accent">Merge cautiously.</span></>}
          lead="Worktrees make experimentation cheap without making review sloppy."
          className="closing-slide"
        >
          <div className="takeaway-grid">
            <Takeaway number="01" title="Experiment freely" text="Try refactors and upgrades in isolated lanes." />
            <Takeaway number="02" title="Compare evidence" text="Use tests, diffs, and behavior to choose." />
            <Takeaway number="03" title="Delete noise" text="Bad experiments do not have to haunt the branch." />
          </div>
          <CodeInset title="MENTAL MODEL" className="closing-code">
            {`trusted branch -> experiment -> compare -> merge or delete`}
          </CodeInset>
        </SlideFrame>
        <aside className="notes">
          <strong>4:30-5:00</strong><br />
          The close: worktrees are useful because they let developers try more AI-assisted approaches
          while keeping the review process grounded and controlled.
        </aside>
      </Slide>
      </Deck>
    </div>
  );
}
