import type { Express } from "express";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createServer, type Server } from "http";
import { storage } from "./storage-fixed";
import { insertUserSchema, insertRecipeSchema, insertWorkoutSchema, insertGoalSchema, insertFoodEntrySchema, blogPosts } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { workoutService } from "./workoutService";
import { recipeService } from "./recipeService";
import { 
  initializeBlogCMS, 
  getAllBlogPosts as cmsGetAllBlogPosts, 
  getBlogPost as cmsGetBlogPost, 
  createBlogPost as cmsCreateBlogPost, 
  updateBlogPost as cmsUpdateBlogPost, 
  deleteBlogPost as cmsDeleteBlogPost 
} from './blog-cms';
import { getCachedLinkPreview } from './link-preview';
import { getYouTubeVideoMetadata, generateSlugFromTitle, createEmbedUrl } from './youtube-utils';

// Check if Stripe is configured
const STRIPE_CONFIGURED = !!process.env.STRIPE_SECRET_KEY;

// Import Stripe only if configured
let stripe: any = null;
if (STRIPE_CONFIGURED) {
  try {
    import("stripe").then((Stripe) => {
      stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2023-10-16",
      });
      console.log("Stripe configured successfully");
    }).catch((error) => {
      console.warn("Stripe SDK not available or configuration invalid:", error);
    });
  } catch (error) {
    console.warn("Failed to initialize Stripe:", error);
  }
}

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static assets
  app.use('/assets', express.static('/home/runner/workspace/attached_assets'));
  app.use('/uploads', express.static(uploadsDir)); // Serve uploaded files
  app.use(express.json({ limit: "50mb" }));
  
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd use proper session management or JWT
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Recipe routes
  app.get("/api/recipes", async (req, res) => {
    try {
      const { search, category, dietType } = req.query;
      
      console.log('API: Fetching recipes using recipe service...');
      if (search || category || dietType) {
        const recipes = await recipeService.searchRecipes(
          (search as string) || "",
          category as string,
          dietType as string
        );
        res.json(recipes);
      } else {
        const recipes = await recipeService.getAllRecipes();
        console.log('API: All recipes fetched:', recipes.length);
        res.json(recipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recipe = await recipeService.getRecipeById(id);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  app.post("/api/recipes", async (req, res) => {
    try {
      const recipeData = insertRecipeSchema.parse(req.body);
      
      // Auto-calculate nutrition if not provided
      if (!recipeData.calories || recipeData.calories === 0) {
        const { calculateNutrition } = await import("./nutrition-calculator");
        const nutrition = calculateNutrition(recipeData.ingredients, recipeData.servings);
        
        Object.assign(recipeData, nutrition);
      }
      
      const recipe = await recipeService.createRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(400).json({ message: "Invalid recipe data" });
    }
  });

  app.put("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const recipe = await recipeService.updateRecipe(id, updates);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(400).json({ message: "Failed to update recipe" });
    }
  });

  app.delete("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await recipeService.deleteRecipe(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        message: "File uploaded successfully",
        url: fileUrl,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Workout routes - using direct service to restore original data
  app.get("/api/workouts", async (req, res) => {
    try {
      console.log('API: Fetching workouts using workout service...');
      const { workoutService } = await import("./workoutService");
      const { category } = req.query;
      
      if (category) {
        const workouts = await workoutService.getWorkoutsByCategory(category as string);
        console.log('API: Workouts by category fetched:', workouts.length);
        res.json(workouts);
      } else {
        const workouts = await workoutService.getAllWorkouts();
        console.log('API: All workouts fetched:', workouts.length);
        res.json(workouts);
      }
    } catch (error) {
      console.error('API: Error fetching workouts:', error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get("/api/workouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { workoutService } = await import("./workoutService");
      const workout = await workoutService.getWorkoutById(id);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.json(workout);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout data" });
    }
  });

  // Goal routes
  app.get("/api/goals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goals = await storage.getUserGoals(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const goalData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(goalData);
      res.status(201).json(goal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const goal = await storage.updateGoal(id, updates);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Failed to update goal" });
    }
  });

  // Food tracking routes
  app.get("/api/food-entries/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { date } = req.query;
      
      const dateObj = date ? new Date(date as string) : undefined;
      const entries = await storage.getUserFoodEntries(userId, dateObj);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch food entries" });
    }
  });

  app.post("/api/food-entries", async (req, res) => {
    try {
      const entryData = insertFoodEntrySchema.parse(req.body);
      const entry = await storage.createFoodEntry(entryData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid food entry data" });
    }
  });

  app.delete("/api/food-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFoodEntry(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Food entry not found" });
      }
      
      res.json({ message: "Food entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete food entry" });
    }
  });

  // Water intake routes
  app.get("/api/water-intake/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { date } = req.query;
      
      const dateObj = date ? new Date(date as string) : new Date();
      const intake = await storage.getUserWaterIntake(userId, dateObj);
      res.json(intake || { glasses: 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch water intake" });
    }
  });

  app.post("/api/water-intake", async (req, res) => {
    try {
      const { userId, date, glasses } = req.body;
      const dateObj = new Date(date);
      const intake = await storage.updateWaterIntake(userId, dateObj, glasses);
      res.json(intake);
    } catch (error) {
      res.status(400).json({ message: "Failed to update water intake" });
    }
  });

  // Achievement routes
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Newsletter signup
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // In a real app, you'd integrate with an email service
      res.json({ message: "Successfully subscribed to newsletter!" });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Stripe not configured" });
    }

    try {
      const { amount, bookType, description } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          bookType: bookType || "digital",
          description: description || "Get Up Earlier Recipe Book"
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/create-subscription", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Stripe not configured" });
    }

    try {
      const { plan, userId } = req.body;
      const user = await storage.getUser(userId || 1); // Default to user 1 for demo

      if (!user.email) {
        throw new Error('No user email on file');
      }

      // Create customer if needed
      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
        });
        
        // Update user with Stripe customer ID
        await storage.updateUser(user.id, { stripeCustomerId: customer.id });
      }

      // Create subscription
      const priceMap = {
        pro: "price_1234567890", // Replace with actual Stripe price ID
        premium: "price_0987654321" // Replace with actual Stripe price ID
      };

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: priceMap[plan as keyof typeof priceMap] || priceMap.pro,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user subscription info
      await storage.updateUser(user.id, { 
        stripeSubscriptionId: subscription.id,
        subscriptionTier: plan 
      });

      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Stripe subscription error:", error);
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });

  // Blog CMS routes
  app.get("/api/blog", cmsGetAllBlogPosts);
  app.get("/api/blog/:id", cmsGetBlogPost);
  app.post("/api/blog", cmsCreateBlogPost);
  app.put("/api/blog/:id", cmsUpdateBlogPost);
  app.delete("/api/blog/:id", cmsDeleteBlogPost);

  // Initialize Blog CMS with clean data
  app.post("/api/blog/initialize", async (req, res) => {
    try {
      await initializeBlogCMS();
      res.json({ success: true, message: "Blog CMS initialized with clean data" });
    } catch (error: any) {
      console.error("Error initializing blog CMS:", error);
      res.status(500).json({ message: "Error initializing blog CMS: " + error.message });
    }
  });

  // Initialize CMS on startup if no posts exist
  setTimeout(async () => {
    try {
      const posts = await storage.getAllBlogPosts();
      if (posts.length === 0) {
        console.log("No blog posts found, initializing CMS with clean data...");
        await initializeBlogCMS();
        console.log("Blog CMS initialized successfully");
      }
    } catch (error) {
      console.error("Error checking/initializing blog CMS:", error);
    }
  }, 1000);

  // Legacy blog routes for backward compatibility
  app.get("/api/blog-legacy", async (req, res) => {
    try {
      // Get original posts from website scraper
      const { scrapeBlogPosts } = await import('./blog-scraper');
      const scrapedPosts = await scrapeBlogPosts();
      
      // Get database posts (Facebook and any others) - order by creation time (newest first)
      const { blogPosts } = await import('../shared/schema');
      const { db } = await import('./db');
      const { desc } = await import('drizzle-orm');
      const dbPosts = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedDate));
      
      // Convert database posts to blog format and filter out blank posts
      const formattedDbPosts = dbPosts
        .filter(post => post.content && post.content.trim().length > 0)
        .map(post => ({
          ...post,
          publishedDate: post.publishedDate || post.createdAt?.toISOString() || new Date().toISOString(),
          readTime: post.readTime || Math.ceil((post.content?.length || 0) / 200), // Calculate read time if not set
          isVideo: Boolean(post.videoUrl),
          originalUrl: post.originalUrl || '',
          tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags || []
        }));
      
      // Combine all posts: newest database posts first, then original scraped posts
      const allPosts = [...formattedDbPosts, ...scrapedPosts];
      
      res.json(allPosts);
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      
      // Return empty array instead of fallback data
      const fallbackPosts = [
        {
          id: "winter-running-motivation",
          title: "Finding Motivation for Winter Running",
          excerpt: "Strategies for maintaining your running routine during the colder months when motivation is low.",
          content: "Winter running can be challenging, but with the right mindset and preparation...",
          author: "Michael Baker",
          publishedDate: "2024-12-15T00:00:00Z",
          category: "training",
          tags: ["running", "winter", "motivation"],
          imageUrl: "https://cdn.prod.website-files.com/678a4458aad73fea7208fc9f/678ab3d4caec71062e65470f_erddd_1749497849578.jpg",
          readTime: 5,
          isVideo: false,
          originalUrl: "https://www.getupearlier.com/blog/winter-running-motivation"
        },
        {
          id: "nutrition-fundamentals",
          title: "Nutrition Fundamentals for Active Adults",
          excerpt: "Essential nutrition principles to fuel your workouts and recovery effectively.",
          content: "Understanding the basics of nutrition is crucial for anyone leading an active lifestyle...",
          author: "Michael Baker",
          publishedDate: "2024-12-10T00:00:00Z",
          category: "nutrition",
          tags: ["nutrition", "fundamentals", "health"],
          imageUrl: "https://cdn.prod.website-files.com/678a4458aad73fea7208fc9f/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg",
          readTime: 7,
          isVideo: false,
          originalUrl: "https://www.getupearlier.com/blog/nutrition-fundamentals"
        }
      ];
      
      res.json(fallbackPosts);
    }
  });

  // Webflow blog scraper endpoint
  app.post("/api/scrape-webflow-blog", async (req, res) => {
    try {
      console.log('API: Starting Webflow blog scraper...');
      const { scrapeWebflowBlog } = await import('./webflow-blog-scraper');
      const result = await scrapeWebflowBlog();
      
      res.json({
        message: `Webflow blog scraping completed successfully`,
        success: result.success,
        savedCount: result.savedCount,
        totalFound: result.totalFound
      });
    } catch (error: any) {
      console.error("Error in Webflow blog scraper:", error);
      res.status(500).json({ 
        message: "Failed to scrape Webflow blog", 
        error: error.message 
      });
    }
  });

  // Fix thumbnails for existing blog posts
  app.post("/api/fix-blog-thumbnails", async (req, res) => {
    try {
      console.log('API: Starting thumbnail fix...');
      const { fixBlogThumbnails } = await import('./webflow-blog-scraper');
      const result = await fixBlogThumbnails();
      
      res.json({
        message: `Thumbnail fix completed successfully`,
        success: result.success,
        updatedCount: result.updatedCount
      });
    } catch (error: any) {
      console.error("Error fixing thumbnails:", error);
      res.status(500).json({ 
        message: "Failed to fix thumbnails", 
        error: error.message 
      });
    }
  });

  // PayPal routes
  app.get("/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // User favorites routes
  app.get("/api/users/:userId/favorites", async (req, res) => {
    try {
      const userId = req.params.userId;
      const favorites = await storage.getUserFavoriteRecipes(userId);
      res.json(favorites);
    } catch (error: any) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ message: "Error fetching favorites: " + error.message });
    }
  });

  app.post("/api/users/:userId/favorites", async (req, res) => {
    try {
      const userId = req.params.userId;
      const { recipeId } = req.body;
      
      if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required" });
      }

      // Check if already favorited to prevent duplicates
      const isAlreadyFavorited = await storage.isRecipeFavorited(userId, recipeId);
      if (isAlreadyFavorited) {
        return res.status(200).json({ message: "Recipe is already in favorites" });
      }

      const favorite = await storage.addFavoriteRecipe(userId, recipeId);
      res.json(favorite);
    } catch (error: any) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Error adding favorite: " + error.message });
    }
  });

  app.delete("/api/users/:userId/favorites/:recipeId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const recipeId = parseInt(req.params.recipeId);
      
      const removed = await storage.removeFavoriteRecipe(userId, recipeId);
      if (removed) {
        res.json({ message: "Favorite removed successfully" });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error: any) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Error removing favorite: " + error.message });
    }
  });

  // User favorite workouts routes
  app.get("/api/users/:userId/favorite-workouts", async (req, res) => {
    try {
      const userId = req.params.userId;
      const favorites = await storage.getUserFavoriteWorkouts(userId);
      res.json(favorites);
    } catch (error: any) {
      console.error("Error fetching user favorite workouts:", error);
      res.status(500).json({ message: "Error fetching favorite workouts: " + error.message });
    }
  });

  app.post("/api/users/:userId/favorite-workouts", async (req, res) => {
    try {
      const userId = req.params.userId;
      const { workoutId } = req.body;
      
      if (!workoutId) {
        return res.status(400).json({ message: "Workout ID is required" });
      }

      // Check if already favorited to prevent duplicates
      const isAlreadyFavorited = await storage.isWorkoutFavorited(userId, workoutId);
      if (isAlreadyFavorited) {
        return res.status(200).json({ message: "Workout is already in favorites" });
      }

      const favorite = await storage.addFavoriteWorkout(userId, workoutId);
      res.json(favorite);
    } catch (error: any) {
      console.error("Error adding favorite workout:", error);
      res.status(500).json({ message: "Error adding favorite workout: " + error.message });
    }
  });

  app.delete("/api/users/:userId/favorite-workouts/:workoutId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const workoutId = parseInt(req.params.workoutId);
      
      const removed = await storage.removeFavoriteWorkout(userId, workoutId);
      if (removed) {
        res.json({ message: "Favorite workout removed successfully" });
      } else {
        res.status(404).json({ message: "Favorite workout not found" });
      }
    } catch (error: any) {
      console.error("Error removing favorite workout:", error);
      res.status(500).json({ message: "Error removing favorite workout: " + error.message });
    }
  });

  // Meal plan routes
  app.get("/api/users/:userId/meal-plans", async (req, res) => {
    try {
      const userId = req.params.userId;
      const mealPlans = await storage.getUserMealPlans(userId);
      res.json(mealPlans);
    } catch (error: any) {
      console.error("Error fetching meal plans:", error);
      res.status(500).json({ message: "Error fetching meal plans: " + error.message });
    }
  });

  app.post("/api/users/:userId/meal-plans", async (req, res) => {
    try {
      const userId = req.params.userId;
      const { name, date } = req.body;
      
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }

      const mealPlan = await storage.createMealPlan({
        userId,
        name: name || "My Meal Plan",
        date: new Date(date),
      });
      res.json(mealPlan);
    } catch (error: any) {
      console.error("Error creating meal plan:", error);
      res.status(500).json({ message: "Error creating meal plan: " + error.message });
    }
  });

  app.get("/api/meal-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mealPlan = await storage.getMealPlan(id);
      
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      
      res.json(mealPlan);
    } catch (error: any) {
      console.error("Error fetching meal plan:", error);
      res.status(500).json({ message: "Error fetching meal plan: " + error.message });
    }
  });

  app.delete("/api/meal-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMealPlan(id);
      
      if (deleted) {
        res.json({ message: "Meal plan deleted successfully" });
      } else {
        res.status(404).json({ message: "Meal plan not found" });
      }
    } catch (error: any) {
      console.error("Error deleting meal plan:", error);
      res.status(500).json({ message: "Error deleting meal plan: " + error.message });
    }
  });

  app.get("/api/meal-plans/:id/recipes", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recipes = await storage.getMealPlanRecipes(id);
      res.json(recipes);
    } catch (error: any) {
      console.error("Error fetching meal plan recipes:", error);
      res.status(500).json({ message: "Error fetching meal plan recipes: " + error.message });
    }
  });

  app.post("/api/meal-plans/:id/recipes", async (req, res) => {
    try {
      const mealPlanId = parseInt(req.params.id);
      const { recipeId, mealType } = req.body;
      
      if (!recipeId || !mealType) {
        return res.status(400).json({ message: "Recipe ID and meal type are required" });
      }

      const mealPlanRecipe = await storage.addRecipeToMealPlan(mealPlanId, recipeId, mealType);
      res.json(mealPlanRecipe);
    } catch (error: any) {
      console.error("Error adding recipe to meal plan:", error);
      res.status(500).json({ message: "Error adding recipe to meal plan: " + error.message });
    }
  });

  app.delete("/api/meal-plans/:id/recipes/:recipeId", async (req, res) => {
    try {
      const mealPlanId = parseInt(req.params.id);
      const recipeId = parseInt(req.params.recipeId);
      
      const removed = await storage.removeRecipeFromMealPlan(mealPlanId, recipeId);
      if (removed) {
        res.json({ message: "Recipe removed from meal plan successfully" });
      } else {
        res.status(404).json({ message: "Recipe not found in meal plan" });
      }
    } catch (error: any) {
      console.error("Error removing recipe from meal plan:", error);
      res.status(500).json({ message: "Error removing recipe from meal plan: " + error.message });
    }
  });

  // Save user profile data from calorie calculator
  app.post("/api/user/profile", async (req, res) => {
    try {
      // Development mode - use default user ID
      const developmentUserId = "dev_user_1";

      const { age, sex, height, currentWeight, desiredWeight, activityLevel, goal, unitSystem, macroProfile } = req.body;
      
      // Store weights in their original units for simplicity
      const profileData = {
        age: age ? parseInt(age) : null,
        sex: sex || null,
        height: height ? parseInt(height) : null,
        currentWeight: currentWeight ? parseFloat(currentWeight) : null,
        desiredWeight: desiredWeight ? parseFloat(desiredWeight) : null,
        activityLevel: activityLevel || null,
        goal: goal || null,
        unitSystem: unitSystem || 'imperial',
        macroProfile: macroProfile || 'balanced'
      };

      const updatedUser = await storage.updateUserProfile(developmentUserId, profileData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile saved successfully", user: updatedUser });
    } catch (error) {
      console.error("Error saving user profile:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  // Get user profile data
  app.get("/api/user/profile", async (req, res) => {
    try {
      // Development mode - use default user ID
      const developmentUserId = "dev_user_1";

      console.log("Profile API: Fetching user from storage...");
      let user = await storage.getUser(developmentUserId);
      console.log("Profile API: Retrieved user data:", user ? `age=${user.age}, source=database` : "not found");
      
      if (!user) {
        // Create development user if doesn't exist
        console.log("Profile API: Creating new development user...");
        user = await storage.createUser({
          id: developmentUserId,
          email: "developer@getupear.lier.com",
          firstName: "Developer",
          lastName: "User"
        });
      }

      // Return stored data directly (no conversion needed)
      const profileData = {
        age: user.age,
        sex: user.sex,
        height: user.height,
        currentWeight: user.currentWeight,
        desiredWeight: user.desiredWeight,
        activityLevel: user.activityLevel,
        goal: user.goal,
        unitSystem: user.unitSystem || 'imperial',
        macroProfile: user.macroProfile || 'balanced'
      };

      console.log("Profile API: Returning profile data with age:", profileData.age);
      res.json(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Save calculation results to user profile
  app.post("/api/user/save-result", async (req, res) => {
    try {
      // Development mode - use default user ID
      const developmentUserId = "dev_user_1";

      const { type, data } = req.body;
      
      if (!type || !data) {
        return res.status(400).json({ message: "Type and data are required" });
      }

      const result = await storage.createCalculatorResult({
        userId: developmentUserId,
        calculatorType: type,
        results: JSON.stringify(data),
        userInputs: JSON.stringify(data)
      });

      res.json({ message: "Results saved successfully", result });
    } catch (error) {
      console.error("Error saving result:", error);
      res.status(500).json({ message: "Failed to save result" });
    }
  });

  // Get user's saved results
  app.get("/api/user/saved-results", async (req, res) => {
    try {
      // Development mode - use default user ID
      const developmentUserId = "dev_user_1";

      const results = await storage.getUserCalculatorResults(developmentUserId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching saved results:", error);
      res.status(500).json({ message: "Failed to fetch saved results" });
    }
  });

  // Get user's favorite recipes
  app.get("/api/users/:userId/favorites", async (req, res) => {
    try {
      // Development mode - always use consistent user ID
      const developmentUserId = 1;
      console.log('Getting favorites for userId:', developmentUserId);
      const favoriteRecipes = await storage.getUserFavoriteRecipes(developmentUserId);
      res.json(favoriteRecipes);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Add recipe to favorites
  app.post("/api/users/:userId/favorites", async (req, res) => {
    try {
      // Development mode - always use consistent user ID
      const developmentUserId = 1;
      const { recipeId } = req.body;
      
      if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required" });
      }

      const favorite = await storage.addFavoriteRecipe(developmentUserId, parseInt(recipeId));
      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  // Remove recipe from favorites
  app.delete("/api/users/:userId/favorites/:recipeId", async (req, res) => {
    try {
      // Development mode - use numeric user ID 1
      const success = await storage.removeFavoriteRecipe(1, parseInt(req.params.recipeId));
      
      if (success) {
        res.json({ message: "Recipe removed from favorites" });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Check if recipe is favorited
  app.get("/api/users/:userId/favorites/:recipeId/check", async (req, res) => {
    try {
      const userId = req.params.userId;
      const recipeId = parseInt(req.params.recipeId);
      
      const isFavorited = await storage.isRecipeFavorited(userId, recipeId);
      res.json({ isFavorited });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Check if workout is favorited
  app.get("/api/users/:userId/favorite-workouts/:workoutId/check", async (req, res) => {
    try {
      const userId = req.params.userId;
      const workoutId = parseInt(req.params.workoutId);
      
      const isFavorited = await storage.isWorkoutFavorited(userId, workoutId);
      res.json({ isFavorited });
    } catch (error) {
      console.error("Error checking workout favorite status:", error);
      res.status(500).json({ message: "Failed to check workout favorite status" });
    }
  });

  // Calculator results routes
  app.get("/api/calculator-results", async (req, res) => {
    try {
      // Development mode - use consistent user ID
      const developmentUserId = "dev_user_1";
      const results = await storage.getUserCalculatorResults(developmentUserId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching calculator results:", error);
      res.status(500).json({ message: "Failed to fetch calculator results" });
    }
  });

  app.post("/api/calculator-results", async (req, res) => {
    try {
      // Development mode - use consistent user ID
      const developmentUserId = "dev_user_1";
      const { calculatorType, results, userInputs } = req.body;
      
      const calculatorResult = await storage.createCalculatorResult({
        userId: developmentUserId,
        calculatorType,
        results,
        userInputs
      });

      res.json(calculatorResult);
    } catch (error) {
      console.error("Error saving calculator result:", error);
      res.status(500).json({ message: "Failed to save calculator result" });
    }
  });

  // PayPal routes
  app.post("/api/paypal/order", createPaypalOrder);
  app.post("/api/paypal/order/:orderID/capture", capturePaypalOrder);

  // YouTube video blog creation route
  app.post("/api/blog/create-youtube-video", async (req, res) => {
    try {
      const { youtubeUrl, customTitle, customDescription, category } = req.body;
      
      if (!youtubeUrl) {
        return res.status(400).json({ message: "YouTube URL is required" });
      }
      
      console.log(`Fetching YouTube video metadata for: ${youtubeUrl}`);
      const videoData = await getYouTubeVideoMetadata(youtubeUrl);
      
      if (!videoData) {
        return res.status(400).json({ 
          message: "Could not extract YouTube video data. Please ensure the video is public and accessible.",
          error: "EXTRACTION_FAILED"
        });
      }
      
      // Validate that we have proper content
      if (!videoData.description || videoData.description.length < 10) {
        return res.status(400).json({ 
          message: "Could not extract video description. The video might be private or have restricted content.",
          error: "NO_DESCRIPTION"
        });
      }
      
      const title = customTitle || videoData.title;
      const description = customDescription || videoData.description;
      const slug = generateSlugFromTitle(title, videoData.videoId);
      const embedUrl = createEmbedUrl(videoData.videoId);
      
      // Determine category based on content or use custom category
      let videoCategory = category || 'General';
      const contentLower = (title + ' ' + description).toLowerCase();
      if (!category) {
        if (contentLower.includes('workout') || contentLower.includes('training') || contentLower.includes('strength')) {
          videoCategory = 'Strength Training';
        } else if (contentLower.includes('nutrition') || contentLower.includes('food') || contentLower.includes('diet')) {
          videoCategory = 'Nutrition';
        } else if (contentLower.includes('running') || contentLower.includes('marathon') || contentLower.includes('cardio')) {
          videoCategory = 'Running';
        } else if (contentLower.includes('yoga') || contentLower.includes('mindfulness') || contentLower.includes('meditation')) {
          videoCategory = 'Mindset';
        } else if (contentLower.includes('nyc marathon')) {
          videoCategory = 'NYC Marathon';
        } else if (contentLower.includes('marathon')) {
          videoCategory = 'Marathon';
        }
      }
      
      // Extract meaningful tags from title and description (no generic video/youtube tags)
      const tags = [];
      if (contentLower.includes('workout')) tags.push('workout');
      if (contentLower.includes('training')) tags.push('training');
      if (contentLower.includes('nutrition')) tags.push('nutrition');
      if (contentLower.includes('running')) tags.push('running');
      if (contentLower.includes('strength')) tags.push('strength');
      if (contentLower.includes('dumbbell')) tags.push('dumbbells');
      if (contentLower.includes('ironmaster')) tags.push('ironmaster');
      if (contentLower.includes('50 years') || contentLower.includes('over 40')) tags.push('over-40');
      if (contentLower.includes('marathon')) tags.push('marathon');
      if (contentLower.includes('nyc')) tags.push('nyc');
      if (contentLower.includes('2024')) tags.push('2024');
      // Don't add generic 'video' or 'youtube' tags as per user requirements
      
      const blogPost = {
        id: `youtube-${videoData.videoId}`,
        title: title,
        slug: slug,
        excerpt: description.slice(0, 200) + (description.length > 200 ? '...' : ''),
        content: description,
        author: 'Michael Baker',
        publishedDate: new Date().toISOString(),
        category: videoCategory,
        tags: JSON.stringify(Array.from(new Set(tags))),
        imageUrl: videoData.thumbnail,
        videoUrl: embedUrl,
        readTime: Math.ceil(description.length / 200) || 3,
        isVideo: true,
        originalUrl: youtubeUrl
      };

      // Check if post already exists
      const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.id, blogPost.id));
      
      if (existingPost.length === 0) {
        await db.insert(blogPosts).values(blogPost);
        console.log(`Added new YouTube video blog: "${title}"`);
        res.json({ 
          success: true, 
          message: `Successfully created video blog: "${title}"`,
          post: blogPost,
          videoData: videoData
        });
      } else {
        res.json({ 
          success: false, 
          message: `Video blog already exists: "${title}"` 
        });
      }
      
    } catch (error: any) {
      console.error("Error creating YouTube video blog:", error);
      res.status(500).json({ message: "Error creating YouTube video blog: " + error.message });
    }
  });

  // Facebook post creation routes
  app.post("/api/blog/create-facebook-post", async (req, res) => {
    try {
      const { title, content, images, postUrl } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }
      
      // Extract post ID from URL or generate one
      const postIdMatch = postUrl?.match(/posts\/(\d+)/) || [];
      const postId = postIdMatch[1] || Date.now().toString();
      
      // Use first image as featured image
      const featuredImage = images && images.length > 0 ? images[0] : undefined;
      
      // Categorize post based on content
      const contentLower = content.toLowerCase();
      let category = 'General';
      if (contentLower.includes('recipe') || contentLower.includes('nutrition')) {
        category = 'Nutrition';
      } else if (contentLower.includes('workout') || contentLower.includes('training')) {
        category = 'Workouts';
      } else if (contentLower.includes('running') || contentLower.includes('marathon')) {
        category = 'Running';
      } else if (contentLower.includes('inspiration') || contentLower.includes('motivation')) {
        category = 'Inspiration';
      }
      
      // Extract tags
      const hashtagMatches = content.match(/#\w+/g) || [];
      const hashtags = hashtagMatches.map(tag => tag.slice(1).toLowerCase());
      const tags = [...hashtags];
      
      if (contentLower.includes('50 years old') || contentLower.includes('over 40')) {
        tags.push('over-40', 'mature-athlete');
      }
      if (contentLower.includes('ironmaster') || contentLower.includes('dumbbell')) {
        tags.push('ironmaster', 'dumbbells');
      }
      if (contentLower.includes('pr') || contentLower.includes('personal record')) {
        tags.push('personal-record');
      }
      
      const blogPost = {
        id: `fb-group-${postId}`,
        title: title,
        excerpt: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
        content: content,
        author: 'Michael Baker',
        publishedDate: new Date().toISOString(),
        category: category,
        tags: JSON.stringify(Array.from(new Set(tags))),
        imageUrl: featuredImage,
        videoUrl: null,
        readTime: Math.ceil(content.length / 200) || 1,
        isVideo: false,
        originalUrl: postUrl
      };

      // Check if post already exists
      const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.id, blogPost.id));
      
      if (existingPost.length === 0) {
        await db.insert(blogPosts).values(blogPost);
        console.log(`Added new Facebook post: "${title}"`);
        res.json({ 
          success: true, 
          message: `Successfully added post: "${title}" with ${images?.length || 0} images`,
          post: blogPost
        });
      } else {
        res.json({ 
          success: false, 
          message: `Post already exists: "${title}"` 
        });
      }
      
    } catch (error: any) {
      console.error("Error creating Facebook post:", error);
      res.status(500).json({ message: "Error creating Facebook post: " + error.message });
    }
  });

  // Blog post edit and delete routes
  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error: any) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Error fetching blog post: " + error.message });
    }
  });



  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ success: true, message: "Blog post deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Error deleting blog post: " + error.message });
    }
  });

  // Link Preview API endpoint
  app.get("/api/link-preview", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: "URL parameter is required" });
      }

      // Only allow Amazon URLs for security
      if (!url.includes('amazon.') && !url.includes('amzn.')) {
        return res.status(400).json({ message: "Only Amazon URLs are supported" });
      }

      console.log(`Fetching link preview for: ${url}`);
      const preview = await getCachedLinkPreview(url);
      
      if (!preview) {
        return res.status(404).json({ message: "Could not fetch link preview" });
      }

      res.json(preview);
    } catch (error: any) {
      console.error("Error fetching link preview:", error);
      res.status(500).json({ message: "Error fetching link preview: " + error.message });
    }
  });

  // =============================================================================
  // ZAPIER WEBHOOK ENDPOINTS
  // =============================================================================

  // Generic webhook endpoint for any Zapier integration
  app.post("/api/webhooks/zapier", async (req, res) => {
    try {
      const { type, data } = req.body;
      
      if (!type || !data) {
        return res.status(400).json({ 
          success: false, 
          message: "Type and data are required" 
        });
      }

      console.log(`Zapier webhook received: ${type}`, data);
      
      // Log the webhook data for debugging
      const webhookLog = {
        timestamp: new Date().toISOString(),
        type,
        data: JSON.stringify(data),
        processed: true
      };
      
      // You can store webhook logs in your database if needed
      // await storage.createWebhookLog(webhookLog);

      res.json({ 
        success: true, 
        message: `Webhook processed successfully`,
        received: webhookLog 
      });
    } catch (error: any) {
      console.error("Error processing Zapier webhook:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error processing webhook: " + error.message 
      });
    }
  });

  // New user registration webhook (from forms, lead magnets, etc.)
  app.post("/api/webhooks/new-user", async (req, res) => {
    try {
      const { email, firstName, lastName, phone, source } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is required" 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.json({ 
          success: true, 
          message: "User already exists",
          user: existingUser 
        });
      }

      // Create new user
      const newUser = await storage.createUser({
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || '',
        source: source || 'zapier_webhook'
      });

      console.log(`New user created via Zapier: ${email}`);
      
      res.json({ 
        success: true, 
        message: "User created successfully",
        user: newUser 
      });
    } catch (error: any) {
      console.error("Error creating user via webhook:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error creating user: " + error.message 
      });
    }
  });

  // Goal tracking webhook (from habit tracking apps, calendars, etc.)
  app.post("/api/webhooks/goal-update", async (req, res) => {
    try {
      const { email, goalType, goalValue, status, date, notes } = req.body;
      
      if (!email || !goalType) {
        return res.status(400).json({ 
          success: false, 
          message: "Email and goalType are required" 
        });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      // Create goal entry
      const goalEntry = await storage.createGoal({
        userId: user.id,
        type: goalType,
        targetValue: goalValue || 0,
        status: status || 'active',
        notes: notes || '',
        createdAt: date ? new Date(date) : new Date()
      });

      console.log(`Goal updated via Zapier for user: ${email}`);
      
      res.json({ 
        success: true, 
        message: "Goal updated successfully",
        goal: goalEntry 
      });
    } catch (error: any) {
      console.error("Error updating goal via webhook:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error updating goal: " + error.message 
      });
    }
  });

  // Workout completion webhook (from fitness apps, wearables, etc.)
  app.post("/api/webhooks/workout-completed", async (req, res) => {
    try {
      const { email, workoutName, duration, calories, date, notes } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is required" 
        });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      // Log workout completion
      const workoutLog = {
        userId: user.id,
        workoutName: workoutName || 'Unknown Workout',
        duration: duration || 0,
        calories: calories || 0,
        completedAt: date ? new Date(date) : new Date(),
        notes: notes || ''
      };

      console.log(`Workout completed via Zapier for user: ${email}`, workoutLog);
      
      res.json({ 
        success: true, 
        message: "Workout logged successfully",
        workout: workoutLog 
      });
    } catch (error: any) {
      console.error("Error logging workout via webhook:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error logging workout: " + error.message 
      });
    }
  });

  // Nutrition tracking webhook (from MyFitnessPal, Cronometer, etc.)
  app.post("/api/webhooks/nutrition-logged", async (req, res) => {
    try {
      const { email, foodName, calories, protein, carbs, fat, date, mealType } = req.body;
      
      if (!email || !foodName) {
        return res.status(400).json({ 
          success: false, 
          message: "Email and foodName are required" 
        });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      // Create food entry
      const foodEntry = await storage.createFoodEntry({
        userId: user.id,
        foodName,
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        mealType: mealType || 'other',
        date: date ? new Date(date) : new Date()
      });

      console.log(`Nutrition logged via Zapier for user: ${email}`);
      
      res.json({ 
        success: true, 
        message: "Nutrition logged successfully",
        entry: foodEntry 
      });
    } catch (error: any) {
      console.error("Error logging nutrition via webhook:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error logging nutrition: " + error.message 
      });
    }
  });

  // Blog post creation webhook (from content management tools)
  app.post("/api/webhooks/create-blog-post", async (req, res) => {
    try {
      const { title, content, excerpt, tags, category, featuredImage, author } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ 
          success: false, 
          message: "Title and content are required" 
        });
      }

      // Create blog post
      const blogPost = await storage.createBlogPost({
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        tags: tags || [],
        category: category || 'General',
        featuredImage: featuredImage || '',
        author: author || 'Michael Baker',
        status: 'published',
        publishedAt: new Date()
      });

      console.log(`Blog post created via Zapier: ${title}`);
      
      res.json({ 
        success: true, 
        message: "Blog post created successfully",
        post: blogPost 
      });
    } catch (error: any) {
      console.error("Error creating blog post via webhook:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error creating blog post: " + error.message 
      });
    }
  });

  // Email notification webhook (trigger emails based on user actions)
  app.post("/api/webhooks/send-notification", async (req, res) => {
    try {
      const { email, type, subject, message, data } = req.body;
      
      if (!email || !type) {
        return res.status(400).json({ 
          success: false, 
          message: "Email and type are required" 
        });
      }

      // Log notification request
      const notification = {
        timestamp: new Date().toISOString(),
        email,
        type,
        subject: subject || 'Notification from Get Up Earlier',
        message: message || 'You have a new notification',
        data: data || {}
      };

      console.log(`Notification webhook received for: ${email}`, notification);
      
      // In a real implementation, you would send actual emails here
      // For now, we'll just log and confirm receipt
      
      res.json({ 
        success: true, 
        message: "Notification processed successfully",
        notification 
      });
    } catch (error: any) {
      console.error("Error processing notification webhook:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error processing notification: " + error.message 
      });
    }
  });

  // Webhook verification endpoint (for Zapier setup)
  app.get("/api/webhooks/verify", async (req, res) => {
    res.json({ 
      success: true, 
      message: "Webhook endpoint is active",
      timestamp: new Date().toISOString(),
      endpoints: [
        "/api/webhooks/zapier - Generic webhook",
        "/api/webhooks/new-user - New user registration",
        "/api/webhooks/goal-update - Goal tracking",
        "/api/webhooks/workout-completed - Workout logging",
        "/api/webhooks/nutrition-logged - Nutrition tracking",
        "/api/webhooks/create-blog-post - Blog post creation",
        "/api/webhooks/send-notification - Email notifications"
      ]
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
