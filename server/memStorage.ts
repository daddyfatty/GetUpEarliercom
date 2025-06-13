import type { User, Recipe, Workout, Goal, FoodEntry, Achievement, WaterIntake, FavoriteRecipe, FavoriteWorkout, MealPlan, MealPlanRecipe, CalculatorResult, InsertUser, InsertRecipe, InsertWorkout, InsertGoal, InsertFoodEntry, InsertAchievement, InsertWaterIntake, InsertFavoriteRecipe, InsertFavoriteWorkout, InsertMealPlan, InsertMealPlanRecipe, InsertCalculatorResult } from "../shared/schema";
import * as fs from 'fs';
import * as path from 'path';

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
  searchWorkouts(query: string, category?: string, difficulty?: string): Promise<Workout[]>;

  // Goal methods
  getUserGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;

  // Food entry methods
  getUserFoodEntries(userId: string, date?: Date): Promise<FoodEntry[]>;
  createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  updateFoodEntry(id: number, updates: Partial<FoodEntry>): Promise<FoodEntry | undefined>;
  deleteFoodEntry(id: number): Promise<boolean>;

  // Achievement methods
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Water intake methods
  getUserWaterIntake(userId: string, date?: Date): Promise<WaterIntake[]>;
  createWaterIntake(intake: InsertWaterIntake): Promise<WaterIntake>;
  updateWaterIntake(id: number, updates: Partial<WaterIntake>): Promise<WaterIntake | undefined>;

  // Calculator results methods
  getUserCalculatorResults(userId: string): Promise<CalculatorResult[]>;
  createCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult>;

  // User favorites methods
  getUserFavoriteRecipes(userId: string): Promise<Recipe[]>;
  addFavoriteRecipe(userId: string, recipeId: number): Promise<FavoriteRecipe>;
  removeFavoriteRecipe(userId: string, recipeId: number): Promise<boolean>;

  getUserFavoriteWorkouts(userId: string): Promise<Workout[]>;
  addFavoriteWorkout(userId: string, workoutId: number): Promise<FavoriteWorkout>;
  removeFavoriteWorkout(userId: string, workoutId: number): Promise<boolean>;

  // Meal plan methods
  getUserMealPlans(userId: string): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  updateMealPlan(id: number, updates: Partial<MealPlan>): Promise<MealPlan | undefined>;
  deleteMealPlan(id: number): Promise<boolean>;

  getMealPlanRecipes(mealPlanId: number): Promise<(MealPlanRecipe & { recipe: Recipe })[]>;
  addRecipeToMealPlan(mealPlanId: number, recipeId: number, mealType: string): Promise<MealPlanRecipe>;
  removeRecipeFromMealPlan(mealPlanId: number, recipeId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private recipes: Map<number, Recipe> = new Map();
  private workouts: Map<number, Workout> = new Map();
  private goals: Map<number, Goal> = new Map();
  private foodEntries: Map<number, FoodEntry> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private waterIntakes: Map<number, WaterIntake> = new Map();
  private favoriteRecipes: Map<string, FavoriteRecipe[]> = new Map();
  private favoriteWorkouts: Map<string, FavoriteWorkout[]> = new Map();
  private mealPlans: Map<number, MealPlan> = new Map();
  private mealPlanRecipes: Map<number, MealPlanRecipe[]> = new Map();
  private calculatorResults: Map<string, CalculatorResult[]> = new Map();

  private dataPath = path.join(process.cwd(), 'data');
  private favoritesFile = path.join(this.dataPath, 'favorites.json');

  private nextId = {
    recipe: 1,
    workout: 1,
    goal: 1,
    foodEntry: 1,
    achievement: 1,
    waterIntake: 1,
    favoriteRecipe: 1,
    favoriteWorkout: 1,
    mealPlan: 1,
    mealPlanRecipe: 1,
    calculatorResult: 1,
  };

  private saveFavoritesToFile() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        fs.mkdirSync(this.dataPath, { recursive: true });
      }
      
      const favoritesData = {
        favoriteRecipes: Object.fromEntries(this.favoriteRecipes),
        favoriteWorkouts: Object.fromEntries(this.favoriteWorkouts),
        nextId: this.nextId
      };
      
      fs.writeFileSync(this.favoritesFile, JSON.stringify(favoritesData, null, 2));
    } catch (error) {
      console.error('Error saving favorites to file:', error);
    }
  }

  private loadFavoritesFromFile() {
    try {
      if (fs.existsSync(this.favoritesFile)) {
        const data = JSON.parse(fs.readFileSync(this.favoritesFile, 'utf8'));
        
        if (data.favoriteRecipes) {
          this.favoriteRecipes = new Map(Object.entries(data.favoriteRecipes));
        }
        
        if (data.favoriteWorkouts) {
          this.favoriteWorkouts = new Map(Object.entries(data.favoriteWorkouts));
        }
        
        if (data.nextId) {
          this.nextId = { ...this.nextId, ...data.nextId };
        }
      }
    } catch (error) {
      console.error('Error loading favorites from file:', error);
    }
  }

  constructor() {
    // Load persisted favorites data
    this.loadFavoritesFromFile();
    
    // Initialize with default user
    const defaultUser: User = {
      id: "dev_user_1",
      email: "user@example.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null,
      height: null,
      age: null,
      sex: null,
      currentWeight: null,
      desiredWeight: null,
      activityLevel: null,
      goal: null,
      unitSystem: "imperial",
      macroProfile: null,
      timezone: null,
      language: "en",
      notifications: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set("dev_user_1", defaultUser);

    // Initialize with authentic workout data
    const authenticWorkout: Workout = {
      id: 5,
      title: "Chest & Biceps Finisher - The Ultimate Push-up Workout - Body Weight & Iron Master Dumbbells",
      description: "A comprehensive chest and biceps finisher workout combining bodyweight movements with dumbbell exercises for maximum muscle activation.",
      category: "Strength Training",
      difficulty: "intermediate",
      duration: 30,
      caloriesBurned: 250,
      exercises: [
        {
          name: "Push-ups",
          sets: 3,
          reps: 15,
          rest: 60
        },
        {
          name: "Dumbbell Bicep Curls",
          sets: 3,
          reps: 12,
          rest: 60
        },
        {
          name: "Diamond Push-ups",
          sets: 2,
          reps: 10,
          rest: 45
        }
      ],
      equipment: ["dumbbells", "bodyweight"],
      targetMuscles: ["chest", "biceps", "triceps"],
      imageUrl: null,
      videoUrl: "https://www.youtube.com/watch?v=example",
      authorId: "michael_baker",
      authorName: "Michael Baker",
      authorPhoto: null,
      createdAt: new Date()
    };
    this.workouts.set(5, authenticWorkout);

    // Initialize with authentic recipe data
    const authenticRecipes = [
      {
        id: 1,
        title: "Homemade Granola",
        description: "100% organic homemade granola with 0 sketchy ingredients that break off into awesome chunks. This granola is my go-to carb loading snack for marathon training. I created it out of frustration with store-bought granola that's packed with sugar and preservatives.",
        category: ["Breakfast", "Snacks"],
        dietType: ["Vegetarian", "Gluten-Free"],
        tags: ["healthy", "homemade", "organic"],
        prepTime: 15,
        cookTime: 25,
        totalTime: 40,
        servings: 8,
        servingSize: "1/2 cup",
        calories: 280,
        protein: 8,
        carbs: 32,
        fat: 14,
        fiber: 6,
        sugar: 8,
        sodium: 95,
        ingredients: [
          "3 cups old-fashioned oats",
          "1/2 cup chopped almonds",
          "1/2 cup chopped walnuts",
          "1/4 cup maple syrup",
          "1/4 cup coconut oil",
          "1 tsp vanilla extract",
          "1/2 tsp cinnamon",
          "1/4 tsp salt",
          "1/3 cup dried cranberries"
        ],
        instructions: [
          "Preheat oven to 300°F",
          "Mix dry ingredients in a large bowl",
          "Warm maple syrup and coconut oil, add vanilla",
          "Pour wet ingredients over dry and mix well",
          "Spread on parchment-lined baking sheet",
          "Bake 20-25 minutes, stirring once",
          "Add dried fruit after cooling"
        ],
        imageUrl: "/attached_assets/granola_image.jpg",
        videoUrl: null,
        authorId: "michael_baker",
        authorName: "Michael Baker",
        authorPhoto: "/attached_assets/michael_baker.jpg",
        createdAt: new Date()
      },
      {
        id: 2,
        title: "Quick Chicken Goulash",
        description: "An easy one I make with Bell & Evans ground chicken breast is a quick goulash. I chop up onions and bell peppers, brown the chicken, add diced tomatoes, and season with paprika and garlic. Simple, healthy, and filling.",
        category: ["Dinner", "Main Course"],
        dietType: ["High Protein", "Gluten-Free"],
        tags: ["quick", "healthy", "protein"],
        prepTime: 10,
        cookTime: 20,
        totalTime: 30,
        servings: 4,
        servingSize: "1 cup",
        calories: 320,
        protein: 28,
        carbs: 12,
        fat: 18,
        fiber: 3,
        sugar: 8,
        sodium: 480,
        ingredients: [
          "1 lb Bell & Evans ground chicken breast",
          "1 large onion, diced",
          "2 bell peppers, chopped",
          "1 can diced tomatoes",
          "2 tsp paprika",
          "3 cloves garlic, minced",
          "Salt and pepper to taste",
          "2 tbsp olive oil"
        ],
        instructions: [
          "Heat olive oil in large skillet",
          "Sauté onions and peppers until soft",
          "Add ground chicken and brown",
          "Add garlic and paprika, cook 1 minute",
          "Add diced tomatoes and simmer 15 minutes",
          "Season with salt and pepper"
        ],
        imageUrl: "/attached_assets/chicken_goulash.jpg",
        videoUrl: null,
        authorId: "michael_baker",
        authorName: "Michael Baker",
        authorPhoto: "/attached_assets/michael_baker.jpg",
        createdAt: new Date()
      }
    ];

    authenticRecipes.forEach(recipe => {
      this.recipes.set(recipe.id, recipe);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { 
      ...user, 
      ...updates,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
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
    return this.updateUser(id, profileData);
  }

  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(recipeData: InsertRecipe): Promise<Recipe> {
    const recipe: Recipe = {
      ...recipeData,
      id: this.nextId.recipe++,
      createdAt: new Date(),
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
      
      const matchesCategory = !category || recipe.category.some(cat => 
        cat.toLowerCase() === category.toLowerCase()
      );
      
      const matchesDietType = !dietType || (recipe.dietType && recipe.dietType.some(diet => 
        diet.toLowerCase() === dietType.toLowerCase()
      ));

      return matchesQuery && matchesCategory && matchesDietType;
    });
  }

  // Workout methods
  async getWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values());
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(workoutData: InsertWorkout): Promise<Workout> {
    const workout: Workout = {
      ...workoutData,
      id: this.nextId.workout++,
      createdAt: new Date(),
    };
    this.workouts.set(workout.id, workout);
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

  async searchWorkouts(query: string, category?: string, difficulty?: string): Promise<Workout[]> {
    const workouts = Array.from(this.workouts.values());
    return workouts.filter(workout => {
      const matchesQuery = workout.title.toLowerCase().includes(query.toLowerCase()) ||
                          (workout.description && workout.description.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || workout.category.some(cat => 
        cat.toLowerCase() === category.toLowerCase()
      );
      
      const matchesDifficulty = !difficulty || workout.difficulty === difficulty;

      return matchesQuery && matchesCategory && matchesDifficulty;
    });
  }

  // Goal methods
  async getUserGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async createGoal(goalData: InsertGoal): Promise<Goal> {
    const goal: Goal = {
      ...goalData,
      id: this.nextId.goal++,
      createdAt: new Date(),
    };
    this.goals.set(goal.id, goal);
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

  // Food entry methods
  async getUserFoodEntries(userId: string, date?: Date): Promise<FoodEntry[]> {
    const entries = Array.from(this.foodEntries.values()).filter(entry => entry.userId === userId);
    if (date) {
      const dateString = date.toDateString();
      return entries.filter(entry => entry.date.toDateString() === dateString);
    }
    return entries;
  }

  async createFoodEntry(entryData: InsertFoodEntry): Promise<FoodEntry> {
    const entry: FoodEntry = {
      ...entryData,
      id: this.nextId.foodEntry++,
      createdAt: new Date(),
    };
    this.foodEntries.set(entry.id, entry);
    return entry;
  }

  async updateFoodEntry(id: number, updates: Partial<FoodEntry>): Promise<FoodEntry | undefined> {
    const entry = this.foodEntries.get(id);
    if (!entry) return undefined;

    const updatedEntry = { ...entry, ...updates };
    this.foodEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteFoodEntry(id: number): Promise<boolean> {
    return this.foodEntries.delete(id);
  }

  // Achievement methods
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      ...achievementData,
      id: this.nextId.achievement++,
      createdAt: new Date(),
    };
    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  // Water intake methods
  async getUserWaterIntake(userId: string, date?: Date): Promise<WaterIntake[]> {
    const intakes = Array.from(this.waterIntakes.values()).filter(intake => intake.userId === userId);
    if (date) {
      const dateString = date.toDateString();
      return intakes.filter(intake => intake.date.toDateString() === dateString);
    }
    return intakes;
  }

  async createWaterIntake(intakeData: InsertWaterIntake): Promise<WaterIntake> {
    const intake: WaterIntake = {
      ...intakeData,
      id: this.nextId.waterIntake++,
      createdAt: new Date(),
    };
    this.waterIntakes.set(intake.id, intake);
    return intake;
  }

  async updateWaterIntake(id: number, updates: Partial<WaterIntake>): Promise<WaterIntake | undefined> {
    const intake = this.waterIntakes.get(id);
    if (!intake) return undefined;

    const updatedIntake = { ...intake, ...updates };
    this.waterIntakes.set(id, updatedIntake);
    return updatedIntake;
  }

  // Calculator results methods
  async getUserCalculatorResults(userId: string): Promise<CalculatorResult[]> {
    return this.calculatorResults.get(userId) || [];
  }

  async createCalculatorResult(resultData: InsertCalculatorResult): Promise<CalculatorResult> {
    const result: CalculatorResult = {
      ...resultData,
      id: this.nextId.calculatorResult++,
      createdAt: new Date(),
    };
    
    const userResults = this.calculatorResults.get(resultData.userId) || [];
    userResults.push(result);
    this.calculatorResults.set(resultData.userId, userResults);
    
    return result;
  }

  // User favorites methods
  async getUserFavoriteRecipes(userId: string): Promise<Recipe[]> {
    const favorites = this.favoriteRecipes.get(userId) || [];
    return favorites.map(fav => this.recipes.get(fav.recipeId)).filter(Boolean) as Recipe[];
  }

  async addFavoriteRecipe(userId: string, recipeId: number): Promise<FavoriteRecipe> {
    const favorite: FavoriteRecipe = {
      id: this.nextId.favoriteRecipe++,
      userId,
      recipeId,
      createdAt: new Date(),
    };
    
    const userFavorites = this.favoriteRecipes.get(userId) || [];
    userFavorites.push(favorite);
    this.favoriteRecipes.set(userId, userFavorites);
    this.saveFavoritesToFile();
    
    return favorite;
  }

  async removeFavoriteRecipe(userId: string, recipeId: number): Promise<boolean> {
    const userFavorites = this.favoriteRecipes.get(userId) || [];
    const filteredFavorites = userFavorites.filter(fav => fav.recipeId !== recipeId);
    this.favoriteRecipes.set(userId, filteredFavorites);
    this.saveFavoritesToFile();
    return filteredFavorites.length < userFavorites.length;
  }

  async getUserFavoriteWorkouts(userId: string): Promise<Workout[]> {
    const favorites = this.favoriteWorkouts.get(userId) || [];
    return favorites.map(fav => this.workouts.get(fav.workoutId)).filter(Boolean) as Workout[];
  }

  async addFavoriteWorkout(userId: string, workoutId: number): Promise<FavoriteWorkout> {
    const favorite: FavoriteWorkout = {
      id: this.nextId.favoriteWorkout++,
      userId,
      workoutId,
      createdAt: new Date(),
    };
    
    const userFavorites = this.favoriteWorkouts.get(userId) || [];
    userFavorites.push(favorite);
    this.favoriteWorkouts.set(userId, userFavorites);
    this.saveFavoritesToFile();
    
    return favorite;
  }

  async removeFavoriteWorkout(userId: string, workoutId: number): Promise<boolean> {
    const userFavorites = this.favoriteWorkouts.get(userId) || [];
    const filteredFavorites = userFavorites.filter(fav => fav.workoutId !== workoutId);
    this.favoriteWorkouts.set(userId, filteredFavorites);
    this.saveFavoritesToFile();
    return filteredFavorites.length < userFavorites.length;
  }

  // Meal plan methods
  async getUserMealPlans(userId: string): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values()).filter(plan => plan.userId === userId);
  }

  async createMealPlan(planData: InsertMealPlan): Promise<MealPlan> {
    const plan: MealPlan = {
      ...planData,
      id: this.nextId.mealPlan++,
      createdAt: new Date(),
    };
    this.mealPlans.set(plan.id, plan);
    return plan;
  }

  async updateMealPlan(id: number, updates: Partial<MealPlan>): Promise<MealPlan | undefined> {
    const plan = this.mealPlans.get(id);
    if (!plan) return undefined;

    const updatedPlan = { ...plan, ...updates };
    this.mealPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteMealPlan(id: number): Promise<boolean> {
    this.mealPlanRecipes.delete(id);
    return this.mealPlans.delete(id);
  }

  async getMealPlanRecipes(mealPlanId: number): Promise<(MealPlanRecipe & { recipe: Recipe })[]> {
    const planRecipes = this.mealPlanRecipes.get(mealPlanId) || [];
    return planRecipes.map(planRecipe => {
      const recipe = this.recipes.get(planRecipe.recipeId);
      return recipe ? { ...planRecipe, recipe } : null;
    }).filter(Boolean) as (MealPlanRecipe & { recipe: Recipe })[];
  }

  async addRecipeToMealPlan(mealPlanId: number, recipeId: number, mealType: string): Promise<MealPlanRecipe> {
    const planRecipe: MealPlanRecipe = {
      id: this.nextId.mealPlanRecipe++,
      mealPlanId,
      recipeId,
      mealType,
      createdAt: new Date(),
    };
    
    const planRecipes = this.mealPlanRecipes.get(mealPlanId) || [];
    planRecipes.push(planRecipe);
    this.mealPlanRecipes.set(mealPlanId, planRecipes);
    
    return planRecipe;
  }

  async removeRecipeFromMealPlan(mealPlanId: number, recipeId: number): Promise<boolean> {
    const planRecipes = this.mealPlanRecipes.get(mealPlanId) || [];
    const filteredRecipes = planRecipes.filter(recipe => recipe.recipeId !== recipeId);
    this.mealPlanRecipes.set(mealPlanId, filteredRecipes);
    return filteredRecipes.length < planRecipes.length;
  }
}

export const storage = new MemStorage();