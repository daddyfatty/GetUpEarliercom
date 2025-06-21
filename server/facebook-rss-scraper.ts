import * as cheerio from 'cheerio';
import { db } from './db';
import { blogPosts } from '../shared/schema';
import { eq } from 'drizzle-orm';

interface FacebookPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedDate: string;
  permalink: string;
  images: string[];
  featuredImage?: string;
}

export class FacebookRSScraper {
  private groupUrl = 'https://www.facebook.com/groups/getupearlier';
  private targetAuthor = 'Michael Baker';

  private async fetchSpecificPost(postUrl: string): Promise<FacebookPost | null> {
    try {
      console.log(`Facebook RSS: Fetching specific post: ${postUrl}`);
      
      const response = await fetch(postUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract post content using various selectors
      let content = '';
      const contentSelectors = [
        '[data-testid="post_message"]',
        '.userContent',
        '.text_exposed_root',
        'div[data-ad-preview="message"]',
        '.story_body_container .userContent',
        '.mtm .userContent'
      ];

      for (const selector of contentSelectors) {
        const foundContent = $(selector).first().text().trim();
        if (foundContent && foundContent.length > 20) {
          content = foundContent;
          break;
        }
      }

      // Extract images
      const images: string[] = [];
      $('img[src]').each((i, img) => {
        const src = $(img).attr('src');
        if (src && !src.includes('emoji') && !src.includes('reaction') && 
            (src.includes('scontent') || src.includes('fbcdn'))) {
          // Clean up the image URL to get higher resolution
          const cleanUrl = src.split('?')[0];
          if (!images.includes(cleanUrl)) {
            images.push(cleanUrl);
          }
        }
      });

      // Use the first image as featured image
      const featuredImage = images.length > 0 ? images[0] : undefined;

      // Extract post ID from URL
      const postIdMatch = postUrl.match(/posts\/(\d+)/);
      const postId = postIdMatch ? postIdMatch[1] : Date.now().toString();

      // Generate title from content
      const title = content.split('\n')[0].slice(0, 100) || 'Facebook Group Post';

      if (!content) {
        console.log('Facebook RSS: No content found in post');
        return null;
      }

      return {
        id: `fb-group-${postId}`,
        title: title,
        content: content,
        author: this.targetAuthor,
        publishedDate: new Date().toISOString(),
        permalink: postUrl,
        images: images,
        featuredImage: featuredImage
      };

    } catch (error) {
      console.error('Facebook RSS: Error fetching specific post:', error);
      return null;
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
    if (contentLower.includes('getupearlier') || contentLower.includes('get up earlier')) {
      tags.push('getupearlier', 'community');
    }
    
    return Array.from(new Set(tags));
  }

  private async saveToBlog(post: FacebookPost): Promise<void> {
    try {
      const category = this.categorizePost(post.content);
      const tags = this.extractTags(post.content);
      const excerpt = post.content.slice(0, 200) + (post.content.length > 200 ? '...' : '');
      const readTime = Math.ceil(post.content.length / 200) || 1;
      
      const blogPost = {
        id: post.id,
        title: post.title,
        excerpt: excerpt,
        content: post.content,
        author: post.author,
        publishedDate: post.publishedDate,
        category: category,
        tags: JSON.stringify(tags),
        imageUrl: post.featuredImage,
        videoUrl: null,
        readTime: readTime,
        isVideo: false,
        originalUrl: post.permalink
      };

      // Check if post already exists
      const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.id, blogPost.id));
      
      if (existingPost.length === 0) {
        await db.insert(blogPosts).values(blogPost);
        console.log(`Facebook RSS: Added new post "${post.title.slice(0, 50)}..."`);
        console.log(`Facebook RSS: Featured image: ${post.featuredImage}`);
        console.log(`Facebook RSS: Total images found: ${post.images.length}`);
      } else {
        console.log(`Facebook RSS: Post already exists "${post.title.slice(0, 50)}..."`);
      }
      
    } catch (error) {
      console.error('Facebook RSS: Error saving post to blog:', error);
      throw error;
    }
  }

  public async fetchLatestPost(postUrl: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Facebook RSS: Starting fetch of specific post...');
      
      const post = await this.fetchSpecificPost(postUrl);
      
      if (!post) {
        return {
          success: false,
          message: 'Could not extract content from the Facebook post. The post might be private or require login.'
        };
      }

      await this.saveToBlog(post);
      
      return {
        success: true,
        message: `Successfully added post: "${post.title}" with ${post.images.length} images`
      };
      
    } catch (error) {
      console.error('Facebook RSS Error:', error);
      return {
        success: false,
        message: `Error: ${error}`
      };
    }
  }
}

export const facebookRSScraper = new FacebookRSScraper();