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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
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
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Workout & Challenge Collection
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Workouts &<br className="hidden sm:block" />
                <span className="text-blue-600">Challenges</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Strength, Calisthenics, Yoga, Guided Runs, Challenges and Tutorials to Keep You Moving
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">New Workouts Weekly</span>
                  </div>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">15-45 Min Sessions</span>
                  </div>
                </div>
                <div className="bg-green-100 px-6 py-3 rounded-xl shadow-sm border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">{workoutPosts.length} workouts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workoutPosts.map((post) => {
              const youtubeId = post.videoUrl ? extractYouTubeId(post.videoUrl) : null;
              const postLink = post.slug ? `/blog/${post.slug}` : `/blog/${post.id}`;
              
              return (
                <Link key={post.id} href={postLink} className="block">
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200 flex flex-col h-full cursor-pointer">
                    {/* Featured Image or YouTube Thumbnail */}
                    {(youtubeId || post.imageUrl) && (
                      <div className="relative overflow-hidden rounded-t-lg">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
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
                          {post.videoUrl && (
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Play className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <CardContent className="p-6 flex-1 flex flex-col">
                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories && post.categories.length > 0 ? (
                          post.categories.map((category, index) => (
                            <Link key={`${category}-${index}`} href={`/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer"
                              >
                                {category}
                              </Badge>
                            </Link>
                          ))
                        ) : (
                          post.category && (
                            post.category.split(',').map((category, index) => (
                              <Link key={`${category.trim()}-${index}`} href={`/category/${category.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer">
                                  {category.trim()}
                                </Badge>
                              </Link>
                            ))
                          )
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <span>{formatDate(post.publishedDate)}</span>
                      </div>

                      {/* Read More Button */}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No workout posts found
              </h3>
              <p className="text-gray-600">
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