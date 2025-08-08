import { RealAmazonPreview } from "@/components/real-amazon-preview";
import { Fragment } from "react";

interface BlogContentRendererProps {
  content: string;
  onImageClick?: (imageSrc: string) => void;
  videoUrl?: string;
}

export function BlogContentRenderer({ content, onImageClick, videoUrl }: BlogContentRendererProps) {
  if (!content) return null;

  // Preprocess content to handle literal escape sequences
  const preprocessContent = (text: string) => {
    return text
      .replace(/\\n\\n/g, '\n\n')  // Convert literal \n\n to actual double newlines
      .replace(/\\n/g, '\n');      // Convert literal \n to actual newlines
  };

  const processedContent = preprocessContent(content);

  const renderContent = () => {
    const parts = [];
    const amazonLinkRegex = /<span(?:\s+class="amazon-link")?\s*data-url="([^"]+)">([^<]+)<\/span>/g;
    const galleryRegex = /<div class="gallery-grid">([\s\S]*?)<\/div>/g;
    const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:[^\s\n]*)?)/g;
    
    // Function to convert URLs to clickable links (only for plain text content, YouTube URLs are handled separately)
    const convertUrlsToLinks = (text: string) => {
      // Only process if the text doesn't contain any HTML tags at all
      if (text.includes('<') || text.includes('>')) {
        return text; // Return unchanged if it contains HTML
      }
      
      // Convert URLs to links (but skip YouTube URLs since they're handled separately as embedded videos)
      const urlRegex = /(https?:\/\/[^\s\n]+)/g;
      return text.replace(urlRegex, (match) => {
        // Skip YouTube URLs - they're processed as embedded videos
        if (match.includes('youtube.com') || match.includes('youtu.be')) {
          return match; // Don't convert to link, will be embedded as video
        }
        return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${match}</a>`;
      });
    };

    // Check if processedContent contains Amazon product markers
    const amazonProductRegex = /\[AMAZON_PRODUCT:(https?:\/\/[^:]+):([^\]]+)\]/g;

    // Function to process timecodes and make them clickable
    const processTimecodes = (text: string) => {
      if (!videoUrl) return text;
      
      // Extract YouTube video ID from URL
      const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      
      if (!videoId) return text;
      
      // Match timecodes in formats like 0:00:06 or 00:42
      const timecodeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/g;
      
      return text.replace(timecodeRegex, (match) => {
        // Convert timecode to seconds
        const parts = match.split(':').reverse();
        let seconds = parseInt(parts[0]);
        if (parts[1]) seconds += parseInt(parts[1]) * 60;
        if (parts[2]) seconds += parseInt(parts[2]) * 3600;
        
        // Create YouTube link with timestamp
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`;
        
        return `<a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">${match}</a>`;
      });
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
    
    // Find all Amazon links and markers
    const amazonMatches = [];
    let match;
    
    // First find regular Amazon links
    amazonLinkRegex.lastIndex = 0;
    while ((match = amazonLinkRegex.exec(processedContent)) !== null) {
      amazonMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        url: match[1],
        title: match[2],
        type: 'amazon'
      });
    }
    
    // Then find Amazon product markers
    amazonProductRegex.lastIndex = 0;
    while ((match = amazonProductRegex.exec(processedContent)) !== null) {
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
    while ((match = galleryRegex.exec(processedContent)) !== null) {
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
    
    // Find all YouTube videos
    const youtubeMatches = [];
    youtubeRegex.lastIndex = 0;
    while ((match = youtubeRegex.exec(processedContent)) !== null) {
      const fullUrl = match[1];
      const videoId = match[2];
      
      // Extract timestamp if present
      const timestampMatch = fullUrl.match(/[?&]t=(\d+)(?:s)?/) || fullUrl.match(/[?&]start=(\d+)/);
      const startTime = timestampMatch ? `?start=${timestampMatch[1]}` : '';
      
      youtubeMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        videoId,
        startTime,
        type: 'youtube'
      });
    }
    
    // Combine and sort all matches
    const allMatches = [...amazonMatches, ...galleryMatches, ...youtubeMatches].sort((a, b) => a.start - b.start);
    
    let lastIndex = 0;
    
    // Process each match
    allMatches.forEach((match, index) => {
      // Add content before this match
      if (match.start > lastIndex) {
        const beforeContent = processedContent.substring(lastIndex, match.start);
        if (beforeContent.trim()) {
          // Process markdown formatting: bold first, then images, then URLs, then line breaks
          const processedBeforeContent = processMarkdownImages(processMarkdownBold(convertUrlsToLinks(beforeContent))).replace(/\n/g, '<br>');
          parts.push(
            <div 
              key={`content-${lastIndex}`}
              className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: processedBeforeContent }}
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
      } else if (match.type === 'youtube') {
        parts.push(
          <div key={`youtube-${match.start}`} className="youtube-embed my-6">
            <iframe 
              width="100%" 
              height="315" 
              src={`https://www.youtube.com/embed/${match.videoId}${match.startTime}`}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              style={{ maxWidth: '560px', margin: '0 auto', display: 'block' }}
            />
          </div>
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
              // Multiple images - Dynamic column layout based on image count
              <div className={`grid gap-4 w-full ${
                imageCount === 2 ? 'grid-cols-2' : 
                imageCount === 3 ? 'grid-cols-3' : 
                'grid-cols-2 md:grid-cols-4'
              }`}>
                {match.images?.map((image, imgIndex) => (
                  <div 
                    key={`gallery-img-${imgIndex}`}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 group relative aspect-auto overflow-hidden rounded-lg shadow-lg"
                    onClick={() => onImageClick && onImageClick(image.src)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto object-contain group-hover:opacity-90 transition-opacity"
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
    if (lastIndex < processedContent.length) {
      const remainingContent = processedContent.substring(lastIndex);
      if (remainingContent.trim()) {
        // Process markdown formatting: bold first, then images, then URLs, then timecodes, then line breaks
        const processedRemainingContent = processTimecodes(processMarkdownImages(processMarkdownBold(convertUrlsToLinks(remainingContent)))).replace(/\n/g, '<br>');
        parts.push(
          <span 
            key={`remaining-${lastIndex}`}
            className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: processedRemainingContent }}
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
      // Check for Amazon product markers
      const amazonMatches = [];
      let match;
      amazonProductRegex.lastIndex = 0;
      while ((match = amazonProductRegex.exec(processedContent)) !== null) {
        amazonMatches.push({
          fullMatch: match[0],
          url: match[1],
          title: match[2],
          index: match.index
        });
      }
      
      if (amazonMatches.length > 0) {
        const contentParts = [];
        let lastIndex = 0;
        
        amazonMatches.forEach((amazonMatch, idx) => {
          // Add content before this Amazon product
          if (amazonMatch.index > lastIndex) {
            const beforeContent = processedContent.substring(lastIndex, amazonMatch.index);
            const processedBeforeContent = processTimecodes(processMarkdownImages(processMarkdownBold(convertUrlsToLinks(beforeContent)))).replace(/\n/g, '<br>');
            contentParts.push(
              <div 
                key={`before-${idx}`}
                className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: processedBeforeContent }}
                onClick={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.tagName === 'IMG' && target.classList.contains('markdown-image')) {
                    onImageClick && onImageClick(target.src);
                  }
                }}
              />
            );
          }
          
          // Add the Amazon product
          contentParts.push(
            <RealAmazonPreview key={`amazon-${idx}`} url={amazonMatch.url} title={amazonMatch.title} />
          );
          
          lastIndex = amazonMatch.index + amazonMatch.fullMatch.length;
        });
        
        // Add remaining content
        if (lastIndex < processedContent.length) {
          const afterContent = processedContent.substring(lastIndex);
          const processedAfterContent = processTimecodes(processMarkdownImages(processMarkdownBold(convertUrlsToLinks(afterContent)))).replace(/\n/g, '<br>');
          contentParts.push(
            <div 
              key="after"
              className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: processedAfterContent }}
              onClick={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.tagName === 'IMG' && target.classList.contains('markdown-image')) {
                  onImageClick && onImageClick(target.src);
                }
              }}
            />
          );
        }
        
        return <>{contentParts}</>;
      }
      
      // Process markdown formatting: bold first, then images, then URLs, then timecodes, then line breaks
      const processedFinalContent = processTimecodes(processMarkdownImages(processMarkdownBold(convertUrlsToLinks(processedContent)))).replace(/\n/g, '<br>');
      return (
        <div 
          className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: processedFinalContent }}
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