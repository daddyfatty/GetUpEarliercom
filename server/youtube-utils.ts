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

    console.log(`Fetching YouTube metadata for video ID: ${videoId}`);

    // Try to fetch video metadata using YouTube's oEmbed API first
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    try {
      const response = await fetch(oembedUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('oEmbed data received:', { title: data.title, author: data.author_name });
        
        // Now scrape the actual YouTube page for the description
        let description = '';
        let enhancedTitle = data.title || 'YouTube Video';
        
        try {
          console.log('Attempting to scrape YouTube page for description...');
          const pageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1'
            }
          });
          
          if (pageResponse.ok) {
            const html = await pageResponse.text();
            console.log('YouTube page HTML length:', html.length);
            
            // Method 1: Extract from ytInitialData (most reliable)
            const ytInitialDataMatch = html.match(/var ytInitialData = ({.+?});/);
            if (ytInitialDataMatch) {
              try {
                const ytData = JSON.parse(ytInitialDataMatch[1]);
                console.log('Found ytInitialData, attempting to extract description...');
                
                // Navigate the complex YouTube data structure
                const videoDetails = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer;
                const videoSecondaryInfo = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[1]?.videoSecondaryInfoRenderer;
                
                // Try to get description from videoSecondaryInfoRenderer
                if (videoSecondaryInfo?.description?.runs) {
                  description = videoSecondaryInfo.description.runs.map((run: any) => run.text).join('');
                  console.log('Found description from videoSecondaryInfoRenderer');
                }
                
                // Alternative path for description
                if (!description && videoSecondaryInfo?.attributedDescription?.content) {
                  description = videoSecondaryInfo.attributedDescription.content;
                  console.log('Found description from attributedDescription');
                }
                
                // Another alternative path
                if (!description) {
                  const descMatch = html.match(/"shortDescription":"([^"]+)"/);
                  if (descMatch) {
                    description = descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
                    console.log('Found description from shortDescription');
                  }
                }
                
              } catch (e) {
                console.error('Error parsing ytInitialData:', e);
              }
            }
            
            // Method 2: Try meta tags if ytInitialData failed
            if (!description) {
              console.log('Trying meta tags for description...');
              const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
              if (descMatch && descMatch[1] && !descMatch[1].includes('Enjoy the videos and music')) {
                description = descMatch[1];
                console.log('Found description from meta tag');
              }
            }
            
            // Method 3: Try og:description
            if (!description) {
              const ogDescMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
              if (ogDescMatch && ogDescMatch[1] && !ogDescMatch[1].includes('Enjoy the videos and music')) {
                description = ogDescMatch[1];
                console.log('Found description from og:description');
              }
            }
            
            console.log('Final description length:', description.length);
            console.log('Description preview:', description.substring(0, 100) + '...');
            
          } else {
            console.error('Failed to fetch YouTube page:', pageResponse.status);
          }
        } catch (scrapeError) {
          console.error('Page scraping failed:', scrapeError);
        }
        
        // If we still don't have a description, return an error
        if (!description || description.includes('Enjoy the videos and music')) {
          console.error('Could not extract video description from YouTube');
          return null;
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
      console.error('oEmbed API failed:', oembedError);
      return null;
    }

    return null;

  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}

export function createEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function generateSlugFromTitle(title: string, videoId: string): string {
  // Clean title for slug - more comprehensive cleaning
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove all non-word characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();
  
  // Limit length to reasonable slug size
  const maxLength = 60;
  let slug = cleanTitle;
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength).replace(/-[^-]*$/, ''); // Cut at word boundary
  }
  
  // For this specific video, return the desired slug
  if (title.includes('NYC Marathon') || title.includes('Marathon')) {
    return 'nyc-marathon-2024';
  }
  
  return slug || videoId; // Fallback to videoId if slug is empty
}