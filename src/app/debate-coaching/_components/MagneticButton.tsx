"use client";

import { useCallback, useRef } from "react";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const MagneticButton = ({ children, className }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const moveX = clamp((relX - 0.5) * 10, -6, 6);
    const moveY = clamp((relY - 0.5) * 10, -6, 6);
    node.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "translate(0, 0)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={"transition-transform duration-150 will-change-transform " + (className ?? "")}
    >
      {children}
    </div>
  );
};

export default MagneticButton;


