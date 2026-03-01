"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 border-0",
        secondary: "bg-white/10 backdrop-blur-sm text-gray-900 border border-gray-200/50 hover:bg-white/20 hover:border-gray-300/50 focus:ring-gray-500",
        ghost: "text-gray-700 hover:text-gray-900 hover:bg-gray-50/50 focus:ring-gray-500",
        glow: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/25 focus:ring-emerald-500"
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-lg",
        md: "px-6 py-3 text-base rounded-xl",
        lg: "px-8 py-4 text-lg rounded-2xl",
        xl: "px-10 py-5 text-xl rounded-2xl"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

interface EnhancedButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  href?: string;
  asChild?: boolean;
  shimmer?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, children, href, shimmer = false, ...props }, ref) => {
    const Component = href ? 'a' : 'button';
    
    const buttonContent = (
      <motion.div
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ 
          scale: 1.02, 
          y: -2,
          boxShadow: variant === 'primary' 
            ? "0 20px 40px rgba(59, 130, 246, 0.3)" 
            : "0 10px 30px rgba(0, 0, 0, 0.1)"
        }}
        whileTap={{ scale: 0.98, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {shimmer && variant === 'primary' && (
          <motion.div
            className="absolute inset-0 -top-[2px] -bottom-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.div>
    );

    if (href) {
      return (
        <a href={href} className="inline-block">
          {buttonContent}
        </a>
      );
    }

    return (
      <Component ref={ref} {...props}>
        {buttonContent}
      </Component>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, buttonVariants };
