# Felix's work log

- 10:50 - 11:05: Read the task, create a git repo, structure it and ask claude cowork to brainstorm archietecture with me (initial commit)
- 11:05 - 11:15: Sign up for API Keys at MongoDB Atlas and GNews and put them into the .env file, store an example .env to make useage easier and allow agents to read it directly without leaking credentials
- 11:15 - 11:25: Understand which KPIs you have for this project
- 11:25 - 11:45: Use Claude Chat to research relevant skill.md files matching these KPIs
- 11:45 - 12:00: Install Atlas Management CLI and add relevant Skills
- 12:00 - 12:20: Start Skills Security Review, add md version of pdf task, set up Vercel CLI
- 12:25 - 12:30: Short break before I start implementation to reflect and relax
- 12:45 - 13:55: Iterate on visual Implementation Plan with Antigravity (Model Claude Opus 4.5), Add Test Driven Development Skill
- 13:55 - 14:10: Start with Phase 0 (Gemini 3.1 Pro (Low)), monitor agent while working
- 14:10 - 14:15: Asked Gemini to add tailwind, bcs i didn't notice it left it out in the implementation plan (2 hours and 25 minutes of work)
- 14:15 - 15:33: Lunchbreak with friends
- 15:33 - 15:38: Review agent progress
- 15:38 - 15:45: Ask Gemini to continue with Phase 1
- 16:05 - 16:16: Switch MongoConfig to OpenTofu
- 16:16 - 16:25: Ask Claude Opus to create the UI (Phase 2)
- 16:25 - 17:00: Perform various end-to-end tests, using Claude Code, added documentation skills
- 17:00 - 17:10: Let Opus Fix issues from UX audit
- 17:10 - 17:20: Suggest UI improvements (sticky header, quick search chips)
- 17:20 - 17:55: Reliability testing, Fix CLS/layout shifting and working through bugs
- 18:00 - 18:20: Deployment debugging
- 19:44 - 20:30: Fix security issues in deployment
- 20:30 - 20:40:

## What I still want to do

- [x] Use <https://stitch.withgoogle.com/> to understand it by redesigning the frontend after claude is done with the first iteration (turned out to be pretty much useless)
- [x] Add batch requests for all articles that come up after the initial api request (Doesn't make sense with the current UI and I think it's better for users to decide whether they want to see AI summaries or not explicitly to create trust)
- [x] Reliability testing
- [x] Make sure analysis are always in english, check using dictionary check and repeat if AI output doesn't pass that check, remove the old analysis from the db
- [x] Make sure that article contents are actually in AI context, when performing the summarization, flush all cached and stored ai responses
- [x] Deployment (Phase 3)
- [x] Security Testing and hardening (deployment on private url first, then security testing, then release on public url)
- [ ] Update documentation (with full pages on at least api reference, prompt/context/AI efficiency engineering, a page showcasing all the components and their features, the architecture, getting started, a troubleshooting page based on failures that came up in our prior conversations and the approach used for web scraping)
- [ ] Fix issue with OpenTofu during CI/CD
- [ ] Have manus try to create an account hisself and deploy a second version somewhere
- [ ] Add vercel analytics
