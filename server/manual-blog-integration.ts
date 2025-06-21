import { db } from './db';
import { blogPosts } from '../shared/schema';
import { eq } from 'drizzle-orm';

interface ManualBlogPost {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  originalUrl?: string;
}

export class ManualBlogIntegration {
  
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

  public async addManualPost(postData: ManualBlogPost): Promise<string> {
    try {
      const id = `manual-${Date.now()}`;
      const excerpt = postData.excerpt || postData.content.slice(0, 200) + (postData.content.length > 200 ? '...' : '');
      const category = postData.category || this.categorizePost(postData.content);
      const tags = postData.tags.length > 0 ? postData.tags : this.extractTags(postData.content);
      const videoUrl = postData.videoUrl ? this.convertVideoUrl(postData.videoUrl) : undefined;
      const isVideo = !!videoUrl || postData.content.toLowerCase().includes('video');
      
      const blogPost = {
        id,
        title: postData.title,
        excerpt,
        content: postData.content,
        author: 'Michael Baker',
        publishedDate: new Date().toISOString(),
        category,
        tags: JSON.stringify(tags),
        imageUrl: postData.imageUrl,
        videoUrl,
        readTime: Math.ceil(postData.content.length / 200) || 1,
        isVideo,
        originalUrl: postData.originalUrl || `https://www.getupearlier.com/blog/${id}`
      };

      await db.insert(blogPosts).values(blogPost);
      
      console.log(`Manual Blog Integration: Added post "${postData.title}"`);
      return id;
      
    } catch (error) {
      console.error('Manual Blog Integration Error:', error);
      throw error;
    }
  }

  public async updatePost(id: string, postData: Partial<ManualBlogPost>): Promise<void> {
    try {
      const updateData: any = {
        updatedAt: new Date().toISOString()
      };
      
      if (postData.title) updateData.title = postData.title;
      if (postData.content) {
        updateData.content = postData.content;
        updateData.excerpt = postData.excerpt || postData.content.slice(0, 200) + (postData.content.length > 200 ? '...' : '');
        updateData.readTime = Math.ceil(postData.content.length / 200) || 1;
      }
      if (postData.category) updateData.category = postData.category;
      if (postData.tags) updateData.tags = JSON.stringify(postData.tags);
      if (postData.imageUrl !== undefined) updateData.imageUrl = postData.imageUrl;
      if (postData.videoUrl !== undefined) {
        updateData.videoUrl = postData.videoUrl ? this.convertVideoUrl(postData.videoUrl) : null;
        updateData.isVideo = !!updateData.videoUrl;
      }
      if (postData.originalUrl !== undefined) updateData.originalUrl = postData.originalUrl;

      await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
      
      console.log(`Manual Blog Integration: Updated post "${id}"`);
      
    } catch (error) {
      console.error('Manual Blog Integration Error:', error);
      throw error;
    }
  }

  public async deletePost(id: string): Promise<void> {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      console.log(`Manual Blog Integration: Deleted post "${id}"`);
    } catch (error) {
      console.error('Manual Blog Integration Error:', error);
      throw error;
    }
  }
}

export const manualBlogIntegration = new ManualBlogIntegration();