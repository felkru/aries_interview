# Vercel Skills CLI

The project uses the [Vercel Skills CLI](https://github.com/vercel-labs/skills) to manage AI agent skills. Skills are modular sets of instructions and tools that extend the capabilities of AI agents like Claude Code, Cursor, and others.

## Installation & Setup

Ensure you have the CLI available (or use `npx`):

```bash
npx skills --help
```

The project is configured to store skills in the `.agents/skills` directory and manages them via `skills.json` and `skills-lock.json`.

## Common Commands

### Adding Skills

To add a new skill to the project:

```bash
npx skills add <repository-or-path>
# Example:
npx skills add vercel-labs/agent-skills --skill react-performance
```

### Listing Skills

To see all skills installed in the project:

```bash
npx skills list
```

### Checking for Updates

```bash
npx skills check
```

### Updating Skills

```bash
npx skills update
```

## Agent Integration

Skills are installed into `.agents/skills`. To make them available to specific agents (e.g., Claude Code), we use a synchronization script.

### Syncing Skills to Claude Code

Run the following command to symlink all project skills into the `.claude/skills` directory:

```bash
./scripts/sync-skills.sh
```

This ensures that when you use `claude` (Claude Code) in this project, it has access to the latest instructions defined in the project's skills.

## Project Structure

- `skills.json`: Defines the skills required for the project.
- `skills-lock.json`: Lockfile for skill versions and hashes.
- `.agents/skills/`: Local storage for skill definitions.
- `scripts/sync-skills.sh`: Utility to link skills to agent-specific folders.
