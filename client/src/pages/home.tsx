import { HeroSection } from "@/components/hero-section";
import { BookPromotion } from "@/components/book-promotion";
import { RecipeCard } from "@/components/recipe-card";

import { CredentialsBand } from "@/components/credentials-band";
import { ClientReviews } from "@/components/client-reviews";
import { GoogleReviews } from "@/components/google-reviews";
import GoogleReviewsCarousel from "@/components/google-reviews-carousel";
import { PrivateBoutiqueSection } from "@/components/private-boutique-section";
import { NavigationButtonsSection } from "@/components/navigation-buttons-section";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, TrendingUp, Users, Star, ChefHat, Dumbbell, ArrowRight, Calendar, Target, MapPin, BookOpen, ExternalLink } from "lucide-react";
import type { Recipe, BlogPost } from "@shared/schema";
import gymImagePath from "@assets/download - 2025-06-20T164725.183_1750452478509.png";
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";

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

function ServicesCard() {
  const services = [
    {
      title: "1-on-1 Personal Strength Training",
      url: "/personal-strength-training",
      external: false
    },
    {
      title: "Virtual Nutrition Coaching",
      url: "/virtual-nutrition-coaching", 
      external: false
    },
    {
      title: "Accountability Coaching",
      url: "/accountability-coaching",
      external: false
    },
    {
      title: "Certified Running Coaching",
      url: "/certified-running-coaching",
      external: false
    },
    {
      title: "Private Yoga",
      url: "https://EricaLeeBaker.com",
      external: true
    },
    {
      title: "Small Group Yoga",
      url: "https://EricaLeeBaker.com",
      external: true
    }
  ];

  return (
    <div className="bg-[hsl(var(--navy))] rounded-2xl shadow-lg h-full flex flex-col p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Users className="w-5 h-5 text-purple-300" />
          </div>
          <span className="text-purple-300 text-sm font-medium uppercase tracking-wider">Coaching Services</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Transform Your Health</h2>
        <p className="text-blue-100 text-sm">Personalized coaching tailored to your goals</p>
      </div>
      
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.url}
              target={service.external ? "_blank" : undefined}
              className="group"
            >
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 cursor-pointer border border-white/10 hover:border-purple-400/30">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                    {service.title}
                  </span>
                  {service.external && (
                    <ExternalLink className="w-4 h-4 text-purple-300 opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <Link href="/services">
          <Button 
            size="lg" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Users className="h-5 w-5 mr-2" />
            View All Services
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        
        {/* Facebook Button */}
        <a 
          href="https://www.facebook.com/profile.php?id=61552522390973" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <Button 
            size="lg" 
            variant="outline"
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Follow on Facebook
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  useSEO('homepage');

  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: allPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
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
  
  // Filter blog posts by "workouts & challenges" tag and get latest
  const workoutPosts = allPosts
    .filter(post => {
      // Check primary category
      if (post.category && post.category.toLowerCase() === 'workouts & challenges') {
        return true;
      }
      // Check categories array
      if (post.categories && post.categories.some(cat => cat.toLowerCase() === 'workouts & challenges')) {
        return true;
      }
      // Check tags field if it exists
      const tags = post.tags ? post.tags.toLowerCase() : '';
      return tags.includes('workouts & challenges') || tags.includes('workouts-challenges');
    })
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  return (
    <div className="w-full">
      <HeroSection />
      
      {/* Private Boutique Section */}
      <PrivateBoutiqueSection />
      
      {/* Navigation Buttons Section */}
      <NavigationButtonsSection />
      
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
            </div>
            <GoogleReviewsCarousel placeId="ChIJLQqz6P516IkRwqYD22g-_m8" />
          </div>
        </div>
      </section>
      
      {/* Credentials Band */}
      <CredentialsBand />
      
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
              <Link href={workoutPosts.length > 0 ? `/blog/${workoutPosts[0].slug}` : "/category/workouts-challenges"} className="block h-full">
                <div className="bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-lg h-full flex flex-col hover:shadow-xl hover:border-blue-300 transition-all duration-200 cursor-pointer">
                  <div className="mb-4">
                    <div className="inline-block bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      Latest Workout
                    </div>
                    <h2 className="text-2xl font-bold text-blue-600 mb-2">Latest Workout</h2>
                    <p className="text-gray-600 mb-2 text-[14px]">Health, fitness, and nutrition insights</p>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full inline-block text-sm font-medium">
                      <BookOpen className="inline w-4 h-4 mr-1" />
                      New posts added regularly!
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    {workoutPosts.length > 0 ? (
                      <div className="mb-4">
                        {workoutPosts[0].imageUrl && (
                          <img 
                            src={workoutPosts[0].imageUrl}
                            alt={workoutPosts[0].title}
                            className="w-full h-72 object-cover rounded-lg mb-4"
                          />
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {workoutPosts[0].title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {workoutPosts[0].excerpt}
                        </p>
                        
                        {/* Author Attribution */}
                        <div className="flex items-center mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                              <img 
                                src="/attached_assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg" 
                                alt="Michael Baker - Author"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              by Michael Baker
                            </span>
                          </div>
                        </div>
                        
                        {/* Workout Details */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Dumbbell className="w-4 h-4 text-blue-600 mr-1" />
                              {workoutPosts[0].categories?.includes('Push-up') ? 'Body Weight' : 'Mixed Equipment'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{workoutPosts[0].readTime || 5} min read</span>
                            <span className="text-gray-400">•</span>
                            <span>Upper Body</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">1 workout</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-blue-600 hover:text-blue-600/80 font-medium"
                            >
                              View Workout
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 text-center text-gray-500">
                        <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>Loading latest workout...</p>
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
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Workouts & Challenges</div>
            </div>
          </div>
        </div>
      </section>
      <BookPromotion />
    </div>
  );
}
