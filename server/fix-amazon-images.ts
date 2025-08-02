// Temporary script to download and store Amazon product images locally
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Known product images that need to be downloaded
const PRODUCT_IMAGES = {
  'B00J074W94': 'https://m.media-amazon.com/images/I/61MwS1wOhmL._AC_SX300_SY300_.jpg', // Naked Whey 1lb
  'B01M1EXQY4': 'https://m.media-amazon.com/images/I/61MwS1wOhmL._AC_SX679_.jpg', // Pea Protein
  'B00J074W7W': 'https://m.media-amazon.com/images/I/61U9v1XWISL._AC_SX300_SY300_.jpg', // Naked Whey 5lb
  'B01M4OM1RN': 'https://m.media-amazon.com/images/I/61HEKRHm+gL._AC_SX300_SY300_.jpg', // Collagen
  'B00E9M4XEE': 'https://m.media-amazon.com/images/I/71sA5KSq86L._AC_SX300_SY300_.jpg', // Creatine
};

// Local image mapping - these will be the new local paths
export const LOCAL_IMAGE_MAP: Record<string, string> = {
  'B00J074W94': '/attached_assets/amazon_B00J074W94_nakedwhey1lb.jpg',
  'B01M1EXQY4': '/attached_assets/amazon_B01M1EXQY4_peaprotein.jpg',
  'B00J074W7W': '/attached_assets/amazon_B00J074W7W_nakedwhey5lb.jpg',
  'B01M4OM1RN': '/attached_assets/amazon_B01M4OM1RN_collagen.jpg',
  'B00E9M4XEE': '/attached_assets/amazon_B00E9M4XEE_creatine.jpg',
};

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

export async function fixAmazonImages() {
  const assetsDir = path.join(process.cwd(), 'attached_assets');
  
  for (const [asin, imageUrl] of Object.entries(PRODUCT_IMAGES)) {
    const filename = LOCAL_IMAGE_MAP[asin].split('/').pop()!;
    const filepath = path.join(assetsDir, filename);
    
    // Check if image already exists
    if (fs.existsSync(filepath)) {
      console.log(`Image already exists for ${asin}: ${filename}`);
      continue;
    }
    
    try {
      console.log(`Downloading image for ${asin}...`);
      await downloadImage(imageUrl, filepath);
      console.log(`Successfully downloaded: ${filename}`);
    } catch (error) {
      console.error(`Failed to download image for ${asin}:`, error);
    }
  }
}

// Run this if called directly
if (import.meta.url === `file://${__filename}`) {
  fixAmazonImages().then(() => {
    console.log('Done fixing Amazon images');
  }).catch(console.error);
}