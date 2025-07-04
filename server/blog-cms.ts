import { Request, Response } from 'express';
import { storage } from './storage';
import { insertBlogPostSchema } from '@shared/schema';
import { z } from 'zod';

// Create a flexible schema for blog post updates that handles both string and array tags and categories
const flexibleBlogPostSchema = insertBlogPostSchema.extend({
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  categories: z.array(z.string()).optional()
});

// Helper function to normalize tags
function normalizeTags(tags: string | string[] | undefined): string | undefined {
  if (!tags) return undefined;
  if (Array.isArray(tags)) return JSON.stringify(tags);
  return tags;
}

// Clean blog posts from the scraper - authentic content from GetUpEarlier.com
const cleanBlogPosts = [
  {
    id: 'hit-a-new-strength-pr-of-100lbs-dumbbells-x-8-reps-50-years-old-5-7-165lbs-ironmasterpro',
    title: 'Hit a new strength PR of 100lbs dumbbells x 8 reps | 50 years old 5\' 7" 165lbs @IronmasterPro',
    slug: 'hit-a-new-strength-pr-of-100lbs-dumbbells-x-8-reps-50-years-old-5-7-165lbs-ironmasterpro',
    content: 'Hit a new strength PR of 100lbs dumbbells x 8 reps. The last rep took around 10 SECONDS of not giving up. That last rep and the negative (eccentric) did the trick. I followed this with one more working set of 100 x 5.\n\nMale 50 years old 5\' 7" 165lbs\n\nI\'m doing the same thing for my strength training clients at their precise levels. No gimmicks just smart compound movements with iron or bodyweight at an elevated intensity. Week after week.\n\nHowever. If you want to get back at it and don\'t need a trainer I highly recommend Ironmaster adjustable dumbbells.\n\nFrom around COVID time through now I was able to elevate back to this. I would never have gotten every heavy dumbbell from 75-120lbs so I would have never elevated past the old 50lb dumbbells I had for 20+ years.\n\nIf space is an issue and you want to lift heavy (70+lbs) this solves the problem. 3+ years of constant use and dropping as needed. Indestructible! My set can go as high as 105lbs. I\'m about to graduate to the 120\'s.',
    excerpt: 'Hit a new strength PR of 100lbs dumbbells x 8 reps. The last rep took around 10 SECONDS of not giving up.',
    category: 'Strength Training',
    tags: ['strength-training', 'ironmaster', 'dumbbells', 'pr'],
    author: 'Michael Baker',
    publishedDate: '2024-12-15T10:00:00.000Z',
    imageUrl: 'https://cdn.prod.website-files.com/678a4459aad73fea7208fd29/6844967b6fec0964ccf7956a_20250517_073713.00_13_26_11.Still003.jpg',
    videoUrl: 'https://www.youtube.com/embed/Z5R3DZGBIzo',
    isVideo: true,
    status: 'published'
  },
  {
    id: 'why-drop-sets-on-incline-dumbbell-presses-dr-mike-israetel-approved',
    title: 'Why drop sets on incline dumbbell presses (@dr.mike.israetel approved)',
    slug: 'why-drop-sets-on-incline-dumbbell-presses-dr-mike-israetel-approved',
    content: 'Drop sets are one of the most effective intensity techniques for building muscle, especially when time is limited. Dr. Mike Israetel research shows that drop sets can significantly increase training volume and muscle protein synthesis. For people over 40 with busy schedules, incline dumbbell press drop sets provide maximum bang for your buck - hitting the upper chest, front delts, and triceps in one efficient movement pattern.',
    excerpt: 'Dr. Mike Israetel approved drop sets on incline dumbbell presses for maximum muscle growth.',
    category: 'Strength Training',
    tags: ['drop-sets', 'incline-press', 'dr-mike-israetel'],
    author: 'Michael Baker',
    publishedDate: '2024-12-10T09:30:00.000Z',
    imageUrl: 'https://cdn.prod.website-files.com/678a4459aad73fea7208fd29/68189708bdea2915dae45e2e_20250429_074709.00_00_45_00.Still003.jpg',
    videoUrl: 'https://www.youtube.com/embed/XuOU4rnq1p4',
    isVideo: true,
    status: 'published'
  },
  {
    id: 'address-your-fear-of-discomfort-joe-rogan-motivational-discussion',
    title: 'Address your fear of discomfort - Joe Rogan motivational discussion',
    slug: 'address-your-fear-of-discomfort-joe-rogan-motivational-discussion',
    content: 'Joe Rogan discusses the importance of addressing our fear of discomfort. Most people avoid challenging situations that would help them grow because they fear temporary discomfort. This mindset keeps us stuck in mediocrity. The key is to recognize that discomfort is temporary, but the growth and confidence you gain from pushing through it lasts forever.',
    excerpt: 'Joe Rogan discusses the importance of addressing our fear of discomfort and how it holds us back from growth.',
    category: 'Mindset',
    tags: ['joe-rogan', 'discomfort', 'motivation', 'growth'],
    author: 'Michael Baker',
    publishedDate: '2024-12-05T08:00:00.000Z',
    imageUrl: 'https://cdn.prod.website-files.com/678a4458aad73fea7208fc9f/678a5eb0dfc262c4f1966dd3_AI-Wintrer-Runner4-text.png',
    videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_1', // Admin can edit with real video
    isVideo: true,
    status: 'published'
  },
  {
    id: 'how-to-lose-belly-fat-in-weeks-easy-no-bs-10-minute-guide',
    title: 'How to lose belly fat in weeks (easy no BS 10 minute guide)',
    slug: 'how-to-lose-belly-fat-in-weeks-easy-no-bs-10-minute-guide',
    content: 'Losing belly fat requires a combination of proper nutrition, strength training, and consistency. Here\'s the no-BS approach that works: 1) Create a moderate caloric deficit through whole foods, 2) Incorporate compound strength movements like squats and deadlifts, 3) Add 2-3 cardio sessions per week, 4) Get adequate sleep and manage stress. Skip the gimmicks and focus on sustainable habits.',
    excerpt: 'A straightforward, no-BS guide to losing belly fat in weeks through proper nutrition and exercise.',
    category: 'Weight Loss',
    tags: ['belly-fat', 'weight-loss', 'nutrition', 'exercise'],
    author: 'Michael Baker',
    publishedDate: '2024-12-01T07:00:00.000Z',
    imageUrl: 'https://cdn.prod.website-files.com/678a4459aad73fea7208fd29/678e3e27ed8efc26069bc262_training-ericaleebakerback-trice.jpeg',
    videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_2', // Admin can edit with real video
    isVideo: true,
    status: 'published'
  },
  {
    id: 'winter-running-motivation-tips-for-cold-weather-training',
    title: 'Winter Running Motivation: Tips for Cold Weather Training',
    slug: 'winter-running-motivation-tips-for-cold-weather-training',
    content: 'Winter running can be challenging, but it\'s also incredibly rewarding. The key is proper preparation and mindset. Layer your clothing properly, invest in good winter running gear, and start with shorter distances. Most importantly, focus on consistency over speed during winter months. The mental toughness you build running in cold weather will carry over to all areas of your life.',
    excerpt: 'Stay motivated and safe during winter running with these cold weather training tips.',
    category: 'Running',
    tags: ['winter-running', 'cold-weather', 'motivation', 'training'],
    author: 'Michael Baker',
    publishedDate: '2024-11-28T06:30:00.000Z',
    imageUrl: 'https://cdn.prod.website-files.com/678a4459aad73fea7208fd29/6794b76b83b2663913c2e57e_2025-01-21%2008-28-19.00_15_49_08.Still007.jpg',
    videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_3', // Admin can edit with real video
    isVideo: true,
    status: 'published'
  }
];

