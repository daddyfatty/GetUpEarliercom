import * as cheerio from 'cheerio';

interface AmazonProduct {
  title: string;
  description: string;
  image: string;
  price: string;
  rating: number;
  reviews: number;
  availability: string;
  isPrime: boolean;
  asin: string;
}

// Known product data for the specific ASINs in the blog
const KNOWN_PRODUCTS: Record<string, AmazonProduct> = {
  'B09L6JM2T6': {
    title: 'Premium Soft Flask - Shrink As You Drink Soft Water Bottle for Hydration Pack - Folding Water Bottle',
    description: 'HYDRATION ON THE MOVE: Our collapsible running soft flask is a compact and eco-friendly way to stay hydrated on the move! The soft water bottle is the perfect hydration tool for active individuals.',
    image: 'https://m.media-amazon.com/images/I/71K2KHfg4FL._AC_SL1500_.jpg',
    price: '$14.00',
    rating: 4.2,
    reviews: 2076,
    availability: 'In Stock',
    isPrime: false,
    asin: 'B09L6JM2T6'
  },
  'B018NZJC70': {
    title: 'Nuun Sport Electrolyte Tablets with Magnesium, Calcium, Potassium, Chloride & Sodium, Gluten Free & Non-GMO',
    description: 'HYDRATION MADE FOR YOUR ACTIVE LIFE: Nuun Sport electrolyte tablets offer a perfect sports drink for daily use, including 5 essential electrolytes and 1g of sugar',
    image: 'https://m.media-amazon.com/images/I/81Gdus5Zj4L.__AC_SX300_SY300_QL70_ML2_.jpg',
    price: '$23.42',
    rating: 4.4,
    reviews: 56112,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B018NZJC70'
  },
  'B076PR27Z1': {
    title: 'Huma Plus (Double Electrolytes) - Chia Energy Gel, BlackBerry Banana, 12 Gels - Stomach Friendly, Real Food Energy',
    description: 'PLUS = 2x NATURAL ELECTROLYTES – Sourced from Coconut Water, Sea Salt, and Chia Seeds. Double the electrolytes of original Huma Gel. 240-250mg Sodium, 65mg Potassium. Contains 100% All-Natural, Real-Food Ingredients.',
    image: 'https://m.media-amazon.com/images/I/71ynS-qChqL.__AC_SY300_SX300_QL70_ML2_.jpg',
    price: '$32.95',
    rating: 4.5,
    reviews: 2762,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B076PR27Z1'
  },
  'B07TLP8DKC': {
    title: 'CHIRP Wheel Foam Roller - Targeted Back & Neck Pain Relief, Muscle Massage, Trigger Point Therapy',
    description: 'INNOVATIVE & FUNCTIONAL DESIGN: Experience targeted muscle relief with this high-density foam roller, perfect for deep tissue massage and easing back pain. Chirp Wheel+ is designed with trigger points that target muscles along the spine.',
    image: 'https://m.media-amazon.com/images/I/71q9+Nxk6tL._AC_SY300_SX300_.jpg',
    price: '$49.99',
    rating: 4.4,
    reviews: 21476,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B07TLP8DKC'
  },
  'B0789V9Q39': {
    title: 'Gaiam Yoga Block - Supportive Latex-Free EVA Foam Soft Non-Slip Surface for Yoga, Pilates, Meditation',
    description: 'YOGA ESSENTIAL: This yoga block provides the stability and support needed to maintain poses and increase strength, flexibility, and balance.',
    image: 'https://m.media-amazon.com/images/I/61P9XY6VJXL._AC_SL1200_.jpg',
    price: '$12.98',
    rating: 4.6,
    reviews: 24847,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B0789V9Q39'
  },
  'B07XYYBHFT': {
    title: 'Gaiam Yoga Block - Supportive Latex-Free EVA Foam Soft Non-Slip Surface for Yoga, Pilates, Meditation',
    description: 'YOGA ESSENTIAL: This yoga block provides the stability and support needed to maintain poses and increase strength, flexibility, and balance. Made from supportive latex-free EVA foam.',
    image: 'https://m.media-amazon.com/images/I/71kELlKWHFL._AC_SX300_SY300_.jpg',
    price: '$9.99',
    rating: 4.8,
    reviews: 51576,
    availability: 'In Stock',
    isPrime: false,
    asin: 'B07XYYBHFT'
  },
  'B0848PNH1J': {
    title: 'CHIRP Wheel+ Back Roller - Deep Tissue Trigger Point Massage - 12" Foam Roller for Back Pain Relief',
    description: 'THE ORIGINAL CHIRP WHEEL: The patented spinal canal design puts 4x less pressure on your spine than traditional foam rollers while still providing the same massage and pressure to the surrounding muscles.',
    image: 'https://m.media-amazon.com/images/I/71FhczYCRlL._AC_SL1500_.jpg',
    price: '$59.95',
    rating: 4.4,
    reviews: 23891,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B0848PNH1J'
  },
  'B01M1EXQY4': {
    title: 'NAKED nutrition Pea Protein Isolate from North American Farms - 2lb Bulk',
    description: 'Premium Pea Protein - Clean pea protein with only one ingredient: Yellow Pea Protein sourced from farms in USA and Canada. No artificial sweeteners, flavors, or colors.',
    image: 'https://m.media-amazon.com/images/I/71VmUj7e3wL._AC_SY300_SX300_.jpg',
    price: '$37.99',
    rating: 4.3,
    reviews: 1852,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B01M1EXQY4'
  },
  'B00J074W94': {
    title: 'NAKED WHEY 1LB 100% Grass Fed Unflavored Whey Protein Powder',
    description: '100% GRASS FED WHEY PROTEIN POWDER from dairy cows that graze on pastures in California and Idaho. NO rBGH or rBST, GMO-FREE. Naked Whey is unflavored and contains no artificial or natural sweeteners, colors, or flavors.',
    image: 'https://m.media-amazon.com/images/I/61MwS1wOhmL._AC_SX300_SY300_.jpg',
    price: '$19.99',
    rating: 4.4,
    reviews: 15234,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B00J074W94'
  },
  'B01M4OM1RN': {
    title: 'Vital Proteins Collagen Peptides Powder, Promotes Hair, Nail, Skin, Bone and Joint Health',
    description: 'Collagen Peptides Powder: Sourced from grass-fed, pasture-raised bovine to ensure a high quality and sustainable source of this powerful ingredient. Original Collagen Peptides formula.',
    image: 'https://m.media-amazon.com/images/I/61HEKRHm+gL._AC_SX300_SY300_.jpg',
    price: '$24.99',
    rating: 4.4,
    reviews: 87653,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B01M4OM1RN'
  },
  'B00E9M4XEE': {
    title: 'Optimum Nutrition Micronized Creatine Monohydrate Powder, Unflavored, Keto Friendly',
    description: '5g OF PURE CREATINE MONOHYDRATE PER SERVING – Supports increases in energy, endurance and recovery.',
    image: 'https://m.media-amazon.com/images/I/71sA5KSq86L._AC_SX300_SY300_.jpg',
    price: '$19.99',
    rating: 4.4,
    reviews: 36789,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B00E9M4XEE'
  },
  'B00J074W7W': {
    title: 'NAKED WHEY 5LB 100% Grass Fed Unflavored Whey Protein Powder - US Farms',
    description: '100% GRASS FED WHEY PROTEIN POWDER from dairy cows that graze on pastures in California and Idaho. NO rBGH or rBST, GMO-FREE. Naked Whey is unflavored and contains no artificial or natural sweeteners, colors, or flavors.',
    image: 'https://m.media-amazon.com/images/I/61U9v1XWISL._AC_SX300_SY300_.jpg',
    price: '$94.99',
    rating: 4.4,
    reviews: 15234,
    availability: 'In Stock',
    isPrime: true,
    asin: 'B00J074W7W'
  }
};

