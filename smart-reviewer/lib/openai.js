import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI();

const ReviewSchema = z.object({
  summary: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  confidence: z.number(),
});

export async function analyzeArticle(article) {
  const systemMessage = {
    role: 'system',
    content: `You are an expert news analyst. Given a news article, analyze it and provide:
1. A neutral, factual summary in 2-3 sentences
2. The overall sentiment of the article
3. Your confidence in the sentiment assessment (0-1)

Be objective. Do not inject opinion. If the article is ambiguous, lean toward "neutral" and lower your confidence score.`
  };

  const userMessage = {
    role: 'user',
    content: `Analyze this news article:

Title: ${article.title}
Source: ${article.source?.name}
Published: ${article.publishedAt}
Description: ${article.description}
Full Content: ${article.content}`
  };

  const completion = await openai.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [systemMessage, userMessage],
    response_format: zodResponseFormat(ReviewSchema, 'review'),
  });

  return completion.choices[0].message.parsed;
}
