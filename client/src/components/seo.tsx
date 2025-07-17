import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  noindex?: boolean;
}

export function SEO({
  title = "Get Up Earlier - Strength, Nutrition & Accountability Coaching",
  description = "Personal training, nutrition coaching, and accountability services to help you build strength, healthy habits, and achieve your fitness goals. Expert guidance for lasting transformation.",
  keywords = "personal training, nutrition coaching, accountability coaching, fitness, strength training, healthy habits, marathon training, yoga, wellness",
  image = "/og-image.jpg",
  url,
  type = "website",
  canonical,
  noindex = false,
}: SEOProps) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.getupearlier.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image?.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Get Up Earlier" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Michael Baker" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="theme-color" content="#1e40af" />
    </Helmet>
  );
}