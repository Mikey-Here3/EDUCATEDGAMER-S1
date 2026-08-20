'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("flex flex-col items-center justify-center text-center py-12 relative", className)}
    >
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-4">
        {title}
      </h1>
      
      {subtitle && (
        <p className="text-gray-400 max-w-2xl text-lg">
          {subtitle}
        </p>
      )}
      
      <div className="mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent neon-glow rounded-full" />
    </motion.div>
  );
}

export default PageHeader;
