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
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalCustomerId: null,
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
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalCustomerId: null,
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
        dietType: "high-protein",
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
      {
        id: this.currentId++,
        title: "Ribeye Steak with Bone Marrow",
        description: "Premium ribeye steak with rich bone marrow for carnivore nutrition",
        category: "dinner",
        dietType: "carnivore",
        prepTime: 15,
        servings: 1,
        calories: 720,
        protein: 52,
        carbs: 0,
        fat: 56,
        ingredients: ["1 ribeye steak (12oz)", "2 bone marrow bones", "Sea salt", "Black pepper"],
        instructions: ["Season steak with salt and pepper", "Sear steak 3-4 minutes per side", "Roast bone marrow at 450°F for 15 minutes", "Rest steak 5 minutes before serving"],
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Sweet Potato Power Pasta",
        description: "High-carb whole grain pasta with roasted sweet potatoes and vegetables",
        category: "lunch",
        dietType: "high-carb-low-fat",
        prepTime: 35,
        servings: 3,
        calories: 450,
        protein: 15,
        carbs: 85,
        fat: 8,
        ingredients: ["12oz whole grain pasta", "2 large sweet potatoes", "2 cups mixed vegetables", "2 tbsp nutritional yeast", "1 tsp olive oil"],
        instructions: ["Roast sweet potatoes and vegetables", "Cook pasta according to package directions", "Combine all ingredients", "Serve with nutritional yeast"],
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Protein-Packed Chicken Bowl",
        description: "Grilled chicken with quinoa and Greek yogurt for maximum protein",
        category: "lunch",
        dietType: "high-protein",
        prepTime: 25,
        servings: 2,
        calories: 520,
        protein: 45,
        carbs: 35,
        fat: 18,
        ingredients: ["8oz chicken breast", "1 cup quinoa", "1/2 cup Greek yogurt", "2 cups leafy greens", "1 tbsp hemp seeds"],
        instructions: ["Grill seasoned chicken breast", "Cook quinoa in chicken broth", "Prepare bed of greens", "Top with chicken, quinoa, yogurt and hemp seeds"],
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Vegan Lentil Curry",
        description: "Hearty red lentil curry with coconut milk and vegetables",
        category: "dinner",
        dietType: "vegan",
        prepTime: 40,
        servings: 4,
        calories: 320,
        protein: 16,
        carbs: 48,
        fat: 9,
        ingredients: ["1.5 cups red lentils", "1 can coconut milk", "2 cups vegetables", "2 tbsp curry powder", "1 onion", "3 cloves garlic"],
        instructions: ["Sauté onion and garlic", "Add curry powder and cook 1 minute", "Add lentils, coconut milk, and vegetables", "Simmer 25 minutes until thick"],
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Keto Cauliflower Mac",
        description: "Creamy cauliflower with cheese sauce and bacon bits",
        category: "dinner",
        dietType: "keto",
        prepTime: 30,
        servings: 3,
        calories: 420,
        protein: 22,
        carbs: 12,
        fat: 34,
        ingredients: ["1 large cauliflower head", "1 cup heavy cream", "2 cups cheddar cheese", "6 strips bacon", "2 tbsp butter"],
        instructions: ["Steam cauliflower until tender", "Make cheese sauce with cream and butter", "Combine cauliflower with cheese sauce", "Top with crispy bacon bits"],
        imageUrl: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Paleo Zucchini Noodles",
        description: "Spiralized zucchini with turkey meatballs and marinara",
        category: "dinner",
        dietType: "paleo",
        prepTime: 35,
        servings: 2,
        calories: 380,
        protein: 32,
        carbs: 18,
        fat: 22,
        ingredients: ["3 large zucchini", "1 lb ground turkey", "2 cups marinara sauce", "1 egg", "2 tbsp olive oil"],
        instructions: ["Spiralize zucchini into noodles", "Mix turkey with egg and seasonings", "Form and cook meatballs", "Serve over zucchini noodles with sauce"],
        imageUrl: "https://images.unsplash.com/photo-1572441713132-51c75654db73?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Grilled Beef Liver",
        description: "Nutrient-dense beef liver with simple salt seasoning",
        category: "dinner",
        dietType: "carnivore",
        prepTime: 15,
        servings: 1,
        calories: 380,
        protein: 56,
        carbs: 0,
        fat: 16,
        ingredients: ["8oz beef liver", "2 tbsp grass-fed butter", "Sea salt", "Black pepper"],
        instructions: ["Let liver come to room temperature", "Season with salt and pepper", "Grill 3-4 minutes per side", "Rest 2 minutes before serving"],
        imageUrl: "https://images.unsplash.com/photo-1588347818121-f85b862c4b3d?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Rice and Bean Power Bowl",
        description: "Brown rice with black beans and roasted vegetables",
        category: "lunch",
        dietType: "high-carb-low-fat",
        prepTime: 45,
        servings: 3,
        calories: 420,
        protein: 18,
        carbs: 82,
        fat: 6,
        ingredients: ["1.5 cups brown rice", "1 can black beans", "2 cups mixed vegetables", "1 tbsp olive oil", "2 tbsp nutritional yeast"],
        instructions: ["Cook brown rice according to package", "Roast vegetables with minimal oil", "Heat black beans with spices", "Combine all ingredients in bowls"],
        imageUrl: "https://images.unsplash.com/photo-1559847844-56968d8a7f5c?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Tuna Protein Salad",
        description: "High-protein tuna salad with cottage cheese and vegetables",
        category: "lunch",
        dietType: "high-protein",
        prepTime: 15,
        servings: 1,
        calories: 450,
        protein: 52,
        carbs: 8,
        fat: 22,
        ingredients: ["2 cans tuna in water", "1/2 cup cottage cheese", "2 cups mixed greens", "1 hard-boiled egg", "1 tbsp olive oil"],
        instructions: ["Drain tuna and mix with cottage cheese", "Prepare bed of mixed greens", "Top with tuna mixture and sliced egg", "Drizzle with olive oil"],
        imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Hummus Veggie Wrap",
        description: "Whole grain wrap with hummus and fresh vegetables",
        category: "lunch",
        dietType: "vegetarian",
        prepTime: 10,
        servings: 1,
        calories: 380,
        protein: 16,
        carbs: 52,
        fat: 14,
        ingredients: ["1 large whole grain tortilla", "1/4 cup hummus", "1 cup mixed vegetables", "2 tbsp feta cheese", "1 tbsp olive oil"],
        instructions: ["Spread hummus on tortilla", "Layer with fresh vegetables", "Sprinkle with feta cheese", "Roll tightly and slice in half"],
        imageUrl: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Raw Veggie Energy Balls",
        description: "No-bake energy balls with dates, nuts, and seeds",
        category: "snack",
        dietType: "vegan",
        prepTime: 15,
        servings: 12,
        calories: 95,
        protein: 3,
        carbs: 12,
        fat: 5,
        ingredients: ["1 cup dates", "1/2 cup almonds", "2 tbsp chia seeds", "1 tbsp coconut oil", "1 tsp vanilla"],
        instructions: ["Soak dates until soft", "Blend all ingredients in food processor", "Roll into 12 balls", "Refrigerate for 30 minutes"],
        imageUrl: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Cheese and Salami Plate",
        description: "Simple keto-friendly cheese and meat combination",
        category: "snack",
        dietType: "keto",
        prepTime: 5,
        servings: 1,
        calories: 320,
        protein: 24,
        carbs: 3,
        fat: 24,
        ingredients: ["3oz aged cheddar", "2oz salami", "1 tbsp olives", "1 tbsp nuts"],
        instructions: ["Arrange cheese and salami on plate", "Add olives and nuts", "Serve at room temperature"],
        imageUrl: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Bone Broth Sipper",
        description: "Warm, healing bone broth for carnivore nutrition",
        category: "snack",
        dietType: "carnivore",
        prepTime: 5,
        servings: 1,
        calories: 45,
        protein: 9,
        carbs: 0,
        fat: 1,
        ingredients: ["1 cup bone broth", "1 tsp sea salt", "1 tbsp grass-fed butter"],
        instructions: ["Heat bone broth in saucepan", "Stir in butter until melted", "Season with sea salt", "Serve hot in mug"],
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3",
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
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalCustomerId: null,
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
