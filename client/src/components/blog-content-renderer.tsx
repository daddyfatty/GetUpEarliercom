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
      // Match URLs that appear after text or on their own lines
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
    };

    // Function to process markdown images
    const processMarkdownImages = (text: string) => {
      const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      return text.replace(markdownImageRegex, (match, alt, src) => {
        return `<img src="${src}" alt="${alt}" class="markdown-image w-full h-auto object-cover rounded-lg my-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" />`;
      });
    };

    // Function to process markdown bold formatting
    const processMarkdownBold = (text: string) => {
      const markdownBoldRegex = /\*\*([^*]+)\*\*/g;
      return text.replace(markdownBoldRegex, '<strong class="font-bold text-gray-800 dark:text-gray-200">$1</strong>');
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
          // Process markdown formatting: bold first, then images, then URLs, then line breaks
          const processedContent = processMarkdownImages(processMarkdownBold(convertUrlsToLinks(beforeContent))).replace(/\n/g, '<br>');
          parts.push(
            <div 
              key={`content-${lastIndex}`}
              className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: processedContent }}
              onClick={(e) => {
                // Handle clicks on markdown images
                const target = e.target as HTMLImageElement;
                if (target.tagName === 'IMG' && target.classList.contains('markdown-image')) {
                  onImageClick && onImageClick(target.src);
                }
              }}
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
        // Determine layout based on image count
        const imageCount = match.images.length;
        
        parts.push(
          <div key={`gallery-${match.start}`} className="my-8 w-full">
            {imageCount === 1 ? (
              // Single image - full width
              <div 
                className="cursor-pointer hover:shadow-xl transition-shadow group relative w-full"
                onClick={() => onImageClick && onImageClick(match.images[0].src)}
              >
                <img
                  src={match.images[0].src}
                  alt={match.images[0].alt}
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-lg">
                  <div className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4m-4 0l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              // Multiple images - masonry layout full width
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 w-full">
                {match.images.map((image, imgIndex) => (
                  <div 
                    key={`gallery-img-${imgIndex}`}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 group relative break-inside-avoid mb-4"
                    onClick={() => onImageClick && onImageClick(image.src)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto object-cover rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-lg">
                      <div className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4m-4 0l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      
      lastIndex = match.end;
    });
    
    // Add remaining content
    if (lastIndex < content.length) {
      const remainingContent = content.substring(lastIndex);
      if (remainingContent.trim()) {
        // Process markdown formatting: bold first, then images, then URLs, then line breaks
        const processedContent = processMarkdownImages(processMarkdownBold(convertUrlsToLinks(remainingContent))).replace(/\n/g, '<br>');
        parts.push(
          <span 
            key={`remaining-${lastIndex}`}
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: processedContent }}
            onClick={(e) => {
              // Handle clicks on markdown images
              const target = e.target as HTMLImageElement;
              if (target.tagName === 'IMG' && target.classList.contains('markdown-image')) {
                onImageClick && onImageClick(target.src);
              }
            }}
          />
        );
      }
    }
    
    // If no special content found, render the original content
    if (parts.length === 0) {
      // Process markdown formatting: bold first, then images, then URLs, then line breaks
      const processedContent = processMarkdownImages(processMarkdownBold(convertUrlsToLinks(content))).replace(/\n/g, '<br>');
      return (
        <div 
          className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: processedContent }}
          onClick={(e) => {
            // Handle clicks on markdown images
            const target = e.target as HTMLImageElement;
            if (target.tagName === 'IMG' && target.classList.contains('markdown-image')) {
              onImageClick && onImageClick(target.src);
            }
          }}
        />
      );
    }

    return parts;
  };

  return (
    <div className="leading-relaxed space-y-4 w-full">
      {renderContent()}
    </div>
  );
}