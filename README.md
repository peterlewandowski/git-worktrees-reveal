# Git Worktrees: More Room to Work

A five-minute reveal.js React presentation introducing Git worktrees to software
engineers, coworkers, and leadership.

## Run Locally

Use Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Press `S` to open reveal.js speaker notes.

## Production Build

```bash
npm run build
npm run preview
```

The Vite configuration uses relative asset paths so the generated `dist/`
folder can run under a GitHub Pages project subpath.

## Presenting

- Use arrow keys or the on-screen controls to advance.
- Click the theme control or press `D` to switch between light and dark mode.
- Press `S` for the speaker view, timing guidance, and slide notes.
- Press `F` for fullscreen.
- Follow [DEMO.md](./DEMO.md) for the live VS Code segment and CLI fallback.

To open the deployed deck directly in dark mode, add `?theme=dark` before the
slide hash:

```text
https://example.github.io/repository-name/?theme=dark
```

## Sources

- [Git worktree documentation](https://git-scm.com/docs/git-worktree)
- [VS Code Git branches and worktrees](https://code.visualstudio.com/docs/sourcecontrol/branches-worktrees)
- [IntelliJ IDEA Git worktrees](https://www.jetbrains.com/help/idea/use-git-worktrees.html)
- [VS Code Copilot CLI sessions](https://code.visualstudio.com/docs/copilot/agents/background-agents)
- [Official reveal.js React wrapper](https://revealjs.com/react/)
- [reveal.js speaker view](https://revealjs.com/speaker-view/)
- [GitHub Pages custom workflows](https://docs.github.com/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
