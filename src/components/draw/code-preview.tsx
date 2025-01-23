'use client';

import { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('html', html);

interface CodePreviewProps {
  code: string;
}

export function CodePreview({ code }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('code')}
            className={`text-xs px-2 py-1 rounded ${
              activeTab === 'code'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`text-xs px-2 py-1 rounded ${
              activeTab === 'preview'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Preview
          </button>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
          }}
          className="text-xs text-primary hover:underline"
        >
          Copy
        </button>
      </div>

      <div className="rounded border overflow-hidden">
        {activeTab === 'code' ? (
          <SyntaxHighlighter
            language="html"
            style={vs}
            customStyle={{
              margin: 0,
              fontSize: '12px',
              backgroundColor: 'transparent',
            }}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <div
            className="p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: code }}
          />
        )}
      </div>
    </div>
  );
} 