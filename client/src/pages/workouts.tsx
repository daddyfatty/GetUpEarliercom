import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Calendar, ArrowRight, User } from "lucide-react";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";
import { SEO } from "@/components/seo";

export default function Workouts() {
  const { data: allPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });
  
  // Filter blog posts by "workouts & challenges" tag and sort by date (latest first)
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

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    return match ? match[1] : null;
  };

  // Helper function to create clean category URLs
  const createCategoryUrl = (category: string) => {
    if (category.toLowerCase() === 'workouts & challenges') {
      return '/category/workouts-challenges';
    }
    return `/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Workout Videos & Training Programs"
        description="Master effective 15-45 minute workout sessions with professional guidance. From strength training and calisthenics to yoga flows and guided runs, find the perfect routine for your fitness level and schedule."
        keywords="workout videos, strength training, calisthenics, yoga, running, fitness programs, exercise routines"
        url="/workouts"
      />
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Workout & Challenge Collection
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Workouts &<br className="hidden sm:block" />
              <span className="text-blue-600">Challenges</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Strength, Calisthenics, Yoga, Guided Runs, Challenges and Tutorials to Keep You Moving
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Workouts Weekly</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">15-45 Min Sessions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {workoutPosts.map((post: BlogPost) => {
              const youtubeId = post.videoUrl ? extractYouTubeId(post.videoUrl) : null;
              
              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 flex flex-col h-full cursor-pointer">
                    {/* YouTube Video Thumbnail or Featured Image */}
                    {(youtubeId || post.imageUrl) && (
                      <div className="relative overflow-hidden">
                        <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img 
                            src={post.imageUrl || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '')}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              if (youtubeId) {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                              }
                            }}
                          />
                          {youtubeId && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="bg-white/90 rounded-full p-3">
                                <Play className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {post.category}
                        </Badge>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                  
                    <CardContent className="pt-0">
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Display all categories as clickable tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories && post.categories.length > 0 ? (
                          post.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = createCategoryUrl(category);
                              }}
                            >
                              {category}
                            </Badge>
                          ))
                        ) : (
                          post.category && (
                            post.category.split(',').map((category) => (
                              <Badge key={category.trim()} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.location.href = createCategoryUrl(category.trim());
                                }}
                              >
                                {category.trim()}
                              </Badge>
                            ))
                          )
                        )}
                      </div>

                      <div className="flex justify-end mt-auto">
                        <Button size="sm" className="gap-1">
                          Read More
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {workoutPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No workout posts found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No workout and challenge posts available at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
    </>
  );
}