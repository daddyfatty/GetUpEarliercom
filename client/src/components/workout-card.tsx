import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Play, Star } from "lucide-react";
import type { Workout } from "@shared/schema";

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "workout-difficulty-beginner";
      case "intermediate":
        return "workout-difficulty-intermediate";
      case "advanced":
        return "workout-difficulty-advanced";
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
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "running":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "hiking":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const difficultyStars = getDifficultyStars(workout.difficulty);

  // Extract YouTube video ID from video URL
  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = workout.videoUrl ? extractYouTubeId(workout.videoUrl) : null;

  return (
    <Card className="card-hover overflow-hidden">
      {/* YouTube Video Thumbnail */}
      {youtubeId ? (
        <div className="relative group">
          <img 
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            alt={workout.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      ) : workout.imageUrl && (
        <img 
          src={workout.imageUrl} 
          alt={workout.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
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
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1 capitalize">
              {workout.difficulty}
            </span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {workout.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {workout.description}
        </p>
        
        <div className="flex items-center justify-between">
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
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Start Workout
            <Play className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
