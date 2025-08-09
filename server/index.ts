import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveSitemapToDisk } from "./sitemap-generator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Domain redirect now handled by GoDaddy DNS forwarding

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve attached assets statically
app.use('/attached_assets', express.static('attached_assets'));

// Serve public assets statically  
app.use('/assets', express.static('public/assets'));

// Serve root-level public files (like featured images)
app.use(express.static('public'));

// Middleware to inject meta tags for homepage (only for social media crawlers)
app.get('/', (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Check if this is a social media crawler/bot
  const isCrawler = /bot|crawler|spider|scraper|facebook|twitter|linkedin|whatsapp|telegram|discord|slack/i.test(userAgent);
  
  if (isCrawler) {
    const title = "Get Up Earlier - Personal Training & Nutrition Coaching";
    const description = "1-on-1 Strength Training, Nutrition, Running, Yoga & Accountability Coaching Orange, CT or Virtual Anywhere";
    const image = `${req.protocol}://${req.get('host')}/get-up-earlier-og-image.jpg`;
    const url = `${req.protocol}://${req.get('host')}/`;
    
    // Read the default HTML and inject meta tags
    let htmlPath;
    if (app.get("env") === "development") {
      htmlPath = path.join(__dirname, '../client/index.html');
    } else {
      htmlPath = path.join(__dirname, '../dist/public/index.html');
    }
    
    if (fs.existsSync(htmlPath)) {
      let html = fs.readFileSync(htmlPath, 'utf8');
      
      // Inject meta tags into the head
      const metaTags = `
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta name="keywords" content="personal training, nutrition coaching, marathon training, clean eating recipes, workout library, fitness coaching, accountability coaching, health transformation">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${image}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:url" content="${url}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Get Up Earlier">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${image}">
      `;
      
      html = html.replace('<title>Get Up Earlier - Health & Fitness App</title>', metaTags);
      res.send(html);
      return;
    }
  }
  
  next();
});

// Middleware to inject meta tags for alcohol calculator page (only for social media crawlers)
app.get('/alcohol-calculator', (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Check if this is a social media crawler/bot
  const isCrawler = /bot|crawler|spider|scraper|facebook|twitter|linkedin|whatsapp|telegram|discord|slack/i.test(userAgent);
  
  if (isCrawler) {
    const title = "Buzzkill | Beer and Wine Weight Gain Calculator | Get Up Earlier";
    const description = "Calculate how daily beer and wine consumption affects your weight gain. Interactive alcohol calorie calculator shows the impact of habitual drinking on your fitness goals.";
    const image = `${req.protocol}://${req.get('host')}/buzzkill-calculator-og-image.png?v=${Date.now()}`;
    const url = `${req.protocol}://${req.get('host')}/alcohol-calculator`;
    
    // Read the default HTML and inject meta tags
    let htmlPath;
    if (app.get("env") === "development") {
      htmlPath = path.join(__dirname, '../client/index.html');
    } else {
      htmlPath = path.join(__dirname, '../dist/public/index.html');
    }
    
    if (fs.existsSync(htmlPath)) {
      let html = fs.readFileSync(htmlPath, 'utf8');
      
      // Inject meta tags into the head
      const metaTags = `
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta name="keywords" content="alcohol calculator, beer calories, wine calories, weight gain calculator, alcohol weight gain, fitness calculator, drinking habits, calorie tracking">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${image}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:url" content="${url}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Get Up Earlier Strength & Nutrition Coaching">
        <meta property="fb:app_id" content="1234567890123456">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${image}">
      `;
      
      html = html.replace('<title>Get Up Earlier - Health & Fitness App</title>', metaTags);
      res.send(html);
      return;
    }
  }
  
  next();
});

