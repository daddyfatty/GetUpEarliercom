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
        // Determine grid layout based on image count
        const imageCount = match.images.length;
        let gridClass = "";
        
        if (imageCount === 1) {
          gridClass = "grid grid-cols-1 gap-4 w-full";
        } else if (imageCount === 2) {
          gridClass = "grid grid-cols-2 gap-4 w-full";
        } else if (imageCount === 3) {
          gridClass = "grid grid-cols-3 gap-4 w-full";
        } else if (imageCount >= 4) {
          gridClass = "grid grid-cols-2 gap-4 w-full";
        }
        
        parts.push(
          <div key={`gallery-${match.start}`} className={`${gridClass} my-8`}>
            {match.images.map((image, imgIndex) => (
              <div 
                key={`gallery-img-${imgIndex}`}
                className="rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative w-full"
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
        // Process markdown formatting: bold first, then images, then URLs, then line breaks
        const processedContent = processMarkdownImages(processMarkdownBold(convertUrlsToLinks(remainingContent))).replace(/\n/g, '<br>');
        parts.push(
          <div 
            key={`remaining-${lastIndex}`}
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