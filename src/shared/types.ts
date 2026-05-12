export type ExplainMode = 'normal' | 'eli5';

export type Provider = 'anthropic' | 'groq';

export type ClaudeModel = 'claude-haiku-4-5' | 'claude-sonnet-4-6' | 'claude-opus-4-7';

export type GroqModel = 'llama-3.3-70b-versatile' | 'llama-3.1-8b-instant';

export type ModelId = ClaudeModel | GroqModel;

export interface DecodeSettings {
  provider: Provider;
  anthropicApiKey: string;
  groqApiKey: string;
  anthropicModel: ClaudeModel;
  groqModel: GroqModel;
  defaultMode: ExplainMode;
}

export interface DecodeRequest {
  requestId: string;
  code: string;
  language: string | null;
  sourceUrl: string;
  mode: ExplainMode;
}

export interface NotebookEntry {
  id: string;
  code: string;
  language: string | null;
  explanation: string;
  sourceUrl: string;
  mode: ExplainMode;
  savedAt: string;
}

export const PENDING_REQUEST_KEY = 'decode.pending';

export interface SelectionPayload {
  code: string;
  language: string | null;
  sourceUrl: string;
}

export type MessageFromContent =
  | { type: 'DECODE_SELECTION'; payload: SelectionPayload }
  | { type: 'PING' };

export type MessageFromBackground =
  | { type: 'DECODE_START'; payload: DecodeRequest }
  | { type: 'DECODE_CHUNK'; payload: { text: string } }
  | { type: 'DECODE_DONE' }
  | { type: 'DECODE_ERROR'; payload: { message: string } };

export const DEFAULT_SETTINGS: DecodeSettings = {
  provider: 'anthropic',
  anthropicApiKey: '',
  groqApiKey: '',
  anthropicModel: 'claude-haiku-4-5',
  groqModel: 'llama-3.3-70b-versatile',
  defaultMode: 'normal',
};

export function getActiveApiKey(s: DecodeSettings): string {
  return s.provider === 'groq' ? s.groqApiKey : s.anthropicApiKey;
}

export function getActiveModel(s: DecodeSettings): ModelId {
  return s.provider === 'groq' ? s.groqModel : s.anthropicModel;
}
