import { useEffect, useState } from 'react';
import type {
  DecodeRequest,
  ExplainMode,
  MessageFromBackground,
} from '../shared/types';
import CodeBlock from './components/CodeBlock';
import Explanation from './components/Explanation';
import EmptyState from './components/EmptyState';

type Status = 'idle' | 'streaming' | 'done' | 'error';

export default function App() {
  const [request, setRequest] = useState<DecodeRequest | null>(null);
  const [explanation, setExplanation] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (message: MessageFromBackground) => {
      switch (message.type) {
        case 'DECODE_START':
          setRequest(message.payload);
          setExplanation('');
          setError(null);
          setStatus('streaming');
          break;
        case 'DECODE_CHUNK':
          setExplanation((prev) => prev + message.payload.text);
          break;
        case 'DECODE_DONE':
          setStatus('done');
          break;
        case 'DECODE_ERROR':
          setError(message.payload.message);
          setStatus('error');
          break;
      }
    };

    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);

  const toggleMode = () => {
    if (!request) return;
    const nextMode: ExplainMode = request.mode === 'eli5' ? 'normal' : 'eli5';
    setRequest({ ...request, mode: nextMode });
    // Re-run is wired in v2 — for now this just toggles the label
  };

  if (!request) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-slate-900">Decode</span>
          {request.language && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {request.language}
            </span>
          )}
        </div>
        <button
          onClick={toggleMode}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          aria-pressed={request.mode === 'eli5'}
        >
          {request.mode === 'eli5' ? 'ELI5: on' : 'ELI5: off'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-3">
        <section className="mb-3">
          <CodeBlock code={request.code} language={request.language} />
        </section>

        <section>
          {status === 'error' ? (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : (
            <Explanation
              markdown={explanation}
              isStreaming={status === 'streaming'}
            />
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 px-4 py-2 text-[11px] text-slate-500">
        Powered by Claude · {request.sourceUrl ? new URL(request.sourceUrl).hostname : 'unknown'}
      </footer>
    </div>
  );
}
