import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Clock, Users, ChefHat } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import type { Recipe } from "@shared/schema";

export default function RecipeArchive() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get filter parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFilter = urlParams.get('category') || '';
  const tagFilter = urlParams.get('tag') || '';
  const dietFilter = urlParams.get('diet') || '';

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  // Filter recipes based on URL parameters and search
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = !searchQuery || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !categoryFilter || recipe.category.includes(categoryFilter);
    const matchesTag = !tagFilter || (recipe.tags && recipe.tags.includes(tagFilter));
    const matchesDiet = !dietFilter || recipe.dietType.includes(dietFilter);
    
    return matchesSearch && matchesCategory && matchesTag && matchesDiet;
  });

  // Get all unique categories, tags, and diet types for filter options
  const allCategories = Array.from(new Set(recipes.flatMap(r => r.category)));
  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags || [])));
  const allDietTypes = Array.from(new Set(recipes.flatMap(r => r.dietType)));

  const getFilterTitle = () => {
    if (tagFilter) return `${tagFilter} Recipes`;
    if (categoryFilter) return `${categoryFilter} Recipes`;
    if (dietFilter) return `${dietFilter} Recipes`;
    return "All Recipes";
  };

  const getFilterDescription = () => {
    const count = filteredRecipes.length;
    if (tagFilter) return `${count} recipes tagged with "${tagFilter}"`;
    if (categoryFilter) return `${count} recipes in the "${categoryFilter}" category`;
    if (dietFilter) return `${count} ${dietFilter} recipes`;
    return `Browse all ${count} recipes in our collection`;
  };

  const clearFilters = () => {
    setLocation('/recipes/archive');
    setSearchQuery("");
  };

  const applyFilter = (type: string, value: string) => {
    const params = new URLSearchParams();
    if (type === 'category') params.set('category', value);
    if (type === 'tag') params.set('tag', value);
    if (type === 'diet') params.set('diet', value);
    setLocation(`/recipes/archive?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/recipes')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getFilterTitle()}</h1>
              <p className="text-gray-600 mt-2">{getFilterDescription()}</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Active Filters */}
            {(categoryFilter || tagFilter || dietFilter) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Active filters:</span>
                {categoryFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <ChefHat className="h-3 w-3" />
                    {categoryFilter}
                  </Badge>
                )}
                {tagFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {tagFilter}
                  </Badge>
                )}
                {dietFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {dietFilter}
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories */}
              {allCategories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <ChefHat className="h-4 w-4 mr-2" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {allCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => applyFilter('category', category)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          categoryFilter === category
                            ? 'bg-[hsl(var(--orange))] text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {allTags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={tagFilter === tag ? "default" : "secondary"}
                          className={`cursor-pointer transition-colors ${
                            tagFilter === tag
                              ? 'bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90'
                              : 'hover:bg-gray-200'
                          }`}
                          onClick={() => applyFilter('tag', tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Diet Types */}
              {allDietTypes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Diet Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {allDietTypes.map(diet => (
                      <button
                        key={diet}
                        onClick={() => applyFilter('diet', diet)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          dietFilter === diet
                            ? 'bg-[hsl(var(--orange))] text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="lg:col-span-3">
            {filteredRecipes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters to find more recipes.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}