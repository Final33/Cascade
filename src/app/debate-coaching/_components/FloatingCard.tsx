"use client";

import { useEffect, useRef, useState } from "react";

type FloatingCardProps = {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
};

const FloatingCard = ({ children, className = "", intensity = 1 }: FloatingCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * intensity * 0.1;
      const deltaY = (e.clientY - centerY) * intensity * 0.1;
      
      setMousePosition({ x: deltaX, y: deltaY });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

export default FloatingCard;
