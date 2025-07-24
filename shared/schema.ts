import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Replit user ID
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  subscriptionTier: text("subscription_tier").default("free"), // free, pro, premium
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  paypalCustomerId: text("paypal_customer_id"),
  // Calorie calculator profile data
  age: integer("age"),
  sex: text("sex"), // male, female
  height: integer("height"), // in cm
  currentWeight: integer("current_weight"), // in grams (for precision)
  desiredWeight: integer("desired_weight"), // in grams
  activityLevel: text("activity_level"), // 1.2, 1.375, 1.55, 1.725, 1.9
  goal: text("goal"), // maintenance, loss, gain
  unitSystem: text("unit_system"), // metric, imperial
  macroProfile: text("macro_profile"), // balanced, moderate-protein, high-protein, high-carb
  targetCalories: integer("target_calories"), // calculated daily target calories
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: jsonb("category").$type<string[]>().notNull(), // breakfast, lunch, dinner, snack, dessert, finicky-kid-friendly
  diet_type: jsonb("diet_type").$type<string[]>().notNull(), // vegetarian, vegan, keto, paleo, high-protein
  tags: jsonb("tags").$type<string[]>(), // breakfast, snack, vegetarian, etc.
  prepTime: integer("prep_time").notNull(), // in minutes
  servings: integer("servings").notNull(),
  servingSize: text("serving_size"), // e.g., "1 cup", "4 oz", "150g"
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(), // in grams
  carbs: integer("carbs").notNull(), // in grams
  fat: integer("fat").notNull(), // in grams
  fiber: integer("fiber"), // in grams
  sugar: integer("sugar"), // in grams
  sodium: integer("sodium"), // in mg
  vitaminC: integer("vitamin_c"), // in mg
  vitaminD: integer("vitamin_d"), // in IU
  calcium: integer("calcium"), // in mg
  iron: integer("iron"), // in mg
  potassium: integer("potassium"), // in mg
  ingredients: jsonb("ingredients").$type<string[]>().notNull(),
  instructions: jsonb("instructions").$type<string[]>().notNull(),
  content: text("content"), // Rich text content for recipe story/description
  imageUrl: text("image_url"),
  videoUrl: text("video_url"), // YouTube video URL
  gallery: jsonb("gallery").$type<string[]>(),
  authorId: text("author_id"), // Team member ID (michael or erica)
  authorName: text("author_name"), // Display name
  authorPhoto: text("author_photo"), // Author's photo URL
  createdAt: timestamp("created_at").defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // strength, cardio, flexibility, hiit
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  duration: integer("duration").notNull(), // in minutes
  caloriesBurned: integer("calories_burned").notNull(),
  equipment: jsonb("equipment").$type<string[]>(),
  exercises: jsonb("exercises").$type<{
    name: string;
    sets?: number;
    reps?: string;
    duration?: string;
    rest?: string;
    description?: string;
  }[]>().notNull(),
  content: text("content"), // Rich text content for workout story/detailed instructions
  imageUrl: text("image_url"),
  videoUrl: text("video_url"), // YouTube video URL
  authorId: text("author_id"), // Team member ID (michael or erica)
  authorName: text("author_name"), // Display name
  authorPhoto: text("author_photo"), // Author's photo URL
  createdAt: timestamp("created_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // weight_loss, exercise_frequency, water_intake, custom
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").default(0),
  unit: text("unit").notNull(), // lbs, sessions, glasses, etc
  deadline: timestamp("deadline"),
  status: text("status").default("active"), // active, completed, paused
  createdAt: timestamp("created_at").defaultNow(),
});

