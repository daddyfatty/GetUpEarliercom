import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, Users, ChefHat, Leaf, X, Printer, Download, Heart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { Recipe } from "@shared/schema";

export default function RecipeDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mealPlanDialog, setMealPlanDialog] = useState(false);
  const [mealPlanData, setMealPlanData] = useState({
    name: "",
    date: new Date().toISOString().split('T')[0],
    mealType: "breakfast"
  });

  const generatePDF = () => {
    if (!recipe) return;
    
    // Create formatted content for printing
    const ingredientsList = (recipe.ingredients || '').toString()
      .split('\n')
      .filter(item => item.trim())
      .map(item => `<li>${item.trim()}</li>`)
      .join('');
      
    const instructionsList = (recipe.instructions || '').toString()
      .split('\n')
      .filter(item => item.trim())
      .map(item => `<li>${item.trim()}</li>`)
      .join('');

    const categoryBadges = Array.isArray(recipe.category) 
      ? recipe.category.map(cat => `<span class="badge">${cat}</span>`).join('') 
      : recipe.category ? `<span class="badge">${recipe.category}</span>` : '';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${recipe.title} - Get Up Earlier</title>
    <style>
        @page { margin: 0.75in; size: letter; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: white; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #ef4444; padding-bottom: 20px; }
        .brand { color: #ef4444; font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .recipe-title { font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #1a1a1a; }
        .recipe-meta { display: flex; justify-content: center; gap: 30px; margin: 20px 0; flex-wrap: wrap; }
        .meta-item { text-align: center; padding: 8px 16px; border: 1px solid #e5e5e5; border-radius: 8px; }
        .meta-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .meta-value { font-size: 18px; font-weight: bold; color: #ef4444; }
        .badges { text-align: center; margin: 20px 0; }
        .badge { display: inline-block; background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; margin: 0 5px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 20px; font-weight: bold; color: #ef4444; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; }
        .ingredients-list { columns: 2; column-gap: 30px; list-style: none; }
        .ingredients-list li { margin-bottom: 8px; padding-left: 20px; position: relative; break-inside: avoid; }
        .ingredients-list li:before { content: "•"; color: #ef4444; font-weight: bold; position: absolute; left: 0; }
        .instructions-list { list-style: none; counter-reset: step-counter; }
        .instructions-list li { margin-bottom: 15px; padding-left: 40px; position: relative; counter-increment: step-counter; }
        .instructions-list li:before { content: counter(step-counter); position: absolute; left: 0; top: 0; background: #ef4444; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; }
        .story-section { background: #fef7e0; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .story-title { color: #92400e; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .nutrition-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
        .nutrition-item { text-align: center; padding: 10px; border: 1px solid #e5e5e5; border-radius: 8px; }
        .nutrition-value { font-size: 16px; font-weight: bold; color: #ef4444; }
        .nutrition-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e5e5; padding-top: 20px; }
        @media print { body { -webkit-print-color-adjust: exact; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">Get Up Earlier</div>
        <h1 class="recipe-title">${recipe.title}</h1>
        <div class="badges">${categoryBadges}${recipe.dietType ? `<span class="badge">${recipe.dietType}</span>` : ''}</div>
        <div class="recipe-meta">
            <div class="meta-item"><div class="meta-value">${recipe.prepTime || 0}</div><div class="meta-label">Minutes</div></div>
            <div class="meta-item"><div class="meta-value">${recipe.servings || 0}</div><div class="meta-label">Servings</div></div>
            <div class="meta-item"><div class="meta-value">${recipe.calories || 0}</div><div class="meta-label">Calories</div></div>
            <div class="meta-item"><div class="meta-value">${recipe.protein || 0}g</div><div class="meta-label">Protein</div></div>
        </div>
    </div>
    ${recipe.content ? `<div class="story-section"><h3 class="story-title">Recipe Story</h3><div>${recipe.content.replace(/\n/g, '<br>')}</div></div>` : ''}
    <div class="section"><h2 class="section-title">Ingredients</h2><ul class="ingredients-list">${ingredientsList}</ul></div>
    <div class="section"><h2 class="section-title">Instructions</h2><ol class="instructions-list">${instructionsList}</ol></div>
    <div class="section"><h2 class="section-title">Nutrition Information</h2><div class="nutrition-grid">
        <div class="nutrition-item"><div class="nutrition-value">${recipe.carbs || 0}g</div><div class="nutrition-label">Carbs</div></div>
        <div class="nutrition-item"><div class="nutrition-value">${recipe.fat || 0}g</div><div class="nutrition-label">Fat</div></div>
        <div class="nutrition-item"><div class="nutrition-value">${recipe.fiber || 0}g</div><div class="nutrition-label">Fiber</div></div>
        <div class="nutrition-item"><div class="nutrition-value">${recipe.sodium || 0}mg</div><div class="nutrition-label">Sodium</div></div>
    </div></div>
    <div class="footer"><p>Recipe from Get Up Earlier | Healthy Living Made Simple</p><p>Generated on ${new Date().toLocaleDateString()}</p></div>
</body>
</html>`;

    printWindow.document.write(printHTML);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };
  
  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ["/api/recipes", id],
    queryFn: async () => {
      const response = await fetch(`/api/recipes/${id}`);
      if (!response.ok) throw new Error("Recipe not found");
      return response.json();
    },
    enabled: !!id,
  });

  // Check if recipe is favorited
  const { data: favoriteStatus, isLoading: favoriteLoading } = useQuery<{ isFavorited: boolean }>({
    queryKey: [`/api/users/${user?.id}/favorites/${id}/check`],
    enabled: !!id && !!user?.id,
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (favoriteStatus?.isFavorited) {
        await apiRequest("DELETE", `/api/users/${user?.id}/favorites/${id}`);
      } else {
        await apiRequest("POST", `/api/users/${user?.id}/favorites`, { recipeId: parseInt(id!) });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/favorites/${id}/check`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/favorites`] });
      toast({
        title: favoriteStatus?.isFavorited ? "Removed from Favorites" : "Added to Favorites",
        description: favoriteStatus?.isFavorited 
          ? "Recipe removed from your favorites." 
          : "Recipe added to your favorites.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create meal plan mutation
  const createMealPlanMutation = useMutation({
    mutationFn: async () => {
      // First create the meal plan
      const mealPlan = await apiRequest("POST", `/api/users/${user?.id}/meal-plans`, {
        name: mealPlanData.name,
        date: new Date(mealPlanData.date)
      });
      
      // Then add the recipe to the meal plan
      await apiRequest("POST", `/api/meal-plans/${mealPlan.id}/recipes`, {
        recipeId: parseInt(id!),
        mealType: mealPlanData.mealType
      });
      
      return mealPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/meal-plans`] });
      setMealPlanDialog(false);
      setMealPlanData({
        name: "",
        date: new Date().toISOString().split('T')[0],
        mealType: "breakfast"
      });
      toast({
        title: "Added to Meal Plan",
        description: "Recipe has been added to your meal plan successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add recipe to meal plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4444] mx-auto mb-4"></div>
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
            <Button className="bg-[#ef4444] hover:bg-[#ef4444]/90">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4444] mx-auto mb-4"></div>
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
          <div className="flex items-center justify-between">
            <Link href="/recipes">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Recipes
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavoriteMutation.mutate()}
                disabled={toggleFavoriteMutation.isPending || favoriteLoading}
                className="flex items-center gap-2"
              >
                <Heart 
                  className={`w-5 h-5 ${favoriteStatus?.isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                />
                {favoriteStatus?.isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generatePDF}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipe Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(recipe.category) ? recipe.category.map((cat, index) => (
                  <Link key={index} href={`/recipes?category=${encodeURIComponent(cat)}`}>
                    <Badge className="bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 cursor-pointer transition-colors">
                      {getCategoryEmoji(cat)} {cat}
                    </Badge>
                  </Link>
                )) : (
                  <Link href={`/recipes?category=${encodeURIComponent(recipe.category)}`}>
                    <Badge className="bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 cursor-pointer transition-colors">
                      {getCategoryEmoji(recipe.category)} {recipe.category}
                    </Badge>
                  </Link>
                )}
                {recipe.dietType && Array.isArray(recipe.dietType) ? recipe.dietType.map((diet, index) => (
                  <Link key={index} href={`/recipes?dietType=${encodeURIComponent(diet)}`}>
                    <Badge variant="outline" className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                      {getDietIcon(diet)} {diet}
                    </Badge>
                  </Link>
                )) : recipe.dietType && (
                  <Link href={`/recipes?dietType=${encodeURIComponent(recipe.dietType)}`}>
                    <Badge variant="outline" className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                      {getDietIcon(recipe.dietType)} {recipe.dietType}
                    </Badge>
                  </Link>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {recipe.title || 'Recipe'}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {recipe.description || 'No description available'}
              </p>
            </div>

            {/* Recipe Story/Content */}
            {(recipe as any).content && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ChefHat className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
                  Recipe Story
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {(recipe as any).content}
                </p>
              </div>
            )}

            {/* Recipe Gallery */}
            {((recipe as any).gallery && (recipe as any).gallery.length > 0) ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recipe Photos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {((recipe as any).gallery as string[]).map((imageUrl: string, index: number) => (
                    <div key={index} className="relative">
                      <img 
                        src={imageUrl} 
                        alt={`${recipe.title} - Photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedImage(imageUrl)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : recipe.imageUrl && (
              <div className="relative">
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.title}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedImage(recipe.imageUrl)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none"></div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-[#ef4444] mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">{recipe.prepTime || 0} min</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Prep Time</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-[#ef4444] mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {(recipe as any).servingSize || `${recipe.servings} servings`}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Serving Size</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <ChefHat className="w-6 h-6 text-[#ef4444] mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">{recipe.calories || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Calories per serving</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Leaf className="w-6 h-6 text-[#ef4444] mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 dark:text-white">{recipe.protein || 0}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
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
                      <div className="flex-shrink-0 w-8 h-8 bg-[#ef4444] text-white rounded-full flex items-center justify-center font-semibold text-sm">
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
                      <div className="w-2 h-2 bg-[#ef4444] rounded-full mt-2 flex-shrink-0"></div>
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
                  <div className="bg-[#ef4444]/10 p-3 rounded-lg mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{recipe.calories || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Calories</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Macronutrients</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Protein</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{recipe.protein || 0}g</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Carbohydrates</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{recipe.carbs || 0}g</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Fat</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{recipe.fat || 0}g</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Fiber</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{(recipe as any).fiber || 0}g</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Sugar</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{(recipe as any).sugar || 0}g</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Micronutrients</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Vitamin C</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{(recipe as any).vitaminC || 0}mg</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Vitamin D</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{(recipe as any).vitaminD || 0}IU</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Calcium</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{(recipe as any).calcium || 0}mg</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Iron</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{(recipe as any).iron || 0}mg</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Potassium</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{(recipe as any).potassium || 0}mg</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Sodium</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{(recipe as any).sodium || 0}mg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Dialog open={mealPlanDialog} onOpenChange={setMealPlanDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#ef4444] hover:bg-[#ef4444]/90 text-white py-3 text-lg font-semibold">
                    Add to Meal Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add to Meal Plan</DialogTitle>
                    <DialogDescription>
                      Create a new meal plan and add this recipe to it.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mealPlanName">Meal Plan Name</Label>
                      <Input
                        id="mealPlanName"
                        placeholder="e.g., Weekly Meal Plan"
                        value={mealPlanData.name}
                        onChange={(e) => setMealPlanData({ ...mealPlanData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mealPlanDate">Date</Label>
                      <Input
                        id="mealPlanDate"
                        type="date"
                        value={mealPlanData.date}
                        onChange={(e) => setMealPlanData({ ...mealPlanData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mealType">Meal Type</Label>
                      <Select
                        value={mealPlanData.mealType}
                        onValueChange={(value) => setMealPlanData({ ...mealPlanData, mealType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setMealPlanDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => createMealPlanMutation.mutate()}
                        disabled={createMealPlanMutation.isPending || !mealPlanData.name}
                        className="flex-1 bg-[#ef4444] hover:bg-[#ef4444]/90"
                      >
                        {createMealPlanMutation.isPending ? "Adding..." : "Add to Plan"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                className="w-full py-3 text-lg"
                onClick={() => toggleFavoriteMutation.mutate()}
                disabled={toggleFavoriteMutation.isPending || favoriteLoading}
              >
                {favoriteStatus?.isFavorited ? 'Remove from Favorites' : 'Save Recipe'}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 py-2"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 py-2"
                  onClick={() => generatePDF()}
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
          <DialogTitle className="sr-only">Recipe Image Lightbox</DialogTitle>
          <DialogDescription className="sr-only">Full size view of recipe image</DialogDescription>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size recipe image"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}