import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Utensils, 
  Dumbbell, 
  BarChart3, 
  Bell,
  Shield,
  Users,
  TrendingUp
} from "lucide-react";
import type { Recipe, Workout } from "@shared/schema";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  
  const [recipeForm, setRecipeForm] = useState({
    title: "",
    description: "",
    category: "",
    dietType: "",
    prepTime: "",
    servings: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    ingredients: "",
    instructions: "",
    imageUrl: "",
  });

  const [workoutForm, setWorkoutForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    duration: "",
    caloriesBurned: "",
    equipment: "",
    exercises: "",
    imageUrl: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You need administrator privileges to access this page.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fetch data
  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  // Recipe mutations
  const createRecipeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/recipes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      setIsRecipeDialogOpen(false);
      resetRecipeForm();
      toast({ title: "Recipe created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create recipe", variant: "destructive" });
    },
  });

  const updateRecipeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PUT", `/api/recipes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      setIsRecipeDialogOpen(false);
      resetRecipeForm();
      setEditingRecipe(null);
      toast({ title: "Recipe updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update recipe", variant: "destructive" });
    },
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/recipes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      toast({ title: "Recipe deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete recipe", variant: "destructive" });
    },
  });

  // Workout mutations
  const createWorkoutMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/workouts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      setIsWorkoutDialogOpen(false);
      resetWorkoutForm();
      toast({ title: "Workout created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create workout", variant: "destructive" });
    },
  });

  const resetRecipeForm = () => {
    setRecipeForm({
      title: "",
      description: "",
      category: "",
      dietType: "",
      prepTime: "",
      servings: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      ingredients: "",
      instructions: "",
      imageUrl: "",
    });
  };

  const resetWorkoutForm = () => {
    setWorkoutForm({
      title: "",
      description: "",
      category: "",
      difficulty: "",
      duration: "",
      caloriesBurned: "",
      equipment: "",
      exercises: "",
      imageUrl: "",
    });
  };

  const handleRecipeSubmit = () => {
    const data = {
      ...recipeForm,
      prepTime: parseInt(recipeForm.prepTime),
      servings: parseInt(recipeForm.servings),
      calories: parseInt(recipeForm.calories),
      protein: parseInt(recipeForm.protein),
      carbs: parseInt(recipeForm.carbs),
      fat: parseInt(recipeForm.fat),
      ingredients: recipeForm.ingredients.split('\n').filter(i => i.trim()),
      instructions: recipeForm.instructions.split('\n').filter(i => i.trim()),
      dietType: recipeForm.dietType || null,
    };

    if (editingRecipe) {
      updateRecipeMutation.mutate({ id: editingRecipe.id, data });
    } else {
      createRecipeMutation.mutate(data);
    }
  };

  const handleWorkoutSubmit = () => {
    const data = {
      ...workoutForm,
      duration: parseInt(workoutForm.duration),
      caloriesBurned: parseInt(workoutForm.caloriesBurned),
      equipment: workoutForm.equipment ? workoutForm.equipment.split(',').map(e => e.trim()) : [],
      exercises: workoutForm.exercises.split('\n').filter(e => e.trim()).map(exercise => ({
        name: exercise,
        description: exercise,
      })),
    };

    createWorkoutMutation.mutate(data);
  };

  const openEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setRecipeForm({
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      dietType: recipe.dietType || "",
      prepTime: recipe.prepTime.toString(),
      servings: recipe.servings.toString(),
      calories: recipe.calories.toString(),
      protein: recipe.protein.toString(),
      carbs: recipe.carbs.toString(),
      fat: recipe.fat.toString(),
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions.join('\n'),
      imageUrl: recipe.imageUrl || "",
    });
    setIsRecipeDialogOpen(true);
  };

  // Mock analytics data
  const analytics = {
    totalUsers: 1247,
    activeUsers: 856,
    totalRecipes: recipes.length,
    totalWorkouts: workouts.length,
    newUsersThisWeek: 73,
    engagementRate: 85,
  };

  const recentActivity = [
    { id: 1, action: "New recipe added", item: "Quinoa Power Bowl", time: "2 hours ago", type: "recipe" },
    { id: 2, action: "Workout updated", item: "HIIT Cardio Blast", time: "1 day ago", type: "workout" },
    { id: 3, action: "New user registration", item: "25 new users", time: "3 days ago", type: "user" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user?.username}! Manage your content and monitor platform performance.
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
              <p className="text-xs text-green-600 mt-2">+{analytics.newUsersThisWeek} this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.activeUsers}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <p className="text-xs text-green-600 mt-2">{analytics.engagementRate}% engagement</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Recipes</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalRecipes}</p>
                </div>
                <Utensils className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Workouts</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalWorkouts}</p>
                </div>
                <Dumbbell className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="recipes" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recipes">Recipes</TabsTrigger>
                    <TabsTrigger value="workouts">Workouts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recipes" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Manage Recipes</h3>
                      <Dialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => { setEditingRecipe(null); resetRecipeForm(); }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Recipe
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {editingRecipe ? "Edit Recipe" : "Add New Recipe"}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Title *</Label>
                              <Input
                                value={recipeForm.title}
                                onChange={(e) => setRecipeForm({ ...recipeForm, title: e.target.value })}
                                placeholder="Recipe title"
                              />
                            </div>
                            <div>
                              <Label>Category *</Label>
                              <Select value={recipeForm.category} onValueChange={(value) => setRecipeForm({ ...recipeForm, category: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="breakfast">Breakfast</SelectItem>
                                  <SelectItem value="lunch">Lunch</SelectItem>
                                  <SelectItem value="dinner">Dinner</SelectItem>
                                  <SelectItem value="snack">Snack</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Diet Type</Label>
                              <Select value={recipeForm.dietType} onValueChange={(value) => setRecipeForm({ ...recipeForm, dietType: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select diet type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                  <SelectItem value="vegan">Vegan</SelectItem>
                                  <SelectItem value="keto">Keto</SelectItem>
                                  <SelectItem value="paleo">Paleo</SelectItem>
                                  <SelectItem value="carnivore">Carnivore</SelectItem>
                                  <SelectItem value="high-carb-low-fat">High Carb Low Fat</SelectItem>
                                  <SelectItem value="high-protein">High Protein</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Prep Time (minutes) *</Label>
                              <Input
                                type="number"
                                value={recipeForm.prepTime}
                                onChange={(e) => setRecipeForm({ ...recipeForm, prepTime: e.target.value })}
                                placeholder="30"
                              />
                            </div>
                            <div>
                              <Label>Servings *</Label>
                              <Input
                                type="number"
                                value={recipeForm.servings}
                                onChange={(e) => setRecipeForm({ ...recipeForm, servings: e.target.value })}
                                placeholder="2"
                              />
                            </div>
                            <div>
                              <Label>Calories *</Label>
                              <Input
                                type="number"
                                value={recipeForm.calories}
                                onChange={(e) => setRecipeForm({ ...recipeForm, calories: e.target.value })}
                                placeholder="420"
                              />
                            </div>
                            <div>
                              <Label>Protein (g) *</Label>
                              <Input
                                type="number"
                                value={recipeForm.protein}
                                onChange={(e) => setRecipeForm({ ...recipeForm, protein: e.target.value })}
                                placeholder="18"
                              />
                            </div>
                            <div>
                              <Label>Carbs (g) *</Label>
                              <Input
                                type="number"
                                value={recipeForm.carbs}
                                onChange={(e) => setRecipeForm({ ...recipeForm, carbs: e.target.value })}
                                placeholder="52"
                              />
                            </div>
                            <div>
                              <Label>Fat (g) *</Label>
                              <Input
                                type="number"
                                value={recipeForm.fat}
                                onChange={(e) => setRecipeForm({ ...recipeForm, fat: e.target.value })}
                                placeholder="16"
                              />
                            </div>
                            <div>
                              <Label>Image URL</Label>
                              <Input
                                value={recipeForm.imageUrl}
                                onChange={(e) => setRecipeForm({ ...recipeForm, imageUrl: e.target.value })}
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Description *</Label>
                            <Textarea
                              value={recipeForm.description}
                              onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })}
                              placeholder="Recipe description"
                            />
                          </div>
                          <div>
                            <Label>Ingredients (one per line) *</Label>
                            <Textarea
                              value={recipeForm.ingredients}
                              onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })}
                              placeholder="1 cup quinoa&#10;2 cups vegetables&#10;1 avocado"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label>Instructions (one per line) *</Label>
                            <Textarea
                              value={recipeForm.instructions}
                              onChange={(e) => setRecipeForm({ ...recipeForm, instructions: e.target.value })}
                              placeholder="Cook quinoa according to package directions&#10;Roast vegetables at 400°F for 20 minutes&#10;Assemble bowl with quinoa, vegetables, and avocado"
                              rows={4}
                            />
                          </div>
                          <Button 
                            onClick={handleRecipeSubmit}
                            disabled={createRecipeMutation.isPending || updateRecipeMutation.isPending}
                            className="w-full"
                          >
                            {editingRecipe ? "Update Recipe" : "Create Recipe"}
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-2">
                      {recipes.map((recipe) => (
                        <div key={recipe.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{recipe.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{recipe.category}</Badge>
                              <span className="text-sm text-gray-500">{recipe.calories} cal</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditRecipe(recipe)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this recipe?")) {
                                  deleteRecipeMutation.mutate(recipe.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="workouts" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Manage Workouts</h3>
                      <Dialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={resetWorkoutForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Workout
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add New Workout</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Title *</Label>
                              <Input
                                value={workoutForm.title}
                                onChange={(e) => setWorkoutForm({ ...workoutForm, title: e.target.value })}
                                placeholder="Workout title"
                              />
                            </div>
                            <div>
                              <Label>Category *</Label>
                              <Select value={workoutForm.category} onValueChange={(value) => setWorkoutForm({ ...workoutForm, category: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="strength">Strength</SelectItem>
                                  <SelectItem value="cardio">Cardio</SelectItem>
                                  <SelectItem value="hiit">HIIT</SelectItem>
                                  <SelectItem value="flexibility">Flexibility</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Difficulty *</Label>
                              <Select value={workoutForm.difficulty} onValueChange={(value) => setWorkoutForm({ ...workoutForm, difficulty: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="beginner">Beginner</SelectItem>
                                  <SelectItem value="intermediate">Intermediate</SelectItem>
                                  <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Duration (minutes) *</Label>
                              <Input
                                type="number"
                                value={workoutForm.duration}
                                onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                                placeholder="30"
                              />
                            </div>
                            <div>
                              <Label>Calories Burned *</Label>
                              <Input
                                type="number"
                                value={workoutForm.caloriesBurned}
                                onChange={(e) => setWorkoutForm({ ...workoutForm, caloriesBurned: e.target.value })}
                                placeholder="250"
                              />
                            </div>
                            <div>
                              <Label>Image URL</Label>
                              <Input
                                value={workoutForm.imageUrl}
                                onChange={(e) => setWorkoutForm({ ...workoutForm, imageUrl: e.target.value })}
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Description *</Label>
                            <Textarea
                              value={workoutForm.description}
                              onChange={(e) => setWorkoutForm({ ...workoutForm, description: e.target.value })}
                              placeholder="Workout description"
                            />
                          </div>
                          <div>
                            <Label>Equipment (comma separated)</Label>
                            <Input
                              value={workoutForm.equipment}
                              onChange={(e) => setWorkoutForm({ ...workoutForm, equipment: e.target.value })}
                              placeholder="dumbbells, mat, resistance bands"
                            />
                          </div>
                          <div>
                            <Label>Exercises (one per line) *</Label>
                            <Textarea
                              value={workoutForm.exercises}
                              onChange={(e) => setWorkoutForm({ ...workoutForm, exercises: e.target.value })}
                              placeholder="Push-ups&#10;Squats&#10;Plank"
                              rows={4}
                            />
                          </div>
                          <Button 
                            onClick={handleWorkoutSubmit}
                            disabled={createWorkoutMutation.isPending}
                            className="w-full"
                          >
                            Create Workout
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-2">
                      {workouts.map((workout) => (
                        <div key={workout.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{workout.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{workout.category}</Badge>
                              <Badge variant="outline">{workout.difficulty}</Badge>
                              <span className="text-sm text-gray-500">{workout.duration} min</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Analytics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "recipe" ? "bg-primary/20" :
                        activity.type === "workout" ? "bg-accent/20" : "bg-secondary/20"
                      }`}>
                        {activity.type === "recipe" ? (
                          <Utensils className={`w-4 h-4 ${activity.type === "recipe" ? "text-primary" : ""}`} />
                        ) : activity.type === "workout" ? (
                          <Dumbbell className="w-4 h-4 text-accent" />
                        ) : (
                          <Users className="w-4 h-4 text-secondary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.item}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Weekly Signups</span>
                    <span className="text-sm font-medium text-green-600">+73</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Recipe Views</span>
                    <span className="text-sm font-medium">12.4k</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Workout Completions</span>
                    <span className="text-sm font-medium">3.2k</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Engagement Rate</span>
                    <span className="text-sm font-medium text-primary">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
