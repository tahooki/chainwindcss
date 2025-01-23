'use client';

import { generateTailwindCode } from '@/lib/google-ai';
import { useState } from 'react';
import { Editor } from 'tldraw';
import { CodePreview } from './code-preview';

interface GenerateBoxProps {
  editor: Editor;
}

export function GenerateBox({ editor }: GenerateBoxProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const selectedShapes = editor.getSelectedShapes();
      if (selectedShapes.length === 0) {
        setError('Please select shapes to generate code');
        return;
      }

      const response = await generateTailwindCode(selectedShapes);
      setGeneratedCode(response);
    } catch (error) {
      console.error('Failed to generate code:', error);
      setError('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 w-96 bg-background border rounded-lg shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Generate Tailwind CSS</h3>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-2 text-sm text-destructive bg-destructive/10 rounded">
            {error}
          </div>
        )}

        {generatedCode && <CodePreview code={generatedCode} />}
      </div>
    </div>
  );
} 