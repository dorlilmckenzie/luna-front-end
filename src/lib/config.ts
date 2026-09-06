/**
 * Central place for build-time configuration. API URL comes from the environment
 * (NEXT_PUBLIC_API_URL) and is never hardcoded elsewhere in the codebase.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api';
