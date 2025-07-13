# replit.md

## Overview

Get Up Earlier is a comprehensive health and fitness web application built for Personal Training, Nutrition, and Accountability Coaching. The app helps users transition from inactivity and poor diet to strength and healthy habits through clean eating recipes, workout libraries, and coaching services.

## System Architecture

The application follows a full-stack architecture using:

- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Development auth system (currently simplified for development)
- **Deployment**: Single repository with separate client/server directories

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build system
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state and React hooks for local state
- **UI Components**: shadcn/ui component library with Radix primitives
- **Styling**: Tailwind CSS with custom brand colors and responsive design

### Backend Architecture
- **Server**: Express.js with TypeScript, using ESM modules
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon Database)
- **API Structure**: RESTful endpoints with proper error handling
- **File Storage**: Local file system with static asset serving

### Data Models
The database schema includes:
- Users (with profile data for calorie calculations)
- Recipes (with nutrition information and categorization)
- Workouts (with difficulty levels and equipment requirements)
- Goals, Food Entries, and tracking systems
- Favorites and Calculator Results
- Meal Plans and Subscription management

## Data Flow

1. **User Authentication**: Development system auto-logs in Michael Baker as admin user
2. **Recipe Management**: Admin can add/edit recipes, users can browse and favorite
3. **Workout Library**: Categorized workouts with video integration
4. **Calculator Tools**: Calorie and alcohol calculators with result saving
5. **Subscription System**: Tiered access with Stripe/PayPal integration (configured but not active)

## External Dependencies

### Payment Processing
- **Stripe**: Configured for subscription management (requires STRIPE_SECRET_KEY)
- **PayPal**: Server SDK integration for one-time payments (requires PAYPAL_CLIENT_ID/SECRET)

### Database
- **Neon Database**: PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with migration support

### Content Management
- **Facebook Integration**: Planned RSS scraping for blog content sync
- **SendGrid**: Email service integration for notifications
- **Cheerio**: Web scraping capabilities for content extraction

### UI/UX
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling with custom theme
- **Lucide Icons**: Consistent iconography

## Deployment Strategy

### Development Environment
- Uses `tsx` for TypeScript execution in development
- Vite dev server with HMR for frontend development
- Database migrations with `drizzle-kit push`

### Production Build
- Frontend built with Vite to `dist/public`
- Backend bundled with esbuild to `dist/index.js`
- Single deployment with static file serving

### Environment Variables Required
- `DATABASE_URL`: Neon PostgreSQL connection string
- `STRIPE_SECRET_KEY` (optional): For subscription payments
- `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` (optional): For PayPal payments
- `SENDGRID_API_KEY` (optional): For email notifications

## Changelog

