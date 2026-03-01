"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  delayMs?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

const directionToTransform: Record<NonNullable<RevealProps["direction"]>, string> = {
  up: "translateY(12px)",
  down: "translateY(-12px)",
  left: "translateX(12px)",
  right: "translateX(-12px)",
  none: "translateY(0)",
};

const Reveal = ({ children, delayMs = 0, direction = "up", as = "div", className }: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delayMs);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  const Comp: any = as;

  return (
    <Comp
      ref={ref as any}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : directionToTransform[direction],
        transition: "opacity 700ms ease, transform 700ms ease",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Comp>
  );
};

export default Reveal;


