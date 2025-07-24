import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Star, Dumbbell, Play, ArrowLeft, CheckCircle, X } from "lucide-react";
import { Link } from "wouter";
import { FavoriteButton } from "@/components/FavoriteButton";
import { BlogContentRenderer } from "@/components/blog-content-renderer";
import type { Workout } from "@shared/schema";

export default function WorkoutDetail() {
  const { id } = useParams();
  const [showVideo, setShowVideo] = useState(false);
  
  const { data: workout, isLoading } = useQuery({
    queryKey: ["/api/workouts", id],
    queryFn: () => fetch(`/api/workouts/${id}`).then(res => res.json()),
  });

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
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Workout not found
            </h1>
            <Link href="/workouts">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workouts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const difficultyStars = getDifficultyStars(workout.difficulty);
  const youtubeId = workout.videoUrl ? extractYouTubeId(workout.videoUrl) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/workouts">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workouts
            </Button>
          </Link>

          {/* Video Section */}
          {youtubeId && (
            <Card className="mb-8 overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <div className="aspect-video relative">
                {!showVideo ? (
                  <>
                    <img 
                      src={workout.imageUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                      alt={workout.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Button 
                        size="lg" 
                        className="bg-white/90 text-gray-900 hover:bg-white"
                        onClick={() => setShowVideo(true)}
                      >
                        <Play className="w-6 h-6 mr-3" />
                        Watch Video
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                      title={workout.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                      onClick={() => setShowVideo(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Workout Header */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge className={getCategoryColor(workout.category)}>
                  {workout.category}
                </Badge>
                <div className="flex items-center space-x-2">
                  <FavoriteButton type="workout" id={workout.id} size="sm" />
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < difficultyStars ? "text-accent fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <Badge variant="outline" className={getDifficultyColor(workout.difficulty)}>
                      {workout.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-3xl text-gray-900 dark:text-white mb-4">
                {workout.title}
              </CardTitle>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {workout.description}
              </p>

              {/* Author Attribution */}
              {(workout as any).authorId && (workout as any).authorName && (workout as any).authorPhoto && (
                <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <Link href={`/team/${(workout as any).authorId}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-600">
                        <img 
                          src={(workout as any).authorPhoto} 
                          alt={`${(workout as any).authorName} - Workout Creator`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Created by {(workout as any).authorName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Certified Personal Trainer
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}

              {/* Workout Stats */}
              <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <Clock className="w-5 h-5 text-accent mr-2" />
                  <span className="font-semibold">{workout.duration}</span> minutes
                </span>
                <span className="flex items-center">
                  <Flame className="w-5 h-5 text-accent mr-2" />
                  <span className="font-semibold">{workout.caloriesBurned}</span> calories
                </span>
                {workout.equipment && workout.equipment.length > 0 && (
                  <span className="flex items-center">
                    <Dumbbell className="w-5 h-5 text-accent mr-2" />
                    Equipment needed
                  </span>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Equipment Section */}
          {workout.equipment && workout.equipment.length > 0 && (
            <Card className="mb-8 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                  <Dumbbell className="w-5 h-5 mr-2" />
                  Equipment Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {workout.equipment.map((item: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}



          {/* Quick Exercise Reference (if available) */}
          {workout.exercises && workout.exercises.length > 0 && (
            <Card className="mb-8 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  Quick Exercise Reference ({workout.exercises.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workout.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {index + 1}. {exercise.name}
                        </h4>
                        {exercise.sets && exercise.reps && (
                          <Badge variant="outline" className="text-xs">
                            {exercise.sets} × {exercise.reps}
                          </Badge>
                        )}
                      </div>
                      {exercise.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {youtubeId && (
                  <Button 
                    size="lg"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch on YouTube
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}