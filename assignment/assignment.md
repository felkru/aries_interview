This is a markdown version of the assignment PDF to simplify agent useage

---

# Case Study: Smart Reviewer

**Estimated Duration:** 2–4 hours  
**Tech Stack:** RoR or any JS frameworks  
**Objective:** Build a single-page app that fetches real-time news articles, uses GenAI to generate a summary and sentiment analysis, and stores the results in a MongoDB collection.

---

## Overview

You are tasked with building Smart Reviewer, a single-page web app that allows users to:

1. Search for recent news articles using a public API.
2. Select an article and trigger:
   - A summary using a GenAI API.
   - A sentiment score (positive/neutral/negative etc).
3. Store the results in a MongoDB database.
4. Display all results and their analysis clearly to the user.

## Project Goals

This case study assesses your ability to:

- Build a clean, responsive frontend in React.
- Integrate with external APIs.
- Use a GenAI API.
- Store and retrieve data from MongoDB.
- Handle request lifecycle (loading, error, success states).

---

## APIs You'll Use

### 1. News API

E.g., [GNews.io](https://gnews.io/) (Free Tier: 100 requests/day) or any news/general RSS feed you’d like to use.  
_Note: How the user selects, requests, or does not select an article is up to you to design. But the app should be useful and not arbitrary._

### 2. GenAI Summary API

Use any of the free tier APIs from any GenAI provider. You won't be judged on model selection or quality.

### 3. Sentiment Analysis

Come up with a strategy that uses sentiment analysis; minimize the calls you make.

---

## MongoDB Requirement

Store and display a table that is the result of articles that have been summarized.

## Time Management

Try to complete the task in 2–4 hours. You're welcome to polish it further if you'd like to showcase additional skills, but it's not expected.

## Infrastructure

You can either host the app on free-tier solutions or provide an installation README which we will follow.  
If there's anything extra you would have done but didn't have time for, you can include it in the notes to `mason@aries.global`.

---

## Good Luck!

We're excited to see how you approach the problem, balance architecture, and execute cleanly under a short time constraint.  
Please reach out to `mason@aries.global` for questions.
