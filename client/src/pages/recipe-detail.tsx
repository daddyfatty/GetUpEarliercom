import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Users, ChefHat, Leaf } from "lucide-react";
import type { Recipe } from "@shared/schema";

export default function RecipeDetail() {
  const { id } = useParams();
  
  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ["/api/recipes", id],
    queryFn: async () => {
      const response = await fetch(`/api/recipes/${id}`);
      if (!response.ok) throw new Error("Recipe not found");
      return response.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61c493] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || (!isLoading && !recipe)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recipe not found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The recipe you're looking for doesn't exist.</p>
          <Link href="/recipes">
            <Button className="bg-[#61c493] hover:bg-[#61c493]/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state if still loading or recipe data is incomplete
  if (isLoading || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61c493] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading recipe...</p>
        </div>
      </div>
    );
  }

  const getDietIcon = (dietType: string | null) => {
    switch (dietType) {
      case 'vegetarian': return '🥬';
      case 'vegan': return '🌱';
      case 'keto': return '🥑';
      case 'paleo': return '🍖';
      case 'carnivore': return '🥩';
      case 'high-carb-low-fat': return '🍝';
      case 'high-protein': return '💪';
      default: return null;
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🥜';
      default: return '🍽️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/recipes">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipe Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-[#61c493]/10 text-[#61c493] hover:bg-[#61c493]/20">
                  {getCategoryEmoji(recipe.category)} {recipe.category}
                </Badge>
                {recipe.dietType && (
                  <Badge variant="outline">
                    {getDietIcon(recipe.dietType)} {recipe.dietType}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {recipe.title || 'Recipe'}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {recipe.description || 'No description available'}
              </p>
            </div>

            {/* Recipe Image */}
            {recipe.imageUrl && (
              <div className="relative">
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.title}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-[#61c493] mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">{recipe.prepTime || 0} min</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Prep Time</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-[#61c493] mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">{recipe.servings || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Servings</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <ChefHat className="w-6 h-6 text-[#61c493] mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">{recipe.protein || 0}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Leaf className="w-6 h-6 text-[#61c493] mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">{recipe.carbs || 0}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(recipe.instructions || []).map((instruction, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#61c493] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                        {instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(recipe.ingredients || []).map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#61c493] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Nutrition Facts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Nutrition per Serving</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Protein</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{recipe.protein || 0}g</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Carbohydrates</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{recipe.carbs || 0}g</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">Fat</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{recipe.fat || 0}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-[#61c493] hover:bg-[#61c493]/90 text-white py-3 text-lg font-semibold">
                Add to Meal Plan
              </Button>
              <Button variant="outline" className="w-full py-3 text-lg">
                Save Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}