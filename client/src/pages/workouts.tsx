import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Play, Star, Dumbbell, Eye } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { PageSubscriptionCTA } from "@/components/page-subscription-cta";
import { Link } from "wouter";
import type { Workout } from "@shared/schema";

export default function Workouts() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ["/api/workouts", selectedCategory],
    queryFn: () => {
      const params = selectedCategory ? `?category=${selectedCategory}` : "";
      return fetch(`/api/workouts${params}`).then(res => res.json());
    }
  });



  const categories = ["strength", "cardio", "hiit", "flexibility", "yoga", "calisthenics", "tutorial"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    const stars = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };
    return stars[difficulty as keyof typeof stars] || 1;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "strength":
        return "bg-primary/10 text-primary";
      case "cardio":
        return "bg-accent/10 text-accent";
      case "hiit":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "flexibility":
        return "bg-secondary/10 text-secondary";
      case "yoga":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "calisthenics":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "tutorial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    return match ? match[1] : null;
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
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Workout Collection
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Powerful Short<br className="hidden sm:block" />
              <span className="text-blue-600">Sessions</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Strength, Calisthenics, Yoga, Guided Runs, and Tutorials to Keep You Moving
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

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="capitalize"
            >
              All Workouts
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Workouts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {workouts.map((workout: Workout) => {
              const difficultyStars = getDifficultyStars(workout.difficulty);
              const youtubeId = workout.videoUrl ? extractYouTubeId(workout.videoUrl) : null;
              
              return (
                <div key={workout.id} className="group">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 cursor-pointer h-full">
                    {/* YouTube Video Thumbnail */}
                    {youtubeId && (
                      <Link href={`/workouts/${workout.id}`}>
                        <div className="relative group/video">
                          <img 
                            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                            alt={workout.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover/video:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                            <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-3 group-hover/video:scale-110 transition-transform duration-300">
                              <Play className="w-8 h-8 text-primary" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getCategoryColor(workout.category)}>
                          {workout.category}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <FavoriteButton type="workout" id={workout.id} size="sm" />
                          <Badge variant="outline" className={getDifficultyColor(workout.difficulty)}>
                            {workout.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        <Link href={`/workouts/${workout.id}`} className="hover:text-accent transition-colors">
                          {workout.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                  
                    <CardContent className="pt-0">
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {workout.description}
                      </p>
                    
                      {/* Author Attribution */}
                      {(workout as any).authorId && (workout as any).authorName && (workout as any).authorPhoto && (
                        <div className="flex items-center mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-600">
                              <img 
                                src={(workout as any).authorPhoto} 
                                alt={`${(workout as any).authorName} - Workout Creator`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              by {(workout as any).authorName}
                            </span>
                          </div>
                        </div>
                      )}
                    
                      {/* Workout Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 text-accent mr-1" />
                            {workout.duration} min
                          </span>
                          <span className="flex items-center">
                            <Flame className="w-4 h-4 text-accent mr-1" />
                            {workout.caloriesBurned} cal
                          </span>
                        </div>
                      </div>

                      {/* Equipment Tags */}
                      {workout.equipment && workout.equipment.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {workout.equipment.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Dumbbell className="w-3 h-3 mr-1" />
                              {item}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Exercise List Preview */}
                      {workout.exercises && workout.exercises.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Exercises ({workout.exercises.length})
                          </h4>
                          <div className="space-y-1">
                            {workout.exercises.slice(0, 3).map((exercise, index) => (
                              <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                • {exercise.name} {exercise.sets && exercise.reps && `(${exercise.sets} sets × ${exercise.reps})`}
                              </div>
                            ))}
                            {workout.exercises.length > 3 && (
                              <div className="text-sm text-gray-500 dark:text-gray-500">
                                +{workout.exercises.length - 3} more exercises
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link href={`/workouts/${workout.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        {youtubeId && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank')}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Watch Video
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {workouts.length === 0 && (
            <div className="text-center py-12">
              <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No workouts found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedCategory 
                  ? `No workouts available in the ${selectedCategory} category.`
                  : "No workouts available at the moment."
                }
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Subscription CTA */}
      <PageSubscriptionCTA />
    </div>
  );
}