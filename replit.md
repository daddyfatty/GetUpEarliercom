# replit.md

## Overview
"Get Up Earlier" is a web application designed for personal training, nutrition, and accountability coaching. It aims to help users transition to healthier lifestyles through clean eating recipes, workout libraries, and coaching services, ultimately improving strength and healthy habits.

## User Preferences
Preferred communication style: Simple, everyday language.
Content creation: Use only user's authentic words - never write additional content unless specifically asked.
YouTube Blog System: Always extract authentic YouTube video data (title, description, thumbnail) with links intact. Never use placeholder or synthetic content. New blog posts automatically appear at top of blog page and homepage (sorted by publishedDate descending).
Blog Authorship: All blogs and videos are by Michael Baker (not "Get Up Earlier") and all author mentions should link to his profile about page.
Routing: All Michael Baker references and /team/michael routes redirect to /about page. Recipe templates link author name to /about.
Design Preference: When user requests "Dark Gradient" styling, use the hero-gradient class which creates the stunning multi-layered gradient effect with dark navy/blue base, purple/magenta bands, royal blues, and bright orange horizon with breathing animation - this is the preferred gradient for all headers and special sections.
Service Buttons: Hero section coaching service buttons display 35x35 authentic featured images from each service page rather than generic icons. This creates visual connection between homepage and service pages with real photos (gym equipment, nutrition coaching, hiking, running, yoga).
Blog and Training Log Auto-Bump Workflow: 
- ALWAYS ensure new blog posts automatically appear at the top by setting published_date to current date
- ALWAYS ensure the Hartford Marathon Training Log 2025 blog post is the top post whenever it's mentioned or updated. Set published_date to current date in the database to bump it to the top. This happens frequently and should be automatic.
- ALWAYS ensure new training log entries are added to the TOP of the existing entries array (not appended to the bottom)
- When creating any new blog content or training log entry, automatically set current date to ensure proper sorting

## System Architecture

The application is a full-stack web application with distinct frontend and backend components.

### Frontend
- **Framework**: React 18 with TypeScript and Vite.
- **Routing**: Wouter for client-side routing.
- **State Management**: TanStack Query for server state; React hooks for local state.
- **UI Components**: shadcn/ui built on Radix UI primitives.
- **Styling**: Tailwind CSS, utilizing custom brand colors and responsive design.
- **UI/UX Decisions**: Incorporates accessible component primitives, a utility-first styling approach, consistent iconography (Lucide Icons), and a specific "hero-gradient" class for stunning multi-layered gradient effects with dark navy/blue base, purple/magenta bands, royal blues, and bright orange horizon with breathing animation for headers and special sections. Image galleries feature intelligent layouts based on image count (1-image single column, 2-images two columns, 3-images three columns, 4+ images two columns two rows grid), with lightbox functionality for fullscreen viewing.

### Backend
- **Server**: Express.js with TypeScript, using ESM modules.
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon Database).
- **API Structure**: RESTful endpoints with robust error handling.
- **File Storage**: Local file system with static asset serving.

### Data Models
Key database schemas include: Users, Recipes, Workouts, Goals, Food Entries, Tracking Systems, Favorites, Calculator Results, Meal Plans, and Subscription Management.

### Core Features
- **User Authentication**: Simplified development authentication system.
- **Content Management**: Admin-managed recipes and workouts; user browsing and favoriting.
- **Calculator Tools**: Calorie and alcohol calculators with result saving.
- **Subscription System**: Tiered access with payment gateway integration.
- **Blog System**: YouTube video integration with authentic data extraction, SEO-friendly slugs, dynamic category management (mega menu), and social media sharing functionality with server-side meta tag injection. Blog posts are primarily attributed to Michael Baker.
- **Training Log**: A continuous page for training log entries, where new entries are added to the top. Each entry adheres to a specific template with an entry header, training metrics (for run entries), an info bar, and rich content (authentic user text, gallery images with lightbox, Amazon product links with rich previews, YouTube/website URLs). SQL updates are used to add new entries to the top of an existing array.
- **SEO**: Comprehensive SEO framework with automated sitemap.xml generation that updates on each deployment, robots.txt configuration, and server-side rendering middleware that injects Open Graph tags for social media. Sitemap automatically includes all blog posts, recipes, and workouts with proper lastmod dates.

## Amazon Product Integration Workflow

When adding Amazon links to content:

### For Blog Posts:
- Use format: `[AMAZON_PRODUCT:https://amzn.to/CODE:Product Title]`
- Displays as full product card with image, price, rating, availability
- Automatically adds to /amazon page

### For Training Log Entries:
- Use format: `<span class="amazon-link" data-url="https://amzn.to/CODE">Product Name</span>`
- Shows as inline clickable link in training log
- Automatically adds to /amazon page

### Adding New Products with Images:
1. Add the Amazon link to your content using the format above
2. Provide the product image when adding the link
3. The system will:
   - Extract ASIN from the Amazon URL
   - Save the image as `/attached_assets/amazon_ASIN_productname.jpg`
   - Add product data to `server/amazon-scraper.ts` KNOWN_PRODUCTS
   - Display with full product preview

### Key Features:
- All Amazon links from any content source automatically appear on /amazon page
- Product data is stored locally to avoid Amazon blocking issues
- Images must be provided by user due to Amazon's anti-scraping measures

## External Dependencies

### Payment Processing
- **Stripe**: For subscription management.
- **PayPal**: Server SDK for one-time payments.

### Database
- **Neon Database**: PostgreSQL hosting.
- **Drizzle ORM**: For type-safe database operations and migrations.

### Content & Communication
- **Facebook Integration**: Planned RSS scraping for blog content sync.
- **SendGrid**: For email notifications.
- **Cheerio**: For web scraping capabilities.
- **Klaviyo**: For email collection (integrated via form classes).
- **Zapier**: Webhook integration for connecting with various applications (user registration, goal tracking, workout logging, nutrition tracking, blog post creation, email notifications, generic data processing).

### UI/UX Libraries
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first styling framework.
- **Lucide Icons**: For consistent iconography.

### Social & SEO
- **Google Places API**: For real-time Google Reviews fetching.
- **react-helmet-async**: For server-side rendering of meta tags.