import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product images to download with proper headers
const PRODUCTS_TO_DOWNLOAD = [
  {
    asin: 'B00J074W94',
    url: 'https://m.media-amazon.com/images/I/61MwS1wOhmL._AC_SX300_SY300_.jpg',
    filename: 'amazon_B00J074W94_nakedwhey1lb.jpg'
  },
  {
    asin: 'B01M1EXQY4', 
    url: 'https://m.media-amazon.com/images/I/61MwS1wOhmL._AC_SX679_.jpg',
    filename: 'amazon_B01M1EXQY4_peaprotein.jpg'
  },
  {
    asin: 'B00J074W7W',
    url: 'https://m.media-amazon.com/images/I/61U9v1XWISL._AC_SX300_SY300_.jpg',
    filename: 'amazon_B00J074W7W_nakedwhey5lb.jpg'
  },
  {
    asin: 'B01M4OM1RN',
    url: 'https://m.media-amazon.com/images/I/61HEKRHm+gL._AC_SX300_SY300_.jpg',
    filename: 'amazon_B01M4OM1RN_collagen.jpg'
  },
  {
    asin: 'B00E9M4XEE',
    url: 'https://m.media-amazon.com/images/I/71sA5KSq86L._AC_SX300_SY300_.jpg',
    filename: 'amazon_B00E9M4XEE_creatine.jpg'
  }
];

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.amazon.com/',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-site'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, dest).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    
    request.on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file on error
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

export async function downloadAmazonImages() {
  const assetsDir = path.join(process.cwd(), 'attached_assets');
  
  for (const product of PRODUCTS_TO_DOWNLOAD) {
    const filepath = path.join(assetsDir, product.filename);
    
    if (fs.existsSync(filepath)) {
      console.log(`Image already exists: ${product.filename}`);
      continue;
    }
    
    try {
      console.log(`Downloading ${product.asin}...`);
      await downloadFile(product.url, filepath);
      console.log(`Successfully downloaded: ${product.filename}`);
    } catch (error) {
      console.error(`Failed to download ${product.asin}:`, error);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${__filename}`) {
  downloadAmazonImages().then(() => {
    console.log('Download process completed');
  }).catch(console.error);
}