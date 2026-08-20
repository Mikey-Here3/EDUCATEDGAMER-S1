'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlowCard({ children, className, onClick }: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        'relative group rounded-xl glass-card overflow-hidden transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="absolute inset-0 border border-white/5 rounded-xl group-hover:border-primary/50 group-hover:neon-glow transition-all duration-500 z-10 pointer-events-none" />
      <div className="relative z-20">
        {children}
      </div>
    </motion.div>
  );
}

export default GlowCard;
