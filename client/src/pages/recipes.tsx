import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Plus, Utensils, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BookPromotion } from "@/components/book-promotion";
import type { Recipe } from "@shared/schema";
import { SEO } from "@/components/seo";

export default function Recipes() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dietFilter, setDietFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Handle URL parameters for filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const categoryParam = urlParams.get('category');
    const dietParam = urlParams.get('dietType');
    
    if (categoryParam) {
      setCategoryFilter(categoryParam);
    }
    if (dietParam) {
      setDietFilter(dietParam);
    }
  }, [location]);
  
  const [recipeForm, setRecipeForm] = useState({
    title: "",
    description: "",
    category: "",
    dietType: "",
    prepTime: "",
    servings: "",
    ingredients: "",
    instructions: "",
    imageUrl: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Clear all recipe cache on mount to ensure fresh data
  useEffect(() => {
    queryClient.clear();
    queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
  }, [queryClient]);

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes", searchQuery, categoryFilter, dietFilter],
    staleTime: 0,
    gcTime: 0,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (dietFilter !== "all") params.append("dietType", dietFilter);
      
      const response = await fetch(`/api/recipes?${params.toString()}?t=${Date.now()}`);
      if (!response.ok) throw new Error("Failed to fetch recipes");
      const data = await response.json();
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Fresh Recipe Collection
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            The Clean & Lean<br className="hidden sm:block" />
            <span className="text-red-600">Eating Guide</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Interactive recipes and tips to focus on protein, eat real food and hit your target macros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Updates</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">15-30 Min Prep</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search healthy recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg border-gray-300 dark:border-gray-600 focus:border-[#61c493] focus:ring-[#61c493]"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-12 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                    <SelectItem value="lunch">☀️ Lunch</SelectItem>
                    <SelectItem value="dinner">🌙 Dinner</SelectItem>
                    <SelectItem value="snack">🥜 Snacks</SelectItem>
                    <SelectItem value="dessert">🍰 Dessert</SelectItem>
                    <SelectItem value="Vitamix Smoothie Bowls">🥤 Vitamix Smoothie Bowls</SelectItem>
                    <SelectItem value="finicky-kid-friendly">👶 Finicky Kid Friendly</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dietFilter} onValueChange={setDietFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-12 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="All Diets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Diets</SelectItem>
                    <SelectItem value="vegetarian">🥬 Vegetarian</SelectItem>
                    <SelectItem value="vegan">🌱 Vegan</SelectItem>
                    <SelectItem value="keto">🥑 Keto</SelectItem>
                    <SelectItem value="paleo">🍖 Paleo</SelectItem>
                    <SelectItem value="carnivore">🥩 Carnivore</SelectItem>
                    <SelectItem value="high-carb-low-fat">🍝 High Carb Low Fat</SelectItem>
                    <SelectItem value="high-protein">💪 High Protein</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchQuery || categoryFilter !== "all" || dietFilter !== "all") && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                {searchQuery && (
                  <span className="bg-[#61c493]/10 text-[#61c493] px-3 py-1 rounded-full text-sm font-medium">
                    "{searchQuery}"
                  </span>
                )}
                {categoryFilter !== "all" && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {categoryFilter}
                  </span>
                )}
                {dietFilter !== "all" && (
                  <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {dietFilter}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setDietFilter("all");
                  }}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Recipe Grid */}
        <div>
          {recipes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-[#61c493]/20 to-[#61c493]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-16 h-16 text-[#61c493]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No recipes found</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filters to discover delicious, healthy recipes.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setDietFilter("all");
                }}
                className="bg-[#61c493] hover:bg-[#61c493]/90 text-white px-8 py-3 text-lg font-semibold"
              >
                Show All Recipes
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              
              {/* Results Summary */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="w-2 h-2 bg-[#61c493] rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Book Promotion Section */}
      <BookPromotion />
    </div>
  );
}