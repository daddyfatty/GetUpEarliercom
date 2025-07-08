import React from 'react';
import { cn } from '@/lib/utils';

interface HeroGradientProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroGradient({ children, className }: HeroGradientProps) {
  return (
    <div className={cn("hero-gradient", className)}>
      {children}
    </div>
  );
}