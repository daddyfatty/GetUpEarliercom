import React from 'react';
import { cn } from '@/lib/utils';

interface HeroGradientProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroGradient({ children, className }: HeroGradientProps) {
  return (
    <div className={cn("bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900", className)}>
      {children}
    </div>
  );
}