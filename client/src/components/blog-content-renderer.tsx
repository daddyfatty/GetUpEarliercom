import { RealAmazonPreview } from "@/components/real-amazon-preview";
import { Fragment } from "react";

interface BlogContentRendererProps {
  content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  if (!content) return null;

  // Split content by Amazon link spans and render them as components
  const renderContent = () => {
    const amazonLinkRegex = /<span class="amazon-link" data-url="([^"]+)">([^<]+)<\/span>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = amazonLinkRegex.exec(content)) !== null) {
      // Add content before the Amazon link
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

      // Add Real Amazon preview component
      const url = match[1];
      const title = match[2];
      
      parts.push(
        <RealAmazonPreview
          key={`amazon-${match.index}`}
          url={url}
          title={title}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining content after last Amazon link
    if (lastIndex < content.length) {
      const remainingContent = content.substring(lastIndex);
      if (remainingContent.trim()) {
        parts.push(
          <div 
            key={`content-${lastIndex}`}
            dangerouslySetInnerHTML={{ __html: remainingContent }}
            className="text-gray-600 dark:text-gray-400"
          />
        );
      }
    }

    // If no Amazon links found, render the original content
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