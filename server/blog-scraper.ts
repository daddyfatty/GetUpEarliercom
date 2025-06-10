import { parse } from 'node-html-parser';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  readTime: number;
  isVideo: boolean;
  originalUrl: string;
}

export async function scrapeBlogPosts(): Promise<BlogPost[]> {
  try {
    // Fetch the main blog page
    const response = await fetch('https://www.getupearlier.com/blog');
    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.status}`);
    }
    
    const html = await response.text();
    const root = parse(html);
    
    const posts: BlogPost[] = [];
    
    // Webflow-specific selectors for dynamic content
    const postElements = root.querySelectorAll('.w-dyn-item, .collection-item, .blog-item, [data-w-id]');
    
    console.log(`Found ${postElements.length} potential blog post elements on Webflow site`);
    
    // Since this is a Webflow site with dynamic content, let's look for specific patterns
    // Look for links that contain blog post URLs
    const blogLinks = root.querySelectorAll('a[href*="/blog/"], a[href*="/posts/"], a[href*="/article/"]');
    
    console.log(`Found ${blogLinks.length} potential blog links`);
    
    for (let i = 0; i < Math.min(blogLinks.length, 25); i++) {
      const linkElement = blogLinks[i];
      
      try {
        const href = linkElement.getAttribute('href') || '';
        if (href === '/blog' || href === '/blog/' || !href.includes('/')) continue;
        
        const fullUrl = href.startsWith('http') ? href : `https://www.getupearlier.com${href}`;
        
        // Extract title from link text or nearby elements
        let title = linkElement.text?.trim() || '';
        if (!title) {
          // Look for title in parent or sibling elements
          const parent = linkElement.parentNode;
          const titleElement = parent?.querySelector('h1, h2, h3, h4, h5, h6, .title, [class*="title"]');
          title = titleElement?.text?.trim() || `Blog Post ${i + 1}`;
        }
        
        // Look for images associated with this link
        let imageUrl = '';
        const parent = linkElement.parentNode;
        const grandParent = parent?.parentNode;
        
        // Check the link itself for an image
        let imageElement = linkElement.querySelector('img');
        
        // Check parent containers for images
        if (!imageElement && parent) {
          imageElement = parent.querySelector('img');
        }
        if (!imageElement && grandParent) {
          imageElement = grandParent.querySelector('img');
        }
        
        if (imageElement) {
          imageUrl = imageElement.getAttribute('src') || 
                    imageElement.getAttribute('data-src') || 
                    imageElement.getAttribute('srcset')?.split(' ')[0] || '';
          
          // Handle Webflow CDN URLs
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = imageUrl.startsWith('/') ? 
              `https://cdn.prod.website-files.com${imageUrl}` : 
              `https://cdn.prod.website-files.com/${imageUrl}`;
          }
        }
        
        // Look for excerpt/description text
        let excerpt = '';
        if (parent) {
          const excerptElement = parent.querySelector('p, .excerpt, .description, [class*="excerpt"], [class*="summary"]');
          excerpt = excerptElement?.text?.trim() || '';
        }
        
        // Check for video indicators
        const hasVideo = title.toLowerCase().includes('video') || 
                         excerpt.toLowerCase().includes('video') ||
                         fullUrl.includes('video') ||
                         linkElement.querySelector('[class*="video"], .play-button') !== null;
        
        // Generate clean ID from URL
        const urlParts = href.split('/');
        const id = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || 
                  title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        
        // Estimate read time
        const wordCount = (title + excerpt).split(' ').filter(word => word.length > 0).length;
        const readTime = Math.max(2, Math.ceil(wordCount / 200));
        
        // Determine category
        let category = 'wellness';
        const contentText = (title + excerpt).toLowerCase();
        if (contentText.includes('train') || contentText.includes('workout') || contentText.includes('exercise')) {
          category = 'training';
        } else if (contentText.includes('nutrition') || contentText.includes('diet') || contentText.includes('meal')) {
          category = 'nutrition';
        } else if (hasVideo) {
          category = 'videos';
        }
        
        // Extract author (default to Michael Baker)
        let author = 'Michael Baker';
        if (contentText.includes('erica') || excerpt.toLowerCase().includes('yoga')) {
          author = 'Erica Baker';
        }
        
        const post: BlogPost = {
          id,
          title: title || `Blog Post ${i + 1}`,
          excerpt: excerpt || title || 'Read this insightful article about health and fitness.',
          content: excerpt || title || 'Click to read the full article on our website.',
          author,
          publishedDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(), // Spread dates
          category,
          tags: [category, hasVideo ? 'video' : 'article'],
          imageUrl: imageUrl || undefined,
          videoUrl: hasVideo ? fullUrl : undefined,
          readTime,
          isVideo: hasVideo,
          originalUrl: fullUrl
        };
        
        posts.push(post);
        
      } catch (error) {
        console.error(`Error processing blog link ${i}:`, error);
        continue;
      }
    }
    
    // If no blog links found, try to extract from any content areas
    if (posts.length === 0) {
      console.log('No blog links found, attempting to extract from content areas...');
      
      // Look for any structured content that might be blog posts
      const contentAreas = root.querySelectorAll('.w-richtext, .rich-text, main, article, section');
      
      for (let i = 0; i < Math.min(contentAreas.length, 10); i++) {
        const area = contentAreas[i];
        const headings = area.querySelectorAll('h1, h2, h3');
        
        headings.forEach((heading, idx) => {
          if (posts.length >= 25) return;
          
          const title = heading.text?.trim();
          if (title && title.length > 10) {
            const post: BlogPost = {
              id: `content-${i}-${idx}`,
              title,
              excerpt: `Discover insights about ${title.toLowerCase()}`,
              content: title,
              author: 'Michael Baker',
              publishedDate: new Date(Date.now() - (posts.length * 24 * 60 * 60 * 1000)).toISOString(),
              category: 'wellness',
              tags: ['wellness'],
              readTime: 3,
              isVideo: false,
              originalUrl: 'https://www.getupearlier.com/blog'
            };
            posts.push(post);
          }
        });
      }
    }
    
    console.log(`Successfully scraped ${posts.length} blog posts from Webflow site`);
    return posts.slice(0, 25); // Limit to 25 posts
    
  } catch (error) {
    console.error('Error scraping blog posts:', error);
    throw error;
  }
}

export async function fetchFullPostContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return '';
    }
    
    const html = await response.text();
    const root = parse(html);
    
    // Try to extract the main content
    const contentSelectors = [
      '.blog-content',
      '.post-content', 
      '.rich-text',
      '.w-richtext',
      'main',
      '[class*="content"]',
      'article'
    ];
    
    for (const selector of contentSelectors) {
      const contentElement = root.querySelector(selector);
      if (contentElement) {
        const content = contentElement.text?.trim();
        if (content && content.length > 50) {
          return content;
        }
      }
    }
    
    return '';
  } catch (error) {
    console.error('Error fetching full post content:', error);
    return '';
  }
}