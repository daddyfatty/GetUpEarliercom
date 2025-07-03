import type { User, Recipe, Workout, Goal, FoodEntry, Achievement, WaterIntake, FavoriteRecipe, FavoriteWorkout, MealPlan, MealPlanRecipe, CalculatorResult, BlogPost, InsertUser, InsertRecipe, InsertWorkout, InsertGoal, InsertFoodEntry, InsertAchievement, InsertWaterIntake, InsertFavoriteRecipe, InsertFavoriteWorkout, InsertMealPlan, InsertMealPlanRecipe, InsertCalculatorResult, InsertBlogPost } from "../shared/schema";
import { users, recipes, workouts, goals, foodEntries, achievements, waterIntake, favoriteRecipes, favoriteWorkouts, mealPlans, mealPlanRecipes, calculatorResults, blogPosts } from "../shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

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
  getUserMealPlans(userId: number): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  getMealPlanRecipes(mealPlanId: number): Promise<(MealPlanRecipe & { recipe: Recipe })[]>;
  addRecipeToMealPlan(mealPlanId: number, recipeId: number, mealType: string): Promise<MealPlanRecipe>;

  // Calculator results methods
  getUserCalculatorResults(userId: string): Promise<CalculatorResult[]>;
  createCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult>;

  // Blog post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
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
        await this.createUser({
          id: "dev_user_1",
          email: "michael@getupeariler.com",
          firstName: "Michael",
          lastName: "Baker"
        });
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
        .values({
          ...insertUser,
          createdAt: new Date(),
          updatedAt: new Date()
        })
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

  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedDate));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values({
      ...post,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newPost;
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db.update(blogPosts)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
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

  async getUserMealPlans(userId: number): Promise<MealPlan[]> { return []; }
  async createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan> { throw new Error("Not implemented"); }
  async getMealPlanRecipes(mealPlanId: number): Promise<(MealPlanRecipe & { recipe: Recipe })[]> { return []; }
  async addRecipeToMealPlan(mealPlanId: number, recipeId: number, mealType: string): Promise<MealPlanRecipe> { throw new Error("Not implemented"); }
}

export const storage = new DatabaseStorage();