// Map of short URLs to ASINs for fallback
const SHORT_URL_TO_ASIN: Record<string, string> = {
  '43BqldK': 'B01M1EXQY4', // Pea Protein Isolate
  '43E9B5r': 'B00J074W94', // Grass Fed Whey 1lb
  '3HdeJGa': 'B00J074W7W', // Grass Fed Whey 5lb
  '4k7y0ay': 'B01M4OM1RN', // Collagen Peptides
  '4kBn1G2': 'B00E9M4XEE'  // Creatine Monohydrate
};

export async function extractAmazonProductData(url: string): Promise<AmazonProduct | null> {
  // First check if this is a short URL we know
  const shortCode = url.match(/amzn\.to\/([A-Za-z0-9]+)/)?.[1];
  if (shortCode && SHORT_URL_TO_ASIN[shortCode]) {
    const knownAsin = SHORT_URL_TO_ASIN[shortCode];
    if (KNOWN_PRODUCTS[knownAsin]) {
      console.log('Using known product data for short URL:', shortCode, '-> ASIN:', knownAsin);
      return KNOWN_PRODUCTS[knownAsin];
    }
  }
  
  // Extract ASIN from URL
  const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  if (!asinMatch) {
    console.log('No ASIN found in URL:', url);
    return null;
  }
  
  const asin = asinMatch[1];
  console.log('Extracted ASIN:', asin);
  
  // Check if we have known data for this ASIN
  if (KNOWN_PRODUCTS[asin]) {
    console.log('Using known product data for ASIN:', asin);
    return KNOWN_PRODUCTS[asin];
  }
  
  // If not in our known products, try to scrape
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });
    
    if (!response.ok) {
      console.log('Failed to fetch product page:', response.status);
      // If we have known data for this ASIN, use it as fallback
      if (KNOWN_PRODUCTS[asin]) {
        console.log('Using known product data as fallback for ASIN:', asin);
        return KNOWN_PRODUCTS[asin];
      }
      return null;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Try to extract basic product info
    const title = $('#productTitle').text().trim() || 
                 $('h1.a-size-large').text().trim() ||
                 $('meta[property="og:title"]').attr('content') || 
                 'Amazon Product';
    
    const description = $('#feature-bullets ul li').first().text().trim() || 
                       $('meta[property="og:description"]').attr('content') || 
                       'Available on Amazon';
    
    const image = $('#landingImage').attr('src') || 
                 $('.a-dynamic-image').first().attr('src') || 
                 $('meta[property="og:image"]').attr('content') || 
                 '';
    
    // Extract price
    const priceWhole = $('.a-price-whole').first().text().trim();
    const priceFraction = $('.a-price-fraction').first().text().trim();
    let price = '$--';
    
    if (priceWhole) {
      // Clean up the price parts to avoid double periods
      const cleanWhole = priceWhole.replace(/[^\d]/g, '');
      const cleanFraction = priceFraction.replace(/[^\d]/g, '');
      price = `$${cleanWhole}${cleanFraction ? '.' + cleanFraction : ''}`;
    } else {
      const priceText = $('.a-price .a-offscreen').first().text().trim();
      if (priceText) {
        price = priceText;
      }
    }
    
    // Extract rating
    const ratingText = $('span.a-icon-alt').first().text();
    const ratingMatch = ratingText.match(/(\d+\.?\d*) out of 5/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 4.5;
    
    // Extract review count
    const reviewText = $('#acrCustomerReviewText').text();
    const reviewMatch = reviewText.match(/(\d+(?:,\d+)*)/);
    const reviews = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : 1000;
    
    // Check for Prime
    const isPrime = $('.a-icon-prime').length > 0;
    
    const product: AmazonProduct = {
      title: title.substring(0, 100),
      description: description.substring(0, 200),
      image: image.startsWith('//') ? 'https:' + image : image,
      price,
      rating,
      reviews,
      availability: 'In Stock',
      isPrime,
      asin
    };
    
    console.log('Scraped product data:', product);
    return product;
    
  } catch (error) {
    console.error('Error scraping Amazon product:', error);
    return null;
  }
}

// Helper function to resolve Amazon short URLs
export async function resolveAmazonUrl(url: string): Promise<string> {
  if (!url.includes('amzn.to/')) {
    return url;
  }
  
  // First check if we have a known mapping for this short URL
  const shortCode = url.match(/amzn\.to\/([A-Za-z0-9]+)/)?.[1];
  if (shortCode && SHORT_URL_TO_ASIN[shortCode]) {
    const knownAsin = SHORT_URL_TO_ASIN[shortCode];
    // Return a proper Amazon URL with the known ASIN
    return `https://www.amazon.com/dp/${knownAsin}`;
  }
  
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow'
    });
    return response.url;
  } catch (error) {
    console.error('Error resolving short URL:', error);
    return url;
  }
}