export default function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-3 text-4xl" aria-hidden="true">
        🔍
      </div>
      <h1 className="text-base font-semibold text-slate-900">Decode is ready</h1>
      <p className="mt-2 max-w-xs text-sm text-slate-600">
        Highlight any code on a webpage, then right-click and choose{' '}
        <strong>Decode this code</strong>.
      </p>
      <p className="mt-3 text-xs text-slate-500">
        Or press <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[11px] font-mono">⌘⇧E</kbd>{' '}
        (Mac) /{' '}
        <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[11px] font-mono">Ctrl⇧E</kbd>{' '}
        (Windows).
      </p>
    </div>
  );
}
