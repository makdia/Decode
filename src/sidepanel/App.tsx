import { useCallback, useEffect, useRef, useState } from 'react';
import type { DecodeRequest, ExplainMode } from '../shared/types';
import { PENDING_REQUEST_KEY } from '../shared/types';
import { getSettings } from '../shared/storage';
import { streamExplanation } from '../shared/claude';
import CodeBlock from './components/CodeBlock';
import Explanation from './components/Explanation';
import EmptyState from './components/EmptyState';

type Status = 'idle' | 'streaming' | 'done' | 'error';

export default function App() {
  const [request, setRequest] = useState<DecodeRequest | null>(null);
  const [explanation, setExplanation] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const lastProcessedId = useRef<string | null>(null);

  const runDecode = useCallback(async (req: DecodeRequest) => {
    setRequest(req);
    setExplanation('');
    setError(null);
    setStatus('streaming');

    const settings = await getSettings();
    if (!settings.apiKey) {
      setError('Missing API key. Open the extension settings to add one.');
      setStatus('error');
      return;
    }

    await streamExplanation({
      apiKey: settings.apiKey,
      model: settings.model,
      mode: req.mode,
      code: req.code,
      language: req.language,
      sourceUrl: req.sourceUrl,
      onChunk: (text) => setExplanation((prev) => prev + text),
      onDone: () => setStatus('done'),
      onError: (message) => {
        setError(message);
        setStatus('error');
      },
    });
  }, []);

  useEffect(() => {
    const checkPending = async () => {
      const result = await chrome.storage.session.get(PENDING_REQUEST_KEY);
      const pending = result[PENDING_REQUEST_KEY] as DecodeRequest | undefined;
      if (!pending) return;
      if (lastProcessedId.current === pending.requestId) return;

      lastProcessedId.current = pending.requestId;
      await runDecode(pending);
    };

    void checkPending();

    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string
    ) => {
      if (areaName !== 'session') return;
      if (!changes[PENDING_REQUEST_KEY]?.newValue) return;
      void checkPending();
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [runDecode]);

  const toggleMode = async () => {
    if (!request) return;
    const nextMode: ExplainMode = request.mode === 'eli5' ? 'normal' : 'eli5';
    await runDecode({ ...request, mode: nextMode, requestId: crypto.randomUUID() });
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
          disabled={status === 'streaming'}
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
        Powered by Claude · {request.sourceUrl ? safeHost(request.sourceUrl) : 'unknown'}
      </footer>
    </div>
  );
}

function safeHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}
