import React from 'react';
import { cn } from '@/lib/utils';
import { processLatex } from '@/lib/process-latex';

interface LatexContentProps {
  content: string | null | undefined;
  className?: string;
  inline?: boolean;
}

export function LatexContent({
  content,
  className,
  inline = true,
}: LatexContentProps) {
  const processedContent = processLatex(content);

  if (inline) {
    return (
      <span className={cn('latex-content inline', className)}>
        {processedContent}
      </span>
    );
  }

  return (
    <div className={cn('latex-content block', className)}>
      {processedContent}
    </div>
  );
} 