import * as cheerio from 'cheerio';
import { db } from './db';
import { blogPosts } from '../shared/schema';
import { eq } from 'drizzle-orm';

interface FacebookGroupPost {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  imageUrl?: string;
  videoUrl?: string;
  permalink: string;
  reactions?: number;
  comments?: number;
}

export class FacebookGroupScraper {
  private groupUrl = 'https://www.facebook.com/groups/getupearlier';
  private targetAuthor = 'Michael Baker';
  
  private async fetchGroupPage(): Promise<string> {
    try {
      const response = await fetch(this.groupUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch group page: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error fetching Facebook group page:', error);
      throw error;
    }
  }

  private extractPostContent(html: string): FacebookGroupPost[] {
    const $ = cheerio.load(html);
    const posts: FacebookGroupPost[] = [];
    
    // Look for post containers - Facebook uses various selectors
    const postSelectors = [
      '[role="article"]',
      '[data-pagelet*="FeedUnit"]',
      '.userContentWrapper',
      '.userContent',
      '[data-testid="post_message"]'
    ];
    
    for (const selector of postSelectors) {
      $(selector).each((index, element) => {
        const $post = $(element);
        
        // Extract author information
        const authorSelectors = [
          '[data-testid="post_author"]',
          '.userInfo a strong',
          '.profileName',
          'strong[data-hovercard]',
          'a[role="link"] strong'
        ];
        
        let author = '';
        for (const authSelector of authorSelectors) {
          const authorText = $post.find(authSelector).first().text().trim();
          if (authorText && (authorText.includes('Michael') || authorText.includes('Baker'))) {
            author = authorText;
            break;
          }
        }
        
        // Skip if not from Michael Baker
        if (!author || (!author.includes('Michael') && !author.includes('Baker'))) {
          return;
        }
        
        // Extract post content
        const contentSelectors = [
          '[data-testid="post_message"]',
          '.userContent',
          '.text_exposed_root',
          'div[data-ad-preview="message"]'
        ];
        
        let content = '';
        for (const contentSelector of contentSelectors) {
          const contentText = $post.find(contentSelector).text().trim();
          if (contentText && contentText.length > 20) {
            content = contentText;
            break;
          }
        }
        
        if (!content) return;
        
        // Extract images
        const images = $post.find('img[src]');
        let imageUrl = '';
        images.each((i, img) => {
          const src = $(img).attr('src');
          if (src && !src.includes('emoji') && !src.includes('reaction') && src.includes('scontent')) {
            imageUrl = src;
            return false; // Break loop
          }
        });
        
        // Extract video URLs
        let videoUrl = '';
        const videoLinks = $post.find('a[href*="youtube"], a[href*="youtu.be"]');
        if (videoLinks.length > 0) {
          const videoLink = videoLinks.first().attr('href');
          if (videoLink) {
            videoUrl = this.convertToEmbedUrl(videoLink);
          }
        }
        
        // Check content for video links
        if (!videoUrl) {
          const youtubeMatches = content.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (youtubeMatches) {
            videoUrl = `https://www.youtube.com/embed/${youtubeMatches[1]}`;
          }
        }
        
        // Extract timestamp (try multiple approaches)
        let timestamp = new Date().toISOString();
        const timeSelectors = [
          'abbr[data-utime]',
          '[data-testid="story-subtitle"] abbr',
          'time',
          '.timestamp'
        ];
        
        for (const timeSelector of timeSelectors) {
          const timeElement = $post.find(timeSelector).first();
          const utime = timeElement.attr('data-utime');
          if (utime) {
            timestamp = new Date(parseInt(utime) * 1000).toISOString();
            break;
          }
          const datetime = timeElement.attr('datetime');
          if (datetime) {
            timestamp = new Date(datetime).toISOString();
            break;
          }
        }
        
        // Generate unique ID
        const postId = `fb-group-${Buffer.from(content.slice(0, 50)).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}-${Date.parse(timestamp)}`;
        
        posts.push({
          id: postId,
          content: content,
          author: author,
          timestamp: timestamp,
          imageUrl: imageUrl || undefined,
          videoUrl: videoUrl || undefined,
          permalink: `${this.groupUrl}/posts/${postId}`
        });
      });
      
      // If we found posts, break out of selector loop
      if (posts.length > 0) break;
    }
    
    return posts.slice(0, 2); // Return only last 2 posts as requested
  }

  private convertToEmbedUrl(url: string): string {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    
    return url;
  }

  private categorizePost(content: string): string {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('recipe') || contentLower.includes('nutrition') || contentLower.includes('meal')) {
      return 'Nutrition';
    }
    if (contentLower.includes('workout') || contentLower.includes('training') || contentLower.includes('strength')) {
      return 'Workouts';
    }
    if (contentLower.includes('running') || contentLower.includes('marathon') || contentLower.includes('cardio')) {
      return 'Running';
    }
    if (contentLower.includes('yoga') || contentLower.includes('stretch') || contentLower.includes('flexibility')) {
      return 'Yoga / Stretching';
    }
    if (contentLower.includes('inspiration') || contentLower.includes('motivation') || contentLower.includes('mindset')) {
      return 'Inspiration';
    }
    
    return 'General';
  }

