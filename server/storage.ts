import { 
  users, recipes, workouts, goals, foodEntries, achievements, waterIntake,
  type User, type InsertUser, type Recipe, type InsertRecipe, 
  type Workout, type InsertWorkout, type Goal, type InsertGoal,
  type FoodEntry, type InsertFoodEntry, type Achievement, type InsertAchievement,
  type WaterIntake, type InsertWaterIntake
} from "@shared/schema";

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
    // Create admin user
    const adminUser: User = {
      id: this.currentId++,
      username: "admin",
      email: "admin@example.com",
      password: "admin123", // In real app, this would be hashed
      isAdmin: true,
      subscriptionTier: "premium",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create regular user
    const regularUser: User = {
      id: this.currentId++,
      username: "user",
      email: "user@example.com",
      password: "user123",
      isAdmin: false,
      subscriptionTier: "free",
      createdAt: new Date(),
    };
    this.users.set(regularUser.id, regularUser);

    // Seed recipes
    const sampleRecipes: Recipe[] = [
      {
        id: this.currentId++,
        title: "Power Buddha Bowl",
        description: "Quinoa, roasted vegetables, and avocado with tahini dressing",
        category: "lunch",
        dietType: "vegetarian",
        prepTime: 25,
        servings: 2,
        calories: 420,
        protein: 18,
        carbs: 52,
        fat: 16,
        ingredients: ["1 cup quinoa", "1 avocado", "2 cups mixed vegetables", "2 tbsp tahini", "1 lemon"],
        instructions: ["Cook quinoa", "Roast vegetables", "Prepare tahini dressing", "Assemble bowl"],
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Protein Power Pancakes",
        description: "Fluffy pancakes packed with protein and topped with fresh berries",
        category: "breakfast",
        dietType: "vegetarian",
        prepTime: 15,
        servings: 2,
        calories: 350,
        protein: 25,
        carbs: 35,
        fat: 12,
        ingredients: ["1 cup oats", "2 eggs", "1 banana", "1 scoop protein powder", "1 cup berries"],
        instructions: ["Blend oats into flour", "Mix all ingredients", "Cook pancakes", "Top with berries"],
        imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Herb-Crusted Salmon",
        description: "Omega-rich salmon with roasted seasonal vegetables",
        category: "dinner",
        dietType: null,
        prepTime: 30,
        servings: 2,
        calories: 480,
        protein: 35,
        carbs: 20,
        fat: 28,
        ingredients: ["2 salmon fillets", "2 cups vegetables", "2 tbsp herbs", "1 tbsp olive oil"],
        instructions: ["Season salmon", "Roast vegetables", "Cook salmon", "Serve together"],
        imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
    ];

    sampleRecipes.forEach(recipe => this.recipes.set(recipe.id, recipe));

    // Seed workouts
    const sampleWorkouts: Workout[] = [
      {
        id: this.currentId++,
        title: "Core Strength Builder",
        description: "Build a strong foundation with these essential core exercises",
        category: "strength",
        difficulty: "beginner",
        duration: 20,
        caloriesBurned: 150,
        equipment: ["mat"],
        exercises: [
          { name: "Plank", duration: 30, description: "Hold plank position" },
          { name: "Crunches", sets: 3, reps: "15", description: "Basic abdominal crunches" },
          { name: "Mountain Climbers", duration: 45, description: "Dynamic core exercise" },
        ],
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "HIIT Cardio Blast",
        description: "High-intensity workout to boost metabolism and burn fat",
        category: "hiit",
        difficulty: "advanced",
        duration: 25,
        caloriesBurned: 300,
        equipment: [],
        exercises: [
          { name: "Jumping Jacks", duration: 45, description: "Full body cardio movement" },
          { name: "Burpees", sets: 4, reps: "8", description: "Total body exercise" },
          { name: "High Knees", duration: 30, description: "Cardio exercise" },
        ],
        imageUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
    ];

    sampleWorkouts.forEach(workout => this.workouts.set(workout.id, workout));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentId++;
    const recipe: Recipe = { 
      ...insertRecipe, 
      id, 
      createdAt: new Date() 
    };
    this.recipes.set(id, recipe);
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
      const matchesCategory = !category || category === "all" || recipe.category === category;
      const matchesDiet = !dietType || dietType === "all" || recipe.dietType === dietType;
      
      return matchesQuery && matchesCategory && matchesDiet;
    });
  }

  // Workout methods
  async getWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values());
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = this.currentId++;
    const workout: Workout = { 
      ...insertWorkout, 
      id, 
      createdAt: new Date() 
    };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: number, updates: Partial<Workout>): Promise<Workout | undefined> {
    const workout = this.workouts.get(id);
    if (!workout) return undefined;
    
    const updatedWorkout = { ...workout, ...updates };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    return this.workouts.delete(id);
  }

  async getWorkoutsByCategory(category: string): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(workout => 
      category === "all" || workout.category === category
    );
  }

  // Goal methods
  async getUserGoals(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.currentId++;
    const goal: Goal = { 
      ...insertGoal, 
      id, 
      createdAt: new Date() 
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { ...goal, ...updates };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Food tracking methods
  async getUserFoodEntries(userId: number, date?: Date): Promise<FoodEntry[]> {
    const entries = Array.from(this.foodEntries.values()).filter(entry => entry.userId === userId);
    
    if (date) {
      const dateStr = date.toDateString();
      return entries.filter(entry => entry.date.toDateString() === dateStr);
    }
    
    return entries;
  }

  async createFoodEntry(insertEntry: InsertFoodEntry): Promise<FoodEntry> {
    const id = this.currentId++;
    const entry: FoodEntry = { 
      ...insertEntry, 
      id, 
      createdAt: new Date() 
    };
    this.foodEntries.set(id, entry);
    return entry;
  }

  async deleteFoodEntry(id: number): Promise<boolean> {
    return this.foodEntries.delete(id);
  }

  // Achievement methods
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentId++;
    const achievement: Achievement = { 
      ...insertAchievement, 
      id, 
      earnedAt: new Date() 
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // Water intake methods
  async getUserWaterIntake(userId: number, date: Date): Promise<WaterIntake | undefined> {
    const dateStr = date.toDateString();
    return Array.from(this.waterIntakes.values()).find(
      intake => intake.userId === userId && intake.date.toDateString() === dateStr
    );
  }

  async updateWaterIntake(userId: number, date: Date, glasses: number): Promise<WaterIntake> {
    const existing = await this.getUserWaterIntake(userId, date);
    
    if (existing) {
      existing.glasses = glasses;
      this.waterIntakes.set(existing.id, existing);
      return existing;
    }
    
    const id = this.currentId++;
    const intake: WaterIntake = {
      id,
      userId,
      date,
      glasses,
      createdAt: new Date(),
    };
    this.waterIntakes.set(id, intake);
    return intake;
  }
}

export const storage = new MemStorage();
