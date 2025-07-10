import { load } from 'cheerio';

interface YouTubeVideoData {
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  channelName: string;
  duration?: string;
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export async function getYouTubeVideoMetadata(url: string): Promise<YouTubeVideoData | null> {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Try to fetch video metadata using YouTube's oEmbed API
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    try {
      const response = await fetch(oembedUrl);
      if (response.ok) {
        const data = await response.json();
        
        return {
          title: data.title || 'YouTube Video',
          description: `Video by ${data.author_name || 'Unknown'}`,
          thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          videoId: videoId,
          channelName: data.author_name || 'Unknown Channel',
          duration: undefined
        };
      }
    } catch (oembedError) {
      console.warn('oEmbed API failed, using fallback method');
    }

    // Fallback: Use standard YouTube thumbnail URLs and basic metadata
    const thumbnailUrls = [
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
    ];

    // Try to find the best available thumbnail
    let bestThumbnail = thumbnailUrls[0];
    for (const thumbnailUrl of thumbnailUrls) {
      try {
        const thumbResponse = await fetch(thumbnailUrl, { method: 'HEAD' });
        if (thumbResponse.ok) {
          bestThumbnail = thumbnailUrl;
          break;
        }
      } catch (e) {
        // Continue to next thumbnail
      }
    }

    return {
      title: 'YouTube Video',
      description: 'Video content from YouTube',
      thumbnail: bestThumbnail,
      videoId: videoId,
      channelName: 'YouTube',
      duration: undefined
    };

  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}

export function createEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function generateSlugFromTitle(title: string, videoId: string): string {
  // Clean title for slug
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `${cleanTitle}-${videoId}`;
}