import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SEOMetaHead } from './SEOMetaHead';

interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'business.business';
  keywords?: string[];
  structuredData?: any;
  noIndex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

interface SEOContextType {
  setSEOConfig: (config: SEOConfig) => void;
  seoConfig: SEOConfig | null;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider = ({ children }: { children: ReactNode }) => {
  const [seoConfig, setSEOConfig] = useState<SEOConfig | null>(null);

  return (
    <SEOContext.Provider value={{ setSEOConfig, seoConfig }}>
      {seoConfig && <SEOMetaHead config={seoConfig} />}
      {children}
    </SEOContext.Provider>
  );
};

export const useSEOContext = () => {
  const context = useContext(SEOContext);
  if (context === undefined) {
    throw new Error('useSEOContext must be used within a SEOProvider');
  }
  return context;
};