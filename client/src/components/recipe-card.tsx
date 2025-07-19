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
  const formatTagName = (tag: string) => {
    // Convert kebab-case to Title Case and handle special cases
    const specialCases: Record<string, string> = {
      'high-carb-endurance': 'High Carb Endurance',
      'high-protein': 'High Protein',
      'vitamix-smoothie-bowls': 'Vitamix Smoothie Bowls'
    };
    
    if (specialCases[tag]) {
      return specialCases[tag];
    }
    
    return tag
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    
    switch (category.toLowerCase()) {
      case "breakfast":
        return "recipe-category-breakfast";
      case "lunch":
        return "recipe-category-lunch";
      case "dinner":
        return "recipe-category-dinner";
      case "snack":
        return "recipe-category-snack";
      case "vitamix smoothie bowls":
      case "vitamix-smoothie-bowls":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getDietTypeColor = (dietType: string | null) => {
    if (!dietType) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    
    switch (dietType.toLowerCase()) {
      case "vegetarian":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "vegan":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "keto":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "paleo":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "carnivore":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high-carb-endurance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "high-protein":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
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
          className="w-full h-72 object-cover"
        />
      ) : (
        <div className="w-full h-72 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <div className="text-sm font-medium">No Image Available</div>
            <div className="text-xs mt-1">Authentic photo needed</div>
          </div>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-wrap gap-1">
            {/* Category Tags */}
            {Array.isArray(recipe.category) ? recipe.category.map((cat, index) => (
              <Badge key={`cat-${index}`} className={getCategoryColor(cat)}>
                {formatTagName(cat)}
              </Badge>
            )) : (
              <Badge className={getCategoryColor(recipe.category)}>
                {formatTagName(recipe.category)}
              </Badge>
            )}
            {/* Diet Type Tags */}
            {recipe.diet_type && Array.isArray(recipe.diet_type) && recipe.diet_type.map((diet, index) => (
              <Badge key={`diet-${index}`} className={getDietTypeColor(diet)}>
                {formatTagName(diet)}
              </Badge>
            ))}
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