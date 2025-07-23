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

## Hartford Marathon Training Log Workflow

### Complete Training Log Entry Process

**IMPORTANT**: The Hartford Marathon Training Log is a single continuous page where new entries are added to the TOP, pushing older entries down. Each entry is a complete block with these exact characteristics:

#### Entry Structure Template
1. **Entry Header** (Blue background with white text):
   - Large title in quotes (e.g., "GO ONE MORE", "SPEED KILLS")
   - Subtitle with attribution (e.g., "-Nick Bare", "-Training Entry #2")

2. **Training Metrics Section** (Dark semi-transparent background):
   - Distance (e.g., "19.00 miles")
   - Pace (e.g., "8:22/mile") 
   - Time (e.g., "2h 38m")
   - All values displayed in green (#94D600) with white labels
   - Only shows for actual run entries (not training tips)

3. **Entry Info Bar** (Gray text on blue background):
   - "Training Log Entry #X" (left side)
   - Full date in green (center - e.g., "Wednesday, July 9, 2025")
   - "Workout Type: [Type]" with type in green (right side)

4. **Entry Content** (White background box):
   - User's authentic training log text (never rewrite)
   - Gallery images in masonry layout with lightbox functionality
   - Amazon product links with rich previews
   - YouTube and website URLs automatically converted to clickable links

#### Database Update Process
```sql
-- Update existing training log entry by adding new entry to top of entries array
UPDATE training_log_entries 
SET content = jsonb_set(
  content,
  '{entries}',
  jsonb_build_array(
    jsonb_build_object(
      'entryNumber', [NEW_ENTRY_NUMBER],
      'title', '[BIG_TITLE_IN_QUOTES]',
      'subtitle', '[SUBTITLE_WITH_ATTRIBUTION]',
      'date', '[FULL_DATE_STRING]',
      'workoutType', '[WORKOUT_TYPE]',
      'metrics', [METRICS_OBJECT_OR_NULL],
      'content', '[AUTHENTIC_USER_TEXT]',
      'videoUrl', '[YOUTUBE_URL_OR_NULL]',
      'images', '[ARRAY_OF_IMAGE_PATHS]'
    )
  ) || (content->'entries')
)
WHERE slug = 'hartford-marathon-training-log-2025';
```

#### Content Formatting Guidelines
- **Plain Text**: Preserve exactly as provided by user
- **URLs**: Format as plain text - system auto-converts to clickable links
- **Amazon Links**: Format as `<span class="amazon-link" data-url="[URL]">[PRODUCT_NAME]</span>`
- **Images**: Store as array of paths in `images` field
- **Line Breaks**: Use `\n` - system converts to `<br>` tags

#### Visual Specifications
- Hartford Marathon blue (#0039A6) for headers and backgrounds
- Green accent color (#94D600) for highlights and key information
- Proper spacing and typography matching established design
- Lightbox functionality for all images (95vh/95vw for fullscreen viewing)
- Amazon product link integration with rich previews
- Intelligent image gallery layout based on count:
  - 1 image: Single column (full width)
  - 2 images: Two columns (side by side)
  - 3 images: Three columns (equal width)
  - 4+ images: Two columns, two rows (grid layout)

#### Technical Implementation
- Single database record updated via SQL, not separate posts
- Frontend renders all entries from single training log query
- Newest entries appear first (sorted by date descending)
- Each entry maintains complete template structure
- Seamless integration with existing blog system under training log categories
- BlogContentRenderer handles URL conversion, Amazon links, and image galleries
- Lightbox system for fullscreen image viewing

#### Image Handling for Training Log & Blog Posts
**Gallery Layout Rules (applies to both training log entries and blog posts):**
- 1 image: Single column layout (full width)
- 2 images: Two columns side by side (equal width)
- 3 images: Three columns (equal width)
- 4+ images: Two columns, two rows (grid layout)

**Implementation:** BlogContentRenderer automatically detects image count and applies appropriate CSS grid classes for optimal space utilization and visual balance.

## SEO and Site Management

### Sitemap.xml Maintenance
**Location**: `/public/sitemap.xml`
**Server Route**: `/sitemap.xml` (served with proper XML headers and 1-hour cache)
**Update Policy**: Must be updated whenever:
- New blog posts are created
- New recipes are added
- New workout content is published
- Service pages are modified
- Training log entries are added
- Category pages change

**Current Structure**:
- Homepage (priority 1.0)
- Service pages (priority 0.8-0.9)
- Blog and content pages (priority 0.7-0.9)
- Calculator tools (priority 0.8)
- Category pages (priority 0.6-0.7)
- User pages (priority 0.6)

### Robots.txt Configuration
**Location**: `/public/robots.txt`
**Server Route**: `/robots.txt` (served with 24-hour cache)
**Policy**: 
- Allow all public content
- Disallow admin pages and user-specific content
- Reference sitemap.xml location

## Changelog

```
Changelog:
- July 23, 2025: Enhanced training log layout and content - removed unwanted text "usually around your half marathon pace" from Entry #8 content; made top header image extend full width edge-to-edge for better visual impact; reverted gallery photos to original padded layout with gaps and rounded corners; changed all image galleries to consistent 4-column layout on desktop (2 columns on mobile) for uniform presentation across all training entries; maintained Hartford Marathon branding colors (#0039A6 blue, #94D600 green) and lightbox functionality
- July 23, 2025: Added Training Log Entry #8 "TEMPO + UPPER BODY + LONG RUN PREP" (July 22-23, 2025) - detailed tempo run with 6:51-7:06 pace tempo block, upper body strength session with 100lb dumbbell work, and comprehensive long run preparation strategy including carb loading (200-350g), electrolyte planning, and fueling strategy for upcoming 18-mile long run; entry includes 7 images (Strava data, route maps, elevation charts, nutrition prep photos) and displays at top of training log with proper Hartford Marathon branding
- July 23, 2025: Enhanced calculator engagement tracking - modified like button to increment counter with each click by removing duplicate prevention logic; updated both share buttons ("Share The Buzzkill Calculator" and "COPY and SHARE My Buzzkill Results") to increment share counter each time clicked; all buttons now provide unlimited engagement tracking for better social proof and user interaction metrics
- July 22, 2025: Fixed calculator like/share functionality and improved share button icon - resolved database syntax error by adding 'and' import to drizzle-orm in routes.ts; tested and confirmed both like and share APIs working correctly with proper duplicate prevention and counter increments; replaced Debbie Downer image in share button with professional Share2 icon from Lucide React for cleaner, more appropriate visual design
- July 22, 2025: Confirmed Klaviyo email collection integration using correct form ID - verified all forms across site (footer, newsletter popup) use correct Klaviyo form class "klaviyo-form-ULBmqZ"; Klaviyo JavaScript library integrated in HTML head; fallback email collection system in place for reliable email signup functionality across all pages
- July 21, 2025: Successfully fixed Facebook social sharing image for alcohol calculator - directly replaced buzzkill-calculator-og-image.png file with correct Debbie Downer image to resolve Facebook's cached image issue; added missing fb:app_id property and proper image dimensions (1200x630) to resolve sharing debugger warnings; confirmed Facebook now displays correct buzzkill image with Debbie Downer's head when sharing alcohol calculator
- July 21, 2025: Implemented social media sharing functionality for alcohol calculator - replaced "Save Results" button with "Share Results" that creates personalized social media posts with user's consumption data, weight gain projections, and impact analysis; includes native mobile sharing API support and desktop fallback with Twitter/Facebook direct sharing options; fixed title clipping and updated branding to show both "Alcohol Weight Gain Calculator" and "BUZZKILL CALCULATOR" subtitle; removed "Show Personal Factors" section for cleaner interface
- July 21, 2025: Added walking miles calculation feature showing how many miles needed to burn off weekly alcohol calories with green styling and walking icon - displays "I'd need to walk X miles to burn off X calories from my weekly alcohol consumption" in prominent green section below Share Results button; uses standard 100 calories burned per mile calculation; enhanced social sharing to include walking challenge data with hashtags; updated section title to "Buzzkill Reality:" with lightning bolt icon for stronger impact; added running miles and weightlifting hours calculations (150 cal/mile running, 300 cal/hour weightlifting); improved sharing to copy personal data to clipboard for Facebook and pre-fill LinkedIn composer with complete exercise breakdown
- July 21, 2025: Implemented comprehensive SEO with server-side meta tag injection, structured data schema, and natural meta descriptions - fixed og:image and og:description issues by adding server-side rendering middleware that detects social media crawlers and injects proper Open Graph tags; created reusable Schema component supporting calculator, service, person, organization, blog, and website types; added structured data markup to calculator pages, about page, and services page; verified SEO titles working correctly with proper "Page Title | Get Up Earlier" format; enhanced social media sharing with proper featured images (beer/wine for Buzzkill Calculator, running/fitness for Calorie Calculator); crafted compelling, natural meta descriptions for all major pages including home, about, services, blog, recipes, workouts, and both calculators that emphasize benefits and transformation over features
- July 20, 2025: Enhanced Buzzkill Calculator with branded title and featured image - updated Alcohol Calculator page title to "Buzzkill | Beer and Wine Weight Gain Calculator | Get Up Earlier" and added social media featured image of beer and wine gathering; improved SEO with proper meta description for alcohol weight gain calculations
- July 20, 2025: Perfected full-width image gallery system with 2-column layout and 24px padding - images now fill the post space using container breakouts with balanced 24px left/right padding; single images utilize full available width, multiple images display in clean 2-column grid for optimal space usage; enhanced lightbox with 95vw/95vh sizing; wide landscape images (like Strava screenshots) now properly display with proper breathing room while maximizing space utilization
- July 20, 2025: Added Training Log Entry #7 "FIRST INTERVAL SESSION" (July 20, 2025) - first interval session for Hartford Marathon training featuring 6.5 miles with 7 fast intervals at 5:55-6:20 pace with recovery jogs; entry includes authentic user text explaining interval training benefits for speed, running economy, and aerobic capacity plus 3 images (motivational quote, Strava elevation chart, route map); entry displays at top of training log with proper Hartford Marathon branding including blue metrics bar (6.50 miles, 7:22/mile, 47m 45s) and complete template structure
- July 19, 2025: Successfully reduced homepage hero section gap - decreased padding from py-12 to py-4/py-8 (mobile/desktop), reduced minimum height from 600px to 400px/500px, tightened spacing between text elements, and made heading responsive (text-3xl mobile to text-6xl desktop); optimized mobile spacing throughout for better visual hierarchy
- July 19, 2025: Fixed recipe tagging system dietType.toLowerCase error completely - updated schema field name consistency, proper array handling in components, and maintained legacy support; recipe tags now display with proper Title Case formatting and consistent color coding across all pages matching dropdown filters
- July 19, 2025: Added Training Log Entry #6 "OCEAN THERAPY DAY" (July 18-19, 2025) - featured ocean therapy session at East Matunuck Beach with 7-year-old followed by powerlifting session including 315lb hex bar deadlifts and 100lb incline dumbbell presses; entry includes 7 images (beach scenes, gym equipment) and authentic content about recovery nutrition and training philosophy; successfully implemented 300ms fade in/out transitions for Google Reviews carousel navigation with prevention of rapid clicking during animations; removed "Write a review" button and all "Read more" links from carousel for cleaner, more elegant presentation
- July 19, 2025: Implemented comprehensive Google Reviews integration with authentic review carousel - created professional Google Reviews carousel component matching WorldCare design, added dedicated /reviews page, integrated Google Places API with real-time review fetching, and embedded carousel on homepage hero section; enhanced with 8 total testimonials (5 Google + 3 additional client reviews from David Salinas, Mike Richetelli, and Erica Baker) using authentic profile photos and "a year ago" timing; unified homepage reviews section by removing duplicate review components and positioning single carousel over rotating star background; removed white card backgrounds and inverted text colors for seamless navy background integration with optimal readability
- July 17, 2025: Perfected hero gradient with stunning vibrant sunrise effect - implemented four-layer gradient system with deep night blue base (#01020c), rich purple/magenta bands (deep purple #8A2BE2, indigo #4B0082), royal blues, and bright orange horizon; enhanced with 40% saturation boost and subtle breathing animation creating authentic dawn atmosphere
- July 17, 2025: Increased certification logos 3x bigger across all 6 service pages for better visibility - changed from w-16 h-16 to w-48 h-48 on individual service pages
- July 17, 2025: Updated footer branding from "WebMBD.com" to "Michael Baker Digital" for proper attribution
- July 17, 2025: Completed comprehensive SEO implementation with react-helmet-async across all major pages - proper meta titles, descriptions, and Open Graph tags for social media sharing
- July 17, 2025: Created comprehensive sitemap.xml with all site routes and robots.txt for SEO optimization; added server routes to serve both files with proper headers and caching; established maintenance policy to update sitemap when content changes
- July 17, 2025: Documented comprehensive calculator mathematics and logic - Alcohol Calculator ("Buzzkill Calculator") uses 3,500 calories = 1 pound formula for weight gain projections with authentic drink nutritional data; Calorie Calculator uses Mifflin-St Jeor BMR equation with TDEE calculations, goal-based adjustments, macro distribution, and advanced metabolic metrics including body fat estimation and meal timing
- July 17, 2025: Successfully created "Digital tip to know when it's time to get new running shoes" blog post with sneaker featured image and Strava screenshot; standardized homepage image thumbnail heights - all four homepage cards (Services, Latest Blog, Recipe, Workout) now use consistent h-72 height for uniform visual appearance and better featured image display
- July 17, 2025: Successfully implemented and verified social media sharing functionality - Hartford Marathon 2024 start line image now displays perfectly when shared on Facebook, Twitter, LinkedIn with proper "Hartford Marathon Training Log 2025 - Get Up Earlier" title and comprehensive description; server-side meta tag injection works flawlessly for social media crawlers while preserving normal React app experience for regular users
- July 16, 2025: Successfully created Training Log Entry #5 "FN GROSS OUT" (July 17, 2025) - 13.10 mile long run with authentic Strava data, 4 images in 2x2 grid layout, and restored category tags to top of training log page; entry displays at top with proper Hartford Marathon branding and metrics
- July 16, 2025: Fixed training log image display - restored proper image rendering with intelligent grid layout system (1 image=single column, 2 images=two columns full width, 3 images=three columns, 4+ images=two columns two rows); removed conflicting prose constraints and ensured full-width image display in training log entries
- July 16, 2025: Implemented intelligent image gallery layout system - 1 image uses single column, 2 images use two columns side by side, 3 images use three columns, 4+ images use two columns two rows grid; updated BlogContentRenderer and documented image handling rules for both training log entries and blog posts
- July 16, 2025: Updated training log entry titles to left-justified 35px font size for consistent, structured appearance across all entries
- July 16, 2025: Created Training Log Entry #4 "Recovery Run" (July 13, 2025) - 7.50 mile recovery run through Orange, CT with Strava data screenshots and route map; entry displays at top of training log with proper metrics, content formatting, and image gallery integration
- July 16, 2025: Fixed URL conversion in BlogContentRenderer - URLs now properly convert to clickable links by processing before HTML conversion; fixed order of operations to prevent HTML interference with URL regex matching
- July 16, 2025: Fixed Amazon product link processing globally across all content types - completely rebuilt BlogContentRenderer to properly handle Amazon links and galleries in correct order; Amazon links now display as rich preview cards with images, prices, and ratings consistently across blog posts, training log entries, and all other content throughout the site
- July 16, 2025: Successfully implemented global Amazon link functionality in Hartford Marathon Training Log Entry #2 - all three Amazon products (Soft Water Bottle, Double Electrolyte Gels, NUUN tablets) now display with full rich previews including product images, prices, ratings, and Prime status using the same system as blog posts
- July 15, 2025: Fixed Amazon product preview display in Hartford Marathon Training Log entries - updated BlogContentRenderer regex to properly match data-url span format enabling full rich product previews with images, prices, ratings, and Prime status; Entry #2 now displays complete Amazon product cards for soft water bottle, electrolyte gels, and NUUN tablets
- July 15, 2025: Implemented conditional training metrics display - blue training metrics bar (distance, pace, time) only shows for actual run entries; Entry #2 "Marathon Training Tip for HOT long runs" displays without metrics bar since it's training advice rather than actual run data
- July 15, 2025: Added Hartford Marathon Training Log Entry #2 "Marathon Training Tip for HOT long runs" (July 12, 2025) - features frozen water bottle technique with NUUN tablets, displays above Entry #1 in chronological order with proper Hartford Marathon branding and gallery images
- July 15, 2025: Completed Hartford Marathon Training Log 2025 continuous page structure - each training entry displays with own complete template including big entry title, metrics, date, and workout type; Entry #2 "SPEED KILLS" (7/11/2025) appears above Entry #1 "GO ONE MORE" (7/9/2025) with proper chronological ordering and separators
- July 15, 2025: Established Hartford Marathon Training Log workflow - training log entries updated via direct SQL database updates to preserve authentic user text exactly as provided; system uses Hartford Marathon branding colors (#0039A6 blue background, #94D600 green accents); masonry image layout displays images in natural aspect ratios without gray backgrounds; category tags styled with Hartford colors; spacing optimized between tags and titles; training log updates bump entire post to top of blog feed automatically
- July 14, 2025: Created unique training log template with distinctive dark navy/orange theme that prominently displays training date, metrics (distance, pace, time), and entry number; implemented specialized gallery image display with lightbox functionality; added admin workflow at /admin/training-log for creating new training log entries; training log entries seamlessly integrate into blog system under categories "Marathon Training Log", "Marathon Training", and "Running"
- July 14, 2025: Renamed Alcohol Weight Impact Calculator to "Buzzkill Calculator" and updated wine serving options to "Glass 5 oz", "1/2 Bottle", and "Bottle" for cleaner labeling
- July 14, 2025: Added High Carb macro profile (65% carbs/25% protein/10% fat) for marathon carb loading and Endurance Training goal as default - endurance goal provides maintenance calories plus 15% extra for training demands
- July 14, 2025: Removed Recommendations and Healthy Guidelines sections from alcohol calculator - streamlined interface by removing advisory content to focus purely on calculation and impact analysis
- July 14, 2025: Updated both calculator pages to use consistent site-wide blue to white gradient background - changed from multi-color gradient to standard bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white matching About, Blog, Services, and Home pages
- July 14, 2025: Made calculator card backgrounds darker gray for better form field contrast - changed from bg-white to bg-gray-50 then to bg-[#d5dde5] so white form fields stand out more prominently against the card backgrounds
- July 14, 2025: Updated Alcohol Calculator color scheme to match Daily Calorie Calculator - changed from amber-orange to blue-purple gradient theme throughout (backgrounds, headers, buttons, info boxes) while maintaining all functionality
- July 14, 2025: Added space before opening parenthesis in macro profile dropdown display for better readability - now shows "Balanced (40% Carbs/30% Protein/30% Fat)" with proper spacing
- July 14, 2025: Updated macro profile display to show full descriptive words instead of abbreviations - changed from "C P F" to "Carbs, Protein, Fat" for improved user experience
- July 14, 2025: Added consistent 35px top padding to both Michael and Erica's profile sections - applied pt-[35px] to both component files and about page for uniform breathing room from top edge while maintaining top-justified alignment; updated Michael's about section to use justify-start for consistency
- July 14, 2025: Added 50px spacing between credentials band and In-Home Private Boutique section title for improved visual hierarchy and layout breathing room
- July 13, 2025: Top-justified Erica's profile photo and credentials - changed from center to top alignment in left column by updating flex justify-start positioning; now matches Michael's layout with content appearing at the very top of the column
- July 13, 2025: Redesigned profile quotes with elegant blockquote styling - moved quotes back to right side with new visual treatment using subtle gray backgrounds, rounded corners, SVG quote icons, italic text, and proper semantic blockquote elements; eliminated all previous spacing issues with clean, modern design
- July 13, 2025: Fixed outdated blog URLs in home page and hero section - updated random blog post links to use proper slug-based URLs instead of YouTube ID format; now generates SEO-friendly URLs like /blog/relieve-lower-back-pain-fast-2-simple-moves instead of /blog/youtube-oQu5RBpaM_Y
- July 13, 2025: Top-justified profile photos and credentials in MichaelAboutBlock and EricaAboutBlock components - removed top padding completely so profile photos appear at the very top of left columns; changes automatically apply to all pages using these components (About, service pages, team pages)
- July 13, 2025: Fixed profile component spacing inconsistency - removed uneven spacing around highlighted quote boxes by eliminating wrapper divs and applying consistent mb-4 spacing to all elements; quote boxes now have perfectly balanced spacing above and below them matching paragraph spacing throughout profile sections
- July 13, 2025: Enhanced blog URL generation with SEO-friendly slugs - blog posts now use keyword-based URLs (e.g., /blog/relieve-lower-back-pain-fast-2-simple-moves) instead of YouTube IDs; implemented slug generation from video titles, updated routing system, and maintained backward compatibility
- July 13, 2025: Enhanced blog categories with mega menu - transformed simple dropdown into 3-column mega menu with post counts, better visual organization, and improved user experience; categories automatically update from existing blog posts with real-time filtering
- July 13, 2025: Made blog categories dropdown dynamic - now automatically updates with all categories from existing blog posts in real-time; replaced hardcoded category list with dynamic extraction from posts' category and categories fields, sorted alphabetically for better user experience
- July 13, 2025: Improved Amazon product preview mobile responsiveness - stacked layout on mobile with full-width images, appropriately sized text, hidden descriptions to prevent cramping; both fallback and real product previews use consistent responsive design
- July 13, 2025: Enhanced YouTube blog workflow with Amazon link processing - Amazon URLs (amazon.com, amzn.to) now automatically convert to interactive product previews with real data extraction (images, prices, ratings, Prime status) using established visual treatment; updated YOUTUBE_BLOG_CHECKLIST.md with Amazon validation requirements
- July 13, 2025: Confirmed YouTube blog workflow automatically displays new posts at top of blog page and homepage (sorted by publishedDate descending) - system fully automated for optimal user experience
- July 13, 2025: Made entire blog cards clickable for better user experience - removed conflicting author links from blog cards while keeping author info displayed; individual blog posts retain author links to about page
- July 13, 2025: Fixed blog authorship - all blog posts now properly attributed to "Michael Baker" (not "Get Up Earlier") with clickable links to about page across all blog templates (listing, individual posts, category pages)
- July 13, 2025: Created comprehensive YouTube blog post validation system with YOUTUBE_BLOG_CHECKLIST.md - enforces authentic data extraction (title, description, thumbnail) with automated verification; integrated validation into blog creation process with detailed logging; recreated "Get Up Earlier" blog post with authentic YouTube description including clickable timestamps and preserved links
- July 13, 2025: Removed title truncation from blog cards - titles now display in full without ellipsis on blog listing and category pages for better readability
- July 13, 2025: Added YouTube video blog post with authentic title "I Don't Have Time to Work Out? Get Up Earlier! #1 Life Hack for Workouts and Self Improvement" with categories inspiration and nutrition - uses only authentic YouTube data (title, thumbnail, author) without custom content modifications
- July 12, 2025: Added animated "Built with Agentic AI WebMBD.com" credit with comical red alien robot icon to site footer - features friendly cartoon design with moving eyes, blinking antennas, pulse effect, and hover bounce animation for engaging attribution
- July 12, 2025: Added 301 redirect from non-www to www domain - automatically redirects getupearlier.com to www.getupearlier.com to resolve SSL certificate issues
- July 11, 2025: Updated blog page header - changed "Health & Fitness Blog" to "Get Up Earlier Blog", replaced "Expert Content" with "Helpful Insight", and removed "Expert Insights" and "Updated Weekly" badges for cleaner presentation
- July 11, 2025: Updated footer navigation to match header links and removed Instagram/Twitter icons - footer now shows only YouTube and Facebook Group links consistent with header navigation
- July 20, 2025: Removed pricing table from workouts page for cleaner, content-focused presentation
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
YouTube Blog System: Always extract authentic YouTube video data (title, description, thumbnail) with links intact. Never use placeholder or synthetic content. New blog posts automatically appear at top of blog page and homepage (sorted by publishedDate descending).
Blog Authorship: All blogs and videos are by Michael Baker (not "Get Up Earlier") and all author mentions should link to his profile about page.
Design Preference: When user requests "Dark Gradient" styling, use the hero-gradient class which creates the stunning multi-layered gradient effect with dark navy/blue base, purple/magenta bands, royal blues, and bright orange horizon with breathing animation - this is the preferred gradient for all headers and special sections.
```