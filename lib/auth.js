/**
 * Validates the API key from the request headers.
 * 
 * @param {Request} request 
 * @returns {boolean}
 */
export function validateApiKey(request) {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.API_KEY;
  
  if (!expectedKey) {
    console.warn('API_KEY is not configured in environment variables');
    return false;
  }
  
  return apiKey === expectedKey;
}
