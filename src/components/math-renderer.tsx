"use client";

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  math: string;
  displayMode?: boolean;
  className?: string;
  errorColor?: string;
  throwOnError?: boolean;
  maxSize?: number;
  maxExpand?: number;
  minRuleThickness?: number;
  colorIsTextColor?: boolean;
  strict?: boolean;
  trust?: boolean | ((context: katex.TrustContext) => boolean);
}

export function MathRenderer({ 
  math, 
  displayMode = false,
  className = '',
  errorColor = '#cc0000',
  throwOnError = false,
  maxSize = Infinity,
  maxExpand = 1000,
  minRuleThickness = 0.04,
  colorIsTextColor = false,
  strict = false,
  trust = false,
}: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode,
          errorColor,
          throwOnError,
          maxSize,
          maxExpand,
          minRuleThickness,
          colorIsTextColor,
          strict,
          trust,
          output: 'html',
          leqno: false,
          fleqn: false,
          globalGroup: false,
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        if (throwOnError) {
          throw error;
        }
        // Fallback to raw text with error styling
        if (containerRef.current) {
          containerRef.current.innerHTML = `<span style="color: ${errorColor};">${math}</span>`;
        }
      }
    }
  }, [math, displayMode, errorColor, throwOnError, maxSize, maxExpand, minRuleThickness, colorIsTextColor, strict, trust]);

  return (
    <span 
      ref={containerRef} 
      className={`math-renderer ${displayMode ? 'block my-4' : 'inline'} ${className}`}
    />
  );
} 