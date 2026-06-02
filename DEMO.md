# Live Demo Guide

The deck reserves roughly 90 seconds for an editor-based demonstration after slide 4.
Keep the change small enough that the audience can see the workspace isolation,
not watch code generation.

## Before Presenting

1. Open a clean demo repository on a branch named `feature/payment-flow`.
2. Ensure your editor recognizes the repository and exposes Git/worktree actions.
3. If you are using VS Code or IntelliJ, confirm the worktree entry point is visible.
4. Prepare a small Copilot Chat prompt, such as:

   > Add a concise README section explaining how to run the local test command.

5. Close unrelated windows and notifications.
6. Run the CLI fallback once before the presentation.

## Live Flow

1. From your editor's Git/worktree entry point, create a new worktree.
2. Create `demo/copilot-note` in a sibling directory.
3. Open the new worktree in a second editor window.
4. Ask Copilot Chat to make the prepared focused change.
5. Show the changed file in the new window.
6. Return briefly to the original window and show that its working files remain
   untouched.
7. Return to slide 6.

## CLI Fallback

If the menu or Copilot workflow is unavailable, demonstrate the Git primitive:

```bash
git worktree add -b demo/copilot-note ../copilot-note main
git worktree list
git -C ../copilot-note status --short --branch
git worktree remove ../copilot-note
```

If the new worktree contains uncommitted demo changes, remove it with:

```bash
git worktree remove --force ../copilot-note
```

## Rehearsal Targets

- Slides 1-4: about 2 minutes 15 seconds
- Live demo: about 1 minute 30 seconds
- Slides 6-7: about 1 minute 15 seconds
- Open speaker notes with `S` after starting the local server.
