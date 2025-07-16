import { RealAmazonPreview } from "@/components/real-amazon-preview";
import { Fragment } from "react";

interface BlogContentRendererProps {
  content: string;
  onImageClick?: (imageSrc: string) => void;
}

export function BlogContentRenderer({ content, onImageClick }: BlogContentRendererProps) {
  if (!content) return null;

  const renderContent = () => {
    const parts = [];
    const amazonLinkRegex = /<span(?:\s+class="amazon-link")?\s*data-url="([^"]+)">([^<]+)<\/span>/g;
    const galleryRegex = /<div class="gallery-grid">([\s\S]*?)<\/div>/g;
    
    // Function to convert URLs to clickable links (only for plain text content)
    const convertUrlsToLinks = (text: string) => {
      // Only process if the text doesn't contain any HTML tags at all
      if (text.includes('<') || text.includes('>')) {
        return text; // Return unchanged if it contains HTML
      }
      // Very conservative URL replacement - only match standalone URLs
      const urlRegex = /^(https?:\/\/[^\s]+)$/gm;
      return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
    };
    
    // Find all Amazon links
    const amazonMatches = [];
    let match;
    amazonLinkRegex.lastIndex = 0;
    while ((match = amazonLinkRegex.exec(content)) !== null) {
      amazonMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        url: match[1],
        title: match[2],
        type: 'amazon'
      });
    }
    
    // Find all galleries
    const galleryMatches = [];
    galleryRegex.lastIndex = 0;
    while ((match = galleryRegex.exec(content)) !== null) {
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
        galleryMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          images,
          type: 'gallery'
        });
      }
    }
    
    // Combine and sort all matches
    const allMatches = [...amazonMatches, ...galleryMatches].sort((a, b) => a.start - b.start);
    
    let lastIndex = 0;
    
    // Process each match
    allMatches.forEach((match, index) => {
      // Add content before this match
      if (match.start > lastIndex) {
        const beforeContent = content.substring(lastIndex, match.start);
        if (beforeContent.trim()) {
          parts.push(
            <div 
              key={`content-${lastIndex}`}
              className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(beforeContent.replace(/\n/g, '<br>')) }}
            />
          );
        }
      }
      
      // Add the match component
      if (match.type === 'amazon') {
        parts.push(
          <RealAmazonPreview
            key={`amazon-${match.start}`}
            url={match.url}
            title={match.title}
          />
        );
      } else if (match.type === 'gallery') {
        parts.push(
          <div key={`gallery-${match.start}`} className="columns-1 md:columns-2 lg:columns-3 gap-4 my-8">
            {match.images.map((image, imgIndex) => (
              <div 
                key={`gallery-img-${imgIndex}`}
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
      
      lastIndex = match.end;
    });
    
    // Add remaining content
    if (lastIndex < content.length) {
      const remainingContent = content.substring(lastIndex);
      if (remainingContent.trim()) {
        parts.push(
          <div 
            key={`remaining-${lastIndex}`}
            className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(remainingContent.replace(/\n/g, '<br>')) }}
          />
        );
      }
    }
    
    // If no special content found, render the original content
    if (parts.length === 0) {
      return (
        <div 
          className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(content.replace(/\n/g, '<br>')) }}
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