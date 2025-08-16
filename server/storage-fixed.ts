import type { User, Recipe, Workout, Goal, FoodEntry, Achievement, WaterIntake, FavoriteRecipe, FavoriteWorkout, MealPlan, MealPlanRecipe, CalculatorResult, BlogPost, TrainingLogEntry, InsertUser, InsertRecipe, InsertWorkout, InsertGoal, InsertFoodEntry, InsertAchievement, InsertWaterIntake, InsertFavoriteRecipe, InsertFavoriteWorkout, InsertMealPlan, InsertMealPlanRecipe, InsertCalculatorResult, InsertBlogPost, InsertTrainingLogEntry } from "../shared/schema";
import { users, recipes, workouts, goals, foodEntries, achievements, waterIntake, favoriteRecipes, favoriteWorkouts, mealPlans, mealPlanRecipes, calculatorResults, blogPosts, trainingLogEntries } from "../shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserProfile(id: string, profileData: {
    age?: number;
    sex?: string;
    height?: number;
    currentWeight?: number;
    desiredWeight?: number;
    activityLevel?: string;
    goal?: string;
    unitSystem?: string;
    macroProfile?: string;
  }): Promise<User | undefined>;

  // Recipe methods
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;
  searchRecipes(query: string, category?: string, dietType?: string): Promise<Recipe[]>;

  // Workout methods
  getWorkouts(): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: number, updates: Partial<Workout>): Promise<Workout | undefined>;
  deleteWorkout(id: number): Promise<boolean>;
  getWorkoutsByCategory(category: string): Promise<Workout[]>;

  // Goal methods
  getUserGoals(userId: number): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;

  // Food tracking methods
  getUserFoodEntries(userId: number, date?: Date): Promise<FoodEntry[]>;
  createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  deleteFoodEntry(id: number): Promise<boolean>;

  // Achievement methods
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Water intake methods
  getUserWaterIntake(userId: number, date: Date): Promise<WaterIntake[]>;
  createWaterIntake(waterIntake: InsertWaterIntake): Promise<WaterIntake>;

  // Favorite recipe methods
  getUserFavoriteRecipes(userId: string): Promise<FavoriteRecipe[]>;
  addFavoriteRecipe(userId: string, recipeId: number): Promise<FavoriteRecipe>;
  removeFavoriteRecipe(userId: string, recipeId: number): Promise<boolean>;
  isRecipeFavorited(userId: string, recipeId: number): Promise<boolean>;

  // Favorite workout methods
  getUserFavoriteWorkouts(userId: string): Promise<FavoriteWorkout[]>;
  addFavoriteWorkout(userId: string, workoutId: number): Promise<FavoriteWorkout>;
  removeFavoriteWorkout(userId: string, workoutId: number): Promise<boolean>;
  isWorkoutFavorited(userId: string, workoutId: number): Promise<boolean>;

  // Meal plan methods
  getUserMealPlans(userId: string): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  getMealPlan(id: number): Promise<MealPlan | undefined>;
  deleteMealPlan(id: number): Promise<boolean>;
  getMealPlanRecipes(mealPlanId: number): Promise<(MealPlanRecipe & { recipe: Recipe })[]>;
  addRecipeToMealPlan(mealPlanId: number, recipeId: number, mealType: string): Promise<MealPlanRecipe>;
  removeRecipeFromMealPlan(mealPlanId: number, recipeId: number): Promise<boolean>;

  // Calculator results methods
  getUserCalculatorResults(userId: string): Promise<CalculatorResult[]>;
  createCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult>;

  // Blog post methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Training log methods
  getAllTrainingLogEntries(): Promise<TrainingLogEntry[]>;
  getTrainingLogEntry(id: string): Promise<TrainingLogEntry | undefined>;
  getTrainingLogEntryBySlug(slug: string): Promise<TrainingLogEntry | undefined>;
  createTrainingLogEntry(entry: InsertTrainingLogEntry): Promise<TrainingLogEntry>;
  updateTrainingLogEntry(id: string, updates: Partial<TrainingLogEntry>): Promise<TrainingLogEntry | undefined>;
  deleteTrainingLogEntry(id: string): Promise<boolean>;
  getNextEntryNumber(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      const existingUser = await this.getUser("dev_user_1");
      if (!existingUser) {
        console.log("Creating development user in database...");
        const [newUser] = await db
          .insert(users)
          .values({
            id: "dev_user_1",
            email: "michael@getupeariler.com",
            firstName: "Michael",
            lastName: "Baker"
          })
          .returning();
        console.log("Development user created successfully");
      }
    } catch (error) {
      console.error("Error initializing database user:", error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      console.log("DatabaseStorage: Retrieved user from database:", user ? `age=${user.age}` : "not found");
      return user || undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user || undefined;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async updateUserProfile(id: string, profileData: {
    age?: number;
    sex?: string;
    height?: number;
    currentWeight?: number;
    desiredWeight?: number;
    activityLevel?: string;
    goal?: string;
    unitSystem?: string;
    macroProfile?: string;
  }): Promise<User | undefined> {
    try {
      console.log("DatabaseStorage: Updating user profile for ID:", id, "with data:", profileData);
      const [user] = await db
        .update(users)
        .set({ 
          ...profileData, 
          updatedAt: new Date() 
        })
        .where(eq(users.id, id))
        .returning();
      console.log("DatabaseStorage: Profile updated successfully:", user ? "Success" : "Failed");
      return user || undefined;
    } catch (error) {
      console.error("DatabaseStorage: Error updating user profile:", error);
      return undefined;
    }
  }



  // Calculator results methods
  async getUserCalculatorResults(userId: string): Promise<CalculatorResult[]> {
    try {
      const results = await db
        .select()
        .from(calculatorResults)
        .where(eq(calculatorResults.userId, userId))
        .orderBy(desc(calculatorResults.createdAt));
      return results;
    } catch (error) {
      console.error("Error getting calculator results:", error);
      return [];
    }
  }

  async createCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult> {
    try {
      const [newResult] = await db
        .insert(calculatorResults)
        .values({
          ...result,
          createdAt: new Date()
        })
        .returning();
      return newResult;
    } catch (error) {
      console.error("Error creating calculator result:", error);
      throw error;
    }
  }

  // Placeholder implementations for other methods (keep interface compatibility)
  async getRecipes(): Promise<Recipe[]> { return []; }
  async getRecipe(id: number): Promise<Recipe | undefined> { return undefined; }
  async createRecipe(recipe: InsertRecipe): Promise<Recipe> { throw new Error("Use recipe service"); }
  async updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined> { return undefined; }
  async deleteRecipe(id: number): Promise<boolean> { return false; }
  async searchRecipes(query: string, category?: string, dietType?: string): Promise<Recipe[]> { return []; }

  async getWorkouts(): Promise<Workout[]> { return []; }
  async getWorkout(id: number): Promise<Workout | undefined> { return undefined; }
  async createWorkout(workout: InsertWorkout): Promise<Workout> { throw new Error("Use workout service"); }
  async updateWorkout(id: number, updates: Partial<Workout>): Promise<Workout | undefined> { return undefined; }
  async deleteWorkout(id: number): Promise<boolean> { return false; }
  async getWorkoutsByCategory(category: string): Promise<Workout[]> { return []; }

  async getUserGoals(userId: number): Promise<Goal[]> { return []; }
  async getGoal(id: number): Promise<Goal | undefined> { return undefined; }
  async createGoal(goal: InsertGoal): Promise<Goal> { throw new Error("Not implemented"); }
  async updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined> { return undefined; }
  async deleteGoal(id: number): Promise<boolean> { return false; }

  async getUserFoodEntries(userId: number, date?: Date): Promise<FoodEntry[]> { return []; }
  async createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry> { throw new Error("Not implemented"); }
  async deleteFoodEntry(id: number): Promise<boolean> { return false; }

  async getUserAchievements(userId: number): Promise<Achievement[]> { return []; }
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> { throw new Error("Not implemented"); }

  async getUserWaterIntake(userId: number, date: Date): Promise<WaterIntake[]> { return []; }
  async createWaterIntake(waterIntake: InsertWaterIntake): Promise<WaterIntake> { throw new Error("Not implemented"); }

  async getUserFavoriteRecipes(userId: string): Promise<FavoriteRecipe[]> { return []; }
  async addFavoriteRecipe(userId: string, recipeId: number): Promise<FavoriteRecipe> { throw new Error("Not implemented"); }
  async removeFavoriteRecipe(userId: string, recipeId: number): Promise<boolean> { return false; }
  async isRecipeFavorited(userId: string, recipeId: number): Promise<boolean> { return false; }

  async getUserFavoriteWorkouts(userId: string): Promise<FavoriteWorkout[]> { return []; }
  async addFavoriteWorkout(userId: string, workoutId: number): Promise<FavoriteWorkout> { throw new Error("Not implemented"); }
  async removeFavoriteWorkout(userId: string, workoutId: number): Promise<boolean> { return false; }
  async isWorkoutFavorited(userId: string, workoutId: number): Promise<boolean> { return false; }

  async getUserMealPlans(userId: string): Promise<MealPlan[]> {
    try {
      const userMealPlans = await db.select().from(mealPlans).where(eq(mealPlans.userId, userId));
      return userMealPlans;
    } catch (error) {
      console.error("Error getting user meal plans:", error);
      return [];
    }
  }

  async createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan> {
    try {
      const [newMealPlan] = await db.insert(mealPlans).values(mealPlan).returning();
      return newMealPlan;
    } catch (error) {
      console.error("Error creating meal plan:", error);
      throw error;
    }
  }

  async getMealPlan(id: number): Promise<MealPlan | undefined> {
    try {
      const [mealPlan] = await db.select().from(mealPlans).where(eq(mealPlans.id, id));
      return mealPlan || undefined;
    } catch (error) {
      console.error("Error getting meal plan:", error);
      return undefined;
    }
  }

  async deleteMealPlan(id: number): Promise<boolean> {
    try {
      // First delete associated recipes
      await db.delete(mealPlanRecipes).where(eq(mealPlanRecipes.mealPlanId, id));
      // Then delete the meal plan
      const result = await db.delete(mealPlans).where(eq(mealPlans.id, id));
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      return false;
    }
  }

  async getMealPlanRecipes(mealPlanId: number): Promise<(MealPlanRecipe & { recipe: Recipe })[]> {
    try {
      const planRecipes = await db
        .select()
        .from(mealPlanRecipes)
        .leftJoin(recipes, eq(mealPlanRecipes.recipeId, recipes.id))
        .where(eq(mealPlanRecipes.mealPlanId, mealPlanId));
      
      return planRecipes.map(row => ({
        ...row.meal_plan_recipes,
        recipe: row.recipes!
      }));
    } catch (error) {
      console.error("Error getting meal plan recipes:", error);
      return [];
    }
  }

  async addRecipeToMealPlan(mealPlanId: number, recipeId: number, mealType: string): Promise<MealPlanRecipe> {
    try {
      const [newMealPlanRecipe] = await db
        .insert(mealPlanRecipes)
        .values({ mealPlanId, recipeId, mealType })
        .returning();
      return newMealPlanRecipe;
    } catch (error) {
      console.error("Error adding recipe to meal plan:", error);
      throw error;
    }
  }

  async removeRecipeFromMealPlan(mealPlanId: number, recipeId: number): Promise<boolean> {
    try {
      const result = await db
        .delete(mealPlanRecipes)
        .where(and(
          eq(mealPlanRecipes.mealPlanId, mealPlanId),
          eq(mealPlanRecipes.recipeId, recipeId)
        ));
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error removing recipe from meal plan:", error);
      return false;
    }
  }

  // Blog CMS methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      // Only fetch regular blog posts - training log entries should NOT appear in blog feed
      const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedDate));
      
      return posts;
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      return [];
    }
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return post || undefined;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
      return post || undefined;
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      return undefined;
    }
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    try {
      // Ensure new blog posts always appear at the top by setting current date if not provided
      const postWithDate = {
        ...post,
        publishedDate: post.publishedDate || new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      };
      
      console.log("Creating blog post with values:", JSON.stringify(postWithDate, null, 2));
      const [newPost] = await db.insert(blogPosts).values(postWithDate).returning();
      return newPost;
    } catch (error) {
      console.error("Error creating blog post:", error);
      console.error("Failed with post data:", JSON.stringify(post, null, 2));
      throw error;
    }
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined> {
    try {
      const [updatedPost] = await db
        .update(blogPosts)
        .set(updates)
        .where(eq(blogPosts.id, id))
        .returning();
      return updatedPost || undefined;
    } catch (error) {
      console.error("Error updating blog post:", error);
      return undefined;
    }
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  }

  // Training log methods
  async getAllTrainingLogEntries(): Promise<TrainingLogEntry[]> {
    try {
      const entries = await db.select().from(trainingLogEntries).orderBy(desc(trainingLogEntries.entryNumber));
      return entries;
    } catch (error) {
      console.error("Error fetching all training log entries:", error);
      return [];
    }
  }

  async getTrainingLogEntry(id: string): Promise<TrainingLogEntry | undefined> {
    try {
      const [entry] = await db.select().from(trainingLogEntries).where(eq(trainingLogEntries.id, id));
      return entry || undefined;
    } catch (error) {
      console.error("Error fetching training log entry:", error);
      return undefined;
    }
  }

  async getTrainingLogEntryBySlug(slug: string): Promise<TrainingLogEntry | undefined> {
    try {
      const [entry] = await db.select().from(trainingLogEntries).where(eq(trainingLogEntries.slug, slug));
      return entry || undefined;
    } catch (error) {
      console.error("Error fetching training log entry by slug:", error);
      return undefined;
    }
  }

  async createTrainingLogEntry(entry: InsertTrainingLogEntry): Promise<TrainingLogEntry> {
    try {
      console.log("Creating training log entry with values:", JSON.stringify(entry, null, 2));
      
      // Check if Hartford Marathon Training Log 2025 already exists
      const existingEntry = await db.select().from(trainingLogEntries)
        .where(eq(trainingLogEntries.title, 'Hartford Marathon Training Log 2025'))
        .limit(1);
      
      if (existingEntry.length > 0) {
        // Parse existing content to get entries array
        const existing = existingEntry[0];
        let existingEntries = [];
        
        try {
          const parsedContent = JSON.parse(existing.content);
          existingEntries = parsedContent.entries || [];
        } catch (parseError) {
          console.error("Error parsing existing content, starting fresh:", parseError);
          existingEntries = [];
        }
        
        // Create new training entry object
        const newTrainingEntry = {
          entryNumber: entry.entryNumber,
          title: entry.title,
          subtitle: `-Training Entry #${entry.entryNumber}`,
          date: entry.date,
          workoutType: entry.categories?.[0] || "Training",
          metrics: {
            distance: entry.distance,
            pace: entry.pace,
            time: entry.time
          },
          content: entry.content,
          images: entry.images || [],
          videoUrl: null
        };
        
        // Add new entry to the beginning of the array (newest first)
        const updatedEntries = [newTrainingEntry, ...existingEntries];
        
        // Create updated JSON content
        const updatedContent = JSON.stringify({ entries: updatedEntries });
        
        // Combine all images
        const allImages = [
          ...(entry.images || []),
          ...(existing.images || [])
        ];
        
        const [updatedEntry] = await db
          .update(trainingLogEntries)
          .set({
            content: updatedContent,
            images: allImages,
            updatedAt: new Date(),
            createdAt: new Date()
          })
          .where(eq(trainingLogEntries.id, existing.id))
          .returning();
        
        console.log(`Added training entry #${entry.entryNumber} to Hartford Marathon Training Log 2025`);
        console.log(`Total entries now: ${updatedEntries.length}`);
        return updatedEntry;
      } else {
        // Create new entry if Hartford Marathon Training Log 2025 doesn't exist
        const newTrainingEntry = {
          entryNumber: entry.entryNumber,
          title: entry.title,
          subtitle: `-Training Entry #${entry.entryNumber}`,
          date: entry.date,
          workoutType: entry.categories?.[0] || "Training",
          metrics: {
            distance: entry.distance,
            pace: entry.pace,
            time: entry.time
          },
          content: entry.content,
          images: entry.images || [],
          videoUrl: null
        };
        
        const initialContent = JSON.stringify({ entries: [newTrainingEntry] });
        
        const [newEntry] = await db.insert(trainingLogEntries).values({
          ...entry,
          title: 'Hartford Marathon Training Log 2025', // Always use the standard title
          content: initialContent,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        }).returning();
        
        console.log("Created new Hartford Marathon Training Log 2025 with first entry");
        return newEntry;
      }
    } catch (error) {
      console.error("Error creating training log entry:", error);
      console.error("Failed with entry data:", JSON.stringify(entry, null, 2));
      throw error;
    }
  }

  async updateTrainingLogEntry(id: string, updates: Partial<TrainingLogEntry>): Promise<TrainingLogEntry | undefined> {
    try {
      const [updatedEntry] = await db
        .update(trainingLogEntries)
        .set(updates)
        .where(eq(trainingLogEntries.id, id))
        .returning();
      return updatedEntry || undefined;
    } catch (error) {
      console.error("Error updating training log entry:", error);
      return undefined;
    }
  }

  async deleteTrainingLogEntry(id: string): Promise<boolean> {
    try {
      const result = await db.delete(trainingLogEntries).where(eq(trainingLogEntries.id, id));
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting training log entry:", error);
      return false;
    }
  }

  async getNextEntryNumber(): Promise<number> {
    try {
      const [maxEntry] = await db.select().from(trainingLogEntries).orderBy(desc(trainingLogEntries.entryNumber)).limit(1);
      return maxEntry ? maxEntry.entryNumber + 1 : 1;
    } catch (error) {
      console.error("Error getting next entry number:", error);
      return 1;
    }
  }
}

export const storage = new DatabaseStorage();