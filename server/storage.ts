import type { User, Recipe, Workout, Goal, FoodEntry, Achievement, WaterIntake, FavoriteRecipe, FavoriteWorkout, MealPlan, MealPlanRecipe, CalculatorResult, InsertUser, InsertRecipe, InsertWorkout, InsertGoal, InsertFoodEntry, InsertAchievement, InsertWaterIntake, InsertFavoriteRecipe, InsertFavoriteWorkout, InsertMealPlan, InsertMealPlanRecipe, InsertCalculatorResult } from "../shared/schema";
import { users, recipes, workouts, goals, foodEntries, achievements, waterIntake, favoriteRecipes, favoriteWorkouts, mealPlans, mealPlanRecipes, calculatorResults } from "../shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { pool } from "./db";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: Partial<User> & { id: string }): Promise<User>;
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
  getUserWaterIntake(userId: number, date: Date): Promise<WaterIntake | undefined>;
  updateWaterIntake(userId: number, date: Date, glasses: number): Promise<WaterIntake>;

  // User favorites methods
  getUserFavoriteRecipes(userId: number): Promise<Recipe[]>;
  addFavoriteRecipe(userId: number, recipeId: number): Promise<FavoriteRecipe>;
  removeFavoriteRecipe(userId: number, recipeId: number): Promise<boolean>;
  isRecipeFavorited(userId: number, recipeId: number): Promise<boolean>;

  // User favorite workouts methods
  getUserFavoriteWorkouts(userId: number): Promise<Workout[]>;
  addFavoriteWorkout(userId: number, workoutId: number): Promise<FavoriteWorkout>;
  removeFavoriteWorkout(userId: number, workoutId: number): Promise<boolean>;
  isWorkoutFavorited(userId: number, workoutId: number): Promise<boolean>;

  // Meal plan methods
  getUserMealPlans(userId: number): Promise<MealPlan[]>;
  getMealPlan(id: number): Promise<MealPlan | undefined>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  deleteMealPlan(id: number): Promise<boolean>;
  getMealPlanRecipes(mealPlanId: number): Promise<(MealPlanRecipe & { recipe: Recipe })[]>;
  addRecipeToMealPlan(mealPlanId: number, recipeId: number, mealType: string): Promise<MealPlanRecipe>;
  removeRecipeFromMealPlan(mealPlanId: number, recipeId: number): Promise<boolean>;

  // Calculator results methods
  getUserCalculatorResults(userId: string): Promise<CalculatorResult[]>;
  createCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private recipes: Map<number, Recipe>;
  private workouts: Map<number, Workout>;
  private goals: Map<number, Goal>;
  private foodEntries: Map<number, FoodEntry>;
  private achievements: Map<number, Achievement>;
  private waterIntakes: Map<number, WaterIntake>;
  private favoriteRecipes: Map<number, FavoriteRecipe>;
  private favoriteWorkouts: Map<number, FavoriteWorkout>;
  private mealPlans: Map<number, MealPlan>;
  private mealPlanRecipes: Map<number, MealPlanRecipe>;
  private calculatorResults: Map<number, CalculatorResult>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.workouts = new Map();
    this.goals = new Map();
    this.foodEntries = new Map();
    this.achievements = new Map();
    this.waterIntakes = new Map();
    this.favoriteRecipes = new Map();
    this.favoriteWorkouts = new Map();
    this.mealPlans = new Map();
    this.mealPlanRecipes = new Map();
    this.calculatorResults = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed users
    const adminUser: User = {
      id: "admin-user-1",
      email: "admin@getupeariler.com",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: null,
      isAdmin: true,
      subscriptionTier: "premium",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalCustomerId: null,
      age: null,
      sex: null,
      height: null,
      currentWeight: null,
      desiredWeight: null,
      activityLevel: null,
      goal: null,
      unitSystem: null,
      macroProfile: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const regularUser: User = {
      id: "dev_user_1", 
      email: "mike@webmbd.com",
      firstName: "Michael",
      lastName: "Baker",
      profileImageUrl: null,
      isAdmin: true,
      subscriptionTier: "premium",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalCustomerId: null,
      age: 45,
      sex: "male",
      height: 72, // 6 feet in inches
      currentWeight: 180,
      desiredWeight: 175,
      activityLevel: "very_active",
      goal: "weight_loss",
      unitSystem: "imperial",
      macroProfile: "balanced",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(regularUser.id, regularUser);

    // Seed with your authentic Ground Chicken Breast Quick Goulash recipe
    const sampleRecipes: Recipe[] = [
      {
        id: this.currentId++,
        title: "Banana Ice Cream Sundae Smoothie \"Cup\" (Vitamix)",
        description: "Satisfy an ice cream sundae craving with a Banana Ice Cream Smoothie \"Cup\". It's unbelievably good if you are into these flavors. Balanced snack with a moderate carb focus, some healthy fats, and a bit of protein ideal for a clean treat. Perfect the night before a morning run for good fuel.",
        category: ["smoothie bowls", "snack"],
        dietType: ["vegetarian"],
        tags: ["smoothie", "bowl", "banana", "snack", "healthy", "endurance", "pre-workout"],
        prepTime: 5,
        servings: 1,
        servingSize: "1 cup",
        calories: 247,
        protein: 5,
        carbs: 39,
        fat: 9,
        fiber: 4,
        sugar: 32,
        sodium: 65,
        vitaminC: 9,
        vitaminD: 0,
        calcium: 80,
        iron: 1,
        potassium: 422,
        ingredients: [
          "1 medium frozen banana",
          "0.25 cup whole milk",
          "1 teaspoon Enjoy Life chocolate chips",
          "1 teaspoon chunky peanut butter",
          "1 tablespoon Grandy Organics original granola"
        ],
        instructions: [
          "Add frozen banana and whole milk to Vitamix or high-powered blender.",
          "Blend until smooth and creamy, resembling soft-serve ice cream consistency.",
          "Pour the banana ice cream base into a glass or bowl.",
          "Top with chocolate chips, chunky peanut butter, and granola.",
          "Serve immediately for best texture and enjoy as a healthy ice cream alternative."
        ],
        content: "The ratio is 1 medium frozen banana to .25 cups whole milk. Blend in Vitamix or any high powered blender. Vitamix is in use almost every day around here. *Finicky kid just wanted the chocolate chips. Balanced snack with a moderate carb focus, some healthy fats, and a bit of protein ideal for a clean treat. I like to have one of these the night before a morning run for good fuel.",
        imageUrl: "/attached_assets/20250610_182417_1749639036217.jpg",
        videoUrl: "https://youtube.com/shorts/7tWN7nfpuVU",
        gallery: [
          "/attached_assets/20250610_181919_1749639036216.jpg",
          "/attached_assets/20250610_182410_1749639036217.jpg",
          "/attached_assets/20250610_182417_1749639036217.jpg",
          "/attached_assets/20250610_183427 (1)_1749639036217.jpg",
          "/attached_assets/1000006873_1749639036218.jpg"
        ],
        authorId: "michael",
        authorName: "Michael Baker",
        authorPhoto: "/attached_assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg",
        createdAt: new Date(), // Most recent recipe
      },
      {
        id: this.currentId++,
        title: "Ground Chicken Breast Quick Goulash",
        description: "Easy one-pot goulash with Bell & Evans ground chicken breast, vegetables, and San Marzano tomatoes served over Kirkland rice",
        category: ["dinner"],
        dietType: ["high-protein"],
        tags: ["dinner", "high-protein", "one-pot", "chicken"],
        prepTime: 25,
        servings: 4,
        servingSize: "1.5 cups (6 oz)",
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
        content: "An easy one I make with Bell & Evans ground chicken breast is a quick goulash! I chop up onions and a fresh green pepper (but you can use any color) and sauté them for a bit with salt, pepper, and granulated California garlic (Kirkland). Then, I throw in the pound of ground chicken breast and break it up into the peppers and onions while seasoning to taste with basil, oregano, and a little parsley. Once the chicken is white and cooked, I throw in a can of crushed tomatoes (see pic—these are my favorite tomatoes at Whole Foods). Once bubbling, bring it down to simmer for a few minutes, add some Parmesan and more salt and pepper. Then, we usually have this over white rice (frozen pouches from Trader Joe's).",
        imageUrl: "/assets/download - 2025-06-08T053914.181_1749376059784.png",
        videoUrl: null,
        gallery: [
          "/assets/download - 2025-06-08T053908.812_1749376059784.png",
          "/assets/download - 2025-06-08T053914.181_1749376059784.png",
          "/assets/download - 2025-06-08T053921.230_1749376059785.png"
        ],
        authorId: "erica",
        authorName: "Erica Baker",
        authorPhoto: "/attached_assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg",
        createdAt: new Date('2024-01-01'),
      },
      {
        id: this.currentId++,
        title: "Ultimate Endurance Fuel: Easy Peanut Butter, Cinnamon, Honey Granola Recipe (Full Fat)",
        description: "100% organic homemade granola with no sketchy ingredients that breaks off into awesome chunks. Perfect for marathon training and carb-loading with clean, natural ingredients.",
        category: ["breakfast", "snack"],
        dietType: ["vegetarian"],
        tags: ["breakfast", "snack", "vegetarian", "granola", "endurance"],
        prepTime: 50,
        servings: 16,
        servingSize: "1 cup",
        calories: 498,
        protein: 12,
        carbs: 52,
        fat: 30,
        fiber: 8,
        sugar: 24,
        sodium: 150,
        vitaminC: 0,
        vitaminD: 0,
        calcium: 40,
        iron: 2,
        potassium: 180,
        ingredients: [
          "5 cups oats",
          "1 cup walnuts",
          "1 cup sliced almonds",
          "1 cup shredded coconut",
          "2 tbsp cinnamon",
          "6 tbsp salted butter",
          "1 tsp sea salt",
          "1/4 cup maple syrup",
          "1/4 cup peanut butter",
          "1/2 cup honey (plus extra for drizzling)",
          "1-2 tbsp vanilla extract (optional)"
        ],
        instructions: [
          "Preheat the oven to 305°F.",
          "In a large bowl, combine 5 cups oats, 1 cup walnuts, 1 cup sliced almonds, 1 cup shredded coconut, and optionally, the 1-2 tbsp vanilla extract. Mix the dry ingredients thoroughly.",
          "In a small pot over low heat, blend 2 tbsp cinnamon, 6 tbsp salted butter, 1 tsp sea salt, 1/4 cup maple syrup, 1/2 cup honey, and 1/4 cup peanut butter. Stir until fully blended and smooth.",
          "Pour the melted mixture into the dry ingredients in the large bowl and mix thoroughly until everything is evenly coated.",
          "Spread the granola mixture onto a large cookie sheet lined with parchment paper, creating an even layer about 1/2 inch thick.",
          "Bake for 20 minutes.",
          "Remove from the oven, stir the granola, and flatten it back down to an even layer.",
          "Drizzle additional honey in a crisscross pattern over the top of the flattened granola.",
          "Bake for an additional 20-25 minutes, or until the granola is golden brown and as crunchy as you like.",
          "Let the granola cool completely before breaking it up into chunks.",
          "Store in an airtight container."
        ],
        content: "This granola is awesome. It is my go-to carb-loading snack for marathon training and my family eats it up for breakfast or snacking. I created it out of frustration with low-quality store-bought options full of added sugar, seed oils, and tiny bags for high prices. I wanted a cleaner, more natural option with high-quality carbs, healthy fats, and balanced sweetness to fuel my long runs without compromising nutrition. I modeled it after brands like Purely Elizabeth and Grandy Organics but replaced the processed ingredients with raw honey and pure maple syrup as sweeteners and binders, and grass-fed butter for better fats and flavor. Raw honey is perfect for endurance, offering quick, digestible carbs with a low glycemic index for steady energy. It also provides antioxidants and essential minerals like potassium and magnesium to support muscle function and recovery. This granola's mix of slow- and fast-digesting carbs, healthy fats, and protein makes it ideal for carb-loading and supporting energy levels during long runs and workouts.",
        imageUrl: "/attached_assets/download - 2025-06-09T131947.822_1749489653696.png",
        videoUrl: "https://www.youtube.com/watch?v=bDovNcN5Dl4",
        gallery: [
          "/attached_assets/download - 2025-06-09T131947.822_1749489653696.png",
          "/attached_assets/download - 2025-06-09T131953.710_1749489653696.png",
          "/attached_assets/download - 2025-06-09T132001.684_1749489653696.png",
          "/attached_assets/download - 2025-06-09T132007.147_1749489653697.png"
        ],
        authorId: "michael",
        authorName: "Michael Baker",
        authorPhoto: "/attached_assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg",
        createdAt: new Date('2024-01-10'),
      },
      {
        id: this.currentId++,
        title: "Light Running Endurance Fuel: Cinnamon Raisin Granola (Low Fat High Carb)",
        description: "My long run pregame granola is super light running rocket fuel. My 5th Sunday in a row evolving this recipe: Clean, Light, Crunchy endurance fuel optimized for pre-run carb loading.",
        category: ["breakfast", "snack"],
        dietType: ["vegetarian"],
        tags: ["breakfast", "snack", "vegetarian", "granola", "endurance"],
        prepTime: 40,
        servings: 8,
        servingSize: "1 cup",
        calories: 437,
        protein: 4,
        carbs: 79,
        fat: 14,
        fiber: 5,
        sugar: 35,
        sodium: 150,
        vitaminC: 0,
        vitaminD: 0,
        calcium: 25,
        iron: 2,
        potassium: 200,
        ingredients: [
          "¼ cup pure maple syrup",
          "¼ cup raw honey", 
          "3 TBSP melted grass fed butter",
          "1.5 tsp pure vanilla extract",
          "1.5 TBSP ground cinnamon",
          "1 tsp sea salt",
          "2 cups old fashioned rolled oats",
          "½ cup raisins plus any extra desired"
        ],
        instructions: [
          "Preheat oven to 325°F.",
          "Over very low heat, blend butter, honey, maple syrup, cinnamon, vanilla, and salt until the mixture is smooth.",
          "In a large bowl, thoroughly coat the dry oats with the blended mixture.",
          "Flatten the mixture onto a cookie sheet and drizzle a bit of honey over the top.",
          "Bake for 20 minutes.",
          "Mix on the cookie sheet, stirring in raisins, and flatten into a thin layer.",
          "Bake an additional 15-20 minutes until golden brown.",
          "Let fully cool.",
          "Break apart and enjoy."
        ],
        content: "I can sustain most normal runs of up to 7 miles fully fasted without problems. If I'm doing intervals or a tempo run within that mile range, I like to have at least a banana beforehand. For 7-14 miles, a banana and a tablespoon of honey work well. Beyond 14 miles, carbs, electrolytes, hydration, and fueling become very important and a bit complicated. And if you plan to run a full marathon, proper fueling is important. Raisin bagels are the fast n easy if you don't have gut issues with grains.",
        imageUrl: "/attached_assets/download - 2025-06-09T133928.624_1749490827985.png",
        gallery: [
          "/attached_assets/download - 2025-06-09T133928.624_1749490827985.png",
          "/attached_assets/download - 2025-06-09T133933.866_1749490827986.png",
          "/attached_assets/download - 2025-06-09T133947.197_1749490827986.png"
        ],
        videoUrl: null,
        authorId: "michael",
        authorName: "Michael Baker",
        authorPhoto: "/attached_assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg",
        createdAt: new Date('2024-01-02'),
      }
    ];

    sampleRecipes.forEach(recipe => {
      this.recipes.set(recipe.id, recipe);
    });

    // Seed with workout from YouTube video
    const sampleWorkouts: Workout[] = [
      {
        id: this.currentId++,
        title: "Chest & Biceps Finisher - The Ultimate Push-up Workout - Body Weight & Iron Master Dumbbells",
        description: "An intense chest and biceps finisher workout combining bodyweight push-ups with dumbbell exercises for maximum muscle engagement and strength building.",
        category: "strength",
        duration: 30,
        difficulty: "intermediate",
        caloriesBurned: 250,
        equipment: ["dumbbells", "bodyweight"],
        exercises: [
          {
            name: "Standard Push-ups",
            sets: 3,
            reps: "8-12",
            description: "Classic push-up with hands shoulder-width apart, maintaining straight body line from head to heels"
          },
          {
            name: "Diamond Push-ups", 
            sets: 2,
            reps: "6-10",
            description: "Push-ups with hands forming diamond shape, targeting triceps and inner chest"
          },
          {
            name: "Dumbbell Bicep Curls",
            sets: 3,
            reps: "10-15",
            description: "Standing bicep curls with controlled movement, focusing on muscle contraction"
          },
          {
            name: "Dumbbell Chest Press",
            sets: 3,
            reps: "8-12",
            description: "Chest press lying on bench or floor, full range of motion for chest development"
          }
        ],
        imageUrl: null,
        videoUrl: "https://youtu.be/2NOc_trrSP8",
        authorId: "michael",
        authorName: "Michael Baker",
        authorPhoto: "/attached_assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg",
        createdAt: new Date(),
      },




    ];

    sampleWorkouts.forEach(workout => {
      this.workouts.set(workout.id, workout);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      id: insertUser.id || `user_${this.currentId++}`,
      ...insertUser,
      isAdmin: insertUser.isAdmin ?? false,
      subscriptionTier: insertUser.subscriptionTier ?? "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalCustomerId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async upsertUser(userData: Partial<User> & { id: string }): Promise<User> {
    const existingUser = this.users.get(userData.id);
    if (existingUser) {
      // Update existing user - set admin status for mike@webmbd.com
      const updatedUser = {
        ...existingUser,
        ...userData,
        isAdmin: userData.email === "mike@webmbd.com" ? true : (userData.isAdmin ?? existingUser.isAdmin),
        updatedAt: new Date(),
      };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user - set admin status for mike@webmbd.com
      const newUser: User = {
        id: userData.id,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        isAdmin: userData.email === "mike@webmbd.com" ? true : (userData.isAdmin || false),
        subscriptionTier: userData.subscriptionTier || "free",
        stripeCustomerId: userData.stripeCustomerId || null,
        stripeSubscriptionId: userData.stripeSubscriptionId || null,
        paypalCustomerId: userData.paypalCustomerId || null,
        age: userData.age || null,
        sex: userData.sex || null,
        height: userData.height || null,
        currentWeight: userData.currentWeight || null,
        desiredWeight: userData.desiredWeight || null,
        activityLevel: userData.activityLevel || null,
        goal: userData.goal || null,
        unitSystem: userData.unitSystem || null,
        macroProfile: userData.macroProfile || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(newUser.id, newUser);
      return newUser;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
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

  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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
      const matchesCategory = !category || (Array.isArray(recipe.category) ? recipe.category.includes(category) : recipe.category === category);
      const matchesDietType = !dietType || (Array.isArray(recipe.dietType) ? recipe.dietType.includes(dietType) : recipe.dietType === dietType);
      
      return matchesQuery && matchesCategory && matchesDietType;
    });
  }

  // Workout methods - use pool directly to bypass ORM issues
  async getWorkouts(): Promise<Workout[]> { 
    try {
      console.log('Fetching workouts using direct pool connection...');
      const result = await pool.query('SELECT * FROM workouts ORDER BY id');
      
      console.log('Pool query result:', result.rows.length, 'workouts found');
      
      const workouts = result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        difficulty: row.difficulty,
        duration: row.duration,
        caloriesBurned: row.calories_burned,
        equipment: row.equipment || null,
        exercises: row.exercises || [],
        imageUrl: row.image_url || null,
        videoUrl: row.video_url || null,
        authorId: row.author_id || null,
        authorName: row.author_name || null,
        authorPhoto: row.author_photo || null,
        createdAt: row.created_at ? new Date(row.created_at) : null,
      }));
      
      console.log('Successfully processed workouts:', workouts.length);
      if (workouts.length > 0) {
        console.log('Sample workout title:', workouts[0].title);
      }
      return workouts;
    } catch (error) {
      console.error('Database error fetching workouts:', error);
      return [];
    }
  }
  
  async getWorkout(id: number): Promise<Workout | undefined> { 
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout;
  }
  
  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> { 
    const [workout] = await db.insert(workouts).values(insertWorkout).returning();
    return workout;
  }
  
  async updateWorkout(id: number, updates: Partial<Workout>): Promise<Workout | undefined> { 
    const [workout] = await db.update(workouts)
      .set(updates)
      .where(eq(workouts.id, id))
      .returning();
    return workout;
  }
  
  async deleteWorkout(id: number): Promise<boolean> { 
    const result = await db.delete(workouts).where(eq(workouts.id, id));
    return result.rowCount > 0;
  }
  
  async getWorkoutsByCategory(category: string): Promise<Workout[]> {
    const allWorkouts = await this.getWorkouts();
    return allWorkouts.filter(workout => workout.category.toLowerCase() === category.toLowerCase());
  }
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

  // User favorites methods
  async getUserFavoriteRecipes(userId: number): Promise<Recipe[]> {
    // Force userId to 1 for development mode
    const developmentUserId = 1;
    console.log('Getting favorites for userId:', developmentUserId);
    console.log('All favorites:', Array.from(this.favoriteRecipes.values()));
    const favorites = Array.from(this.favoriteRecipes.values()).filter(fav => fav.userId === developmentUserId);
    console.log('Filtered favorites:', favorites);
    const recipes = favorites.map(fav => this.recipes.get(fav.recipeId)).filter(recipe => recipe !== undefined) as Recipe[];
    console.log('Found recipes:', recipes.length);
    return recipes;
  }

  async addFavoriteRecipe(userId: number, recipeId: number): Promise<FavoriteRecipe> {
    const favorite: FavoriteRecipe = {
      id: this.currentId++,
      userId: 1, // Force userId to 1 for development
      recipeId: parseInt(String(recipeId)),
      createdAt: new Date(),
    };
    this.favoriteRecipes.set(favorite.id, favorite);
    return favorite;
  }

  async removeFavoriteRecipe(userId: number, recipeId: number): Promise<boolean> {
    const favorite = Array.from(this.favoriteRecipes.values()).find(
      fav => fav.userId === userId && fav.recipeId === recipeId
    );
    if (favorite) {
      this.favoriteRecipes.delete(favorite.id);
      return true;
    }
    return false;
  }

  async isRecipeFavorited(userId: number, recipeId: number): Promise<boolean> {
    return Array.from(this.favoriteRecipes.values()).some(
      fav => fav.userId === userId && fav.recipeId === recipeId
    );
  }

  // Meal plan methods
  async getUserMealPlans(userId: number): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values()).filter(plan => plan.userId === userId);
  }

  async getMealPlan(id: number): Promise<MealPlan | undefined> {
    return this.mealPlans.get(id);
  }

  async createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan> {
    const plan: MealPlan = {
      id: this.currentId++,
      ...mealPlan,
      createdAt: new Date(),
    };
    this.mealPlans.set(plan.id, plan);
    return plan;
  }

  async deleteMealPlan(id: number): Promise<boolean> {
    // Remove all recipes from the meal plan first
    const planRecipes = Array.from(this.mealPlanRecipes.values()).filter(
      mpr => mpr.mealPlanId === id
    );
    planRecipes.forEach(mpr => this.mealPlanRecipes.delete(mpr.id));
    
    return this.mealPlans.delete(id);
  }

  async getMealPlanRecipes(mealPlanId: number): Promise<(MealPlanRecipe & { recipe: Recipe })[]> {
    const planRecipes = Array.from(this.mealPlanRecipes.values()).filter(
      mpr => mpr.mealPlanId === mealPlanId
    );
    
    return planRecipes.map(mpr => {
      const recipe = this.recipes.get(mpr.recipeId);
      if (!recipe) throw new Error(`Recipe ${mpr.recipeId} not found`);
      return { ...mpr, recipe };
    });
  }

  async addRecipeToMealPlan(mealPlanId: number, recipeId: number, mealType: string): Promise<MealPlanRecipe> {
    const mealPlanRecipe: MealPlanRecipe = {
      id: this.currentId++,
      mealPlanId,
      recipeId,
      mealType,
      createdAt: new Date(),
    };
    this.mealPlanRecipes.set(mealPlanRecipe.id, mealPlanRecipe);
    return mealPlanRecipe;
  }

  async removeRecipeFromMealPlan(mealPlanId: number, recipeId: number): Promise<boolean> {
    const mealPlanRecipe = Array.from(this.mealPlanRecipes.values()).find(
      mpr => mpr.mealPlanId === mealPlanId && mpr.recipeId === recipeId
    );
    if (mealPlanRecipe) {
      this.mealPlanRecipes.delete(mealPlanRecipe.id);
      return true;
    }
    return false;
  }

  // Calculator results methods
  async getUserCalculatorResults(userId: string): Promise<CalculatorResult[]> {
    return Array.from(this.calculatorResults.values())
      .filter(result => result.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createCalculatorResult(insertResult: InsertCalculatorResult): Promise<CalculatorResult> {
    const result: CalculatorResult = {
      id: this.currentId++,
      ...insertResult,
      createdAt: new Date(),
    };
    this.calculatorResults.set(result.id, result);
    return result;
  }

  // User favorite workouts methods
  async getUserFavoriteWorkouts(userId: number): Promise<Workout[]> {
    const favoriteWorkoutIds = Array.from(this.favoriteWorkouts.values())
      .filter(fav => fav.userId === "dev_user_1")
      .map(fav => fav.workoutId);
    
    return favoriteWorkoutIds
      .map(id => this.workouts.get(id))
      .filter((workout): workout is Workout => workout !== undefined);
  }

  async addFavoriteWorkout(userId: number, workoutId: number): Promise<FavoriteWorkout> {
    const favorite: FavoriteWorkout = {
      id: this.currentId++,
      userId: "dev_user_1",
      workoutId,
      createdAt: new Date(),
    };
    this.favoriteWorkouts.set(favorite.id, favorite);
    return favorite;
  }

  async removeFavoriteWorkout(userId: number, workoutId: number): Promise<boolean> {
    const favorite = Array.from(this.favoriteWorkouts.values()).find(
      fav => fav.userId === "dev_user_1" && fav.workoutId === workoutId
    );
    if (favorite) {
      this.favoriteWorkouts.delete(favorite.id);
      return true;
    }
    return false;
  }

  async isWorkoutFavorited(userId: number, workoutId: number): Promise<boolean> {
    return Array.from(this.favoriteWorkouts.values()).some(
      fav => fav.userId === "dev_user_1" && fav.workoutId === workoutId
    );
  }
}



// Database storage implementation
export class DatabaseStorage implements IStorage {
  private favoriteWorkouts: Set<string> = new Set(); // Simple in-memory storage for favorites

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
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
    const [user] = await db.update(users).set({
      ...profileData,
      updatedAt: new Date()
    }).where(eq(users.id, id)).returning();
    return user;
  }

  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    return await db.select().from(recipes);
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [newRecipe] = await db.insert(recipes).values(recipe).returning();
    return newRecipe;
  }

  async updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined> {
    const [recipe] = await db.update(recipes).set(updates).where(eq(recipes.id, id)).returning();
    return recipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const result = await db.delete(recipes).where(eq(recipes.id, id));
    return result.rowCount > 0;
  }

  async searchRecipes(query: string, category?: string, dietType?: string): Promise<Recipe[]> {
    // Simple implementation - can be enhanced with full-text search
    const allRecipes = await db.select().from(recipes);
    return allRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Calculator results methods
  async getUserCalculatorResults(userId: string): Promise<CalculatorResult[]> {
    return await db.select().from(calculatorResults)
      .where(eq(calculatorResults.userId, userId))
      .orderBy(desc(calculatorResults.createdAt));
  }

  async createCalculatorResult(insertResult: InsertCalculatorResult): Promise<CalculatorResult> {
    const [result] = await db.insert(calculatorResults).values({
      ...insertResult,
      createdAt: new Date()
    }).returning();
    return result;
  }

  // User favorites methods
  async getUserFavoriteRecipes(userId: number): Promise<Recipe[]> {
    const favorites = await db.select({
      recipe: recipes
    })
    .from(favoriteRecipes)
    .innerJoin(recipes, eq(favoriteRecipes.recipeId, recipes.id))
    .where(eq(favoriteRecipes.userId, "dev_user_1")); // Use string userId
    
    return favorites.map(fav => fav.recipe);
  }

  async addFavoriteRecipe(userId: number, recipeId: number): Promise<FavoriteRecipe> {
    const [favorite] = await db.insert(favoriteRecipes).values({
      userId: "dev_user_1", // Use string userId
      recipeId,
      createdAt: new Date()
    }).returning();
    return favorite;
  }

  async removeFavoriteRecipe(userId: number, recipeId: number): Promise<boolean> {
    const result = await db.delete(favoriteRecipes)
      .where(and(eq(favoriteRecipes.userId, "dev_user_1"), eq(favoriteRecipes.recipeId, recipeId)));
    return result.rowCount > 0;
  }

  async isRecipeFavorited(userId: number, recipeId: number): Promise<boolean> {
    const [favorite] = await db.select().from(favoriteRecipes)
      .where(and(eq(favoriteRecipes.userId, "dev_user_1"), eq(favoriteRecipes.recipeId, recipeId)));
    return !!favorite;
  }

  // User favorite workouts methods
  async getUserFavoriteWorkouts(userId: number): Promise<Workout[]> {
    // For now, return the authentic workout from the workoutService
    const { workoutService } = await import("./workoutService");
    const allWorkouts = await workoutService.getAllWorkouts();
    
    // Return empty array for now since we don't have a real database
    // but the heart icon functionality will still work
    return [];
  }

  async addFavoriteWorkout(userId: number, workoutId: number): Promise<FavoriteWorkout> {
    const key = `${userId}-${workoutId}`;
    this.favoriteWorkouts.add(key);
    
    const favorite: FavoriteWorkout = {
      id: Date.now(),
      userId: "dev_user_1",
      workoutId,
      createdAt: new Date()
    };
    return favorite;
  }

  async removeFavoriteWorkout(userId: number, workoutId: number): Promise<boolean> {
    const key = `${userId}-${workoutId}`;
    return this.favoriteWorkouts.delete(key);
  }

  async isWorkoutFavorited(userId: number, workoutId: number): Promise<boolean> {
    const key = `${userId}-${workoutId}`;
    return this.favoriteWorkouts.has(key);
  }

  // Stub implementations for other methods (not currently used)
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
  async getUserMealPlans(userId: number): Promise<MealPlan[]> { return []; }
  async createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan> { throw new Error("Not implemented"); }
  async deleteMealPlan(id: number): Promise<boolean> { return false; }
  async getMealPlanRecipes(mealPlanId: number): Promise<MealPlanRecipe[]> { return []; }
  async addRecipeToMealPlan(mealPlanRecipe: InsertMealPlanRecipe): Promise<MealPlanRecipe> { throw new Error("Not implemented"); }
  async removeRecipeFromMealPlan(mealPlanId: number, recipeId: number): Promise<boolean> { return false; }
}

export const storage = new MemStorage();