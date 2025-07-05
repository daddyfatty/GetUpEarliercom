import { AmazonPreview } from "@/components/amazon-preview";
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

      // Add Amazon preview component
      const url = match[1];
      const title = match[2];
      
      // Determine product image based on title/content
      let productImage = "/attached_assets/20250702_065601_1751710941826.jpg"; // default water bottle
      let productPrice = "$24.99";
      let productDescription = "Recommended by certified trainers for optimal performance and hydration during training.";
      
      // Map specific products based on exact titles
      if (title.includes("Get the soft water bottle here")) {
        productImage = "/attached_assets/20250702_065601_1751710941826.jpg";
        productPrice = "$24.99";
        productDescription = "Soft, flexible water bottle perfect for compression shorts without bouncing.";
      } else if (title.includes("Shop double electrolyte gels")) {
        productImage = "/attached_assets/20250702_065853_1751710941827.jpg";
        productPrice = "$32.99";
        productDescription = "Double electrolyte gels provide sustained energy without sugar crash during long runs.";
      } else if (title.includes("Order NUUN tablets online")) {
        // Use a different image for NUUN tablets to distinguish from gels
        productImage = "/attached_assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800.jpg";
        productPrice = "$19.99";
        productDescription = "NUUN electrolyte tablets available at CVS, Dick's, REI, and most grocery stores.";
      } else {
        // Generic fallback for any other Amazon links
        productImage = "/attached_assets/20250702_065601_1751710941826.jpg";
        productPrice = "$24.99";
        productDescription = "Recommended by certified trainers for optimal performance and hydration during training.";
      }
      
      parts.push(
        <AmazonPreview
          key={`amazon-${match.index}`}
          url={url}
          title={title}
          imageUrl={productImage}
          price={productPrice}
          description={productDescription}
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