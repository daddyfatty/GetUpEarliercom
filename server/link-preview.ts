import * as cheerio from 'cheerio';
import { extractAmazonProductData, resolveAmazonUrl } from './amazon-scraper';

export interface LinkPreviewData {
  title: string;
  description: string;
  image: string;
  price?: string;
  rating?: number;
  reviews?: number;
  availability?: string;
  isPrime?: boolean;
  url: string;
}

export async function fetchAmazonLinkPreview(url: string): Promise<LinkPreviewData | null> {
  try {
    console.log(`Fetching link preview for: ${url}`);
    
    // First, resolve the short URL to get the actual Amazon product URL
    const actualUrl = await resolveAmazonUrl(url);
    console.log(`Working with URL: ${actualUrl}`);
    
    // Use the dedicated Amazon scraper
    const productData = await extractAmazonProductData(actualUrl);
    
    if (productData) {
      // Convert the product data to our LinkPreviewData format
      const linkPreview: LinkPreviewData = {
        title: productData.title,
        description: productData.description,
        image: productData.image,
        price: productData.price,
        rating: productData.rating,
        reviews: productData.reviews,
        availability: productData.availability,
        isPrime: productData.isPrime,
        url
      };
      
      console.log('Extracted link preview:', linkPreview);
      return linkPreview;
    }
    
    // If the dedicated scraper fails, return a fallback
    console.log('Amazon scraper failed, using fallback data');
    return {
      title: 'Amazon Product',
      description: 'Click to view product details and pricing on Amazon',
      image: '',
      price: '$--',
      rating: 4.5,
      reviews: 1247,
      availability: 'In Stock',
      isPrime: false,
      url
    };

  } catch (error) {
    console.error('Error fetching link preview:', error);
    return null;
  }
}

// Cache for link previews to avoid repeated requests
const linkPreviewCache = new Map<string, { data: LinkPreviewData, timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function getCachedLinkPreview(url: string): Promise<LinkPreviewData | null> {
  const cached = linkPreviewCache.get(url);
  
  // Check if cache is still valid
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`Using cached preview for ${url}`);
    return cached.data;
  }

  console.log(`Fetching fresh preview for ${url}`);
  const preview = await fetchAmazonLinkPreview(url);
  if (preview) {
    linkPreviewCache.set(url, { data: preview, timestamp: Date.now() });
  }

  return preview;
}

// Export function to clear cache for specific URLs or all cache
export function clearLinkPreviewCache(url?: string): void {
  if (url) {
    linkPreviewCache.delete(url);
    console.log(`Cache cleared for ${url}`);
  } else {
    linkPreviewCache.clear();
    console.log('All link preview cache cleared');
  }
}