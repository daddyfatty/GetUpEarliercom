import type { User, Recipe, Workout, Goal, FoodEntry, Achievement, WaterIntake, InsertUser, InsertRecipe, InsertWorkout, InsertGoal, InsertFoodEntry, InsertAchievement, InsertWaterIntake } from "../shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

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
  getUserWaterIntake(userId: number, date: Date): Promise<WaterIntake | undefined>;
  updateWaterIntake(userId: number, date: Date, glasses: number): Promise<WaterIntake>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipes: Map<number, Recipe>;
  private workouts: Map<number, Workout>;
  private goals: Map<number, Goal>;
  private foodEntries: Map<number, FoodEntry>;
  private achievements: Map<number, Achievement>;
  private waterIntakes: Map<number, WaterIntake>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.workouts = new Map();
    this.goals = new Map();
    this.foodEntries = new Map();
    this.achievements = new Map();
    this.waterIntakes = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed users
    const adminUser: User = {
      id: this.currentId++,
      username: "admin",
      email: "admin@getupeariler.com",
      password: "password123",
      isAdmin: true,
      subscriptionTier: "premium",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalCustomerId: null,
      createdAt: new Date(),
    };

    const regularUser: User = {
      id: this.currentId++,
      username: "user",
      email: "user@example.com",
      password: "password123",
      isAdmin: false,
      subscriptionTier: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalCustomerId: null,
      createdAt: new Date(),
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(regularUser.id, regularUser);

    // Seed with your authentic Ground Chicken Breast Quick Goulash recipe
    const sampleRecipes: Recipe[] = [
      {
        id: this.currentId++,
        title: "Ground Chicken Breast Quick Goulash",
        description: "Easy one-pot goulash with Bell & Evans ground chicken breast, vegetables, and San Marzano tomatoes served over Kirkland rice",
        category: "dinner",
        dietType: "high-protein",
        prepTime: 25,
        servings: 4,
        calories: 420,
        protein: 24,
        carbs: 26,
        fat: 6,
        fiber: 4,
        sugar: 8,
        sodium: 680,
        vitaminC: 15,
        vitaminD: 0,
        calcium: 120,
        iron: 3,
        potassium: 580,
        ingredients: [
          "1 lb Bell & Evans ground chicken breast",
          "1 large onion, diced",
          "1 bell pepper, diced", 
          "2 cloves garlic, minced",
          "1 can (14.5 oz) San Marzano crushed tomatoes",
          "2 tablespoons tomato paste",
          "1 teaspoon paprika",
          "1/2 teaspoon dried thyme",
          "Salt and pepper to taste",
          "1/4 cup grated Parmesan cheese",
          "2 cups cooked white rice (Kirkland brand)"
        ],
        instructions: [
          "Heat olive oil in a large skillet over medium-high heat",
          "Add ground chicken breast and cook until browned, breaking up with spoon",
          "Add diced onion and bell pepper. Cook 5-7 minutes until vegetables soften",
          "Add minced garlic and cook another minute until fragrant", 
          "Stir in tomato paste, paprika, and thyme. Cook 1-2 minutes",
          "Pour in crushed tomatoes and stir well. Bring to gentle boil, then reduce heat and simmer 5-10 minutes",
          "Stir in grated Parmesan cheese. Taste and adjust seasoning",
          "Serve hot over cooked white rice"
        ],
        imageUrl: "/assets/download - 2025-06-08T053914.181_1749376059784.png",
        gallery: [
          "/assets/download - 2025-06-08T053908.812_1749376059784.png",
          "/assets/download - 2025-06-08T053914.181_1749376059784.png",
          "/assets/download - 2025-06-08T053921.230_1749376059785.png"
        ],
        createdAt: new Date(),
      }
    ];

    sampleRecipes.forEach(recipe => {
      this.recipes.set(recipe.id, recipe);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      id: this.currentId++, 
      ...insertUser,
      isAdmin: insertUser.isAdmin ?? false,
      subscriptionTier: insertUser.subscriptionTier ?? "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalCustomerId: null,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const recipe: Recipe = { 
      id: this.currentId++, 
      title: insertRecipe.title,
      description: insertRecipe.description,
      category: insertRecipe.category,
      dietType: insertRecipe.dietType ?? null,
      prepTime: insertRecipe.prepTime,
      servings: insertRecipe.servings,
      calories: insertRecipe.calories,
      protein: insertRecipe.protein,
      carbs: insertRecipe.carbs,
      fat: insertRecipe.fat,
      fiber: insertRecipe.fiber ?? null,
      sugar: insertRecipe.sugar ?? null,
      sodium: insertRecipe.sodium ?? null,
      vitaminC: insertRecipe.vitaminC ?? null,
      vitaminD: insertRecipe.vitaminD ?? null,
      calcium: insertRecipe.calcium ?? null,
      iron: insertRecipe.iron ?? null,
      potassium: insertRecipe.potassium ?? null,
      ingredients: insertRecipe.ingredients,
      instructions: insertRecipe.instructions,
      imageUrl: insertRecipe.imageUrl ?? null,
      gallery: insertRecipe.gallery ?? null,
      createdAt: new Date()
    };
    this.recipes.set(recipe.id, recipe);
    return recipe;
  }

  async updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined> {
    const recipe = this.recipes.get(id);
    if (!recipe) return undefined;
    
    const updatedRecipe = { ...recipe, ...updates };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipes.delete(id);
  }

  async searchRecipes(query: string, category?: string, dietType?: string): Promise<Recipe[]> {
    const recipes = Array.from(this.recipes.values());
    return recipes.filter(recipe => {
      const matchesQuery = recipe.title.toLowerCase().includes(query.toLowerCase()) ||
                          recipe.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || recipe.category === category;
      const matchesDietType = !dietType || recipe.dietType === dietType;
      
      return matchesQuery && matchesCategory && matchesDietType;
    });
  }

  // Placeholder implementations for other methods
  async getWorkouts(): Promise<Workout[]> { return []; }
  async getWorkout(id: number): Promise<Workout | undefined> { return undefined; }
  async createWorkout(workout: InsertWorkout): Promise<Workout> { throw new Error("Not implemented"); }
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
  async getUserWaterIntake(userId: number, date: Date): Promise<WaterIntake | undefined> { return undefined; }
  async updateWaterIntake(userId: number, date: Date, glasses: number): Promise<WaterIntake> { throw new Error("Not implemented"); }
}

export const storage = new MemStorage();