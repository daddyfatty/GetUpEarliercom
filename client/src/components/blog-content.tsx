import React from 'react';
import { LinkPreview } from './link-preview';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  // Function to process HTML content and wrap Amazon links with LinkPreview
  const processContent = (htmlContent: string) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Find all anchor tags
    const links = tempDiv.querySelectorAll('a');
    
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (href.includes('amazon.com') || href.includes('amzn.to'))) {
        // Mark Amazon links for special processing
        link.setAttribute('data-amazon-link', 'true');
        link.setAttribute('data-original-href', href);
      }
    });
    
    return tempDiv.innerHTML;
  };

  // Convert processed HTML to React elements
  const createContentWithPreviews = () => {
    const processedContent = processContent(content);
    
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: processedContent }}
        ref={(el) => {
          if (el) {
            // Find and replace Amazon links after render
            const amazonLinks = el.querySelectorAll('a[data-amazon-link="true"]');
            amazonLinks.forEach((link) => {
              const href = link.getAttribute('data-original-href');
              const text = link.textContent;
              
              if (href && text) {
                // Create React element
                const linkPreviewElement = React.createElement(
                  LinkPreview,
                  { url: href, key: href },
                  text
                );
                
                // This approach won't work with dangerouslySetInnerHTML
                // We need a different strategy
              }
            });
          }
        }}
      />
    );
  };

  // Alternative approach: Parse and convert to React elements manually
  const parseHtmlToReact = (htmlString: string): React.ReactNode[] => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    const convertNode = (node: ChildNode, index: number): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        const props: any = { key: index };
        
        // Copy attributes
        Array.from(element.attributes).forEach(attr => {
          if (attr.name === 'class') {
            props.className = attr.value;
          } else if (attr.name === 'style') {
            props.style = parseStyleString(attr.value);
          } else {
            props[attr.name] = attr.value;
          }
        });
        
        // Handle links specially
        if (tagName === 'a') {
          const href = element.getAttribute('href');
          if (href && (href.includes('amazon.com') || href.includes('amzn.to'))) {
            return React.createElement(
              LinkPreview,
              { url: href, key: index },
              element.textContent
            );
          }
        }
        
        // Convert children
        const children = Array.from(element.childNodes).map((child, childIndex) => 
          convertNode(child, childIndex)
        );
        
        return React.createElement(tagName, props, ...children);
      }
      
      return null;
    };
    
    return Array.from(tempDiv.childNodes).map((node, index) => convertNode(node, index));
  };

  const parseStyleString = (styleStr: string): React.CSSProperties => {
    const style: React.CSSProperties = {};
    styleStr.split(';').forEach(rule => {
      const [property, value] = rule.split(':');
      if (property && value) {
        const camelProperty = property.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        style[camelProperty as keyof React.CSSProperties] = value.trim() as any;
      }
    });
    return style;
  };

  // For now, let's use a simpler approach with dangerouslySetInnerHTML
  // and handle Amazon links separately in the blog post component
  return (
    <div 
      className="prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}