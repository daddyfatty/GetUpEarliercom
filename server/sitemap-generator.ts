import { recipeService } from './recipeService';
import { workoutService } from './workoutService';
import { db } from './db';
import { blogPosts } from '../shared/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const baseUrl = 'https://www.getupearlier.com';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Static pages with their priorities and change frequencies
const staticPages: SitemapUrl[] = [
  // Core pages
  { loc: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 1.0 },
  { loc: '/about', changefreq: 'monthly', priority: 0.8 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
  
  // Content sections
  { loc: '/blog', changefreq: 'daily', priority: 0.9 },
  { loc: '/recipes', changefreq: 'weekly', priority: 0.8 },
  { loc: '/workouts', changefreq: 'weekly', priority: 0.8 },
  { loc: '/amazon', changefreq: 'weekly', priority: 0.7 },
  
  // Training log
  { loc: '/training-log', changefreq: 'weekly', priority: 0.8 },
  { loc: '/training-log/hartford-marathon-training-log-2025', changefreq: 'weekly', priority: 0.8 },
  
  // Tools
  { loc: '/calorie-calculator', changefreq: 'monthly', priority: 0.8 },
  { loc: '/alcohol-calculator', changefreq: 'monthly', priority: 0.8 },
  
  // User features (lower priority)
  { loc: '/profile', changefreq: 'monthly', priority: 0.6 },
  { loc: '/favorites', changefreq: 'monthly', priority: 0.6 },
  { loc: '/saved-results', changefreq: 'monthly', priority: 0.6 },
  { loc: '/subscribe', changefreq: 'monthly', priority: 0.7 },
  { loc: '/checkout', changefreq: 'monthly', priority: 0.7 }
];

// Blog categories with their priorities
const blogCategories = [
  'running', 'nutrition', 'training', 'marathon-training', 'marathon-training-log',
  'inspiration', 'health', 'fitness', 'strength-training', 'yoga', 'ai',
  '5k', '10k', 'half-marathon', 'marathon', 'mobility', 'lower-back-pain',
  'granola', 'recipes', 'strava', 'tips'
];

function createSitemapUrl(urlData: SitemapUrl): string {
  const { loc, lastmod, changefreq, priority } = urlData;
  const fullUrl = loc.startsWith('http') ? loc : `${baseUrl}${loc}`;
  
  let xml = `  <url>\n    <loc>${fullUrl}</loc>\n`;
  
  if (lastmod) {
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
  }
  
  if (changefreq) {
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
  }
  
  if (priority !== undefined) {
    xml += `    <priority>${priority.toFixed(1)}</priority>\n`;
  }
  
  xml += `  </url>\n`;
  return xml;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export async function generateSitemap(): Promise<string> {
  console.log('Generating dynamic sitemap...');
  
  let urls: SitemapUrl[] = [...staticPages];
  
  try {
    // Add blog categories
    blogCategories.forEach(category => {
      urls.push({
        loc: `/category/${category}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString().split('T')[0]
      });
    });
    
    // Fetch and add blog posts directly from database
    console.log('Fetching blog posts for sitemap...');
    const blogPostsData = await db.select().from(blogPosts);
    blogPostsData.forEach((post: any) => {
      const slug = post.slug || slugify(post.title);
      urls.push({
        loc: `/blog/${slug}`,
        lastmod: post.publishedDate ? new Date(post.publishedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7
      });
    });
    console.log(`Added ${blogPostsData.length} blog posts to sitemap`);
    
    // Fetch and add recipes
    console.log('Fetching recipes for sitemap...');
    const recipes = await recipeService.getAllRecipes();
    recipes.forEach((recipe: any) => {
      const slug = recipe.slug || slugify(recipe.title);
      urls.push({
        loc: `/recipes/${slug}`,
        lastmod: recipe.createdAt ? new Date(recipe.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6
      });
    });
    console.log(`Added ${recipes.length} recipes to sitemap`);
    
    // Fetch and add workouts
    console.log('Fetching workouts for sitemap...');
    const workouts = await workoutService.getAllWorkouts();
    workouts.forEach((workout: any) => {
      const slug = workout.slug || slugify(workout.title);
      urls.push({
        loc: `/workouts/${slug}`,
        lastmod: workout.createdAt ? new Date(workout.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6
      });
    });
    console.log(`Added ${workouts.length} workouts to sitemap`);
    
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
    // Continue with static pages if dynamic content fails
  }
  
  // Sort URLs by priority (highest first) then by URL
  urls.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (b.priority || 0) - (a.priority || 0);
    }
    return a.loc.localeCompare(b.loc);
  });
  
  // Generate XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

`;
  
  urls.forEach(url => {
    sitemap += createSitemapUrl(url);
  });
  
  sitemap += '</urlset>';
  
  console.log(`Generated sitemap with ${urls.length} URLs`);
  return sitemap;
}

export async function saveSitemapToDisk(): Promise<void> {
  try {
    const sitemapContent = await generateSitemap();
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    // Ensure public directory exists
    const publicDir = path.dirname(sitemapPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    console.log(`Sitemap saved to ${sitemapPath}`);
  } catch (error) {
    console.error('Error saving sitemap to disk:', error);
    throw error;
  }
}

// CLI interface for manual generation (ES module compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if this is the main module being executed
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  console.log('Generating sitemap...');
  saveSitemapToDisk()
    .then(() => {
      console.log('Sitemap generation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Sitemap generation failed:', error);
      process.exit(1);
    });
}