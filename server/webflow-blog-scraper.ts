import * as cheerio from 'cheerio';
import { db } from './db';
import { blogPosts } from '../shared/schema';
import { eq } from 'drizzle-orm';

interface WebflowBlogPost {
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

export class WebflowBlogScraper {
  private readonly baseUrl = 'https://www.getupearlier.com';
  private readonly blogUrl = 'https://www.getupearlier.com/blog';

  /**
   * Scrape all blog posts from the Webflow site
   */
  async scrapeAllPosts(): Promise<WebflowBlogPost[]> {
    console.log('Webflow Scraper: Starting blog post scraping...');
    const allPosts: WebflowBlogPost[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        console.log(`Webflow Scraper: Scraping page ${currentPage}...`);
        const pageUrl = currentPage === 1 ? this.blogUrl : `${this.blogUrl}?a514f639_page=${currentPage}`;
        
        const response = await fetch(pageUrl);
        if (!response.ok) {
          console.error(`Failed to fetch page ${currentPage}: ${response.status}`);
          break;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract posts from the current page
        const postsOnPage = await this.extractPostsFromPage($, currentPage);
        allPosts.push(...postsOnPage);

        // Check if there's a "Next" button to continue pagination
        const nextButton = $('a[href*="a514f639_page"]').last();
        const nextHref = nextButton.attr('href');
        hasMorePages = nextButton.length > 0 && nextHref !== undefined && nextHref.includes(`page=${currentPage + 1}`);
        
        if (postsOnPage.length === 0) {
          hasMorePages = false;
        }

        currentPage++;
        
        // Add delay to be respectful to the server
        await this.delay(1000);
        
      } catch (error) {
        console.error(`Error scraping page ${currentPage}:`, error);
        hasMorePages = false;
      }
    }

    console.log(`Webflow Scraper: Found ${allPosts.length} total posts across ${currentPage - 1} pages`);
    return allPosts;
  }

  /**
   * Extract post data from a blog listing page
   */
  private async extractPostsFromPage($: cheerio.CheerioAPI, pageNumber: number): Promise<WebflowBlogPost[]> {
    const posts: WebflowBlogPost[] = [];

    // Find all blog post links (they contain "/post/" in the href)
    const postLinks = $('a[href*="/post/"]');
    
    console.log(`Webflow Scraper: Found ${postLinks.length} post links on page ${pageNumber}`);

    for (let i = 0; i < postLinks.length; i++) {
      const linkElement = $(postLinks[i]);
      const postUrl = linkElement.attr('href');
      
      if (!postUrl) continue;

      const fullUrl = postUrl.startsWith('http') ? postUrl : `${this.baseUrl}${postUrl}`;
      
      try {
        // Extract basic info from the listing page
        const postContainer = linkElement.closest('div').parent();
        const title = linkElement.find('strong').text().trim() || 
                     linkElement.text().trim() || 
                     this.extractTitleFromUrl(postUrl);
        
        const image = postContainer.find('img').first();
        const imageUrl = image.attr('src') || image.attr('data-src');
        
        // Get category from the listing (look for category text near the image)
        const categoryElement = postContainer.find('div').filter((_, el) => {
          const text = $(el).text().trim();
          return ['Iron Master Dumbbells', 'Workouts', 'Yoga / Stretching', 'Nutrition', 'Running', 'Inspiration'].includes(text);
        });
        const category = categoryElement.text().trim() || 'General';

        // Scrape the full post content
        const fullPost = await this.scrapeIndividualPost(fullUrl, title, category, imageUrl);
        if (fullPost) {
          posts.push(fullPost);
        }

        // Add delay between individual post requests
        await this.delay(500);
        
      } catch (error) {
        console.error(`Error processing post ${postUrl}:`, error);
      }
    }

    return posts;
  }

  /**
   * Scrape content from an individual blog post page
   */
  private async scrapeIndividualPost(url: string, fallbackTitle: string, category: string, imageUrl?: string): Promise<WebflowBlogPost | null> {
    try {
      console.log(`Webflow Scraper: Scraping individual post: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch post ${url}: ${response.status}`);
        return null;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract post content
      const title = $('h1').first().text().trim() || 
                   $('[class*="title"]').first().text().trim() || 
                   fallbackTitle;

      // Look for main content areas
      const contentSelectors = [
        '[class*="blog-content"]',
        '[class*="post-content"]', 
        '[class*="rich-text"]',
        'main p',
        '.w-richtext',
        '[class*="text-block"]'
      ];

      let content = '';
      for (const selector of contentSelectors) {
        const contentEl = $(selector);
        if (contentEl.length > 0) {
          content = contentEl.text().trim();
          if (content.length > 100) break; // Found substantial content
        }
      }

      // If no substantial content found, try to get all paragraph text
      if (!content || content.length < 100) {
        content = $('p').map((_, el) => $(el).text().trim()).get().join('\n').trim();
      }

      // Extract video URL if present
      const videoUrl = $('iframe[src*="youtube"], iframe[src*="vimeo"], video source').first().attr('src') || 
                     $('a[href*="youtube"], a[href*="vimeo"]').first().attr('href');

      // If still no image, try to find one on the post page
      if (!imageUrl) {
        const postImage = $('img').first();
        imageUrl = postImage.attr('src') || postImage.attr('data-src');
      }

      // Generate excerpt from content
      const excerpt = this.generateExcerpt(content, title);

      // Generate ID from URL
      const id = this.generateIdFromUrl(url);

      // Estimate read time
      const readTime = Math.max(1, Math.ceil(content.length / 1000));

      // Determine if it's a video post
      const isVideo = !!videoUrl || title.toLowerCase().includes('video') || content.toLowerCase().includes('watch');

      // Extract tags from title and content
      const tags = this.extractTags(title, content, category);

      const post: WebflowBlogPost = {
        id,
        title,
        excerpt,
        content: content || excerpt,
        author: 'Michael Baker',
        publishedDate: new Date().toISOString(), // Webflow doesn't expose publish date easily
        category: this.normalizeCategory(category),
        tags,
        imageUrl,
        videoUrl,
        readTime,
        isVideo,
        originalUrl: url
      };

      return post;

    } catch (error) {
      console.error(`Error scraping individual post ${url}:`, error);
      return null;
    }
  }

