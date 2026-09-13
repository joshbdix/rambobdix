/**
 * Security validation and sanitization utilities
 * JOSH RAMBO BDIX Bypass™
 */

/**
 * Validates that an external URL strictly uses the https:// protocol.
 * Rejects javascript:, data:, vbscript:, file:, http:, or malformed protocols.
 */
export function validateHttpsUrl(url: string, fieldName = 'URL'): { isValid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: `${fieldName} খালি হতে পারে না।` };
  }

  const trimmed = url.trim();

  // Explicit check for dangerous protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return { isValid: false, error: `${fieldName} এ অননুমোদিত প্রোটোকল শনাক্ত হয়েছে। কেবল https:// লিঙ্ক গ্রহণযোগ্য।` };
  }

  if (!lower.startsWith('https://')) {
    return { isValid: false, error: `${fieldName} অবশ্যই https:// দিয়ে শুরু হতে হবে।` };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return { isValid: false, error: `${fieldName} অবশ্যই https:// প্রোটোকল ব্যবহার করতে হবে।` };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: `${fieldName} একটি সঠিক ওয়েব লিঙ্ক নয়।` };
  }
}

/**
 * Safely sanitizes external URLs, returning a fallback if invalid or dangerous.
 */
export function safeHttpsUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  const validation = validateHttpsUrl(url);
  return validation.isValid ? url.trim() : fallback;
}

/**
 * Strips script tags and dangerous HTML injections from plain text inputs.
 */
export function sanitizePlainString(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}
