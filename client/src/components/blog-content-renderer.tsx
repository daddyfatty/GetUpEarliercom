import { RealAmazonPreview } from "@/components/real-amazon-preview";
import { Fragment } from "react";

interface BlogContentRendererProps {
  content: string;
  onImageClick?: (imageSrc: string) => void;
}

export function BlogContentRenderer({ content, onImageClick }: BlogContentRendererProps) {
  if (!content) return null;

  // Process content and convert Amazon links to previews
  const processedContent = content.replace(
    /<span(?:\s+class="amazon-link")?\s*data-url="([^"]+)">([^<]+)<\/span>/g,
    (match, url, title) => {
      return `<div class="amazon-preview" data-url="${url}" data-title="${title}"></div>`;
    }
  );

  const renderContent = () => {
    const parts = [];
    const amazonPreviewRegex = /<div class="amazon-preview" data-url="([^"]+)" data-title="([^"]+)"><\/div>/g;
    const galleryRegex = /<div class="gallery-grid">([\s\S]*?)<\/div>/g;
    
    let lastIndex = 0;
    let currentContent = processedContent;
    
    // First handle galleries
    let galleryMatch;
    while ((galleryMatch = galleryRegex.exec(currentContent)) !== null) {
      // Add content before gallery
      if (galleryMatch.index > lastIndex) {
        const beforeContent = currentContent.substring(lastIndex, galleryMatch.index);
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
      
      // Process gallery
      const galleryContent = galleryMatch[1];
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
          <div key={`gallery-${galleryMatch.index}`} className="columns-1 md:columns-2 lg:columns-3 gap-4 my-8">
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
      
      lastIndex = galleryMatch.index + galleryMatch[0].length;
    }
    
    // Add remaining content and process Amazon previews
    const remainingContent = currentContent.substring(lastIndex);
    if (remainingContent.trim()) {
      // Check for Amazon previews in remaining content
      const amazonParts = [];
      let amazonLastIndex = 0;
      let amazonMatch;
      
      amazonPreviewRegex.lastIndex = 0;
      while ((amazonMatch = amazonPreviewRegex.exec(remainingContent)) !== null) {
        // Add content before Amazon preview
        if (amazonMatch.index > amazonLastIndex) {
          const beforeAmazon = remainingContent.substring(amazonLastIndex, amazonMatch.index);
          if (beforeAmazon.trim()) {
            amazonParts.push(
              <div 
                key={`before-amazon-${amazonLastIndex}`}
                dangerouslySetInnerHTML={{ __html: beforeAmazon }}
                className="text-gray-600 dark:text-gray-400"
              />
            );
          }
        }
        
        // Add Amazon preview
        amazonParts.push(
          <RealAmazonPreview
            key={`amazon-${amazonMatch.index}`}
            url={amazonMatch[1]}
            title={amazonMatch[2]}
          />
        );
        
        amazonLastIndex = amazonMatch.index + amazonMatch[0].length;
      }
      
      // Add remaining content after last Amazon preview
      if (amazonLastIndex < remainingContent.length) {
        const finalContent = remainingContent.substring(amazonLastIndex);
        if (finalContent.trim()) {
          amazonParts.push(
            <div 
              key={`final-${amazonLastIndex}`}
              dangerouslySetInnerHTML={{ __html: finalContent }}
              className="text-gray-600 dark:text-gray-400"
            />
          );
        }
      }
      
      // If no Amazon links found, render remaining content as is
      if (amazonParts.length === 0) {
        parts.push(
          <div 
            key={`remaining-${lastIndex}`}
            dangerouslySetInnerHTML={{ __html: remainingContent }}
            className="text-gray-600 dark:text-gray-400"
          />
        );
      } else {
        parts.push(...amazonParts);
      }
    }
    
    if (parts.length === 0) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: processedContent }}
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