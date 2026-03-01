/**
 * AI Settings for test interface layout
 * Fixes the issue with excessive whitespace and high positioning of the footer
 */

export const aiSettings = {
  testInterface: {
    // Ensure the content area fills available space
    contentArea: {
      minHeight: "calc(100vh - 250px)",
      display: "flex",
      flexDirection: "column",
    },
    
    // Fix the footer positioning at the bottom
    footer: {
      marginTop: "auto",
      position: "sticky",
      bottom: "0",
      backgroundColor: "white",
      borderTop: "1px solid #e5e7eb",
      padding: "0.75rem 1rem",
    },
    
    // Ensure question content expands to fill available space
    questionContent: {
      flex: "1 1 auto",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }
  }
}

/**
 * Apply styles to specific elements
 * @param elementId - ID of the element to apply styles to
 * @param styles - Styles to apply
 */
export function applyTestInterfaceStyles(elementId: string, styles: Record<string, string>) {
  if (typeof document !== 'undefined') {
    const element = document.getElementById(elementId);
    if (element) {
      Object.entries(styles).forEach(([key, value]) => {
        element.style[key as any] = value;
      });
    }
  }
} 