"use client";

import { useEffect, useRef, useState } from "react";

type ParallaxSectionProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
};

const ParallaxSection = ({ 
  children, 
  className = "", 
  speed = 0.5,
  direction = "up" 
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        setOffset(direction === "up" ? rate : -rate);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxSection;
