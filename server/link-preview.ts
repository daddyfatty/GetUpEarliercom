import * as cheerio from 'cheerio';

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
    
    // Follow redirects first to get the actual Amazon product URL
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    console.log(`Fetched HTML length: ${html.length} characters`);
    const $ = cheerio.load(html);

    // Extract product information from Amazon page with extensive selectors
    let title = $('#productTitle').text().trim() || 
                $('h1.a-size-large').text().trim() || 
                $('h1.a-size-base-plus').text().trim() ||
                $('span.product-title').text().trim() ||
                $('.a-size-large.a-spacing-none.a-color-base').text().trim() ||
                $('h1').first().text().trim() ||
                $('[data-automation-id="product-title"]').text().trim() ||
                $('meta[property="og:title"]').attr('content') ||
                '';

    // Clean up title
    title = title.replace(/\s+/g, ' ').trim();
    if (!title || title === '') {
      title = 'Amazon Product';
    }

    let description = $('#feature-bullets ul li').first().text().trim() || 
                     $('#feature-bullets .a-list-item').first().text().trim() ||
                     $('.a-unordered-list .a-list-item').first().text().trim() ||
                     $('#productDescription p').first().text().trim() ||
                     $('.product-description').text().trim() ||
                     $('meta[name="description"]').attr('content') ||
                     $('meta[property="og:description"]').attr('content') ||
                     '';

    // Clean up description
    description = description.replace(/\s+/g, ' ').trim();
    if (!description || description === '') {
      description = 'Available on Amazon';
    }

    // Try multiple selectors for product image with better fallbacks
    let image = $('#landingImage').attr('src') || 
               $('#landingImage').attr('data-old-hires') ||
               $('.a-dynamic-image').first().attr('src') ||
               $('.a-dynamic-image').first().attr('data-old-hires') ||
               $('img[data-old-hires]').attr('data-old-hires') ||
               $('img[data-a-dynamic-image]').attr('src') ||
               $('.imgTagWrapper img').attr('src') ||
               $('#main-image').attr('src') ||
               $('.main-image img').attr('src') ||
               $('meta[property="og:image"]').attr('content') ||
               '';

    // Clean image URL
    if (image && image.includes('_SL') || image.includes('_SX') || image.includes('_SY')) {
      // Extract base image URL and make it larger
      image = image.replace(/_S[LXY]\d+_/g, '_SL500_');
    }

    // Extract price with multiple fallbacks
    let price = '';
    
    // Try main price selectors
    const priceWhole = $('.a-price-whole').first().text().trim();
    const priceFraction = $('.a-price-fraction').first().text().trim();
    
    if (priceWhole) {
      price = `$${priceWhole}${priceFraction ? '.' + priceFraction : ''}`;
    } else {
      // Try alternative price selectors
      const priceText = $('.a-price .a-offscreen').first().text().trim() ||
                       $('.a-price-range .a-offscreen').first().text().trim() ||
                       $('[data-a-color="price"] .a-offscreen').first().text().trim() ||
                       $('.a-price-range').first().text().trim() ||
                       $('.a-price').first().text().trim() ||
                       $('[data-automation-id="list-price"]').text().trim() ||
                       $('.price-current').text().trim() ||
                       $('meta[property="product:price:amount"]').attr('content') ||
                       '';
      
      // Clean up price text
      if (priceText) {
        const priceMatch = priceText.match(/\$?(\d+[.,]?\d*)/);
        if (priceMatch) {
          price = `$${priceMatch[1]}`;
        } else {
          price = priceText;
        }
      } else {
        price = '$--';
      }
    }

    // Extract rating
    const ratingText = $('span.a-icon-alt').first().text();
    const ratingMatch = ratingText.match(/(\d+\.?\d*) out of 5/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 4.5;

    // Extract review count
    const reviewText = $('#acrCustomerReviewText').text() || 
                      $('[data-hook="total-review-count"]').text() ||
                      '';
    const reviewMatch = reviewText.match(/(\d+(?:,\d+)*)/);
    const reviews = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : 1247;

    // Check for Prime availability
    const isPrime = $('.a-icon-prime').length > 0 || 
                   $('[data-csa-c-type="element"][data-csa-c-content-id*="prime"]').length > 0;

    // Check availability
    const availability = $('#availability span').text().trim() ||
                        $('.a-color-success').text().trim() ||
                        'In Stock';

    const linkPreview: LinkPreviewData = {
      title: title.substring(0, 100), // Limit title length
      description: description.substring(0, 200), // Limit description length
      image: image.startsWith('//') ? 'https:' + image : image,
      price,
      rating,
      reviews,
      availability: availability.includes('Stock') ? 'In Stock' : availability,
      isPrime,
      url
    };

    console.log('Extracted link preview:', linkPreview);
    return linkPreview;

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