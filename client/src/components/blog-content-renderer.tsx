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
    const amazonLinkRegex = /<span class="amazon-link" data-url="([^"]+)">([^<]+)<\/span>/g;
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
          <div key={`gallery-${match.index}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {images.map((image, index) => (
              <div 
                key={`gallery-img-${index}`}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative bg-gray-100 dark:bg-gray-700"
                onClick={() => onImageClick && onImageClick(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Reset regex for Amazon links on remaining content
    const remainingContent = content.substring(lastIndex);
    
    // Process Amazon links in remaining content
    const amazonParts = [];
    let amazonLastIndex = 0;
    let amazonMatch;
    
    while ((amazonMatch = amazonLinkRegex.exec(remainingContent)) !== null) {
      // Add content before the Amazon link
      if (amazonMatch.index > amazonLastIndex) {
        const beforeAmazonContent = remainingContent.substring(amazonLastIndex, amazonMatch.index);
        if (beforeAmazonContent.trim()) {
          amazonParts.push(
            <div 
              key={`amazon-content-${amazonLastIndex}`}
              dangerouslySetInnerHTML={{ __html: beforeAmazonContent }}
              className="text-gray-600 dark:text-gray-400"
            />
          );
        }
      }

      // Add Real Amazon preview component
      const url = amazonMatch[1];
      const title = amazonMatch[2];
      
      amazonParts.push(
        <RealAmazonPreview
          key={`amazon-${amazonMatch.index}`}
          url={url}
          title={title}
        />
      );

      amazonLastIndex = amazonMatch.index + amazonMatch[0].length;
    }

    // Add remaining content after last Amazon link
    if (amazonLastIndex < remainingContent.length) {
      const finalContent = remainingContent.substring(amazonLastIndex);
      if (finalContent.trim()) {
        amazonParts.push(
          <div 
            key={`final-content-${amazonLastIndex}`}
            dangerouslySetInnerHTML={{ __html: finalContent }}
            className="text-gray-600 dark:text-gray-400"
          />
        );
      }
    }

    // If no Amazon links found in remaining content, render it as is
    if (amazonParts.length === 0 && remainingContent.trim()) {
      parts.push(
        <div 
          key={`remaining-content-${lastIndex}`}
          dangerouslySetInnerHTML={{ __html: remainingContent }}
          className="text-gray-600 dark:text-gray-400"
        />
      );
    } else {
      parts.push(...amazonParts);
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