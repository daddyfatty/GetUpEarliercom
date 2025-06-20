import { HeroSection } from "@/components/hero-section";
import { BookPromotion } from "@/components/book-promotion";
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Latest Recipe */}
            <div className="text-center flex flex-col h-full">
              <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white mb-2">Latest Recipe</h2>
                  <p className="text-red-100 mb-2">Interactive, clean, lean high-protein recipes</p>
                  <div className="bg-red-200/20 text-red-100 px-3 py-1 rounded-full inline-block text-sm font-medium">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    New recipes added weekly!
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  {featuredRecipes.length > 0 && (
                    <div className="mb-4">
                      <RecipeCard recipe={featuredRecipes[0]} />
                    </div>
                  )}
                </div>
                
                <div className="mt-auto">
                  <Link href="/recipes">
                    <Button 
                      size="lg" 
                      className="w-full font-semibold text-red-700 bg-white hover:bg-red-50 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <ChefHat className="h-5 w-5 mr-2" />
                      View All Recipes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Column 2: Latest Workout */}
            <div className="text-center flex flex-col h-full">
              <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white mb-2">Latest Workout</h2>
                  <p className="text-blue-100 mb-2">Simple, effective workouts for every fitness level</p>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  {featuredWorkouts.length > 0 && (
                    <div className="mb-4">
                      <WorkoutCard workout={featuredWorkouts[0]} />
                    </div>
                  )}
                </div>
                
                <div className="mt-auto">
                  <Link href="/workouts">
                    <Button 
                      size="lg" 
                      className="w-full font-semibold text-blue-700 bg-white hover:bg-blue-50 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Dumbbell className="h-5 w-5 mr-2" />
                      View All Workouts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Column 3: Ready to Transform */}
            <div className="text-center flex flex-col h-full">
              <div className="bg-gradient-to-br from-[hsl(var(--coaching-primary))] via-purple-700 to-[hsl(var(--coaching-accent))] text-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white mb-2">Ready to Transform?</h2>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop&crop=center"
                      alt="Personal training and fitness coaching"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p className="text-purple-100 text-sm leading-relaxed">
                      Get personalized training and coaching from a certified trainer, yoga teacher, running coach, and integrative nutrition coach. 
                      Bridge the gap from inactivity to strength and sustainable healthy habits.
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto space-y-3">
                  <Link href="/coaching">
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-[hsl(var(--coaching-text))] hover:bg-[hsl(var(--coaching-light))] font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      View Coaching Packages
                    </Button>
                  </Link>
                  
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-[hsl(var(--coaching-accent))] to-[hsl(var(--coaching-primary))] hover:from-[hsl(var(--coaching-accent))]/90 hover:to-[hsl(var(--coaching-primary))]/90 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Free Consultation
                  </Button>
                  
                  <p className="text-purple-200 text-xs mt-2">
                    No commitment required • 30-minute consultation • Personalized recommendations
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
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-red-600" />
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
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">4.9★</div>
              <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
      <BookPromotion />
      <NewsletterSignup />
    </div>
  );
}
