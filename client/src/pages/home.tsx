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
      {/* Combined Three-Column Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Latest Recipe */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
              {/* Featured Image */}
              {featuredRecipes.length > 0 && featuredRecipes[0].imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={featuredRecipes[0].imageUrl} 
                    alt={featuredRecipes[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <TrendingUp className="inline w-4 h-4 mr-1" />
                      New!
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow text-center">
                <div className="mb-6 flex-grow">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Latest Recipe</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Discover nutritious, delicious recipes updated weekly.
                  </p>
                  {featuredRecipes.length > 0 && (
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {featuredRecipes[0].title}
                    </h3>
                  )}
                </div>
                
                <Link href="/recipes" className="mt-auto">
                  <Button 
                    size="lg" 
                    className="w-full font-semibold text-white hover:opacity-90"
                    style={{ backgroundColor: '#ef4444' }}
                  >
                    <ChefHat className="h-5 w-5 mr-2" />
                    View All Recipes
                  </Button>
                </Link>
              </div>
            </div>

            {/* Column 2: Latest Workout */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
              {/* Featured Image */}
              {featuredWorkouts.length > 0 && featuredWorkouts[0].thumbnailUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={featuredWorkouts[0].thumbnailUrl} 
                    alt={featuredWorkouts[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow text-center">
                <div className="mb-6 flex-grow">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Latest Workout</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Simple, effective workouts for every fitness level.
                  </p>
                  {featuredWorkouts.length > 0 && (
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {featuredWorkouts[0].title}
                    </h3>
                  )}
                </div>
                
                <Link href="/workouts" className="mt-auto">
                  <Button 
                    size="lg" 
                    className="w-full font-semibold text-black hover:opacity-90"
                    style={{ backgroundColor: '#B3D7E9' }}
                  >
                    <Dumbbell className="h-5 w-5 mr-2" />
                    View All Workouts
                  </Button>
                </Link>
              </div>
            </div>

            {/* Column 3: Ready to Transform */}
            <div className="bg-gradient-to-br from-[hsl(var(--coaching-primary))] via-purple-700 to-[hsl(var(--coaching-accent))] rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
              {/* Featured Image/Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <div className="text-sm font-medium">Personal Coaching</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="inline w-4 h-4 mr-1" />
                    Featured
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow text-center text-white">
                <div className="mb-6 flex-grow">
                  <h2 className="text-2xl font-bold mb-3">Ready to Transform?</h2>
                  <p className="text-purple-100 mb-4 leading-relaxed">
                    Get personalized training and coaching from a certified trainer, yoga teacher, running coach, and integrative nutrition coach.
                  </p>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <Link href="/coaching">
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-[hsl(var(--coaching-text))] hover:bg-gray-100 font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      View Coaching Packages
                    </Button>
                  </Link>
                  
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border border-white border-opacity-30"
                    onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Free Consultation
                  </Button>
                  
                  <p className="text-purple-200 text-xs mt-3">
                    No commitment required • 30-minute consultation
                  </p>
                </div>
              </div>
            </div>
            
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
