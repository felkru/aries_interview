This is a markdown version of the assignment pdf for faster agent access.

---

# **Case Study: Smart Reviewer**

**Estimated Duration:** 2–4 hours  
**Tech Stack:** Ruby on Rails or any JavaScript framework (e.g., React, Vue, Next.js)

## **Objective**

Build a single-page application (SPA) that fetches real-time news articles, uses Generative AI to generate a summary and sentiment analysis, and stores the results in a MongoDB collection.

## **Overview**

You are tasked with building **Smart Reviewer**, a web application that allows users to:

1. **Search** for recent news articles using a public API.
2. **Select** an article to trigger:
   - A summary generated via a GenAI API.
   - A sentiment score (e.g., positive, neutral, negative).
3. **Store** the results in a MongoDB database.
4. **Display** all analyzed results clearly in a dashboard or table.

## **Project Goals**

This case study assesses your ability to:

- Build a clean, responsive frontend.
- Integrate with external third-party APIs.
- Implement GenAI functionality.
- Manage data persistence with MongoDB.
- Handle the request lifecycle (loading, error, and success states).

## **Technical Requirements**

### **1\. News API**

Use a service such as **GNews.io** (Free Tier: 100 requests/day) or any other news/RSS feed. The design of how users select or request articles is up to you, but the flow should be intuitive and purposeful.

### **2\. GenAI Summary API**

Use any free-tier API from a GenAI provider (e.g., OpenAI, Gemini, Anthropic). Assessment is based on integration rather than the specific model choice or output quality.

### **3\. Sentiment Analysis**

Develop a strategy for sentiment analysis. Aim to minimize the number of API calls made (e.g., by requesting the summary and sentiment in a single prompt).

### **4\. MongoDB Storage**

The application must store the summarized articles and their analysis. These results must be displayed in a table or list for the user to review.

## **Time Management & Infrastructure**

- **Timeline:** Aim to complete the core requirements within 2–4 hours. Additional polishing is welcome but not required.
- **Deployment:** You may host the app on a free-tier solution (like Vercel, Render, or Railway) or provide a clear README with installation instructions.
- **Notes:** If there are features or improvements you would have implemented with more time, please include them in your submission notes.

## **Submission & Support**

If you have questions during the process, please reach out to the contact provided in the original brief. We look forward to seeing your approach to architecture and execution under a short time constraint.
