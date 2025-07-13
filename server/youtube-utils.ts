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
        
        // If we still don't have a description, try one more fallback method
        if (!description || description.includes('Enjoy the videos and music')) {
          console.log('Trying final fallback method for description...');
          
          // Final fallback: try to extract from JSON-LD structured data
          const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/);
          if (jsonLdMatch) {
            try {
              const jsonLd = JSON.parse(jsonLdMatch[1]);
              if (jsonLd.description) {
                description = jsonLd.description;
                console.log('Found description from JSON-LD');
              }
            } catch (e) {
              console.log('JSON-LD parsing failed');
            }
          }
          
          // If still no description, create a meaningful fallback based on the title
          if (!description) {
            description = `This video discusses: ${enhancedTitle}. For the full content and details, please watch the video above.`;
            console.log('Using title-based fallback description');
          }
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

export function formatYouTubeDescription(description: string, videoId: string): string {
  // First, preserve line breaks and clean up escaped characters
  let formatted = description
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
  
  // Process Amazon links FIRST before general URL processing
  // Pattern to match Amazon affiliate links and product URLs
  const amazonLinkPattern = /(https?:\/\/(?:www\.)?(?:amazon\.com|amzn\.to)[^\s]+)/g;
  
  // Extract Amazon links and their surrounding context for better titles
  formatted = formatted.replace(amazonLinkPattern, (match, url) => {
    // Try to extract a meaningful title from the text around the link
    const lines = formatted.split('\n');
    let title = 'Amazon Product';
    
    // Look for product name in the line containing the link
    for (const line of lines) {
      if (line.includes(url)) {
        // Extract product name - look for patterns like "Product Name: (price)" or "Product Name ($price)"
        const productMatch = line.match(/([^:]+?)(?:\s*:\s*\([^)]+\)|\s*\([^)]+\))?$/);
        if (productMatch && productMatch[1] && !productMatch[1].includes('http')) {
          title = productMatch[1].trim();
          break;
        }
        // Alternative: look for product name before the link
        const beforeLink = line.substring(0, line.indexOf(url)).trim();
        if (beforeLink && beforeLink.length > 5 && !beforeLink.includes('http')) {
          title = beforeLink.replace(/[:\-\(\)]/g, '').trim();
          break;
        }
      }
    }
    
    // Create special Amazon link span for the BlogContentRenderer
    return `<span class="amazon-link" data-url="${url}">${title}</span>`;
  });
  
  // Convert other URLs to clickable links (excluding Amazon links which are already processed)
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+)/g, 
    (match, url) => {
      // Skip if this is already an Amazon link span
      if (formatted.includes(`data-url="${url}"`)) {
        return match;
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    }
  );
  
  // Convert hashtags to styled spans
  formatted = formatted.replace(
    /#([a-zA-Z0-9_]+)/g, 
    '<span style="color: #1d9bf0;">#$1</span>'
  );
  
  // Convert timestamps to clickable YouTube links
  formatted = formatted.replace(
    /(\d{2}:\d{2}:\d{2})/g, 
    (match, timestamp) => {
      // Convert timestamp to seconds
      const parts = timestamp.split(':');
      const totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${totalSeconds}s`;
      return `<a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" style="color: #ff0000; font-weight: bold;">${timestamp}</a>`;
    }
  );
  
  // Convert line breaks to HTML breaks for proper rendering
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}

export function generateSlugFromTitle(title: string, videoId: string): string {
  // Clean title for slug - more comprehensive cleaning
  const cleanTitle = title
    .toLowerCase()
    // Remove special characters and punctuation, keep only alphanumeric and spaces
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    .trim();
  
  // Limit length to reasonable slug size for SEO
  const maxLength = 60;
  let slug = cleanTitle;
  if (slug.length > maxLength) {
    // Cut at word boundary to avoid breaking words
    slug = slug.substring(0, maxLength).replace(/-[^-]*$/, '');
  }
  
  // Ensure the slug is not empty
  if (!slug || slug.length < 3) {
    // Create a fallback slug from the first few words of the title
    const words = title.toLowerCase().split(' ').filter(word => word.length > 2);
    slug = words.slice(0, 5).join('-').replace(/[^a-z0-9-]/g, '');
  }
  
  // If still empty, use videoId as fallback
  return slug || videoId;
}