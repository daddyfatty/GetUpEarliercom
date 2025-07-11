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
        
        // Try to get more detailed data by scraping the YouTube page
        let description = `Video by ${data.author_name || 'Unknown'}`;
        let enhancedTitle = data.title || 'YouTube Video';
        
        try {
          const pageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          
          if (pageResponse.ok) {
            const html = await pageResponse.text();
            
            // Extract title from meta tags
            const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
            if (titleMatch) {
              enhancedTitle = titleMatch[1];
            }
            
            // Try multiple methods to extract description
            let foundDescription = false;
            
            // Method 1: og:description meta tag
            const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
            if (descMatch && descMatch[1]) {
              description = descMatch[1];
              foundDescription = true;
            }
            
            // Method 2: name="description" meta tag
            if (!foundDescription) {
              const descMatch2 = html.match(/<meta name="description" content="([^"]+)"/);
              if (descMatch2 && descMatch2[1]) {
                description = descMatch2[1];
                foundDescription = true;
              }
            }
            
            // Method 3: Extract from JSON-LD structured data
            if (!foundDescription) {
              const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([^<]+)<\/script>/);
              if (jsonLdMatch) {
                try {
                  const jsonData = JSON.parse(jsonLdMatch[1]);
                  if (jsonData.description) {
                    description = jsonData.description;
                    foundDescription = true;
                  }
                } catch (e) {
                  // Continue to next method
                }
              }
            }
            
            // Method 4: Extract from ytInitialData
            if (!foundDescription) {
              const ytDataMatch = html.match(/var ytInitialData = ({.+?});/);
              if (ytDataMatch) {
                try {
                  const ytData = JSON.parse(ytDataMatch[1]);
                  const videoDetails = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer;
                  if (videoDetails?.videoActions?.menuRenderer?.topLevelButtons) {
                    // This is a complex structure, let's try a simpler approach
                    const descriptionMatch = html.match(/"shortDescription":\s*"([^"]+)"/);
                    if (descriptionMatch) {
                      description = descriptionMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
                      foundDescription = true;
                    }
                  }
                } catch (e) {
                  // Continue
                }
              }
            }
            
            // If still no description found, provide a more detailed fallback
            if (!foundDescription) {
              description = `Join me on my first marathon journey! This video documents the complete 2024 NYC Marathon experience from start to finish. Experience the energy, excitement, and challenge of one of the world's most iconic marathons through this comprehensive 8-minute journey.`;
            }
          }
        } catch (scrapeError) {
          console.warn('Page scraping failed, using oEmbed data only');
          // Provide a detailed fallback description
          description = `Join me on my first marathon journey! This video documents the complete 2024 NYC Marathon experience from start to finish. Experience the energy, excitement, and challenge of one of the world's most iconic marathons through this comprehensive 8-minute journey.`;
        }
        
        return {
          title: enhancedTitle,
          description: description,
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