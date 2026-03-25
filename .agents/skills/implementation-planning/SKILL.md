---
name: implementation-planning
description: "Create concise, visual implementation plans that reference existing docs and supplement with interactive HTML/SVG diagrams for non-standard patterns. Use when: creating implementation plans, planning new features, architecting systems, breaking down projects. (triggers: implementation plan, architecture plan, project plan, feature breakdown)"
---

# Implementation Planning Standard

## Priority: P1 (Standard)

## Core Principle

Implementation plans should be **concise documents that contain a todo list and then reference other resources for details on the todos** rather than duplicating information. Use **mermaid or UML diagrams** (sequence, C4, ERD) as the primary visualization tool. Only create **interactive HTML/SVG files** if the concept is too complex for a static diagram (e.g., multi-state interactive explorations, layered architecture with hover details).

## Workflow

### 1. Research Phase

- Read all existing documentation (README, assignment briefs, architecture docs)
- Identify external APIs and fetch their latest docs
- Note the current time (per AGENTS.md rules)
- Understand existing patterns and skills in the project

### 2. Visualize with Mermaid (Primary)

Embed diagrams directly in the implementation plan markdown:

| When to use              | Diagram type                                       |
| ------------------------ | -------------------------------------------------- |
| Multi-step request flows | `sequenceDiagram` with participants and alt blocks |
| System architecture      | C4 container diagram (`graph TD`)                  |
| Data models              | `erDiagram` with relationships                     |
| State machines           | `stateDiagram-v2`                                  |
| Decision flows           | `flowchart LR`                                     |

Follow [common-architecture-diagramming](../common-architecture-diagramming/SKILL.md) for C4/UML standards.

### 3. HTML/SVG — Last Resort Only

Only create a standalone HTML file when:

- The diagram needs **interactivity** (tabs, hover, toggle) that mermaid can't express
- The visualization has **20+ nodes** and needs pan/zoom
- You need **animated data flows** or **step-by-step walkthroughs**

If you do create HTML, match the project's existing theme and keep it self-contained (no external deps).

### 4. Write the Implementation Plan

Write a **concise** plan artifact that:

- Opens with a 1-line project description
- Contains a **todo list** as the primary structure
- Uses **mermaid sequence diagrams** for key flows
- Shows a **markdown file tree** for project structure
- Groups work into **Phases** (typically: setup → backend → frontend → deploy)
- For each file: `[NEW]`/`[MODIFY]`/`[DELETE]` badge + 1-2 line description
- Includes **detailed prompt engineering docs** (see §5 below) if the project uses LLMs
- References existing docs (architecture files, API docs) instead of duplicating
- Ends with a concrete **Verification Plan** (automated + browser + manual)

**Anti-Patterns:**

- ❌ Creating HTML files for things expressible as mermaid diagrams
- ❌ Inlining full code snippets (show only the non-obvious parts)
- ❌ Duplicating info already in other docs
- ❌ Vague verification ("test it works") — use exact commands
- ❌ Walls of text — use tables and bullet points
- ❌ Undocumented prompts — never leave LLM integration as a black box

### 5. Document Prompt Engineering (Mandatory for LLM Projects)

If the project calls any LLM API, the implementation plan **must** include a dedicated section covering:

| Item | What to document |
| ---- | ---- |
| **Goal** | What the prompt is trying to achieve (1 line) |
| **System prompt** | Full text of the system message |
| **User prompt template** | Template with `${variable}` placeholders, showing what context is sent |
| **Output schema** | Exact shape of expected response (Zod schema, JSON schema, or TypeScript type) |
| **Model + parameters** | Model name, `temperature`, `max_tokens`, and **rationale** for each choice |
| **Parsing strategy** | How the response is parsed (SDK structured outputs, JSON.parse, regex, etc.) |
| **Edge cases** | What happens on refusal, malformed output, or rate limiting |
| **Iteration notes** | Any prompt variations tried and why the current version was chosen |

This section should be **copy-pasteable** — an engineer should be able to implement the integration from this alone.

### 6. Track Progress

Create `task.md` artifact with checkboxes for each phase/file.

## References

- [Common Architecture Diagramming Skill](../common-architecture-diagramming/SKILL.md) — for C4/Mermaid standards
- [API Validation Skill](../api-validation/SKILL.md) — for verifying API contracts post-implementation
