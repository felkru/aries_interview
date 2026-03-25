# Rules

- ALWAYS check the time (not date, but time in hh:mm) when you start working
- ONLY ever read .env.example directly
- NEVER print any real API Keys
- Before using any libraries ALWAYS fetch the latest documentation for your usecase either from the web or the docs folder.
- After you've successfully implemented a plan, but before committing, document it in your own dedicated work log at `work_log/{agent_name}s_work.md`. Check the time again before you edit the log (hh:mm). Use a maximum of 1 sentence per 10 min. of work
- NEVER modify or add entries to `work_log/felixs_work.md`.
- Before committing ALWAYS check if you are committing files that should be in the gitignore and then document

---

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
