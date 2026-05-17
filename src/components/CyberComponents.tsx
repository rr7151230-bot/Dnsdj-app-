import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../lib/utils';

export interface CyberCardProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  glow?: boolean;
}

export function CyberCard({ children, className, glow = false, ...props }: CyberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative rounded-xl glass-morphism p-6 overflow-hidden",
        glow && "cyber-border",
        className
      )}
      {...props}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-blue opacity-50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-blue opacity-50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-blue opacity-50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-blue opacity-50" />
      
      {children}
    </motion.div>
  );
}

export interface CyberButtonProps extends HTMLMotionProps<"button"> {
  children?: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  glow?: boolean;
}

export function CyberButton({ 
  children, 
  variant = 'primary', 
  glow = true, 
  className, 
  ...props 
}: CyberButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative px-6 py-2.5 font-cyber tracking-wider text-sm transition-all duration-300 rounded-md overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variant === 'primary' && "bg-cyber-blue text-black font-bold hover:bg-opacity-90",
        variant === 'outline' && "border border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10",
        variant === 'ghost' && "text-gray-400 hover:text-white",
        glow && variant === 'primary' && "cyber-glow",
        className
      )}
      {...props as any}
    >
      {children}
    </motion.button>
  );
}
