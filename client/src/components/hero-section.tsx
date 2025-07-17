import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Dumbbell, ChefHat } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { HeroGradient } from "@/components/hero-gradient";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { BlogPost } from "@shared/schema";

export function HeroSection() {
  const [randomPost, setRandomPost] = useState<BlogPost | null>(null);
  
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  useEffect(() => {
    if (blogPosts && blogPosts.length > 0) {
      const randomIndex = Math.floor(Math.random() * blogPosts.length);
      setRandomPost(blogPosts[randomIndex]);
    }
  }, [blogPosts]);
  return (
    <HeroGradient className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch min-h-[600px]">
          <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-96 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <div className="flex flex-col justify-between pt-16 h-full">
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm text-blue-200 mb-4 tracking-wider uppercase">
                Strength, Nutrition & Accountability Coaching
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-12 font-brand">
                Bridging the gap from inactivity and poor diet to strength and healthy habits
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services" className="w-full sm:w-auto">
                  <Button 
                    className="w-full bg-[hsl(var(--coaching-primary))] hover:bg-[hsl(var(--coaching-primary))]/90 text-white font-semibold px-8 py-4 text-lg"
                  >
                    View Services
                  </Button>
                </Link>
                <Link href="/recipes" className="w-full sm:w-auto">
                  <Button 
                    className="w-full font-semibold text-white hover:opacity-90 border-2 border-transparent px-8 py-4 text-lg"
                    style={{ backgroundColor: '#ef4444' }}
                  >
                    View Recipes
                  </Button>
                </Link>
                <Link href="/workouts" className="w-full sm:w-auto">
                  <Button 
                    className="w-full font-semibold text-black hover:opacity-90 px-8 py-4 text-lg"
                    style={{ backgroundColor: '#B3D7E9' }}
                  >
                    View Workouts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-start pt-16 space-y-6 h-full">
            {randomPost ? (
              <div>
                <p className="text-white/80 text-sm font-medium mb-4 uppercase tracking-wider">From the Blog:</p>
                <Link href={`/blog/${randomPost.slug}`}>
                  <div className="cursor-pointer hover:scale-105 transition-transform duration-300 relative">
                    <div className="w-full h-96 overflow-hidden rounded-2xl shadow-2xl">
                      <img 
                        src={randomPost.imageUrl || '/api/placeholder/600/400'} 
                        alt={randomPost.title}
                        className="w-full h-full object-cover"
                      />
                      {/* 50% black overlay */}
                      <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                      <h3 className="text-white text-xl font-bold leading-tight">
                        {randomPost.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl shadow-2xl w-full h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-white/70">Loading blog post...</p>
                </div>
              </div>
            )}
            
            {/* Facebook Group Section */}
            <div>
              <div 
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 transform"
                onClick={() => window.open('https://www.facebook.com/groups/getupearlier', '_blank')}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors duration-300">
                    <SiFacebook className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">900+ Members Facebook Group</h3>
                    <p className="text-blue-100">Join the community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroGradient>
  );
}
