# News Sentiment Analysis SPA

## 📖 How to read this codebase

- **smart-reviewer/**: The core Next.js web application (App Router).
- **tofu/**: OpenTofu (IaC) configuration for managing MongoDB Atlas infrastructure (Clusters, Users, IP Access).
- **assignment/**: Context for the original assignment and agent prompts.
- **docs/**: Comprehensive documentation of the architecture, IMPLEMENTATION.md (plan), and setup details.
- **work_log/**: Activity logs for both humans and agents (e.g., `work_log/antigravitys_work.md`).
- **AGENTS.md**: Operating rules for AI coding assistants.
- **.env.example**: Reference for local environment variables.

## 🚀 Getting Started

### 1. Local Application Setup

- `cd smart-reviewer`
- `npm install`
- Copy `.env.example` into `smart-reviewer/.env.local` and add your:
  - `MONGODB_URI`
  - `OPENAI_API_KEY`
  - `GNEWS_KEY`
- Run the dev server: `npm run dev`

### 2. Cloud Infrastructure (OpenTofu)

The cloud infrastructure (MongoDB Atlas) is managed declaratively. CI/CD for this is automated via GitHub Actions in `.github/workflows/tofu.yml`.

#### Required GitHub Secrets

To authorize the automation, add these secrets in your GitHub repository (`Settings > Secrets and variables > Actions`):

| Secret Name         | Description                                |
| ------------------- | ------------------------------------------ |
| `ATLAS_ORG_ID`      | Your MongoDB Atlas Organization ID         |
| `ATLAS_PUBLIC_KEY`  | MongoDB Atlas Programmatic API Public Key  |
| `ATLAS_PRIVATE_KEY` | MongoDB Atlas Programmatic API Private Key |
| `DB_PASSWORD`       | Password for the `appUser` database user   |

## 🛠️ Best Practices

- Refer to `docs/SKILLS_CLI.md` for CLI usage.
- All contributors must document their work in a log file within the `work_log/` directory.
