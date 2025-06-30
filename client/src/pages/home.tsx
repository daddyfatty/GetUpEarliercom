import { HeroSection } from "@/components/hero-section";
import { BookPromotion } from "@/components/book-promotion";
import { RecipeCard } from "@/components/recipe-card";
import { WorkoutCard } from "@/components/workout-card";
import { CredentialsBand } from "@/components/credentials-band";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, TrendingUp, Users, Star, ChefHat, Dumbbell, ArrowRight, Calendar, Target, MapPin } from "lucide-react";
import type { Recipe, Workout } from "@shared/schema";
import gymImagePath from "@assets/download - 2025-06-20T164725.183_1750452478509.png";

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
      <section className="py-12 bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: 1-on-1 Services */}
            <div className="text-center flex flex-col h-full">
              <div className="bg-white border-2 border-purple-200 p-6 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="mb-4">
                  <div className="inline-block bg-purple-800/10 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    1-on-1 Services
                  </div>
                  <h2 className="text-2xl font-bold text-purple-800 mb-2">1-on-1 Strength Training</h2>
                  <p className="text-gray-600 mb-2 text-[14px]">Personalized coaching tailored to your goals</p>
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full inline-block text-sm font-medium">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Local Orange CT or virtual anywhere
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <img 
                      src={gymImagePath}
                      alt="Professional strength training gym with squat racks and free weights"
                      className="w-full h-48 object-cover rounded-lg mb-4 border border-purple-200"
                    />
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Get personalized training and coaching from a certified trainer, yoga teacher, running coach, and integrative nutrition coach. 
                      Bridge the gap from inactivity to strength and sustainable healthy habits.
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto space-y-3">
                  <Link href="/services">
                    <Button 
                      size="lg" 
                      className="w-full bg-purple-800 text-white hover:bg-purple-900 font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      View Services
                    </Button>
                  </Link>
                  
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Free Consultation
                  </Button>
                  
                  <p className="text-gray-500 text-xs mt-2">
                    No commitment required • 30-minute consultation • Personalized recommendations
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Latest Recipe */}
            <div className="text-center flex flex-col h-full">
              <div className="bg-white border-2 border-red-200 p-6 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="mb-4">
                  <div className="inline-block bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Fresh Recipe Collection
                  </div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">Latest Recipe</h2>
                  <p className="text-gray-600 mb-2 text-[14px]">Interactive, clean, lean high-protein recipes</p>
                  <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block text-sm font-medium">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    New recipes added weekly!
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
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
                      className="w-full font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <ChefHat className="h-5 w-5 mr-2" />
                      View All Recipes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Column 3: Latest Workout */}
            <div className="text-center flex flex-col h-full">
              <div className="bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="mb-4">
                  <div className="inline-block bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Workout Collection
                  </div>
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">Latest Workout</h2>
                  <p className="text-gray-600 mb-2 text-[14px]">Simple, effective workouts for every fitness level</p>
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full inline-block text-sm font-medium">
                    <Dumbbell className="inline w-4 h-4 mr-1" />
                    New workouts added weekly!
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
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
                      className="w-full font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Dumbbell className="h-5 w-5 mr-2" />
                      View All Workouts
                    </Button>
                  </Link>
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
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5.0★</div>
              <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Clean & Lean Recipes</div>
              <div className="text-xs text-orange-500 font-medium mt-1">BETA COMING SOON</div>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Workout Plans</div>
              <div className="text-xs text-orange-500 font-medium mt-1">BETA COMING SOON</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Credentials Band */}
      <CredentialsBand />
      
      <BookPromotion />
    </div>
  );
}
