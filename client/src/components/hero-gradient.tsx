import React from 'react';
import { cn } from '@/lib/utils';

interface HeroGradientProps {
  children: React.ReactNode;
  className?: string;
  backgroundImage?: string;
}

export function HeroGradient({ children, className, backgroundImage }: HeroGradientProps) {
  return (
    <div 
      className={cn("relative", backgroundImage ? "" : "hero-gradient", className)}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      {backgroundImage && (
        <div className="absolute inset-0 hero-gradient opacity-25" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}