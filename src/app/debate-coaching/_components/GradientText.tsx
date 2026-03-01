"use client";

import { useEffect, useRef } from "react";

type GradientTextProps = {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
};

const GradientText = ({ 
  children, 
  className = "", 
  gradient = "from-indigo-600 via-purple-600 to-indigo-800" 
}: GradientTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      element.style.setProperty('--mouse-x', `${x}%`);
      element.style.setProperty('--mouse-y', `${y}%`);
    };

    element.addEventListener('mousemove', handleMouseMove);
    return () => element.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <span
      ref={ref}
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent bg-size-200 animate-gradient-x hover:animate-pulse transition-all duration-300 ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops), transparent 70%)`,
        backgroundPosition: 'var(--mouse-x, 50%) var(--mouse-y, 50%)',
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </span>
  );
};

export default GradientText;
