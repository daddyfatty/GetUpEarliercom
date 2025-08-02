import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function downloadAndSaveImage(imageUrl: string, asin: string): Promise<string | null> {
  try {
    // If it's already a local file, just return it
    if (imageUrl.startsWith('/attached_assets/')) {
      return imageUrl;
    }
    
    // Create a filename based on ASIN
    const fileName = `amazon_${asin}_${Date.now()}.jpg`;
    const filePath = path.join(process.cwd(), 'attached_assets', fileName);
    
    // Download the image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.amazon.com/',
      }
    });

    if (!response.ok) {
      console.error('Failed to download image:', response.status);
      return null;
    }

    // Get the image data
    const buffer = await response.arrayBuffer();
    
    // Save to file
    fs.writeFileSync(filePath, Buffer.from(buffer));
    
    // Return the local URL
    return `/attached_assets/${fileName}`;
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
}

// Check if a local image already exists for an ASIN
export function getLocalImageForAsin(asin: string): string | null {
  try {
    const assetsDir = path.join(process.cwd(), 'attached_assets');
    const files = fs.readdirSync(assetsDir);
    
    // Look for existing image with this ASIN
    const existingFile = files.find(file => file.includes(`amazon_${asin}_`));
    
    if (existingFile) {
      return `/attached_assets/${existingFile}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking for local image:', error);
    return null;
  }
}