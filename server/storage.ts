import type { User, Recipe, Workout, Goal, FoodEntry, Achievement, WaterIntake, FavoriteRecipe, MealPlan, MealPlanRecipe, CalculatorResult, InsertUser, InsertRecipe, InsertWorkout, InsertGoal, InsertFoodEntry, InsertAchievement, InsertWaterIntake, InsertFavoriteRecipe, InsertMealPlan, InsertMealPlanRecipe, InsertCalculatorResult } from "../shared/schema";

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
  getUserWaterIntake(userId: number, date: Date): Promise<WaterIntake | undefined>;
  updateWaterIntake(userId: number, date: Date, glasses: number): Promise<WaterIntake>;

  // User favorites methods
  getUserFavoriteRecipes(userId: number): Promise<Recipe[]>;
  addFavoriteRecipe(userId: number, recipeId: number): Promise<FavoriteRecipe>;
  removeFavoriteRecipe(userId: number, recipeId: number): Promise<boolean>;
  isRecipeFavorited(userId: number, recipeId: number): Promise<boolean>;

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
    this.mealPlans = new Map();
    this.mealPlanRecipes = new Map();
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
      id: "regular-user-1", 
      email: "user@example.com",
      firstName: "Regular",
      lastName: "User",
      profileImageUrl: null,
      isAdmin: false,
      subscriptionTier: "free",
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

  // Placeholder implementations for other methods
  async getWorkouts(): Promise<Workout[]> { 
    return Array.from(this.workouts.values()); 
  }
  
  async getWorkout(id: number): Promise<Workout | undefined> { 
    return this.workouts.get(id); 
  }
  
  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> { 
    const workout: Workout = { 
      id: this.currentId++, 
      ...insertWorkout,
      imageUrl: insertWorkout.imageUrl ?? null,
      videoUrl: insertWorkout.videoUrl ?? null,
      equipment: insertWorkout.equipment ?? null,
      createdAt: new Date() 
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
  
  async getWorkoutsByCategory(category: string): Promise<Workout[]> { 
    return Array.from(this.workouts.values()).filter(workout => 
      workout.category === category
    );
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
    const favorites = Array.from(this.favoriteRecipes.values()).filter(fav => fav.userId === userId);
    const recipes = favorites.map(fav => this.recipes.get(fav.recipeId)).filter(recipe => recipe !== undefined) as Recipe[];
    return recipes;
  }

  async addFavoriteRecipe(userId: number, recipeId: number): Promise<FavoriteRecipe> {
    const favorite: FavoriteRecipe = {
      id: this.currentId++,
      userId,
      recipeId,
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
}

export const storage = new MemStorage();