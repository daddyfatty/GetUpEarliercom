import { HeroSection } from "@/components/hero-section";
import { BookPromotion } from "@/components/book-promotion";
import { SubscriptionTiers } from "@/components/subscription-tiers";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { RecipeCard } from "@/components/recipe-card";
import { WorkoutCard } from "@/components/workout-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, TrendingUp, Users, Star, ChefHat } from "lucide-react";
import type { Recipe, Workout } from "@shared/schema";

export default function Home() {
  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const featuredRecipes = recipes.slice(0, 3);
  const featuredWorkouts = workouts.slice(0, 3);

  return (
    <div className="w-full">
      <HeroSection />
      
      {/* Featured Recipes Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Recipes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover nutritious, delicious recipes updated weekly. From quick breakfasts to hearty dinners.
            </p>
            <div className="bg-accent/10 text-accent px-4 py-2 rounded-full inline-block mt-4 font-medium">
              <TrendingUp className="inline w-4 h-4 mr-2" />
              New recipes added weekly!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/recipes">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Workouts Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Workouts
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple, effective workouts for every fitness level. From beginner-friendly routines to advanced challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/workouts">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Workouts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Healthy Recipes</div>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Workout Plans</div>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">4.9★</div>
              <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <BookPromotion />
      <SubscriptionTiers />
      <NewsletterSignup />
    </div>
  );
}
