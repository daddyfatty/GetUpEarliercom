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
      
      // Look for Webflow dynamic content and video embeds
      const videoElements = root.querySelectorAll('[class*="video"], .w-embed, iframe[src*="youtube"], iframe[src*="vimeo"]');
      const textElements = root.querySelectorAll('h1, h2, h3, h4, .heading, [class*="title"], [class*="heading"]');
      const imageElements = root.querySelectorAll('img[src*="cdn.prod.website-files"]');
      
      // Create a map of images to their nearby titles for better matching
      const imageToTitleMap = new Map();
      imageElements.forEach(img => {
        const imgSrc = img.getAttribute('src') || img.getAttribute('data-src') || '';
        
        // Filter out UI elements like buttons, arrows, icons
        if (imgSrc && !imgSrc.includes('button') && !imgSrc.includes('arrow') && 
            !imgSrc.includes('icon') && !imgSrc.includes('.svg') &&
            (imgSrc.includes('.jpg') || imgSrc.includes('.jpeg') || imgSrc.includes('.png') || imgSrc.includes('.webp'))) {
          
          const parent = img.parentNode;
          const grandParent = parent?.parentNode;
          const greatGrandParent = grandParent?.parentNode;
          
          // Look for nearby title elements
          const nearbyTitle = parent?.querySelector('h1, h2, h3, h4, h5, h6') ||
                             grandParent?.querySelector('h1, h2, h3, h4, h5, h6') ||
                             greatGrandParent?.querySelector('h1, h2, h3, h4, h5, h6');
          
          if (nearbyTitle && nearbyTitle.text?.trim()) {
            let fullImageUrl = imgSrc;
            if (!imgSrc.startsWith('http')) {
              fullImageUrl = imgSrc.startsWith('/') ? 
                `https://cdn.prod.website-files.com${imgSrc}` : 
                `https://cdn.prod.website-files.com/${imgSrc}`;
            }
            imageToTitleMap.set(nearbyTitle.text.trim(), fullImageUrl);
          }
        }
      });
      
      // Extract video content
      videoElements.forEach((element, idx) => {
        if (posts.length >= 25) return;
        
        const parent = element.parentNode;
        const grandParent = parent?.parentNode;
        
        // Look for title near the video
        let title = '';
        const titleElement = parent?.querySelector('h1, h2, h3, h4') || 
                           grandParent?.querySelector('h1, h2, h3, h4') ||
                           element.getAttribute('title');
        
        if (titleElement) {
          title = typeof titleElement === 'string' ? titleElement : titleElement.text?.trim() || '';
        }
        
        if (!title) {
          title = `Video Content ${idx + 1}`;
        }
        
        // Look for associated image - first check the map, then search nearby
        let imageUrl = imageToTitleMap.get(title) || '';
        
        if (!imageUrl) {
          const img = parent?.querySelector('img') || grandParent?.querySelector('img');
          if (img) {
            const imgSrc = img.getAttribute('src') || '';
            // Filter out UI elements and only use actual content images
            if (imgSrc && !imgSrc.includes('button') && !imgSrc.includes('arrow') && 
                !imgSrc.includes('icon') && !imgSrc.includes('.svg') &&
                (imgSrc.includes('.jpg') || imgSrc.includes('.jpeg') || imgSrc.includes('.png') || imgSrc.includes('.webp'))) {
              imageUrl = imgSrc;
              if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = imageUrl.startsWith('/') ? 
                  `https://cdn.prod.website-files.com${imageUrl}` : 
                  `https://cdn.prod.website-files.com/${imageUrl}`;
              }
            }
          }
        }
        
        // Use authentic photos from your collection as featured images
        if (!imageUrl) {
          const authenticImages = [
            "/attached_assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg",
            "/attached_assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg", 
            "/attached_assets/678aad8cfd0dcde677a14418_hike2-p-500.jpg",
            "/attached_assets/20250517_073713.00_00_08_03.Still003.jpg",
            "/attached_assets/493414479_10213588193416986_7983427679426833080_n.jpg",
            "/attached_assets/ss3_1749484345644.jpg"
          ];
          imageUrl = authenticImages[idx % authenticImages.length];
        }
        
        // Extract video URL
        let videoUrl = '';
        if (element.tagName === 'IFRAME') {
          videoUrl = element.getAttribute('src') || '';
        }
        
        const post: BlogPost = {
          id: `video-${idx}`,
          title,
          excerpt: `Watch this informative video about health and fitness training.`,
          content: `Video content featuring expert guidance from our certified trainers.`,
          author: title.toLowerCase().includes('yoga') || title.toLowerCase().includes('erica') ? 'Erica Baker' : 'Michael Baker',
          publishedDate: new Date(Date.now() - (idx * 24 * 60 * 60 * 1000)).toISOString(),
          category: 'videos',
          tags: ['video', 'training'],
          imageUrl: imageUrl || undefined,
          videoUrl: videoUrl || 'https://www.getupearlier.com/blog',
          readTime: 5,
          isVideo: true,
          originalUrl: 'https://www.getupearlier.com/blog'
        };
        posts.push(post);
      });
      
      // Extract text-based content
      const processedTitles = new Set();
      textElements.forEach((element, idx) => {
        if (posts.length >= 25) return;
        
        const title = element.text?.trim() || '';
        if (title && title.length > 10 && !processedTitles.has(title)) {
          processedTitles.add(title);
          
          const parent = element.parentNode;
          const grandParent = parent?.parentNode;
          
          // Look for excerpt text nearby
          let excerpt = '';
          const excerptElement = parent?.querySelector('p') || 
                               grandParent?.querySelector('p') ||
                               element.nextElementSibling;
          
          if (excerptElement && excerptElement.text) {
            excerpt = excerptElement.text.trim().substring(0, 200);
          }
          
          // Look for associated image - first check the map, then search nearby
          let imageUrl = imageToTitleMap.get(title) || '';
          
          if (!imageUrl) {
            const img = parent?.querySelector('img') || grandParent?.querySelector('img');
            if (img) {
              const imgSrc = img.getAttribute('src') || '';
              // Filter out UI elements and only use actual content images
              if (imgSrc && !imgSrc.includes('button') && !imgSrc.includes('arrow') && 
                  !imgSrc.includes('icon') && !imgSrc.includes('.svg') &&
                  (imgSrc.includes('.jpg') || imgSrc.includes('.jpeg') || imgSrc.includes('.png') || imgSrc.includes('.webp'))) {
                imageUrl = imgSrc;
                if (imageUrl && !imageUrl.startsWith('http')) {
                  imageUrl = imageUrl.startsWith('/') ? 
                    `https://cdn.prod.website-files.com${imageUrl}` : 
                    `https://cdn.prod.website-files.com/${imageUrl}`;
                }
              }
            }
          }
          
          // Use authentic photos from your collection as featured images
          if (!imageUrl) {
            const authenticImages = [
              "/attached_assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg",
              "/attached_assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg", 
              "/attached_assets/678aad8cfd0dcde677a14418_hike2-p-500.jpg",
              "/attached_assets/20250517_073713.00_00_08_03.Still003.jpg",
              "/attached_assets/493414479_10213588193416986_7983427679426833080_n.jpg",
              "/attached_assets/ss3_1749484345644.jpg"
            ];
            imageUrl = authenticImages[idx % authenticImages.length];
          }
          
          // Determine category based on content
          let category = 'Inspiration';
          const contentText = (title + excerpt).toLowerCase();
          
          if (contentText.includes('nutrition') || contentText.includes('diet') || contentText.includes('meal') || contentText.includes('food') || contentText.includes('ice cream') || contentText.includes('granola')) {
            category = 'Nutrition';
          } else if (contentText.includes('run') || contentText.includes('marathon') || contentText.includes('5k') || contentText.includes('coach')) {
            category = 'Running';
          } else if (contentText.includes('train') || contentText.includes('workout') || contentText.includes('exercise') || contentText.includes('strength') || contentText.includes('chest') || contentText.includes('arms') || contentText.includes('dumbbell')) {
            category = 'Workouts';
          } else if (contentText.includes('yoga') || contentText.includes('stretch') || contentText.includes('hamstring') || contentText.includes('back pain')) {
            category = 'Yoga / Stretching';
          } else if (contentText.includes('iron master') || contentText.includes('dumbbells') || contentText.includes('100lbs')) {
            category = 'Iron Master Dumbbells';
          } else if (contentText.includes('motivation') || contentText.includes('goal') || contentText.includes('mindset') || contentText.includes('inspiration')) {
            category = 'Inspiration';
          }
          
          const post: BlogPost = {
            id: `article-${idx}`,
            title,
            excerpt: excerpt || `Learn about ${title.toLowerCase()} with expert guidance from our certified trainers.`,
            content: excerpt || `Discover comprehensive insights about ${title.toLowerCase()} and how it can improve your health and fitness journey.`,
            author: contentText.includes('yoga') || contentText.includes('erica') ? 'Erica Baker' : 'Michael Baker',
            publishedDate: new Date(Date.now() - ((posts.length + idx) * 24 * 60 * 60 * 1000)).toISOString(),
            category,
            tags: [category, 'health', 'fitness'],
            imageUrl: imageUrl || undefined,
            readTime: Math.max(3, Math.ceil((title + excerpt).split(' ').length / 200)),
            isVideo: false,
            originalUrl: 'https://www.getupearlier.com/blog'
          };
          posts.push(post);
        }
      });
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