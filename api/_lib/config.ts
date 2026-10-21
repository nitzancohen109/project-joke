// Server-side configuration. The model name lives here only — changing it requires product-owner approval.
export const OPENAI_MODEL = 'gpt-5';

export const TOPIC_MAX_LENGTH = 100;

// OpenAI request timeout; the Vercel function itself is capped at 30s in vercel.json.
export const OPENAI_TIMEOUT_MS = 25_000;

// Small request body cap: a 100-char topic fits comfortably even when fully \u-escaped.
export const MAX_BODY_BYTES = 2048;
