import Anthropic from '@anthropic-ai/sdk';
import type { ExplainMode, ModelId, Provider } from './types';
import { buildUserMessage, getSystemPrompt } from './prompts';

export interface StreamOptions {
  provider: Provider;
  apiKey: string;
  model: ModelId;
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
  try {
    if (opts.provider === 'groq') {
      await streamFromGroq(opts);
    } else {
      await streamFromAnthropic(opts);
    }
    opts.onDone();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    opts.onError(message);
  }
}

async function streamFromAnthropic(opts: StreamOptions): Promise<void> {
  const client = new Anthropic({
    apiKey: opts.apiKey,
    dangerouslyAllowBrowser: true,
  });

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
}

async function streamFromGroq(opts: StreamOptions): Promise<void> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: 1024,
      stream: true,
      messages: [
        { role: 'system', content: getSystemPrompt(opts.mode) },
        {
          role: 'user',
          content: buildUserMessage({
            code: opts.code,
            language: opts.language,
            sourceUrl: opts.sourceUrl,
          }),
        },
      ],
    }),
    signal: opts.signal,
  });

  if (!response.ok || !response.body) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Groq API ${response.status}: ${errText || response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;

      try {
        const event = JSON.parse(data);
        const delta = event?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta.length > 0) {
          opts.onChunk(delta);
        }
      } catch {
        // malformed SSE frame — skip
      }
    }
  }
}
