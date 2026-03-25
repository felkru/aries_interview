import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI();

const ReviewSchema = z.object({
  summary: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  confidence: z.number(),
});

const MAX_RETRIES = 2;

/**
 * Checks whether a string is predominantly English by verifying that
 * ≥ 80% of its alphabetic characters are in the Basic Latin range (A-Z, a-z).
 * Non-alphabetic characters (digits, punctuation, whitespace) are ignored.
 */
export function isEnglish(text) {
  if (!text || typeof text !== 'string') return false;

  const alphaChars = text.replace(/[^\p{L}]/gu, ''); // keep only Unicode letters
  if (alphaChars.length === 0) return false;

  const latinChars = alphaChars.replace(/[^A-Za-z]/g, '');
  return latinChars.length / alphaChars.length >= 0.8;
}

export async function analyzeArticle(article) {
  // Cap content length to avoid excessive token usage (~12k chars ≈ ~3k tokens)
  const MAX_CONTENT_CHARS = 12_000;
  const content = article.content
    ? article.content.slice(0, MAX_CONTENT_CHARS)
    : '';

  const systemMessage = {
    role: 'system',
    content: `You are an expert news analyst. Given a news article, analyze it and provide:
1. A neutral, factual summary in 2-3 sentences
2. The overall sentiment of the article
3. Your confidence in the sentiment assessment (0-1)

IMPORTANT: You MUST write the summary in English, regardless of the source language of the article. Translate if necessary.

Be objective. Do not inject opinion. If the article is ambiguous, lean toward "neutral" and lower your confidence score.`
  };

  const userMessage = {
    role: 'user',
    content: `Analyze this news article:

Title: ${article.title}
Source: ${article.source?.name}
Published: ${article.publishedAt}
Description: ${article.description}
Full Content: ${content}`
  };

  let lastResult = null;
  const messages = [systemMessage, userMessage];

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const completion = await openai.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages,
      response_format: zodResponseFormat(ReviewSchema, 'review'),
    });

    lastResult = completion.choices[0].message.parsed;

    if (isEnglish(lastResult.summary)) {
      return lastResult;
    }

    console.warn(
      `[analyzeArticle] Attempt ${attempt + 1}/${MAX_RETRIES + 1}: ` +
      `summary failed English check, retrying… ("${lastResult.summary.slice(0, 60)}…")`
    );

    // Feed the incorrect response back so the model can self-correct
    messages.push(
      { role: 'assistant', content: JSON.stringify(lastResult) },
      {
        role: 'user',
        content: `Your last response was: "${lastResult.summary}". That was incorrect because it is not in English. You MUST write the summary in English. Please try again.`
      }
    );
  }

  // If all retries exhausted, throw so the caller knows analysis is unusable
  throw new Error(
    'Analysis returned non-English summary after multiple retries'
  );
}
