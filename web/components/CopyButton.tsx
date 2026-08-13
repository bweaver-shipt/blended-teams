'use client';
import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-3 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}
