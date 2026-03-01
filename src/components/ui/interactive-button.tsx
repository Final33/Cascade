"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useCursor } from './interactive-cursor';

const buttonVariants = cva(
  "relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-teal-500 via-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl focus:ring-indigo-500 border-0",
        secondary: "bg-transparent text-gray-900 border-2 border-gray-200 hover:border-indigo-300 focus:ring-indigo-500 backdrop-blur-sm",
        ghost: "text-gray-700 hover:text-gray-900 hover:bg-gray-50/50 focus:ring-gray-500",
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-xl",
        md: "px-6 py-3 text-base rounded-2xl",
        lg: "px-8 py-4 text-lg rounded-2xl",
        xl: "px-10 py-5 text-xl rounded-3xl"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

interface InteractiveButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  href?: string;
  shimmer?: boolean;
  magnetic?: boolean;
}

const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ className, variant, size, children, href, shimmer = false, magnetic = true, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { setCursorVariant } = useCursor();

    const handleMouseEnter = (e: React.MouseEvent) => {
      setCursorVariant('hover');
      
      if (magnetic && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Subtle magnetic effect
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;
        
        buttonRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
      }
    };

    const handleMouseLeave = () => {
      setCursorVariant('default');
      
      if (magnetic && buttonRef.current) {
        buttonRef.current.style.transform = 'translate(0px, 0px) scale(1)';
      }
    };

    const handleMouseDown = () => {
      setCursorVariant('click');
    };

    const handleMouseUp = () => {
      setCursorVariant('hover');
    };

    const buttonContent = (
      <motion.button
        ref={buttonRef}
        className={cn(buttonVariants({ variant, size, className }))}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          duration: 0.12
        }}
        style={{
          willChange: 'transform',
          transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        {/* Ripple Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full scale-0 opacity-0"
            whileTap={{
              scale: 4,
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Shimmer Effect */}
        {shimmer && variant === 'primary' && (
          <motion.div
            className="absolute inset-0 -top-[2px] -bottom-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
              repeatDelay: 3
            }}
          />
        )}

        {/* Animated Border for Secondary */}
        {variant === 'secondary' && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              padding: '2px',
              background: 'linear-gradient(90deg, #14b8a6, #6366f1, #a855f7)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-white rounded-inherit" />
          </motion.div>
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* Breathing Animation */}
        <motion.div
          className="absolute inset-0 rounded-inherit bg-white/5"
          animate={{
            scale: [1, 1.03, 1],
            opacity: [0, 0.1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>
    );

    if (href) {
      return (
        <a href={href} className="inline-block">
          {buttonContent}
        </a>
      );
    }

    return buttonContent;
  }
);

InteractiveButton.displayName = "InteractiveButton";

export { InteractiveButton, buttonVariants };
