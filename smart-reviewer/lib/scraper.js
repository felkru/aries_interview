import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

const FETCH_TIMEOUT_MS = 8_000;

/**
 * Fetches the full article text from a URL using Mozilla Readability.
 *
 * @param {string} url – The article URL to scrape.
 * @returns {Promise<string|null>} The extracted article text, or null on failure.
 */
export async function extractArticleContent(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Present ourselves as a standard browser to avoid bot-blocking
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[scraper] HTTP ${response.status} for ${url}`);
      return null;
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      console.warn(`[scraper] Readability could not parse ${url}`);
      return null;
    }

    // Collapse whitespace and trim — textContent often has excessive spacing
    return article.textContent.replace(/\s+/g, ' ').trim();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`[scraper] Timeout fetching ${url}`);
    } else {
      console.warn(`[scraper] Failed to extract content from ${url}:`, error.message);
    }
    return null;
  }
}
