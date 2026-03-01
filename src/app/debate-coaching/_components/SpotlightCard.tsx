"use client";

import { useCallback, useRef } from "react";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
};

const SpotlightCard = ({ children, className }: SpotlightCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    node.style.setProperty("--spotlight-x", `${x}px`);
    node.style.setProperty("--spotlight-y", `${y}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--spotlight-x", `-9999px`);
    node.style.setProperty("--spotlight-y", `-9999px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={
        "relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md " +
        (className ?? "")
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(150px circle at var(--spotlight-x) var(--spotlight-y), rgba(99,102,241,0.12), transparent 60%)",
          transition: "background 150ms ease",
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;


