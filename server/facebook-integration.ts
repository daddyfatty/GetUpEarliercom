interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  from: {
    id: string;
    name: string;
  };
  picture?: string;
  full_picture?: string;
  attachments?: {
    data: Array<{
      type: string;
      media?: {
        image?: {
          src: string;
        };
      };
      target?: {
        url: string;
      };
    }>;
  };
  permalink_url?: string;
}

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

interface SyncState {
  lastSyncTime: string;
  authorizedUsers: string[];
}

// Authorized Facebook user IDs (you can add more users here)
const AUTHORIZED_USERS: string[] = [
  // Add your Facebook user ID and any other authorized users
  // You can find your user ID by going to Graph API Explorer and querying 'me'
];

export class FacebookBlogIntegration {
  private accessToken: string;
  private pageId: string; // Using Page instead of Group for immediate access
  private lastSyncFile = './data/facebook-sync-state.json';

  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN || '';
    this.pageId = process.env.FACEBOOK_PAGE_ID || ''; // Your business page ID
    
    if (!this.accessToken || !this.pageId) {
      console.warn('Facebook integration disabled: Missing FACEBOOK_ACCESS_TOKEN or FACEBOOK_PAGE_ID');
    }
  }

  private async loadSyncState(): Promise<SyncState> {
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile(this.lastSyncFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      // Default state for first run
      return {
        lastSyncTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
        authorizedUsers: AUTHORIZED_USERS
      };
    }
  }

  private async saveSyncState(state: SyncState): Promise<void> {
    try {
      const fs = await import('fs/promises');
      await fs.mkdir('./data', { recursive: true });
      await fs.writeFile(this.lastSyncFile, JSON.stringify(state, null, 2));
    } catch (error) {
      console.error('Error saving sync state:', error);
    }
  }

  private async fetchPagePosts(since: string): Promise<FacebookPost[]> {
    if (!this.accessToken || !this.pageId) {
      throw new Error('Facebook credentials not configured');
    }

    const url = `https://graph.facebook.com/v18.0/${this.pageId}/posts`;
    const params = new URLSearchParams({
      access_token: this.accessToken,
      fields: 'id,message,story,created_time,from,picture,full_picture,attachments{type,media,target},permalink_url',
      since: since,
      limit: '25'
    });

    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  private convertToEmbedUrl(url: string): string | null {
    // Convert various video URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    if (url.includes('facebook.com') && url.includes('/videos/')) {
      // Facebook video - would need Facebook's embed format
      return url;
    }
    
    return null;
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
    
    return Array.from(new Set(tags)); // Remove duplicates
  }

  private convertFacebookPostToBlogPost(post: FacebookPost): BlogPost {
    const content = post.message || post.story || '';
    const title = content.split('\n')[0].slice(0, 100) || 'Facebook Post';
    const excerpt = content.slice(0, 200) + (content.length > 200 ? '...' : '');
    
    // Detect video content
    const isVideo = post.attachments?.data?.some(att => 
      att.type === 'video_inline' || 
      content.includes('youtube') || 
      content.includes('video')
    ) || false;

    // Get image or video URL
    let imageUrl = post.full_picture || post.picture;
    let videoUrl: string | undefined;

    if (post.attachments?.data) {
      for (const attachment of post.attachments.data) {
        if (attachment.type === 'video_inline' && attachment.target?.url) {
          videoUrl = this.convertToEmbedUrl(attachment.target.url) || undefined;
        } else if (attachment.media?.image?.src) {
          imageUrl = attachment.media.image.src;
        }
      }
    }

    // Extract video URLs from content
    if (!videoUrl && (content.includes('youtube') || content.includes('youtu.be'))) {
      const urlMatch = content.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        videoUrl = this.convertToEmbedUrl(urlMatch[0]);
      }
    }

    return {
      id: `facebook-${post.id}`,
      title: title,
      excerpt: excerpt,
      content: content,
      author: post.from.name,
      publishedDate: post.created_time,
      category: this.categorizePost(content),
      tags: this.extractTags(content),
      imageUrl: imageUrl,
      videoUrl: videoUrl,
      readTime: Math.ceil(content.length / 200) || 1,
      isVideo: isVideo,
      originalUrl: post.permalink_url || `https://facebook.com/${post.id}`
    };
  }

  public async syncNewPosts(): Promise<BlogPost[]> {
    try {
      console.log('Facebook Integration: Starting sync...');
      
      const syncState = await this.loadSyncState();
      const facebookPosts = await this.fetchGroupPosts(syncState.lastSyncTime);
      
      console.log(`Facebook Integration: Found ${facebookPosts.length} posts since ${syncState.lastSyncTime}`);
      
      // Filter posts by authorized users
      const authorizedPosts = facebookPosts.filter(post => 
        syncState.authorizedUsers.includes(post.from.id)
      );
      
      console.log(`Facebook Integration: ${authorizedPosts.length} posts from authorized users`);
      
      if (authorizedPosts.length === 0) {
        return [];
      }
      
      // Convert to blog post format
      const blogPosts = authorizedPosts.map(post => this.convertFacebookPostToBlogPost(post));
      
      // Update sync state
      const newSyncState: SyncState = {
        ...syncState,
        lastSyncTime: new Date().toISOString()
      };
      await this.saveSyncState(newSyncState);
      
      console.log(`Facebook Integration: Successfully synced ${blogPosts.length} new posts`);
      return blogPosts;
      
    } catch (error) {
      console.error('Facebook Integration Error:', error);
      return [];
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      const url = `https://graph.facebook.com/v18.0/me?access_token=${this.accessToken}`;
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const facebookIntegration = new FacebookBlogIntegration();