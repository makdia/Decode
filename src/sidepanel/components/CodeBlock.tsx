interface CodeBlockProps {
  code: string;
  language: string | null;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
      {language && (
        <div className="border-b border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto px-3 py-2 text-[12px] leading-relaxed text-slate-800">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
