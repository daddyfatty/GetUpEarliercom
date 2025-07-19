import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, Users, ChefHat, Leaf, X, Printer, Download, Heart } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { BookPromotion } from "@/components/book-promotion";
import type { Recipe } from "@shared/schema";

export default function RecipeDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mealPlanDialog, setMealPlanDialog] = useState(false);
  const [volumeMultiplier, setVolumeMultiplier] = useState(1);
  const [customServing, setCustomServing] = useState("");
  const [targetProtein, setTargetProtein] = useState<number | null>(null);
  const [targetCarbs, setTargetCarbs] = useState<number | null>(null);
  const [mealPlanData, setMealPlanData] = useState({
    name: "",
    date: new Date().toISOString().split('T')[0],
    mealType: "breakfast"
  });

  // Scroll to top when recipe loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Function to parse serving size input and calculate multiplier
  const parseServingInput = (input: string, originalServing: string) => {
    if (!input.trim()) return 1;
    
    // Extract number from the beginning of the input
    const match = input.match(/^(\d*\.?\d+)/);
    if (!match) return 1;
    
    const inputValue = parseFloat(match[1]);
    
    // Extract number from original serving size (e.g., "1.5" from "1.5 cups (6 oz)")
    const originalMatch = originalServing.match(/^(\d*\.?\d+)/);
    if (!originalMatch) return inputValue;
    
    const originalValue = parseFloat(originalMatch[1]);
    return inputValue / originalValue;
  };

  // Function to get adjusted nutrition values
  const getAdjustedNutrition = (value: number) => {
    return Math.round(value * volumeMultiplier);
  };

  // Function to calculate multiplier based on target protein
  const getProteinBasedMultiplier = () => {
    if (!targetProtein || !recipe?.protein) return 1;
    return targetProtein / recipe.protein;
  };

  // Function to calculate multiplier based on target carbs
  const getCarbsBasedMultiplier = () => {
    if (!targetCarbs || !recipe?.carbs) return 1;
    return targetCarbs / recipe.carbs;
  };

  // Function to get effective multiplier (macro targets take precedence over volume)
  const getEffectiveMultiplier = () => {
    if (targetProtein) return getProteinBasedMultiplier();
    if (targetCarbs) return getCarbsBasedMultiplier();
    return volumeMultiplier;
  };

  // Function to get adjusted nutrition with effective multiplier
  const getAdjustedNutritionValue = (value: number) => {
    return Math.round(value * getEffectiveMultiplier());
  };

  // Function to get adjusted serving size based on protein target
  const getAdjustedServingSize = () => {
    if (!recipe || !(recipe as any).servingSize) return '';
    
    const multiplier = getEffectiveMultiplier();
    if (multiplier === 1) return (recipe as any).servingSize;
    
    const originalServing = (recipe as any).servingSize;
    const match = originalServing.match(/^(\d*\.?\d+)/);
    if (!match) return `${multiplier.toFixed(1)}x original serving`;
    
    const originalValue = parseFloat(match[1]);
    const newValue = (originalValue * multiplier).toFixed(1);
    const unit = originalServing.replace(match[1], '').trim();
    
    return `${newValue} ${unit}`;
  };

  // Update multiplier when custom serving changes
  const handleServingChange = (value: string) => {
    setCustomServing(value);
    setTargetProtein(null); // Clear protein target when manually adjusting serving
    if (recipe && (recipe as any).servingSize) {
      const multiplier = parseServingInput(value, (recipe as any).servingSize);
      setVolumeMultiplier(multiplier);
    }
  };

  // Handle protein slider change
  const handleProteinChange = (value: number[]) => {
    const newProtein = value[0];
    setTargetProtein(newProtein);
    setTargetCarbs(null); // Clear carbs target when adjusting protein
    setCustomServing(''); // Clear custom serving when using protein adjustment
    
    // Update the serving size display
    const newServingSize = getAdjustedServingSize();
    if (newServingSize !== (recipe as any)?.servingSize) {
      setCustomServing(newServingSize);
    }
  };

  // Handle carbs slider change
  const handleCarbsChange = (value: number[]) => {
    const newCarbs = value[0];
    setTargetCarbs(newCarbs);
    setTargetProtein(null); // Clear protein target when adjusting carbs
    setCustomServing(''); // Clear custom serving when using carbs adjustment
    
    // Update the serving size display
    const newServingSize = getAdjustedServingSize();
    if (newServingSize !== (recipe as any)?.servingSize) {
      setCustomServing(newServingSize);
    }
  };

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
        <div class="badges">${categoryBadges}${recipe.diet_type ? `<span class="badge">${recipe.diet_type}</span>` : ''}</div>
        <div class="recipe-meta">
            <div class="meta-item"><div class="meta-value">${recipe.prepTime || 0}</div><div class="meta-label">Minutes</div></div>
            <div class="meta-item"><div class="meta-value">${recipe.servings || 0}</div><div class="meta-label">Servings</div></div>
            <div class="meta-item"><div class="meta-value">${recipe.calories || 0}</div><div class="meta-label">Calories</div></div>
            <div class="meta-item"><div class="meta-value">${recipe.protein || 0}g</div><div class="meta-label">Protein</div></div>
        </div>
    </div>
    ${recipe.content ? `<div class="story-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 class="story-title">Recipe Story</h3>
        ${(recipe as any).authorName ? `<div style="text-align: right;">
          <p style="margin: 0; font-weight: bold; font-size: 14px;">by ${(recipe as any).authorName}</p>
          <p style="margin: 0; font-size: 12px; color: #666;">Recipe Creator</p>
        </div>` : ''}
      </div>
      <div>${recipe.content.replace(/\n/g, '<br>')}</div>
    </div>` : ''}
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

  // Initialize custom serving with default value when recipe loads
  useEffect(() => {
    if (recipe && (recipe as any).servingSize && !customServing) {
      setCustomServing((recipe as any).servingSize);
    }
  }, [recipe, customServing]);

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

  const getCategoryColor = (category: string | null) => {
    if (!category) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    
    switch (category.toLowerCase()) {
      case "breakfast":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "lunch":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "dinner":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "snack":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "vitamix smoothie bowls":
      case "vitamix-smoothie-bowls":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
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
                {/* Category Tags */}
                {Array.isArray(recipe.category) ? recipe.category.map((cat, index) => (
                  <Link key={`cat-${index}`} href={`/recipes/archive?category=${encodeURIComponent(cat)}`}>
                    <Badge className={`${getCategoryColor(cat)} cursor-pointer transition-colors hover:opacity-80`}>
                      {formatTagName(cat)}
                    </Badge>
                  </Link>
                )) : (
                  <Link href={`/recipes/archive?category=${encodeURIComponent(recipe.category)}`}>
                    <Badge className={`${getCategoryColor(recipe.category)} cursor-pointer transition-colors hover:opacity-80`}>
                      {formatTagName(recipe.category)}
                    </Badge>
                  </Link>
                )}
                {/* Diet Type Tags */}
                {recipe.diet_type && Array.isArray(recipe.diet_type) && recipe.diet_type.map((diet, index) => (
                  <Link key={`diet-${index}`} href={`/recipes/archive?diet=${encodeURIComponent(diet)}`}>
                    <Badge className={`${getDietTypeColor(diet)} cursor-pointer transition-colors hover:opacity-80`}>
                      {formatTagName(diet)}
                    </Badge>
                  </Link>
                ))}
                {/* Legacy dietType support */}
                {(recipe as any).dietType && !recipe.diet_type && (
                  <Link href={`/recipes/archive?diet=${encodeURIComponent((recipe as any).dietType)}`}>
                    <Badge className={`${getDietTypeColor((recipe as any).dietType)} cursor-pointer transition-colors hover:opacity-80`}>
                      {formatTagName((recipe as any).dietType)}
                    </Badge>
                  </Link>
                )}
                {/* Additional Tags */}
                {recipe.tags && recipe.tags.map((tag, index) => (
                  <Link key={`tag-${index}`} href={`/recipes/archive?tag=${encodeURIComponent(tag)}`}>
                    <Badge variant="secondary" className="cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                      {formatTagName(tag)}
                    </Badge>
                  </Link>
                ))}
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <ChefHat className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
                    Recipe Story
                  </h3>
                  
                  {/* Author Attribution */}
                  {(recipe as any).authorId && (recipe as any).authorName && (recipe as any).authorPhoto && (
                    <Link href={`/team/${(recipe as any).authorId}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-200 dark:border-amber-600">
                        <img 
                          src={(recipe as any).authorPhoto} 
                          alt={`${(recipe as any).authorName} - Recipe Author`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {(recipe as any).authorName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Recipe Creator
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {(recipe as any).content}
                </p>
              </div>
            )}

            {/* Recipe Media */}
            {(((recipe as any).gallery && (recipe as any).gallery.length > 0) || (recipe as any).videoUrl) && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recipe Media</h3>
                
                {/* YouTube Video */}
                {(recipe as any).videoUrl && (
                  <div className="mb-6">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={(() => {
                          const url = (recipe as any).videoUrl;
                          // Handle YouTube Shorts
                          if (url.includes('/shorts/')) {
                            const videoId = url.split('/shorts/')[1];
                            return `https://www.youtube.com/embed/${videoId}`;
                          }
                          // Handle regular YouTube URLs
                          if (url.includes('watch?v=')) {
                            return url.replace('watch?v=', 'embed/');
                          }
                          // Handle youtu.be URLs
                          if (url.includes('youtu.be/')) {
                            const videoId = url.split('youtu.be/')[1];
                            return `https://www.youtube.com/embed/${videoId}`;
                          }
                          // Return as-is if already an embed URL
                          return url;
                        })()}
                        title={`${recipe.title} - Video Tutorial`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
                      />
                    </div>
                  </div>
                )}
                
                {/* Photo Gallery */}
                {(recipe as any).gallery && (recipe as any).gallery.length > 0 && (
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
                )}
              </div>
            )}
            
            {/* Fallback single image */}
            {!(((recipe as any).gallery && (recipe as any).gallery.length > 0) || (recipe as any).videoUrl) && recipe.imageUrl && (
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
                  {/* Volume Adjustment */}
                  {(recipe as any).servingSize && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                      <div className="mb-2">
                        <Label htmlFor="customServing" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Adjust Serving Size
                        </Label>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Original: {(recipe as any).servingSize}
                        </div>
                      </div>
                      <Input
                        id="customServing"
                        placeholder="e.g., 2 cups, 3 cups, 12 oz"
                        value={customServing}
                        onChange={(e) => handleServingChange(e.target.value)}
                        className="text-sm"
                      />
                      {getEffectiveMultiplier() !== 1 && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Nutrition values adjusted by {getEffectiveMultiplier().toFixed(1)}x
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-[#ef4444]/10 p-3 rounded-lg mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{getAdjustedNutritionValue(recipe.calories || 0)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Calories</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Macronutrients</h4>
                    <div className="space-y-2">
                      <div className="space-y-3 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Protein</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{targetProtein || getAdjustedNutritionValue(recipe.protein || 0)}g</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>5g</span>
                            <span>50g+</span>
                          </div>
                          <Slider
                            value={[targetProtein || recipe.protein || 5]}
                            onValueChange={handleProteinChange}
                            max={50}
                            min={5}
                            step={1}
                            className="w-full"
                          />
                          {targetProtein && (
                            <div className="text-xs text-[#ef4444] dark:text-red-400">
                              Adjusted serving: {getAdjustedServingSize()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Carbohydrates</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{targetCarbs || getAdjustedNutritionValue(recipe.carbs || 0)}g</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>10g</span>
                            <span>100g+</span>
                          </div>
                          <Slider
                            value={[targetCarbs || recipe.carbs || 10]}
                            onValueChange={handleCarbsChange}
                            max={100}
                            min={10}
                            step={1}
                            className="w-full"
                          />
                          {targetCarbs && (
                            <div className="text-xs text-[#ef4444] dark:text-red-400">
                              Adjusted serving: {getAdjustedServingSize()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Fat</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{getAdjustedNutritionValue(recipe.fat || 0)}g</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Fiber</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{getAdjustedNutritionValue((recipe as any).fiber || 0)}g</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 dark:text-gray-400">Sugar</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{getAdjustedNutritionValue((recipe as any).sugar || 0)}g</span>
                      </div>
                    </div>
                  </div>
                  
                  {(() => {
                    const micronutrients = [
                      { name: 'Vitamin C', value: (recipe as any).vitaminC, unit: 'mg' },
                      { name: 'Vitamin D', value: (recipe as any).vitaminD, unit: 'IU' },
                      { name: 'Calcium', value: (recipe as any).calcium, unit: 'mg' },
                      { name: 'Iron', value: (recipe as any).iron, unit: 'mg' },
                      { name: 'Potassium', value: (recipe as any).potassium, unit: 'mg' },
                      { name: 'Sodium', value: (recipe as any).sodium, unit: 'mg' }
                    ].filter(nutrient => nutrient.value && nutrient.value > 0);

                    return micronutrients.length > 0 ? (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Micronutrients</h4>
                        <div className="space-y-2">
                          {micronutrients.map((nutrient, index) => (
                            <div key={index} className="flex justify-between items-center py-1">
                              <span className="text-gray-600 dark:text-gray-400">{nutrient.name}</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{getAdjustedNutritionValue(nutrient.value)}{nutrient.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
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
      
      {/* Book Promotion Section */}
      <BookPromotion />
    </div>
  );
}