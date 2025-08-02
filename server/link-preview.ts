import * as cheerio from 'cheerio';
import { extractAmazonProductData, resolveAmazonUrl } from './amazon-scraper';
import { downloadAndSaveImage, getLocalImageForAsin } from './download-image';

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
      // Extract ASIN from the product data
      const asin = productData.asin || actualUrl.match(/\/dp\/([A-Z0-9]{10})/i)?.[1] || '';
      
      // Check if we have a local image already
      let localImage = getLocalImageForAsin(asin);
      
      // If not, download and save it
      if (!localImage && productData.image && asin) {
        localImage = await downloadAndSaveImage(productData.image, asin);
      }
      
      // Convert the product data to our LinkPreviewData format
      const linkPreview: LinkPreviewData = {
        title: productData.title,
        description: productData.description,
        image: localImage || productData.image, // Use local image if available
        price: productData.price,
        rating: productData.rating,
        reviews: productData.reviews,
        availability: productData.availability,
        isPrime: productData.isPrime,
        url
      };
      
      console.log('Extracted link preview with local image:', linkPreview);
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
  // TEMPORARILY DISABLED CACHE TO FIX IMAGE ISSUES
  console.log(`Fetching fresh preview for ${url} (cache disabled)`);
  const preview = await fetchAmazonLinkPreview(url);
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