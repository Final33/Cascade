"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(error?.message || error)}</pre>
          <button onClick={() => reset?.()} style={{ marginTop: 12 }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