```
Changelog:
- July 13, 2025: Created comprehensive YouTube blog post validation system with YOUTUBE_BLOG_CHECKLIST.md - enforces authentic data extraction (title, description, thumbnail) with automated verification; integrated validation into blog creation process with detailed logging; recreated "Get Up Earlier" blog post with authentic YouTube description including clickable timestamps and preserved links
- July 13, 2025: Removed title truncation from blog cards - titles now display in full without ellipsis on blog listing and category pages for better readability
- July 13, 2025: Added YouTube video blog post with authentic title "I Don't Have Time to Work Out? Get Up Earlier! #1 Life Hack for Workouts and Self Improvement" with categories inspiration and nutrition - uses only authentic YouTube data (title, thumbnail, author) without custom content modifications
- July 12, 2025: Added animated "Built with Agentic AI WebMBD.com" credit with comical red alien robot icon to site footer - features friendly cartoon design with moving eyes, blinking antennas, pulse effect, and hover bounce animation for engaging attribution
- July 12, 2025: Added 301 redirect from non-www to www domain - automatically redirects getupearlier.com to www.getupearlier.com to resolve SSL certificate issues
- July 11, 2025: Updated blog page header - changed "Health & Fitness Blog" to "Get Up Earlier Blog", replaced "Expert Content" with "Helpful Insight", and removed "Expert Insights" and "Updated Weekly" badges for cleaner presentation
- July 11, 2025: Updated footer navigation to match header links and removed Instagram/Twitter icons - footer now shows only YouTube and Facebook Group links consistent with header navigation
- July 11, 2025: Removed pricing table from recipes page for cleaner, content-focused presentation
- July 11, 2025: Updated category display system to show comma-separated categories as individual badges across all blog pages (listing, individual posts, category archives) for improved user experience
- July 11, 2025: Removed "2 min read" tags from all blog pages (blog listing, individual posts, category pages) for cleaner presentation
- July 11, 2025: Added ChatGPT Running Coach YouTube video to blog with AI, Running, Marathon, 5k, Training categories
- July 11, 2025: Updated favicon to custom winter runner image with "M" branding
- July 11, 2025: Enhanced YouTube video blog system with clickable timestamp links - all timestamps now jump to specific YouTube video moments with red styling; fixed URL truncation issues ensuring full product links display properly; removed redundant excerpt display from blog templates; system fully ready for bulk processing of 100+ YouTube videos with authentic content extraction, proper formatting, and professional link handling
- July 11, 2025: Fixed YouTube video blog system to extract authentic content - now properly extracts real video titles, descriptions, and thumbnails from YouTube URLs; enhanced formatting with HTML rendering, clickable links, styled hashtags, and bold timestamps; implemented clean URL slugs (e.g., /blog/nyc-marathon-2024); system ready for bulk addition of 100+ YouTube videos
- July 9, 2025: Added comprehensive Zapier webhook integration with 8 specialized endpoints for user registration, goal tracking, workout logging, nutrition tracking, blog post creation, email notifications, and generic data processing - enables connection to thousands of apps through Zapier platform
- July 9, 2025: Reordered navigation menu: 1-on-1 Services (1st), About dropdown (2nd), Blog (3rd), Recipes (4th), Workouts (5th), Calculators (6th), Facebook Group (last) - updated both desktop and mobile navigation for consistent user experience
- July 9, 2025: Updated homepage hero section text from "Personal Training, Nutrition & Accountability Coaching" to "Strength, Nutrition & Accountability Coaching" for better brand messaging
- July 8, 2025: Updated homepage 1-on-1 Services section title from "Strength, Nutrition, Yoga" to "Strength, Nutrition & Accountability Coaching"
- July 8, 2025: Removed duplicate "What Makes It Special" block from Private Yoga page for cleaner presentation
- July 8, 2025: Rebuilt MichaelAboutBlock and EricaAboutBlock components to exactly match About page layout and styling - Michael's section uses proper lg:grid-cols-5 layout with dark navy background; Erica's section uses correct green gradient background (#E1ECE7 to #C4D6CC) with gray text
- July 8, 2025: Created reusable MichaelAboutBlock and EricaAboutBlock components - added Michael's about section to top 4 services (Personal Training, Nutrition, Running, Accountability) and Erica's about section to yoga services (Private & Small Group Yoga)
- July 8, 2025: Added service-specific certification logos positioned directly below featured images in white space on all service pages - no additional text, just clean logo placement
- July 8, 2025: Added service-specific featured images in 1/3 column layout to all service pages (Running, Strength Training, Nutrition, Accountability, Private Yoga, Small Group Yoga) using the same images defined in services grid component
- July 8, 2025: Added featured image in 1/3 column layout to Certified Running Coaching page philosophy section
- July 8, 2025: Removed 5-star rating graphic from Services page, keeping just the "It all starts with a 30 minute session" title
- July 8, 2025: Replaced "Comprehensive Coaching & Training" with "It all starts with a 30 minute session" and added 5-star rating graphic on Services page
- July 8, 2025: Changed "What You'll Get" section on Virtual Nutrition Coaching page to use 3-column layout instead of 2-column
- July 8, 2025: Removed "Personalized Nutrition Plan" card from Virtual Nutrition Coaching page "What You'll Get" section  
- July 8, 2025: Removed "Class Options" section from Small Group Yoga page to streamline content presentation
- July 8, 2025: Reduced blog post title size by 25% across all screen sizes for better proportions
- July 8, 2025: Added 50% opacity black overlay to blog featured image for better title readability
- July 8, 2025: Aligned hero section content according to design guides with consistent top padding and start alignment for both columns
- July 8, 2025: Adjusted hero section spacing with reduced top/bottom gaps and increased space below headline for better visual balance
- July 8, 2025: Balanced hero section layout with equal heights for left and right columns, improved spacing and vertical centering
- July 8, 2025: Moved Facebook Group button to appear below "From the Blog" area in hero section for better content flow
- July 8, 2025: Hidden profile and logout sections in mobile navigation menu for cleaner user experience
- July 8, 2025: Updated hero section label from "Random Post:" to "From the Blog:" for more welcoming content presentation
- July 7, 2025: Replaced static hero image with dynamic random blog post system featuring consistent image sizing, subtle vertical divider, and title overlay that changes on each page load - creates fresh content experience
- July 7, 2025: Moved Facebook Group section to appear directly below the hero buttons (View Services, View Recipes, View Workouts) in the hero section for better visibility and user engagement
- July 7, 2025: Created reusable Permanent Class Schedule component for Erica's yoga classes (Saturdays 8-9am, Wednesdays 9-10am, $25 fee) - implemented across About page, Team Erica page, and Small Group Yoga page
- July 7, 2025: Updated Michael's profile section to use navy color from header/nav for consistent branding
- July 7, 2025: Removed "Certified Professionals" team section from About page to streamline presentation
- July 7, 2025: Moved credentials band below both profile sections and removed blue background for transparent appearance
- July 7, 2025: Removed "My Story" titles from both Michael and Erica profile sections to streamline content presentation
- July 7, 2025: Added dedicated Erica Baker section to About page with custom green (#E1ECE7) gradient background and comprehensive bio content
- July 7, 2025: Added "What Makes It Special" benefits section to Private Yoga page with 4 detailed benefit cards
- July 7, 2025: Removed philosophy section titles from all service pages (Running, Training, Nutrition, Accountability, Small Group Yoga) to streamline content presentation
- July 7, 2025: Updated Private Yoga copy across all pages to use authentic user voice focusing on journey of self-discovery and mindfulness
- July 7, 2025: Removed "Erica's Yoga Philosophy" title from Private Yoga page to streamline content presentation
- July 7, 2025: Added Yoga Alliance certification logo to both Private Yoga and Small Group Yoga service cards
- July 7, 2025: Added ISSA Running Coach certification logo to Certified Running Coaching service card
- July 7, 2025: Added IIN certification logo to Accountability Coaching service card, replacing text badge with professional certification imagery
- July 7, 2025: Added permanent class schedule to Small Group Yoga page with specific times (Saturdays 8-9am, Wednesdays 9-10am) and $25 class fee
- July 7, 2025: Created dedicated Accountability Coaching page with comprehensive content on goal tracking, daily check-ins, and habit formation
- July 7, 2025: Updated text colors on Personal Strength Training page to white/light colors for better contrast against dark gradient background
- July 7, 2025: Created dedicated Virtual Nutrition Coaching page with virtual session details, meal planning support, and personalized nutrition guidance
- July 7, 2025: Built dedicated Personal Strength Training page converting from modal to full page with routing, philosophy section, and call-to-action
- July 7, 2025: Converted services from modal presentations to dedicated pages for better UX and SEO
- July 6, 2025: Hidden blog edit functionality in production - edit buttons and routes only available in development mode for security
- July 5, 2025: Created gallery section with 3 images formatted as perfectly cropped squares with lightbox functionality and hover effects
- July 5, 2025: Added lightbox functionality to blog featured images - images now display smaller (max-width 448px) with click-to-expand functionality and smooth hover effects
- July 5, 2025: Enhanced Amazon product preview display with larger image containers (36x36) and object-contain sizing to show complete product shots without cropping
- July 5, 2025: Built comprehensive real Amazon link preview system with live product data scraping, including titles, descriptions, images, prices, ratings, and Prime status
- July 5, 2025: Implemented robust fallback mechanisms for Amazon product display when scraping fails, with enhanced generic product cards
- July 5, 2025: Added intelligent caching system with 30-minute refresh intervals for Amazon product data
- July 4, 2025: Created dedicated category archive pages with /category/:category URLs, made all category tags clickable throughout the blog system
- July 3, 2025: Removed 3 unwanted blog posts ("Winter Running Motivation", "Test", "Joe Rogan discomfort") per user request
- July 3, 2025: Updated blog author sections with Michael Baker's actual professional photo and made both header and footer author areas clickable links to about page
- July 3, 2025: Fixed duplicate video display issue by updating blog post layout to match GetUpEarlier.com format
- July 3, 2025: Fixed YouTube URL validation in blog CMS - created flexible schema to handle both string and array tag inputs, enabling proper video content editing
- July 3, 2025: Fixed JavaScript errors in blog system - resolved tags handling for both blog listing and individual post pages
- July 3, 2025: Blog CMS system fully operational with clean data from GetUpEarlier.com
- July 3, 2025: Resolved duplicate DatabaseStorage class conflicts causing server crashes
- June 30, 2025: Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Content creation: Use only user's authentic words - never write additional content unless specifically asked.
YouTube Blog System: Always extract authentic YouTube video data (title, description, thumbnail) with links intact. Never use placeholder or synthetic content.
```