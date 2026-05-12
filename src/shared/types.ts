export type ExplainMode = 'normal' | 'eli5';

export type ClaudeModel = 'claude-haiku-4-5' | 'claude-sonnet-4-6' | 'claude-opus-4-7';

export interface DecodeSettings {
  apiKey: string;
  model: ClaudeModel;
  defaultMode: ExplainMode;
}

export interface DecodeRequest {
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

export type MessageFromContent =
  | { type: 'DECODE_SELECTION'; payload: DecodeRequest }
  | { type: 'PING' };

export type MessageFromBackground =
  | { type: 'DECODE_START'; payload: DecodeRequest }
  | { type: 'DECODE_CHUNK'; payload: { text: string } }
  | { type: 'DECODE_DONE' }
  | { type: 'DECODE_ERROR'; payload: { message: string } };

export const DEFAULT_SETTINGS: DecodeSettings = {
  apiKey: '',
  model: 'claude-haiku-4-5',
  defaultMode: 'normal',
};