export const foodEntries = pgTable("food_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  foodName: text("food_name").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // grams, cups, pieces
  calories: integer("calories").notNull(),
  protein: integer("protein").default(0),
  carbs: integer("carbs").default(0),
  fat: integer("fat").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // streak, goal_completion, milestone
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const waterIntake = pgTable("water_intake", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  glasses: integer("glasses").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favoriteRecipes = pgTable("favorite_recipes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favoriteWorkouts = pgTable("favorite_workouts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  workoutId: integer("workout_id").notNull().references(() => workouts.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull().default("My Meal Plan"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mealPlanRecipes = pgTable("meal_plan_recipes", {
  id: serial("id").primaryKey(),
  mealPlanId: integer("meal_plan_id").notNull().references(() => mealPlans.id),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  createdAt: timestamp("created_at").defaultNow(),
});

export const calculatorResults = pgTable("calculator_results", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  calculatorType: text("calculator_type").notNull(), // calorie, alcohol, nutrition
  results: jsonb("results").notNull(), // Store all calculation results
  userInputs: jsonb("user_inputs").notNull(), // Store user input data
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  paypalCustomerId: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export const insertFoodEntrySchema = createInsertSchema(foodEntries).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export const insertWaterIntakeSchema = createInsertSchema(waterIntake).omit({
  id: true,
  createdAt: true,
});

export const insertFavoriteRecipeSchema = createInsertSchema(favoriteRecipes).omit({
  id: true,
  createdAt: true,
});

export const insertFavoriteWorkoutSchema = createInsertSchema(favoriteWorkouts).omit({
  id: true,
  createdAt: true,
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true,
});

export const insertMealPlanRecipeSchema = createInsertSchema(mealPlanRecipes).omit({
  id: true,
  createdAt: true,
});

export const insertCalculatorResultSchema = createInsertSchema(calculatorResults).omit({
  id: true,
  createdAt: true,
});

// Blog posts table for Facebook integration
export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(), // SEO-friendly URL slug
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull().default("Michael Baker"),
  publishedDate: text("published_date").notNull(),
  category: text("category").notNull(), // Primary category for backward compatibility
  categories: text("categories").array(), // Multiple categories array
  tags: text("tags").notNull(), // JSON string of array
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  readTime: integer("read_time").notNull(),
  isVideo: boolean("is_video").default(false),
  originalUrl: text("original_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  createdAt: true,
  updatedAt: true,
});

// Training log entries table
export const trainingLogEntries = pgTable("training_log_entries", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(), // SEO-friendly URL slug
  entryNumber: integer("entry_number").notNull(), // Sequential entry number
  date: text("date").notNull(), // Training date
  title: text("title").notNull(),
  content: text("content").notNull(),
  distance: text("distance"), // e.g., "19.00 mi"
  pace: text("pace"), // e.g., "8:22 /mi"
  time: text("time"), // e.g., "2h 38m"
  images: text("images").array(), // Array of image URLs
  categories: text("categories").array(), // Array of category strings
  strava_data: jsonb("strava_data").$type<{
    splits?: any;
    route?: any;
    stats?: any;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTrainingLogEntrySchema = createInsertSchema(trainingLogEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type FoodEntry = typeof foodEntries.$inferSelect;
export type InsertFoodEntry = z.infer<typeof insertFoodEntrySchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type WaterIntake = typeof waterIntake.$inferSelect;
export type InsertWaterIntake = z.infer<typeof insertWaterIntakeSchema>;
export type FavoriteRecipe = typeof favoriteRecipes.$inferSelect;
export type InsertFavoriteRecipe = z.infer<typeof insertFavoriteRecipeSchema>;
export type FavoriteWorkout = typeof favoriteWorkouts.$inferSelect;
export type InsertFavoriteWorkout = z.infer<typeof insertFavoriteWorkoutSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlanRecipe = typeof mealPlanRecipes.$inferSelect;
export type InsertMealPlanRecipe = z.infer<typeof insertMealPlanRecipeSchema>;
export type CalculatorResult = typeof calculatorResults.$inferSelect;
export type InsertCalculatorResult = z.infer<typeof insertCalculatorResultSchema>;

// Like and Share tracking tables
export const calculatorLikes = pgTable("calculator_likes", {
  id: serial("id").primaryKey(),
  calculatorType: text("calculator_type").notNull(), // 'alcohol', 'calorie'
  userId: text("user_id"), // Optional - can track anonymous likes by IP
  ipAddress: text("ip_address"), // For anonymous tracking
  userAgent: text("user_agent"), // Browser fingerprinting
  createdAt: timestamp("created_at").defaultNow(),
});

export const calculatorShares = pgTable("calculator_shares", {
  id: serial("id").primaryKey(),
  calculatorType: text("calculator_type").notNull(), // 'alcohol', 'calorie'
  platform: text("platform").notNull(), // 'facebook', 'linkedin', 'sms', 'email'
  userId: text("user_id"), // Optional - can track anonymous shares
  ipAddress: text("ip_address"), // For anonymous tracking
  userAgent: text("user_agent"), // Browser fingerprinting
  createdAt: timestamp("created_at").defaultNow(),
});

// Calculator stats aggregation table for performance
export const calculatorStats = pgTable("calculator_stats", {
  id: serial("id").primaryKey(),
  calculatorType: text("calculator_type").notNull().unique(), // 'alcohol', 'calorie'
  totalLikes: integer("total_likes").default(0),
  totalShares: integer("total_shares").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCalculatorLikeSchema = createInsertSchema(calculatorLikes).omit({ id: true, createdAt: true });
export const insertCalculatorShareSchema = createInsertSchema(calculatorShares).omit({ id: true, createdAt: true });
export const insertCalculatorStatsSchema = createInsertSchema(calculatorStats).omit({ id: true, updatedAt: true });

export type CalculatorLike = typeof calculatorLikes.$inferSelect;
export type CalculatorShare = typeof calculatorShares.$inferSelect;
export type CalculatorStats = typeof calculatorStats.$inferSelect;
export type InsertCalculatorLike = z.infer<typeof insertCalculatorLikeSchema>;
export type InsertCalculatorShare = z.infer<typeof insertCalculatorShareSchema>;
export type InsertCalculatorStats = z.infer<typeof insertCalculatorStatsSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type TrainingLogEntry = typeof trainingLogEntries.$inferSelect;
export type InsertTrainingLogEntry = z.infer<typeof insertTrainingLogEntrySchema>;
