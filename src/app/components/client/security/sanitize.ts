import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * Uses DOMPurify to strip dangerous tags and attributes.
 * 
 * @param html The raw HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html);
}
