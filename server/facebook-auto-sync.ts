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
}

export class FacebookAutoSync {
  private groupUrl: string;
  private lastSyncFile = './data/facebook-last-sync.json';
  
  constructor() {
    this.groupUrl = 'https://www.facebook.com/groups/getupearlier';
  }

  private async loadLastSyncTime(): Promise<string> {
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile(this.lastSyncFile, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.lastSync || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } catch {
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  private async saveLastSyncTime(timestamp: string): Promise<void> {
    try {
      const fs = await import('fs/promises');
      await fs.mkdir('./data', { recursive: true });
      await fs.writeFile(this.lastSyncFile, JSON.stringify({ lastSync: timestamp }, null, 2));
    } catch (error) {
      console.error('Error saving sync time:', error);
    }
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
    
    return Array.from(new Set(tags));
  }

  private convertVideoUrl(url: string): string | undefined {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    }
    
    return url;
  }

  // Alternative method using RSS feed if available
  private async fetchFromRSS(): Promise<FacebookGroupPost[]> {
    try {
      // Some Facebook pages have RSS feeds available
      const rssUrl = `${this.groupUrl}/feed`;
      const response = await fetch(rssUrl);
      
      if (!response.ok) {
        throw new Error('RSS feed not available');
      }
      
      const rssContent = await response.text();
      const $ = cheerio.load(rssContent, { xmlMode: true });
      
      const posts: FacebookGroupPost[] = [];
      
      $('item').each((index, element) => {
        const $item = $(element);
        const title = $item.find('title').text();
        const description = $item.find('description').text();
        const link = $item.find('link').text();
        const pubDate = $item.find('pubDate').text();
        
        // Extract author from title (Facebook RSS format)
        const authorMatch = title.match(/^(.+?):/);
        const author = authorMatch ? authorMatch[1] : 'Michael Baker';
        
        // Only include posts from Michael Baker
        if (author.toLowerCase().includes('michael') || author.toLowerCase().includes('baker')) {
          posts.push({
            id: `rss-${index}-${Date.parse(pubDate)}`,
            content: description || title,
            author: author,
            timestamp: new Date(pubDate).toISOString(),
            permalink: link
          });
        }
      });
      
      return posts;
    } catch (error) {
      console.log('RSS method failed, trying alternative approach');
      return [];
    }
  }

  // Method using Instagram Basic Display API as Facebook owns Instagram
  private async fetchFromInstagram(): Promise<FacebookGroupPost[]> {
    try {
      const instagramUserId = process.env.INSTAGRAM_USER_ID;
      const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      
      if (!instagramUserId || !instagramAccessToken) {
        throw new Error('Instagram credentials not configured');
      }
      
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${instagramAccessToken}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Instagram API request failed');
      }
      
      const data = await response.json();
      const posts: FacebookGroupPost[] = [];
      
      for (const post of data.data || []) {
        posts.push({
          id: `instagram-${post.id}`,
          content: post.caption || '',
          author: 'Michael Baker',
          timestamp: post.timestamp,
          imageUrl: post.media_type === 'IMAGE' ? post.media_url : undefined,
          videoUrl: post.media_type === 'VIDEO' ? this.convertVideoUrl(post.media_url) : undefined,
          permalink: post.permalink
        });
      }
      
      return posts;
    } catch (error) {
      console.log('Instagram method failed');
      return [];
    }
  }

  // Method using web scraping (requires careful implementation)
  private async scrapePublicPosts(): Promise<FacebookGroupPost[]> {
    try {
      // This would scrape public Facebook posts
      // Note: Facebook's terms of service should be considered
      const response = await fetch(this.groupUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GetUpEarlierBot/1.0; +https://getupearlier.com)'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch group page');
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const posts: FacebookGroupPost[] = [];
      
      // Facebook's structure changes frequently, this is a simplified example
      $('[data-testid*="post"]').each((index, element) => {
        const $post = $(element);
        const content = $post.find('[data-testid="post_message"]').text();
        const author = $post.find('[data-testid="post_author"]').text();
        
        if (author.toLowerCase().includes('michael') && content.length > 0) {
          posts.push({
            id: `scraped-${index}-${Date.now()}`,
            content: content,
            author: 'Michael Baker',
            timestamp: new Date().toISOString(),
            permalink: this.groupUrl
          });
        }
      });
      
      return posts;
    } catch (error) {
      console.log('Web scraping method failed');
      return [];
    }
  }

  private async convertToBlogPost(post: FacebookGroupPost): Promise<void> {
    try {
      const title = post.content.split('\n')[0].slice(0, 100) || 'Facebook Group Post';
      const excerpt = post.content.slice(0, 200) + (post.content.length > 200 ? '...' : '');
      const category = this.categorizePost(post.content);
      const tags = this.extractTags(post.content);
      const isVideo = !!post.videoUrl || post.content.toLowerCase().includes('video');
      
      const blogPost = {
        id: `facebook-${post.id}`,
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
        console.log(`Facebook Auto-Sync: Added new post "${title.slice(0, 50)}..."`);
      }
      
    } catch (error) {
      console.error('Error converting post to blog:', error);
    }
  }

  public async syncNewPosts(): Promise<number> {
    try {
      console.log('Facebook Auto-Sync: Starting automatic sync...');
      
      let posts: FacebookGroupPost[] = [];
      
      // Try multiple methods in order of preference
      posts = await this.fetchFromRSS();
      
      if (posts.length === 0) {
        posts = await this.fetchFromInstagram();
      }
      
      if (posts.length === 0) {
        posts = await this.scrapePublicPosts();
      }
      
      if (posts.length === 0) {
        console.log('Facebook Auto-Sync: No new posts found');
        return 0;
      }
      
      const lastSync = await this.loadLastSyncTime();
      const newPosts = posts.filter(post => new Date(post.timestamp) > new Date(lastSync));
      
      console.log(`Facebook Auto-Sync: Found ${newPosts.length} new posts`);
      
      for (const post of newPosts) {
        await this.convertToBlogPost(post);
      }
      
      if (newPosts.length > 0) {
        await this.saveLastSyncTime(new Date().toISOString());
      }
      
      console.log(`Facebook Auto-Sync: Successfully synced ${newPosts.length} posts`);
      return newPosts.length;
      
    } catch (error) {
      console.error('Facebook Auto-Sync Error:', error);
      return 0;
    }
  }

  public async setupAutoSync(): Promise<void> {
    // Set up automatic sync every hour
    setInterval(async () => {
      await this.syncNewPosts();
    }, 60 * 60 * 1000); // 1 hour
    
    console.log('Facebook Auto-Sync: Automatic sync enabled (every hour)');
  }
}

export const facebookAutoSync = new FacebookAutoSync();