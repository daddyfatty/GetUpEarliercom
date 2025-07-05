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
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract product information from Amazon page
    const title = $('#productTitle').text().trim() || 
                  $('h1.a-size-large').text().trim() || 
                  $('h1').first().text().trim() ||
                  'Amazon Product';

    const description = $('#feature-bullets ul li').first().text().trim() || 
                       $('.a-unordered-list .a-list-item').first().text().trim() ||
                       $('meta[name="description"]').attr('content') ||
                       'Available on Amazon';

    // Try multiple selectors for product image
    const image = $('#landingImage').attr('src') || 
                  $('.a-dynamic-image').first().attr('src') ||
                  $('img[data-old-hires]').attr('data-old-hires') ||
                  $('img[data-a-dynamic-image]').attr('src') ||
                  $('.imgTagWrapper img').attr('src') ||
                  '';

    // Extract price
    const priceWhole = $('.a-price-whole').first().text().trim();
    const priceFraction = $('.a-price-fraction').first().text().trim();
    let price = '';
    
    if (priceWhole) {
      price = `$${priceWhole}${priceFraction ? '.' + priceFraction : ''}`;
    } else {
      // Fallback price selectors
      const priceText = $('.a-price .a-offscreen').first().text().trim() ||
                       $('.a-price-range').first().text().trim() ||
                       $('.a-price').first().text().trim();
      price = priceText || '$--';
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
const linkPreviewCache = new Map<string, LinkPreviewData>();

export async function getCachedLinkPreview(url: string): Promise<LinkPreviewData | null> {
  if (linkPreviewCache.has(url)) {
    return linkPreviewCache.get(url)!;
  }

  const preview = await fetchAmazonLinkPreview(url);
  if (preview) {
    linkPreviewCache.set(url, preview);
  }

  return preview;
}