import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  type: "recipe" | "workout";
  id: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({ type, id, className, size = "md" }: FavoriteButtonProps) {
  const { isRecipeFavorited, isWorkoutFavorited, toggleRecipeFavorite, toggleWorkoutFavorite, isLoading } = useFavorites();
  
  const isFavorited = type === "recipe" ? isRecipeFavorited(id) : isWorkoutFavorited(id);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === "recipe") {
      toggleRecipeFavorite(id);
    } else {
      toggleWorkoutFavorite(id);
    }
  };

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "flex items-center justify-center p-2 rounded-full transition-all duration-200 hover:bg-white/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      aria-label={isFavorited ? `Remove from favorites` : `Add to favorites`}
    >
      <Heart 
        className={cn(
          sizeClasses[size],
          "transition-all duration-200",
          isFavorited 
            ? "fill-red-500 text-red-500" 
            : "text-gray-400 hover:text-red-500"
        )}
      />
    </button>
  );
}