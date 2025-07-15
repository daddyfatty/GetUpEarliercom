import { RealAmazonPreview } from "@/components/real-amazon-preview";
import { Fragment } from "react";

interface BlogContentRendererProps {
  content: string;
  onImageClick?: (imageSrc: string) => void;
}

export function BlogContentRenderer({ content, onImageClick }: BlogContentRendererProps) {
  if (!content) return null;

  // Split content by different elements and render them as components
  const renderContent = () => {
    // Check if the URL contains Amazon links and extract them
    const processAmazonLinks = (htmlContent: string) => {
      // Handle both <a href="..."> and <span data-url="..."> formats
      const spanRegex = /<span data-url="([^"]+)">([^<]+)<\/span>/g;
      const anchorRegex = /<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
      
      let result = htmlContent;
      const amazonLinks = [];
      
      // Process span tags
      let match;
      while ((match = spanRegex.exec(htmlContent)) !== null) {
        const url = match[1];
        const title = match[2];
        if (url.includes('amazon.com') || url.includes('amzn.to')) {
          amazonLinks.push({ url, title, original: match[0] });
        }
      }
      
      // Process anchor tags
      while ((match = anchorRegex.exec(htmlContent)) !== null) {
        const url = match[1];
        const title = match[2];
        if (url.includes('amazon.com') || url.includes('amzn.to')) {
          amazonLinks.push({ url, title, original: match[0] });
        }
      }
      
      return amazonLinks;
    };
    const galleryRegex = /<div class="gallery-grid">([\s\S]*?)<\/div>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    // First handle gallery sections
    while ((match = galleryRegex.exec(content)) !== null) {
      // Add content before the gallery
      if (match.index > lastIndex) {
        const beforeContent = content.substring(lastIndex, match.index);
        if (beforeContent.trim()) {
          parts.push(
            <div 
              key={`content-${lastIndex}`}
              dangerouslySetInnerHTML={{ __html: beforeContent }}
              className="text-gray-600 dark:text-gray-400"
            />
          );
        }
      }

      // Process gallery images
      const galleryContent = match[1];
      const imageRegex = /<img src="([^"]+)" alt="([^"]*)" class="gallery-image" \/>/g;
      const images = [];
      let imageMatch;
      
      while ((imageMatch = imageRegex.exec(galleryContent)) !== null) {
        images.push({
          src: imageMatch[1],
          alt: imageMatch[2]
        });
      }

      if (images.length > 0) {
        parts.push(
          <div key={`gallery-${match.index}`} className="columns-1 md:columns-2 lg:columns-3 gap-4 my-8">
            {images.map((image, index) => (
              <div 
                key={`gallery-img-${index}`}
                className="break-inside-avoid mb-4 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative"
                onClick={() => onImageClick && onImageClick(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                />
              </div>
            ))}
          </div>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Process Amazon links in remaining content
    const remainingContent = content.substring(lastIndex);
    const amazonLinks = processAmazonLinks(remainingContent);
    
    if (amazonLinks.length > 0) {
      let contentWithoutAmazon = remainingContent;
      
      // Replace Amazon links with placeholders
      amazonLinks.forEach((link, index) => {
        contentWithoutAmazon = contentWithoutAmazon.replace(link.original, `__AMAZON_PLACEHOLDER_${index}__`);
      });
      
      // Split content by Amazon placeholders and render
      const segments = contentWithoutAmazon.split(/__AMAZON_PLACEHOLDER_\d+__/);
      
      segments.forEach((segment, index) => {
        if (segment.trim()) {
          parts.push(
            <div 
              key={`segment-${index}`}
              dangerouslySetInnerHTML={{ __html: segment }}
              className="text-gray-600 dark:text-gray-400"
            />
          );
        }
        
        // Add Amazon preview after each segment (except the last one)
        if (index < amazonLinks.length) {
          parts.push(
            <RealAmazonPreview
              key={`amazon-${index}`}
              url={amazonLinks[index].url}
              title={amazonLinks[index].title}
            />
          );
        }
      });
    } else {
      // No Amazon links found, render remaining content as is
      if (remainingContent.trim()) {
        parts.push(
          <div 
            key={`remaining-content-${lastIndex}`}
            dangerouslySetInnerHTML={{ __html: remainingContent }}
            className="text-gray-600 dark:text-gray-400"
          />
        );
      }
    }

    // If no special content found, render the original content
    if (parts.length === 0) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-gray-600 dark:text-gray-400"
        />
      );
    }

    return parts;
  };

  return (
    <div className="leading-relaxed space-y-4">
      {renderContent()}
    </div>
  );
}