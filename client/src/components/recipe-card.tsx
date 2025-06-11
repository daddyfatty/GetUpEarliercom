import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Dumbbell, ArrowRight, Heart } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication and favorite status
    const checkAuthAndFavorite = async () => {
      try {
        // In development, always authenticated
        setIsAuthenticated(true);
        
        // Check if this recipe is favorited by fetching user favorites
        const favorites = await apiRequest("GET", "/api/users/dev_user_1/favorites");
        const isFav = favorites.some((fav: any) => fav.id === recipe.id);
        setIsFavorited(isFav);
      } catch (error) {
        console.error("Error checking favorite status:", error);
        setIsAuthenticated(true); // Still authenticated in dev mode
        setIsFavorited(false);
      }
    };
    checkAuthAndFavorite();
  }, [recipe.id]);

  // Mutation for adding favorite
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/users/dev_user_1/favorites", { recipeId: recipe.id });
    },
    onSuccess: () => {
      setIsFavorited(true);
      queryClient.invalidateQueries({ queryKey: ["/api/users/dev_user_1/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: "Added to Favorites",
        description: `${recipe.title} added to your favorites.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add to favorites. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mutation for removing favorite
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/users/dev_user_1/favorites/${recipe.id}`);
    },
    onSuccess: () => {
      setIsFavorited(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users/dev_user_1/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: "Removed from Favorites",
        description: `${recipe.title} removed from your favorites.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not remove from favorites. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Sign Up Required",
        description: "Create an account to save your favorite recipes.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = "/api/login"}
          >
            Sign Up
          </Button>
        ),
      });
      return;
    }

    if (isFavorited) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "breakfast":
        return "recipe-category-breakfast";
      case "lunch":
        return "recipe-category-lunch";
      case "dinner":
        return "recipe-category-dinner";
      case "snack":
        return "recipe-category-snack";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="card-hover overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        {recipe.imageUrl && (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
        )}
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-wrap gap-1">
              {Array.isArray(recipe.category) ? recipe.category.map((cat, index) => (
                <Badge key={index} className={getCategoryColor(cat)}>
                  {cat}
                </Badge>
              )) : (
                <Badge className={getCategoryColor(recipe.category)}>
                  {recipe.category}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteClick}
                className="p-1 h-8 w-8 hover:bg-red-50"
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                />
              </Button>
              <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {recipe.prepTime} min
              </span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {recipe.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {recipe.description}
          </p>
          
          {/* Author Attribution */}
          {(recipe as any).authorId && (recipe as any).authorName && (recipe as any).authorPhoto && (
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                  <img 
                    src={(recipe as any).authorPhoto} 
                    alt={`${(recipe as any).authorName} - Recipe Author`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  by {(recipe as any).authorName}
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {/* Macros on one line */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Dumbbell className="w-4 h-4 text-[#ef4444] mr-1" />
                {recipe.protein}g protein
              </span>
              <span className="text-gray-400">•</span>
              <span>{recipe.carbs}g carbs</span>
              <span className="text-gray-400">•</span>
              <span>{recipe.fat}g fat</span>
            </div>
            
            {/* Servings and View Recipe button */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">{recipe.servings} servings</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[#ef4444] hover:text-[#ef4444]/80 font-medium"
              >
                View Recipe
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
