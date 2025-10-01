/**
 * Extracts the user ID from the full matrix user ID
 * For example: @alexbrown:matrix.org -> alexbrown
 * @param fullUserId The full user ID
 * @returns The user ID
 */
export const extractUserId = (fullUserId?: string) => (fullUserId ? fullUserId.match(/^@([^:]+):/)?.[1] : '');

/**
 * Fetches media with auth for the given url and access token
 * @param url The url
 * @param accessToken The matrix access token
 * @returns response
 */
export const fetchMediaWithAuth = (url: string, accessToken: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
