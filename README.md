# 📰 Smart Reviewer — AI News Analyst

An intelligent news sentiment analysis platform that helps users understand the tone and key takeaways of the latest world events. Built with Next.js, OpenAI, and MongoDB Atlas.

![Project Preview](https://github.com/felkru/aries_interview/raw/main/public/preview.png) (Placeholder for actual image)

---

## ✨ Features

- **🔍 Intelligent Search**: Real-time news discovery powered by the GNews API.
- **🤖 Deep AI Analysis**: Goes beyond headlines—extracts full article content and generates neutral, 2-3 sentence summaries and sentiment scores using OpenAI's `gpt-4o-mini`.
- **📊 Sentiment Insights**: Categorical sentiment identification (Positive, Neutral, Negative) with AI confidence scoring.
- **🏺 Analysis History**: Persistent storage of analyzed articles in MongoDB Atlas for easy historical reference.
- **🎨 Premium UI/UX**: An Anthropic-inspired, light-mode interface with elegant transitions, glassmorphic elements, and a mobile-optimized layout.
- **♿ Accessibility First**: Fully accessible with ARIA-compliant tab systems, semantic HTML, and polished keyboard navigation.
- **🚀 Automated Infrastructure**: Declarative infrastructure management with OpenTofu (IaC) and GitHub Actions CI/CD.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI/LLM**: [OpenAI GPT-4o-mini](https://openai.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Scraping**: [Mozilla Readability](https://github.com/mozilla/readability) + [JSDOM](https://github.com/jsdom/jsdom)
- **Infrastructure**: [OpenTofu (IaC)](https://opentofu.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Vercel CLI](https://vercel.com/download)
- [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/stable/)

### 2. Local Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/felkru/aries_interview.git
   cd aries_interview/smart-reviewer
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:

   Create a `.env.local` file in the `smart-reviewer` directory:

   ```bash
   MONGODB_URI=your_mongodb_uri
   OPENAI_API_KEY=your_openai_key
   GNEWS_KEY=your_gnews_key
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   # or
   vercel dev
   ```

### 3. Infrastructure (OpenTofu)

The MongoDB Atlas cluster is managed via OpenTofu in the `tofu/` directory. CI/CD for infra is automated via GitHub Actions in `.github/workflows/tofu.yml`.

To deploy manually or via CI, you'll need the following environment variables (or GitHub Secrets):

- `ATLAS_ORG_ID`
- `ATLAS_PUBLIC_KEY`
- `ATLAS_PRIVATE_KEY`
- `DB_PASSWORD`

---

## 📖 Project Structure

- `smart-reviewer/`: The Next.js web application.
- `tofu/`: OpenTofu configurations for MongoDB Atlas.
- `docs/`: Architecture diagrams and implementation details.
- `work_log/`: Chronological log of agent activity.
- `assignment/`: Original project requirements.

---

## 📄 License

MIT © [Felix Krueckel](https://github.com/felkru)
