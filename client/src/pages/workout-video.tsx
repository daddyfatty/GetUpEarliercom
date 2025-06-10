import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Star, Dumbbell, ArrowLeft, Lock, Crown } from "lucide-react";
import { Link } from "wouter";
import type { Workout } from "@shared/schema";

export default function WorkoutVideo() {
  const { id } = useParams();
  
  const { data: workout, isLoading } = useQuery({
    queryKey: ["/api/workouts", id],
    queryFn: () => fetch(`/api/workouts/${id}`).then(res => res.json()),
  });

  // Mock subscription status - this will be replaced with real auth
  const hasSubscription = true; // Set to false to test paywall

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

  // Paywall Component
  const PaywallOverlay = () => (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
      <Card className="max-w-md mx-auto bg-white/95 dark:bg-gray-800/95">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Premium Content
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This workout video is available to premium subscribers only. 
            Unlock access to all workout videos and personalized coaching.
          </p>
          <div className="space-y-2">
            <Link href="/subscribe">
              <Button className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
            <Link href="/workouts">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workouts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href={`/workouts/${workout.id}`}>
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workout Details
            </Button>
          </Link>

          {/* Video Section */}
          {youtubeId && (
            <Card className="mb-8 overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <div className="aspect-video relative">
                {hasSubscription ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={workout.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <img 
                      src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                      alt={workout.title}
                      className="w-full h-full object-cover"
                    />
                    <PaywallOverlay />
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Workout Info */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge className={getCategoryColor(workout.category)}>
                  {workout.category}
                </Badge>
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

          {/* Premium Features Notice */}
          {!hasSubscription && (
            <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Unlock Premium Workout Features
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Get full access to workout videos, personalized coaching, and detailed exercise breakdowns.
                    </p>
                    <Link href="/subscribe">
                      <Button>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Equipment & Exercises (visible to all) */}
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

          {workout.exercises && workout.exercises.length > 0 && (
            <Card className="mb-8 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  Exercise Overview ({workout.exercises.length} exercises)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {workout.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="border-l-4 border-accent pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {index + 1}. {exercise.name}
                        </h4>
                        {exercise.sets && exercise.reps && (
                          <Badge variant="outline">
                            {exercise.sets} sets × {exercise.reps}
                          </Badge>
                        )}
                        {exercise.duration && (
                          <Badge variant="outline">
                            {exercise.duration} seconds
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {exercise.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}