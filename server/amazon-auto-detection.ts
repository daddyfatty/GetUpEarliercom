import { getCachedLinkPreview } from './link-preview';
import { db } from './db';
import { amazonProducts } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface AmazonLink {
  url: string;
  context: string;
  position: number;
}

export function detectAmazonLinks(content: string): AmazonLink[] {
  // Regex to find Amazon links (both amzn.to and amazon.com)
  const amazonRegex = /(https?:\/\/)?(amzn\.to\/[a-zA-Z0-9]+|amazon\.com\/[^\s\)]+)/gi;
  const links: AmazonLink[] = [];
  let match;

  while ((match = amazonRegex.exec(content)) !== null) {
    const url = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
    const position = match.index;
    
    // Get context around the link (50 characters before and after)
    const start = Math.max(0, position - 50);
    const end = Math.min(content.length, position + match[0].length + 50);
    const context = content.substring(start, end);
    
    links.push({
      url,
      context: context.trim(),
      position
    });
  }

  return links;
}

export async function processAmazonLinksInContent(content: string): Promise<string> {
  const amazonLinks = detectAmazonLinks(content);
  let processedContent = content;

  for (const link of amazonLinks) {
    try {
      // Get product data
      const linkPreview = await getCachedLinkPreview(link.url);
      
      if (linkPreview && linkPreview.title !== 'Amazon Product') {
        // Add to Amazon products page if not already there
        await addToAmazonPage(link.url, linkPreview);
        
        // Replace plain link with a marker for frontend to process
        const amazonMarker = `[AMAZON_PRODUCT:${link.url}:${linkPreview.title}]`;
        
        // Replace the plain link with marker
        processedContent = processedContent.replace(link.url, amazonMarker);
      }
    } catch (error) {
      console.error('Error processing Amazon link:', link.url, error);
    }
  }

  return processedContent;
}

async function addToAmazonPage(url: string, linkPreview: any): Promise<void> {
  try {
    // Extract ASIN from URL
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (!asinMatch) return;
    
    const asin = asinMatch[1];
    
    // Check if product already exists
    const existingProduct = await db.select().from(amazonProducts).where(eq(amazonProducts.asin, asin)).limit(1);
    
    if (existingProduct.length === 0) {
      // Add new product to Amazon page
      await db.insert(amazonProducts).values({
        asin,
        title: linkPreview.title,
        description: linkPreview.description,
        price: linkPreview.price,
        rating: linkPreview.rating,
        reviews: linkPreview.reviews,
        image: linkPreview.image,
        url: url,
        category: 'Auto-detected',
        tags: JSON.stringify(['auto-detected', 'blog-mention']),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`Added Amazon product ${asin} to products page from blog content`);
    }
  } catch (error) {
    console.error('Error adding product to Amazon page:', error);
  }
}

export async function processBlogPostAmazonLinks(blogId: string, content: string): Promise<string> {
  console.log(`Processing Amazon links for blog post: ${blogId}`);
  const processedContent = await processAmazonLinksInContent(content);
  return processedContent;
}