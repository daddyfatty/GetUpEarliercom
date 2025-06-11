import { HeroSection } from "@/components/hero-section";
import { CoachingSection } from "@/components/coaching-section";
import { BookPromotion } from "@/components/book-promotion";
import { SubscriptionTiers } from "@/components/subscription-tiers";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { RecipeCard } from "@/components/recipe-card";
import { WorkoutCard } from "@/components/workout-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, TrendingUp, Users, Star, ChefHat, Dumbbell, ArrowRight, Calendar } from "lucide-react";
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
      {/* Coaching Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-br from-[hsl(var(--coaching-primary))] via-purple-700 to-[hsl(var(--coaching-accent))] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform?</h2>
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              Get personalized coaching from a certified trainer with 30 years of experience. 
              Bridge the gap from inactivity to strength and healthy habits.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/coaching">
              <Button 
                size="lg" 
                className="bg-white text-[hsl(var(--coaching-text))] hover:bg-[hsl(var(--coaching-light))] font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 min-w-[200px]"
              >
                <Users className="h-5 w-5 mr-2" />
                View Coaching Packages
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[hsl(var(--coaching-accent))] to-[hsl(var(--coaching-primary))] hover:from-[hsl(var(--coaching-accent))]/90 hover:to-[hsl(var(--coaching-primary))]/90 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 min-w-[200px]"
              onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Free Consultation
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-purple-200 text-sm">
              No commitment required • 30-minute consultation • Personalized recommendations
            </p>
          </div>
        </div>
      </section>
      {/* Featured Recipes Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest Recipes</h2>
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
              <Button 
                size="lg" 
                className="font-semibold text-white hover:opacity-90"
                style={{ backgroundColor: '#ef4444' }}
              >
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
              <Button 
                size="lg" 
                className="font-semibold text-black hover:opacity-90"
                style={{ backgroundColor: '#B3D7E9' }}
              >
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Clean & Lean Recipes</div>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Workout Plans</div>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">4.9★</div>
              <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
      <CoachingSection />
      <BookPromotion />
      <SubscriptionTiers />
      <NewsletterSignup />
    </div>
  );
}