  /**
   * Save scraped posts to the database
   */
  async savePostsToDatabase(posts: WebflowBlogPost[]): Promise<void> {
    console.log(`Webflow Scraper: Saving ${posts.length} posts to database...`);
    let savedCount = 0;
    let skippedCount = 0;

    for (const post of posts) {
      try {
        // Check if post already exists
        const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.id, post.id));
        
        if (existingPost.length === 0) {
          const dbPost = {
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            publishedDate: post.publishedDate,
            category: post.category,
            tags: JSON.stringify(post.tags),
            imageUrl: post.imageUrl,
            videoUrl: post.videoUrl,
            readTime: post.readTime,
            isVideo: post.isVideo,
            originalUrl: post.originalUrl
          };

          await db.insert(blogPosts).values(dbPost);
          savedCount++;
          console.log(`Webflow Scraper: Added "${post.title.slice(0, 50)}..."`);
        } else {
          skippedCount++;
          console.log(`Webflow Scraper: Skipped existing post "${post.title.slice(0, 50)}..."`);
        }
      } catch (error) {
        console.error(`Error saving post "${post.title}":`, error);
      }
    }

    console.log(`Webflow Scraper: Completed - ${savedCount} new posts saved, ${skippedCount} existing posts skipped`);
  }

  /**
   * Main method to scrape and save all posts
   */
  async scrapeAndSave(): Promise<{ success: boolean; savedCount: number; totalFound: number }> {
    try {
      const posts = await this.scrapeAllPosts();
      
      if (posts.length === 0) {
        console.log('Webflow Scraper: No posts found to scrape');
        return { success: true, savedCount: 0, totalFound: 0 };
      }

      await this.savePostsToDatabase(posts);
      
      // Count how many were actually new
      const existingPosts = await db.select().from(blogPosts);
      const newPosts = posts.filter(post => 
        !existingPosts.some(existing => existing.id === post.id)
      );

      return { 
        success: true, 
        savedCount: newPosts.length, 
        totalFound: posts.length 
      };
      
    } catch (error) {
      console.error('Webflow Scraper: Error in scrapeAndSave:', error);
      return { success: false, savedCount: 0, totalFound: 0 };
    }
  }

  // Helper methods
  private generateIdFromUrl(url: string): string {
    return url.split('/post/')[1]?.split('?')[0] || url.split('/').pop() || 'unknown';
  }

  private extractTitleFromUrl(url: string): string {
    return url.split('/post/')[1]?.split('?')[0]
      ?.replace(/-/g, ' ')
      ?.replace(/\b\w/g, l => l.toUpperCase()) || 'Untitled Post';
  }

  private generateExcerpt(content: string, title: string): string {
    if (content && content.length > 50) {
      return content.slice(0, 200) + (content.length > 200 ? '...' : '');
    }
    return title.slice(0, 150) + (title.length > 150 ? '...' : '');
  }

  private extractTags(title: string, content: string, category: string): string[] {
    const tags = new Set<string>();
    
    // Add category as a tag
    tags.add(category.toLowerCase());
    
    // Common fitness/health keywords
    const keywords = [
      'workout', 'training', 'strength', 'cardio', 'running', 'marathon', 'yoga', 
      'nutrition', 'protein', 'recipe', 'healthy', 'fitness', 'exercise', 'muscle',
      'deadlift', 'squat', 'press', 'dumbbells', 'barbell', 'bodyweight'
    ];
    
    const text = (title + ' ' + content).toLowerCase();
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.add(keyword);
      }
    });
    
    return Array.from(tags).slice(0, 6); // Limit to 6 tags
  }

  private normalizeCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Iron Master Dumbbells': 'Strength Training',
      'Workouts': 'Workouts',
      'Yoga / Stretching': 'Yoga',
      'Nutrition': 'Nutrition',
      'Running': 'Running',
      'Inspiration': 'Motivation'
    };
    
    return categoryMap[category] || category || 'General';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export a convenience function
export async function scrapeWebflowBlog(): Promise<{ success: boolean; savedCount: number; totalFound: number }> {
  const scraper = new WebflowBlogScraper();
  return await scraper.scrapeAndSave();
}