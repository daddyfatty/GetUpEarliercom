import { HeroSection } from "@/components/hero-section";
import { BookPromotion } from "@/components/book-promotion";
import { RecipeCard } from "@/components/recipe-card";
import { WorkoutCard } from "@/components/workout-card";
import { CredentialsBand } from "@/components/credentials-band";
import { ClientReviews } from "@/components/client-reviews";
import { GoogleReviews } from "@/components/google-reviews";
import GoogleReviewsCarousel from "@/components/google-reviews-carousel";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, TrendingUp, Users, Star, ChefHat, Dumbbell, ArrowRight, Calendar, Target, MapPin, BookOpen, ExternalLink } from "lucide-react";
import type { Recipe, Workout, BlogPost } from "@shared/schema";
import gymImagePath from "@assets/download - 2025-06-20T164725.183_1750452478509.png";
import { useEffect, useState } from "react";
import { SEO } from "@/components/seo";

function LatestBlogCard() {
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const latestPost = blogPosts[0];

  return (
    <Link href={latestPost ? `/blog/${latestPost.slug}` : "/blog"} className="block h-full">
      <div className="bg-white border-2 border-green-200 p-6 rounded-2xl shadow-lg h-full flex flex-col hover:shadow-xl hover:border-green-300 transition-all duration-200 cursor-pointer">
        <div className="mb-4">
          <div className="inline-block bg-green-600/10 text-green-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
            Latest Blog
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Latest Blog</h2>
          <p className="text-gray-600 mb-2 text-[14px]">Health, fitness, and nutrition insights</p>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block text-sm font-medium">
            <BookOpen className="inline w-4 h-4 mr-1" />
            New posts added regularly!
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          {latestPost ? (
            <div className="mb-4">
              {latestPost.imageUrl && (
                <img 
                  src={latestPost.imageUrl}
                  alt={latestPost.title}
                  className="w-full h-72 object-cover rounded-lg mb-4 border border-green-200"
                />
              )}
              <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">
                {latestPost.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {latestPost.excerpt}
              </p>
            </div>
          ) : (
            <div className="mb-4 text-center text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Loading latest blog post...</p>
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <Button 
            size="lg" 
            className="w-full font-semibold text-white bg-green-600 hover:bg-green-700 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Read Full Post
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate rotation based on scroll position (20% = 72 degrees max)
  const starRotation = (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 72;

  const featuredRecipes = recipes.slice(0, 3);
  const featuredWorkouts = workouts.slice(0, 3);

  return (
    <div className="w-full">
      <SEO 
        title="Get Up Earlier Strength & Nutrition Coaching"
        description="Transform your health with personalized strength training, nutrition coaching, and accountability support. Michael Baker helps you build lasting healthy habits and achieve real fitness results in Orange, CT or virtually anywhere."
        keywords="personal training, nutrition coaching, accountability coaching, fitness, strength training, healthy habits, marathon training, yoga, wellness, Michael Baker"
        url="/"
        canonical="https://www.getupearlier.com/"
      />
      <HeroSection />
      {/* Four-Card Two-Column Section */}
      <section className="py-4 sm:py-8 bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Top Row */}
            {/* Column 1: 1-on-1 Services */}
            <div className="text-center flex flex-col h-full">
              <Link href="/services" className="block h-full">
                <div className="bg-white border-2 border-purple-200 p-6 rounded-2xl shadow-lg h-full flex flex-col hover:shadow-xl hover:border-purple-300 transition-all duration-200 cursor-pointer">
                  <div className="mb-4">
                    <div className="inline-block bg-purple-800/10 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      1-on-1 Services
                    </div>
                    <h2 className="text-2xl font-bold text-purple-800 mb-2">Strength, Nutrition, Yoga</h2>
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
                        className="w-full h-72 object-cover rounded-lg mb-4 border border-purple-200"
                      />
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Get personalized training and coaching from a certified trainer, yoga teacher, running coach, and integrative nutrition coach. 
                        Bridge the gap from inactivity to strength and sustainable healthy habits.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      size="lg" 
                      className="w-full bg-purple-800 text-white hover:bg-purple-900 font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      View Services
                    </Button>
                  </div>
                </div>
              </Link>
            </div>

            {/* Column 2: Latest Blog */}
            <div className="text-center flex flex-col h-full">
              <LatestBlogCard />
            </div>

          </div>
          
          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            
            {/* Column 1: Latest Recipe */}
            <div className="text-center flex flex-col h-full">
              <Link href="/recipes" className="block h-full">
                <div className="bg-white border-2 border-red-200 p-6 rounded-2xl shadow-lg h-full flex flex-col hover:shadow-xl hover:border-red-300 transition-all duration-200 cursor-pointer">
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
                        <RecipeCard recipe={featuredRecipes[0]} disableLink={true} />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      size="lg" 
                      className="w-full font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <ChefHat className="h-5 w-5 mr-2" />
                      View All Recipes
                    </Button>
                  </div>
                </div>
              </Link>
            </div>

            {/* Column 2: Latest Workout */}
            <div className="text-center flex flex-col h-full">
              <Link href="/workouts" className="block h-full">
                <div className="bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-lg h-full flex flex-col hover:shadow-xl hover:border-blue-300 transition-all duration-200 cursor-pointer">
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
                        <WorkoutCard workout={featuredWorkouts[0]} disableLink={true} />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      size="lg" 
                      className="w-full font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Dumbbell className="h-5 w-5 mr-2" />
                      View All Workouts
                    </Button>
                  </div>
                </div>
              </Link>
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
      {/* Combined Reviews Section */}
      <section className="relative bg-[hsl(var(--navy))] overflow-hidden">
        {/* Large Background Star */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg 
            className="w-[1200px] h-[1200px] text-white/3 fill-current transition-transform duration-100 ease-out" 
            style={{ transform: `rotate(${starRotation}deg)` }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        
        <div className="relative z-10 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
              <p className="text-xl text-blue-100">Real Google reviews from real transformations</p>
            </div>
            <GoogleReviewsCarousel placeId="ChIJLQqz6P516IkRwqYD22g-_m8" />
          </div>
        </div>
      </section>
      {/* Credentials Band */}
      <CredentialsBand />
      <BookPromotion />
    </div>
  );
}