// Initialize the blog with clean data
export async function initializeBlogCMS() {
  console.log('Initializing Blog CMS with clean data...');
  
  try {
    for (const post of cleanBlogPosts) {
      // Calculate read time based on content length (average 200 words per minute)
      const wordCount = post.content.split(' ').length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      
      const blogPostData = {
        id: post.id,
        title: post.title,
        category: post.category,
        tags: post.tags.join(','), // Convert array to comma-separated string
        content: post.content,
        excerpt: post.excerpt,
        publishedDate: post.publishedDate,
        readTime,
        imageUrl: post.imageUrl,
        videoUrl: post.videoUrl,
        author: post.author,
        isVideo: post.isVideo
      };
      
      console.log('Creating blog post with data:', JSON.stringify(blogPostData, null, 2));
      await storage.createBlogPost(blogPostData);
    }
    console.log(`Successfully initialized ${cleanBlogPosts.length} blog posts`);
  } catch (error) {
    console.error('Error creating blog post:', error);
    console.error('Error initializing blog CMS:', error);
  }
}

// CMS API endpoints
export async function getAllBlogPosts(req: Request, res: Response) {
  try {
    const posts = await storage.getAllBlogPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
}

export async function getBlogPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const post = await storage.getBlogPost(id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
}

export async function createBlogPost(req: Request, res: Response) {
  try {
    const validatedData = flexibleBlogPostSchema.parse(req.body);
    
    // Normalize tags to string format for database storage
    const normalizedData = {
      ...validatedData,
      tags: normalizeTags(validatedData.tags) || '[]'
    };
    
    const post = await storage.createBlogPost(normalizedData);
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid blog post data', details: error.errors });
    }
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
}

export async function updateBlogPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const validatedData = flexibleBlogPostSchema.partial().parse(req.body);
    
    // Normalize tags to string format for database storage, only if tags field is present
    const normalizedData: any = {
      ...validatedData
    };
    
    if (validatedData.tags !== undefined) {
      normalizedData.tags = normalizeTags(validatedData.tags) || '[]';
    }
    
    // Handle categories - convert array to database format if present
    if (validatedData.categories !== undefined) {
      normalizedData.categories = validatedData.categories;
    }
    
    const post = await storage.updateBlogPost(id, normalizedData);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid blog post data', details: error.errors });
    }
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
}

export async function deleteBlogPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await storage.deleteBlogPost(id);
    if (!success) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
}