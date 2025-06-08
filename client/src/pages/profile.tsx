import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Heart, Plus, Trash2, Clock, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Recipe, MealPlan } from "@shared/schema";

// Mock user ID for demo - in real app this would come from auth
const CURRENT_USER_ID = 1;

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMealPlanOpen, setNewMealPlanOpen] = useState(false);
  const [mealPlanName, setMealPlanName] = useState("");
  const [mealPlanDate, setMealPlanDate] = useState("");

  // Fetch user's favorite recipes
  const { data: favoriteRecipes = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID, "favorites"],
    queryFn: () => apiRequest("GET", `/api/users/${CURRENT_USER_ID}/favorites`),
  });

  // Fetch user's meal plans
  const { data: mealPlans = [], isLoading: mealPlansLoading } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID, "meal-plans"],
    queryFn: () => apiRequest("GET", `/api/users/${CURRENT_USER_ID}/meal-plans`),
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (recipeId: number) => {
      await apiRequest("DELETE", `/api/users/${CURRENT_USER_ID}/favorites/${recipeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", CURRENT_USER_ID, "favorites"] });
      toast({
        title: "Favorite Removed",
        description: "Recipe removed from your favorites.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove favorite. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create meal plan mutation
  const createMealPlanMutation = useMutation({
    mutationFn: async (data: { name: string; date: string }) => {
      return await apiRequest("POST", `/api/users/${CURRENT_USER_ID}/meal-plans`, {
        name: data.name,
        date: data.date,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", CURRENT_USER_ID, "meal-plans"] });
      setNewMealPlanOpen(false);
      setMealPlanName("");
      setMealPlanDate("");
      toast({
        title: "Meal Plan Created",
        description: "Your new meal plan has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create meal plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete meal plan mutation
  const deleteMealPlanMutation = useMutation({
    mutationFn: async (mealPlanId: number) => {
      await apiRequest("DELETE", `/api/meal-plans/${mealPlanId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", CURRENT_USER_ID, "meal-plans"] });
      toast({
        title: "Meal Plan Deleted",
        description: "Meal plan deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete meal plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateMealPlan = () => {
    if (!mealPlanName.trim() || !mealPlanDate) {
      toast({
        title: "Missing Information",
        description: "Please provide both a name and date for your meal plan.",
        variant: "destructive",
      });
      return;
    }

    createMealPlanMutation.mutate({
      name: mealPlanName.trim(),
      date: mealPlanDate,
    });
  };

  if (favoritesLoading || mealPlansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your favorite recipes and meal plans</p>
        </div>

        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="favorites">Favorite Recipes</TabsTrigger>
            <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Favorite Recipes ({favoriteRecipes.length})
              </h2>
            </div>

            {favoriteRecipes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Start adding recipes to your favorites to see them here.
                  </p>
                  <Link href="/recipes">
                    <Button>Browse Recipes</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRecipes.map((recipe: Recipe) => (
                  <Card key={recipe.id} className="overflow-hidden">
                    <div className="aspect-video relative bg-gray-200">
                      {recipe.imageUrl && (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {recipe.category?.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {recipe.prepTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {recipe.servings} servings
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/recipes/${recipe.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View Recipe
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavoriteMutation.mutate(recipe.id)}
                          disabled={removeFavoriteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="meal-plans" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Meal Plans ({mealPlans.length})
              </h2>
              <Dialog open={newMealPlanOpen} onOpenChange={setNewMealPlanOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Meal Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Meal Plan</DialogTitle>
                    <DialogDescription>
                      Plan your meals for a specific day or week.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Meal Plan Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Weekly Meal Plan"
                        value={mealPlanName}
                        onChange={(e) => setMealPlanName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={mealPlanDate}
                        onChange={(e) => setMealPlanDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleCreateMealPlan}
                      disabled={createMealPlanMutation.isPending}
                    >
                      {createMealPlanMutation.isPending ? "Creating..." : "Create Meal Plan"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {mealPlans.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No meal plans yet</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Create your first meal plan to organize your weekly meals.
                  </p>
                  <Button onClick={() => setNewMealPlanOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Meal Plan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mealPlans.map((mealPlan: MealPlan) => (
                  <Card key={mealPlan.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{mealPlan.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMealPlanMutation.mutate(mealPlan.id)}
                          disabled={deleteMealPlanMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        {new Date(mealPlan.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Created {new Date(mealPlan.createdAt!).toLocaleDateString()}
                      </p>
                      <Button variant="outline" className="w-full">
                        View Meal Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}