// Middleware to inject meta tags for calorie calculator page (only for social media crawlers)
app.get('/calorie-calculator-clean', (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Check if this is a social media crawler/bot
  const isCrawler = /bot|crawler|spider|scraper|facebook|twitter|linkedin|whatsapp|telegram|discord|slack/i.test(userAgent);
  
  if (isCrawler) {
    const title = "Daily Calorie Calculator & Macro Tracker | Get Up Earlier";
    const description = "Calculate your daily calorie needs, BMR, TDEE, and macronutrient breakdown. Professional calorie calculator with personalized recommendations based on your fitness goals.";
    const image = `${req.protocol}://${req.get('host')}/calorie-calculator-og-image.png`;
    const url = `${req.protocol}://${req.get('host')}/calorie-calculator-clean`;
    
    // Read the default HTML and inject meta tags
    let htmlPath;
    if (app.get("env") === "development") {
      htmlPath = path.join(__dirname, '../client/index.html');
    } else {
      htmlPath = path.join(__dirname, '../dist/public/index.html');
    }
    
    if (fs.existsSync(htmlPath)) {
      let html = fs.readFileSync(htmlPath, 'utf8');
      
      // Inject meta tags into the head
      const metaTags = `
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta name="keywords" content="calorie calculator, BMR calculator, TDEE, macros, nutrition calculator, fitness goals, weight loss, muscle gain">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${image}">
        <meta property="og:url" content="${url}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Get Up Earlier Strength & Nutrition Coaching">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${image}">
      `;
      
      html = html.replace('<title>Get Up Earlier - Health & Fitness App</title>', metaTags);
      res.send(html);
      return;
    }
  }
  
  next();
});

// Import database for blog post fetching
import pool from './db';

// Middleware to inject meta tags for blog posts (only for social media crawlers)
app.get('/blog/:slug', async (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Check if this is a social media crawler/bot
  const isCrawler = /bot|crawler|spider|scraper|facebook|twitter|linkedin|whatsapp|telegram|discord|slack/i.test(userAgent);
  
  if (isCrawler) {
    const { slug } = req.params;
    
    try {
      // Fetch blog post data from database
      const result = await pool.query(
        'SELECT title, description, image_url, content FROM blog_posts WHERE slug = $1',
        [slug]
      );
      
      if (result.rows.length > 0) {
        const post = result.rows[0];
        
        // Clean title and add site name
        const title = `${post.title} | Get Up Earlier Strength & Nutrition`;
        
        // Use description or truncated content
        let description = post.description || '';
        if (!description && post.content) {
          // Remove markdown syntax and truncate content for description
          description = post.content
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
            .replace(/[#*_`]/g, '') // Remove markdown formatting
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .substring(0, 160)
            .trim();
          if (description.length === 160) description += '...';
        }
        
        // Use featured image with full URL
        const imageUrl = post.image_url || '/get-up-earlier-og-image.jpg';
        const image = imageUrl.startsWith('http') 
          ? imageUrl 
          : `${req.protocol}://${req.get('host')}${imageUrl}`;
        
        const url = `${req.protocol}://${req.get('host')}/blog/${slug}`;
        
        // Read the default HTML and inject meta tags
        let htmlPath;
        if (app.get("env") === "development") {
          htmlPath = path.join(__dirname, '../client/index.html');
        } else {
          htmlPath = path.join(__dirname, '../dist/public/index.html');
        }
        
        if (fs.existsSync(htmlPath)) {
          let html = fs.readFileSync(htmlPath, 'utf8');
          
          // Inject meta tags into the head
          const metaTags = `
            <title>${title}</title>
            <meta name="description" content="${description}">
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${description}">
            <meta property="og:image" content="${image}">
            <meta property="og:image:width" content="1200">
            <meta property="og:image:height" content="630">
            <meta property="og:url" content="${url}">
            <meta property="og:type" content="article">
            <meta property="og:site_name" content="Get Up Earlier Strength & Nutrition">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="${title}">
            <meta name="twitter:description" content="${description}">
            <meta name="twitter:image" content="${image}">
          `;
          
          html = html.replace('<title>Get Up Earlier - Health & Fitness App</title>', metaTags);
          res.send(html);
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching blog post for meta tags:', error);
    }
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Facebook group sync temporarily disabled
  console.log('Facebook group sync temporarily disabled - requires RSS feed URL or API credentials');

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Express error handler:', err);
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    
    // Generate sitemap on server startup (for deployments)
    try {
      console.log('Generating sitemap on server startup...');
      await saveSitemapToDisk();
      console.log('Sitemap generated successfully on startup');
    } catch (error) {
      console.error('Failed to generate sitemap on startup:', error);
      console.error('Error details:', error);
      // Don't crash the server if sitemap generation fails - continue running
    }
  });
})();
