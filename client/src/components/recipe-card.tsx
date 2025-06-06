import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Dumbbell, ArrowRight } from "lucide-react";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
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
    <Card className="card-hover overflow-hidden">
      {recipe.imageUrl && (
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(recipe.category)}>
            {recipe.category}
          </Badge>
          <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {recipe.prepTime} min
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <Flame className="w-4 h-4 text-accent mr-1" />
              {recipe.calories} cal
            </span>
            <span className="flex items-center">
              <Dumbbell className="w-4 h-4 text-primary mr-1" />
              {recipe.protein}g protein
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary hover:text-primary/80 font-medium"
          >
            View Recipe
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
