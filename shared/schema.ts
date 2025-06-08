import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  subscriptionTier: text("subscription_tier").default("free"), // free, pro, premium
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  paypalCustomerId: text("paypal_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: jsonb("category").$type<string[]>().notNull(), // breakfast, lunch, dinner, snack, dessert, finicky-kid-friendly
  dietType: jsonb("diet_type").$type<string[]>().notNull(), // vegetarian, vegan, keto, paleo, high-protein
  prepTime: integer("prep_time").notNull(), // in minutes
  servings: integer("servings").notNull(),
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
  imageUrl: text("image_url"),
  gallery: jsonb("gallery").$type<string[]>(),
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
    duration?: number;
    description: string;
  }[]>().notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
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
  userId: integer("user_id").notNull(),
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
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // streak, goal_completion, milestone
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const waterIntake = pgTable("water_intake", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  glasses: integer("glasses").default(0),
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
