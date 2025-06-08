import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertRecipeSchema, insertWorkoutSchema, insertGoalSchema, insertFoodEntrySchema } from "@shared/schema";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static assets
  app.use('/assets', express.static('/home/runner/workspace/attached_assets'));
  
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
      
      if (search || category || dietType) {
        const recipes = await storage.searchRecipes(
          (search as string) || "",
          category as string,
          dietType as string
        );
        res.json(recipes);
      } else {
        const recipes = await storage.getRecipes();
        res.json(recipes);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recipe = await storage.getRecipe(id);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
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
      
      const recipe = await storage.createRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      res.status(400).json({ message: "Invalid recipe data" });
    }
  });

  app.put("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const recipe = await storage.updateRecipe(id, updates);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      res.status(400).json({ message: "Failed to update recipe" });
    }
  });

  app.delete("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteRecipe(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });

  // Workout routes
  app.get("/api/workouts", async (req, res) => {
    try {
      const { category } = req.query;
      
      if (category) {
        const workouts = await storage.getWorkoutsByCategory(category as string);
        res.json(workouts);
      } else {
        const workouts = await storage.getWorkouts();
        res.json(workouts);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get("/api/workouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workout = await storage.getWorkout(id);
      
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

  // PayPal routes
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  const httpServer = createServer(app);
  return httpServer;
}
