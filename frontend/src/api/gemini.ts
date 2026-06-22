import api from './axios';

// ── Typed error categories ────────────────────────────────────────────────────
export type GeminiError =
  | { type: 'unavailable'; message: string }
  | { type: 'network';     message: string }
  | { type: 'unknown';     message: string };

/**
 * Ask the DevFix AI backend to diagnose an error.
 * The backend holds the Gemini API key — users never need to enter one.
 *
 * POST /api/ai/diagnose  →  { answer: string }
 */
export async function askGemini(_unused: string, prompt: string): Promise<string>;
export async function askGemini(prompt: string): Promise<string>;
export async function askGemini(promptOrUnused: string, maybePrompt?: string): Promise<string> {
  // Support both old signature askGemini(apiKey, prompt) and new askGemini(prompt)
  const errorText = maybePrompt ?? promptOrUnused;

  try {
    const response = await api.post<{ answer: string; error?: string }>('/api/ai/diagnose', {
      errorText,
    });

    if (response.data.error) {
      throw { type: 'unavailable', message: response.data.error } as GeminiError;
    }

    return response.data.answer;
  } catch (err: any) {
    // Axios error with response from our backend
    if (err?.response) {
      const status = err.response.status;
      const msg = err.response.data?.error ?? 'AI service error';
      if (status === 503) throw { type: 'unavailable', message: msg } as GeminiError;
      if (status === 401) throw { type: 'unavailable', message: msg } as GeminiError;
      throw { type: 'unknown', message: msg } as GeminiError;
    }
    // Network error (backend not running)
    if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network Error')) {
      throw { type: 'network', message: 'Cannot reach the DevFix AI server. Make sure the backend is running.' } as GeminiError;
    }
    // Already a typed GeminiError
    if (err?.type) throw err;
    throw { type: 'unknown', message: err?.message ?? 'AI request failed.' } as GeminiError;
  }
}

// ── Keep exports that pages still reference ───────────────────────────────────
// These are now no-ops — key management is on the server
export const GEMINI_STORAGE_KEY = 'devfix_gemini_key';
export const DEVFIX_SYSTEM_PROMPT = ''; // unused, prompt is built in GeminiService.java
export function getApiKey(): string { return 'server-managed'; }
export function saveApiKey(_key: string) { /* no-op */ }
export function clearApiKey() { /* no-op */ }

export interface ApiKeyPanelProps {
  apiKey: string;
  setApiKey: (k: string) => void;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  onSave: () => void;
}
