import React from 'react';
import Latex from 'react-latex-next';

// Updated function to return a React Node using react-latex-next
export function processLatex(content: string | null | undefined): React.ReactNode {
  // Handle null or undefined content gracefully
  if (!content) {
    return <span className="text-muted-foreground italic">No content provided.</span>;
  }

  try {
    // Define delimiters for react-latex-next
    // Default delimiters are $$...$$ and $...$
    // If your API uses \(...\) and \[...\], adjust accordingly:
    const delimiters = [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false }
    ];

    // Render the content using the Latex component
    // Add a key to help React with updates if content changes frequently, though often not needed here.
    return <Latex delimiters={delimiters}>{content}</Latex>;

  } catch (error) {
    console.error("Error processing LaTeX with react-latex-next:", error);
    // Fallback display if rendering fails
    return (
      <div className="text-red-600 bg-red-100 p-2 rounded border border-red-300">
        <p className="font-semibold">Error rendering mathematical content.</p>
        <p className="text-xs mt-1">Please check the formatting of the question text.</p>
        {/* Optionally show raw content for debugging, but might be messy */}
        {/* <pre className="text-xs mt-2 whitespace-pre-wrap break-all">{content}</pre> */}
      </div>
    );
  }
} 