  private extractTags(content: string): string[] {
    // Extract hashtags
    const hashtagMatches = content.match(/#\w+/g) || [];
    const hashtags = hashtagMatches.map(tag => tag.slice(1).toLowerCase());
    
    // Add category-based tags
    const contentLower = content.toLowerCase();
    const tags = [...hashtags];
    
    if (contentLower.includes('50 years old') || contentLower.includes('over 40') || contentLower.includes('over 50')) {
      tags.push('over-40', 'mature-athlete');
    }
    if (contentLower.includes('ironmaster') || contentLower.includes('dumbbell')) {
      tags.push('ironmaster', 'dumbbells');
    }
    if (contentLower.includes('pr') || contentLower.includes('personal record')) {
      tags.push('personal-record', 'strength-pr');
    }
    if (contentLower.includes('getupearlier') || contentLower.includes('get up earlier')) {
      tags.push('getupearlier', 'community');
    }
    
    return Array.from(new Set(tags));
  }

  private async saveToBlog(post: FacebookGroupPost): Promise<void> {
    try {
      const title = post.content.split('\n')[0].slice(0, 100) || 'Facebook Group Post';
      const excerpt = post.content.slice(0, 200) + (post.content.length > 200 ? '...' : '');
      const category = this.categorizePost(post.content);
      const tags = this.extractTags(post.content);
      const isVideo = !!post.videoUrl || post.content.toLowerCase().includes('video');
      
      const blogPost = {
        id: post.id,
        title: title,
        excerpt: excerpt,
        content: post.content,
        author: post.author,
        publishedDate: post.timestamp,
        category: category,
        tags: JSON.stringify(tags),
        imageUrl: post.imageUrl,
        videoUrl: post.videoUrl,
        readTime: Math.ceil(post.content.length / 200) || 1,
        isVideo: isVideo,
        originalUrl: post.permalink
      };

      // Check if post already exists
      const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.id, blogPost.id));
      
      if (existingPost.length === 0) {
        await db.insert(blogPosts).values(blogPost);
        console.log(`Facebook Group Scraper: Added new post "${title.slice(0, 50)}..."`);
      } else {
        console.log(`Facebook Group Scraper: Post already exists "${title.slice(0, 50)}..."`);
      }
      
    } catch (error) {
      console.error('Error saving post to blog:', error);
      throw error;
    }
  }

  public async scrapeRecentPosts(): Promise<number> {
    try {
      console.log('Facebook Group Scraper: Starting scrape of recent posts...');
      
      const html = await this.fetchGroupPage();
      const posts = this.extractPostContent(html);
      
      console.log(`Facebook Group Scraper: Found ${posts.length} posts from ${this.targetAuthor}`);
      
      if (posts.length === 0) {
        console.log('Facebook Group Scraper: No posts found. The page might require login or have changed structure.');
        return 0;
      }
      
      // Save posts to database
      for (const post of posts) {
        await this.saveToBlog(post);
      }
      
      console.log(`Facebook Group Scraper: Successfully processed ${posts.length} posts`);
      return posts.length;
      
    } catch (error) {
      console.error('Facebook Group Scraper Error:', error);
      return 0;
    }
  }

  public async testScraper(): Promise<{ success: boolean; message: string; postsFound: number }> {
    try {
      const postsFound = await this.scrapeRecentPosts();
      return {
        success: true,
        message: `Successfully scraped ${postsFound} posts from Facebook group`,
        postsFound
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error}`,
        postsFound: 0
      };
    }
  }
}

export const facebookGroupScraper = new FacebookGroupScraper();