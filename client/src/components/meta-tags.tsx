import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function MetaTags({
  title,
  description,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags
}: MetaTagsProps) {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const currentUrl = url || window.location.href;
    const siteName = 'Get Up Earlier';
    
    // Default featured image if none provided
    const defaultImage = `${baseUrl}/hartford-marathon-2024-start_1752664876322.jpg`;
    const featuredImage = image || defaultImage;
    
    // Ensure image URL is absolute
    const absoluteImageUrl = featuredImage.startsWith('http') ? featuredImage : `${baseUrl}${featuredImage}`;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:') || property.startsWith('article:')) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Ensure tags is an array and handle all edge cases
    let safeTags: string[] = [];
    if (tags) {
      if (Array.isArray(tags)) {
        safeTags = tags.filter(tag => typeof tag === 'string' && tag.trim() !== '');
      } else if (typeof tags === 'string') {
        safeTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      }
    }

    // Basic meta tags
    updateMetaTag('description', description);
    if (author) updateMetaTag('author', author);
    if (safeTags.length > 0) updateMetaTag('keywords', safeTags.join(', '));
    
    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', siteName);
    updateMetaTag('og:image', absoluteImageUrl);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:image:alt', title);
    updateMetaTag('og:locale', 'en_US');
    
    // Article-specific Open Graph tags
    if (type === 'article') {
      if (author) updateMetaTag('article:author', author);
      if (publishedTime) updateMetaTag('article:published_time', publishedTime);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime);
      if (section) updateMetaTag('article:section', section);
      if (safeTags.length > 0) {
        safeTags.forEach(tag => updateMetaTag('article:tag', tag));
      }
    }
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', absoluteImageUrl);
    updateMetaTag('twitter:image:alt', title);
    updateMetaTag('twitter:site', '@GetUpEarlier');
    updateMetaTag('twitter:creator', '@MichaelBaker');
    
    // LinkedIn specific
    updateMetaTag('linkedin:title', title);
    updateMetaTag('linkedin:description', description);
    updateMetaTag('linkedin:image', absoluteImageUrl);
    
    // Facebook specific
    updateMetaTag('fb:app_id', ''); // Add your Facebook App ID if you have one
    
    // Update page title
    document.title = `${title} | ${siteName}`;
  }, [title, description, image, url, type, author, publishedTime, modifiedTime, section, tags]);

  return null; // This component doesn't render anything
}