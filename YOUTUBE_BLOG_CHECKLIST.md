# YouTube Blog Post Creation Checklist

## MANDATORY REQUIREMENTS - ALL MUST BE AUTHENTIC/VERBATIM

### ✅ Title Requirements
- [ ] Extract exact YouTube video title (no modifications)
- [ ] Preserve all punctuation, quotes, and special characters
- [ ] Use title exactly as it appears on YouTube

### ✅ Description Requirements
- [ ] Extract complete YouTube video description (full text)
- [ ] Preserve ALL links as clickable HTML links
- [ ] Convert Amazon links to interactive product previews with authentic data
- [ ] Convert timestamps to clickable YouTube links (format: https://www.youtube.com/watch?v=VIDEO_ID&t=XXXs)
- [ ] Style hashtags with blue color (#1d9bf0)
- [ ] Preserve line breaks and formatting
- [ ] Include author bio, website links, and social media handles if present
- [ ] NO synthetic or placeholder content - only authentic YouTube description

### ✅ Featured Image Requirements
- [ ] Use YouTube video thumbnail (hqdefault.jpg or maxresdefault.jpg)
- [ ] Format: https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg
- [ ] NO custom images or placeholders

### ✅ Technical Implementation
- [ ] Video URL: https://www.youtube.com/embed/VIDEO_ID
- [ ] Post ID: youtube-VIDEO_ID
- [ ] URL Slug: Generated from video title using generateSlugFromTitle() function
- [ ] Excerpt: First 200 characters of description + "..." if longer
- [ ] isVideo: true
- [ ] originalUrl: Full YouTube watch URL

### ✅ URL Generation Requirements
- [ ] Generate SEO-friendly slug from video title
- [ ] Remove special characters and punctuation
- [ ] Convert spaces to hyphens
- [ ] Limit to 60 characters max
- [ ] Ensure slug is unique and descriptive
- [ ] Blog post URLs use format: /blog/SLUG (not /blog/youtube-VIDEO_ID)
- [ ] Use slug for all internal links and navigation

### ✅ Content Formatting
- [ ] Links: `<a href="URL" target="_blank" rel="noopener noreferrer">URL</a>`
- [ ] Amazon Links: `<span class="amazon-link" data-url="URL">Product Title</span>`
- [ ] Timestamps: `<a href="https://www.youtube.com/watch?v=VIDEO_ID&t=XXXs" target="_blank" rel="noopener noreferrer" style="color: #ff0000; font-weight: bold;">XX:XX:XX</a>`
- [ ] Hashtags: `<span style="color: #1d9bf0;">#hashtag</span>`
- [ ] Line breaks: `<br>`

### ✅ Amazon Link Processing
- [ ] Detect Amazon URLs (amazon.com, amzn.to patterns)
- [ ] Extract product titles from surrounding context
- [ ] Format as special spans for RealAmazonPreview component
- [ ] Verify product data loads with authentic information
- [ ] Confirm pricing, ratings, and availability display correctly
- [ ] Ensure affiliate tracking links preserved

### ✅ Extraction Methods (Try in Order)
1. **Primary**: ytInitialData from YouTube page HTML
2. **Secondary**: Meta tags (description, og:description)
3. **Tertiary**: JSON-LD structured data
4. **Fallback**: Return error if no authentic description found

### ✅ Quality Validation
- [ ] Description length > 10 characters
- [ ] No generic YouTube messages ("Enjoy the videos and music")
- [ ] All timestamps converted to clickable links
- [ ] All URLs properly formatted as clickable links
- [ ] Author information preserved if present
- [ ] Website links preserved if present

## AUTOMATION REQUIREMENTS

### ✅ Error Handling
- [ ] Return specific error if video is private/restricted
- [ ] Return specific error if description extraction fails
- [ ] Log all extraction attempts and methods used
- [ ] Provide detailed error messages for debugging

### ✅ Logging Requirements
- [ ] Log successful extraction method used
- [ ] Log description length and preview
- [ ] Log title and channel information
- [ ] Log any extraction failures with reasons

### ✅ Database Requirements
- [ ] Use existing blog_posts table structure
- [ ] Properly format categories array
- [ ] Generate appropriate tags from content
- [ ] Set correct readTime based on content length

## VERIFICATION STEPS

1. **Title Check**: Compare extracted title with YouTube page title
2. **Description Check**: Verify all links are clickable
3. **Amazon Check**: Verify Amazon links display as interactive product previews with authentic data
4. **Timestamp Check**: Verify timestamps jump to correct video moments
5. **Image Check**: Verify thumbnail displays correctly
6. **Content Check**: Verify no synthetic content was added

## CRITICAL RULES

❌ **NEVER DO:**
- Add custom descriptions or content
- Use placeholder text
- Modify authentic YouTube titles
- Remove or alter existing links
- Create synthetic timestamps
- Use custom images instead of YouTube thumbnails

✅ **ALWAYS DO:**
- Use authentic YouTube data only
- Preserve all original formatting
- Keep all links functional
- Maintain original author information
- Extract complete descriptions
- Use actual YouTube thumbnails