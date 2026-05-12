import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ExplanationProps {
  markdown: string;
  isStreaming: boolean;
}

export default function Explanation({ markdown, isStreaming }: ExplanationProps) {
  if (!markdown && isStreaming) {
    return <SkeletonLoader />;
  }

  if (!markdown) {
    return null;
  }

  return (
    <div className="prose-decode">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      {isStreaming && (
        <span
          className="inline-block h-3 w-2 animate-pulse bg-brand-600 align-middle"
          aria-label="streaming"
        />
      )}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading explanation">
      <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
    </div>
  );
}
