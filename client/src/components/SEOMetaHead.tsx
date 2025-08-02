import { Helmet } from 'react-helmet-async';

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

interface SEOMetaHeadProps {
  config: SEOConfig;
}

export const SEOMetaHead = ({ config }: SEOMetaHeadProps) => {
  const {
    title,
    description,
    canonical,
    ogImage = '/attached_assets/single-ingredient-supplements.png',
    ogType = 'website',
    keywords = [],
    structuredData,
    noIndex = false,
    author,
    publishedTime,
    modifiedTime
  } = config;

  const fullTitle = title.includes('Get Up Earlier') ? title : `${title} | Get Up Earlier Strength & Nutrition`;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : `${baseUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Get Up Earlier Strength & Nutrition" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Article-specific meta tags */}
      {author && <meta name="author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};