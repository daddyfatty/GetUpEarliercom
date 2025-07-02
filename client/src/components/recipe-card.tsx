import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Dumbbell, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  disableLink?: boolean;
}

export function RecipeCard({ recipe, disableLink = false }: RecipeCardProps) {
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

  const cardContent = (
    <Card className="card-hover overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      {recipe.imageUrl ? (
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <div className="text-sm font-medium">No Image Available</div>
            <div className="text-xs mt-1">Authentic photo needed</div>
          </div>
        </div>
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
            <FavoriteButton 
              type="recipe" 
              id={recipe.id} 
              size="sm"
            />
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
  );

  if (disableLink) {
    return cardContent;
  }

  return (
    <Link href={`/recipes/${recipe.id}`}>
      {cardContent}
    </Link>
  );
}