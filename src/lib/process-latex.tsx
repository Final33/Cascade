import React from 'react';
import { MathRenderer } from '../components/math-renderer';

interface ProcessLatexOptions {
  throwOnError?: boolean;
  errorColor?: string;
  strict?: boolean;
}

export function processLatex(
  content: string | null | undefined,
  options: ProcessLatexOptions = {}
): React.ReactNode {
  if (!content) {
    return <span className="text-muted-foreground italic">No content provided.</span>;
  }

  const {
    throwOnError = false,
    errorColor = '#cc0000',
    strict = false,
  } = options;

  // Enhanced regex to match all LaTeX patterns including nested braces
  const mathRegex = /(\\\[[\s\S]*?\\\])|(\\\([\s\S]*?\\\))|(\$\$[\s\S]*?\$\$)|(\$[^$\n]*?\$)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = mathRegex.exec(content)) !== null) {
    // Add text before the math
    if (match.index > lastIndex) {
      const textContent = content.substring(lastIndex, match.index);
      if (textContent.trim()) {
        parts.push(
          <span key={`text-${keyCounter++}`} dangerouslySetInnerHTML={{ __html: textContent }} />
        );
      }
    }

    // Extract the math content and determine the type
    let mathContent: string;
    let isDisplay = false;

    if (match[1]) {
      // \[...\] format (display math)
      mathContent = match[1].slice(2, -2);
      isDisplay = true;
    } else if (match[2]) {
      // \(...\) format (inline math)
      mathContent = match[2].slice(2, -2);
      isDisplay = false;
    } else if (match[3]) {
      // $$...$$ format (display math)
      mathContent = match[3].slice(2, -2);
      isDisplay = true;
    } else if (match[4]) {
      // $...$ format (inline math)
      mathContent = match[4].slice(1, -1);
      isDisplay = false;
    } else {
      continue;
    }

    // Clean up the math content
    mathContent = mathContent.trim();

    // Add the rendered math
    parts.push(
      <MathRenderer
        key={`math-${keyCounter++}`}
        math={mathContent}
        displayMode={isDisplay}
        throwOnError={throwOnError}
        errorColor={errorColor}
        strict={strict}
      />
    );

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text
  if (lastIndex < content.length) {
    const remainingContent = content.substring(lastIndex);
    if (remainingContent.trim()) {
      parts.push(
        <span key={`text-${keyCounter++}`} dangerouslySetInnerHTML={{ __html: remainingContent }} />
      );
    }
  }

  // If no math was found, return the content as HTML
  if (parts.length === 0) {
    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return <>{parts}</>;
} 