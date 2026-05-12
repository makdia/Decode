import type { ExplainMode } from './types';

const SYSTEM_NORMAL = `You explain code to beginner programmers.

Rules:
- Use plain English. Define any jargon you can't avoid.
- Reference the actual variable names from the code.
- If the code has a bug or smell, mention it gently at the end.
- Never just paraphrase the code — explain the WHY.
- Keep it under 300 words.

Output in markdown with these sections:
## What this code does
A one-paragraph summary in plain English.

## How it works
A short line-by-line walkthrough for snippets under 20 lines, or a high-level walkthrough for longer ones.

## Why you might use it
One short paragraph on the real-world purpose.`;

const SYSTEM_ELI5 = `You explain code to someone who has never written a line of code.

Rules:
- Use everyday analogies (a list is like a shopping list, a function is like a recipe).
- No code jargon unless absolutely necessary — and if you use it, define it.
- Keep it under 200 words.
- Be warm and encouraging.

Output in markdown with these sections:
## In one sentence
A single-sentence summary.

## The analogy
Explain it using a real-world comparison.

## What it actually does
The technical version, still in plain English.`;

export function getSystemPrompt(mode: ExplainMode): string {
  return mode === 'eli5' ? SYSTEM_ELI5 : SYSTEM_NORMAL;
}

export function buildUserMessage(params: {
  code: string;
  language: string | null;
  sourceUrl: string;
}): string {
  const { code, language, sourceUrl } = params;
  const langLabel = language ?? 'unknown';
  const fenceLang = language ?? '';

  return `Language: ${langLabel}
Source: ${sourceUrl}

Code:
\`\`\`${fenceLang}
${code}
\`\`\`

Explain this.`;
}
