import Anthropic from '@anthropic-ai/sdk';
import type { ClaudeModel, ExplainMode } from '../shared/types';
import { buildUserMessage, getSystemPrompt } from '../shared/prompts';

export interface StreamOptions {
  apiKey: string;
  model: ClaudeModel;
  mode: ExplainMode;
  code: string;
  language: string | null;
  sourceUrl: string;
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
  signal?: AbortSignal;
}

export async function streamExplanation(opts: StreamOptions): Promise<void> {
  const client = new Anthropic({
    apiKey: opts.apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    const stream = client.messages.stream(
      {
        model: opts.model,
        max_tokens: 1024,
        system: [
          {
            type: 'text',
            text: getSystemPrompt(opts.mode),
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          {
            role: 'user',
            content: buildUserMessage({
              code: opts.code,
              language: opts.language,
              sourceUrl: opts.sourceUrl,
            }),
          },
        ],
      },
      { signal: opts.signal }
    );

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        opts.onChunk(event.delta.text);
      }
    }

    opts.onDone();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    opts.onError(message);
  }
}
