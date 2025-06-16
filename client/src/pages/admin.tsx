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
  TrendingUp,
  Monitor
} from "lucide-react";
import type { Recipe, Workout } from "@shared/schema";

export default function Admin() {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
    fiber: "",
    sugar: "",
    sodium: "",
    vitaminC: "",
    vitaminD: "",
    calcium: "",
    iron: "",
    potassium: "",
    ingredients: "",
    instructions: "",
    content: "",
    imageUrl: "",
    gallery: "",
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

  // Fetch data - all hooks must be called before conditional returns
  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

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

  const deleteWorkoutMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/workouts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Workout deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete workout", variant: "destructive" });
    },
  });

  // Helper functions
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
      content: "",
      imageUrl: "",
      gallery: "",
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
      title: recipeForm.title,
      description: recipeForm.description,
      category: recipeForm.category,
      prepTime: parseInt(recipeForm.prepTime),
      servings: parseInt(recipeForm.servings),
      calories: parseInt(recipeForm.calories),
      protein: parseInt(recipeForm.protein),
      carbs: parseInt(recipeForm.carbs),
      fat: parseInt(recipeForm.fat),
      ingredients: recipeForm.ingredients.split('\n').filter(i => i.trim()),
      instructions: recipeForm.instructions.split('\n').filter(i => i.trim()),
      dietType: recipeForm.dietType || null,
      imageUrl: recipeForm.imageUrl || null,
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
      imageUrl: workoutForm.imageUrl || null,
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

  const analytics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalRecipes: recipes.length,
    totalWorkouts: workouts.length,
    newUsersThisWeek: 34,
    engagementRate: 78
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Management Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Content Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="recipes" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recipes">Recipes</TabsTrigger>
                    <TabsTrigger value="workouts">Workouts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recipes" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Recipe Management</h3>
                      <Dialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => {
                            setEditingRecipe(null);
                            resetRecipeForm();
                          }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Recipe
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {editingRecipe ? "Edit Recipe" : "Create New Recipe"}
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
                                  <SelectItem value="smoothie">Smoothie</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <Label>Description *</Label>
                              <Textarea
                                value={recipeForm.description}
                                onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })}
                                placeholder="Recipe description"
                                className="resize-none"
                                rows={3}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Recipe Story</Label>
                              <Textarea
                                value={recipeForm.content}
                                onChange={(e) => setRecipeForm({ ...recipeForm, content: e.target.value })}
                                placeholder="Share your authentic recipe story - cooking tips, ingredient preferences, personal touches..."
                                className="resize-none"
                                rows={4}
                              />
                            </div>
                            <div>
                              <Label>Diet Type</Label>
                              <Select value={recipeForm.dietType} onValueChange={(value) => setRecipeForm({ ...recipeForm, dietType: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select diet type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="vegan">Vegan</SelectItem>
                                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                  <SelectItem value="keto">Keto</SelectItem>
                                  <SelectItem value="paleo">Paleo</SelectItem>
                                  <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                                  <SelectItem value="dairy-free">Dairy-Free</SelectItem>
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
                                placeholder="15"
                              />
                            </div>
                            <div>
                              <Label>Image URL</Label>
                              <Input
                                value={recipeForm.imageUrl}
                                onChange={(e) => setRecipeForm({ ...recipeForm, imageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Ingredients (one per line) *</Label>
                              <Textarea
                                value={recipeForm.ingredients}
                                onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })}
                                placeholder="2 cups quinoa&#10;1 avocado&#10;2 tbsp olive oil"
                                className="resize-none"
                                rows={4}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Instructions (one per line) *</Label>
                              <Textarea
                                value={recipeForm.instructions}
                                onChange={(e) => setRecipeForm({ ...recipeForm, instructions: e.target.value })}
                                placeholder="Cook quinoa according to package instructions&#10;Slice avocado&#10;Mix ingredients and serve"
                                className="resize-none"
                                rows={4}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsRecipeDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleRecipeSubmit}>
                              {editingRecipe ? "Update" : "Create"} Recipe
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="space-y-2">
                      {recipes.map((recipe) => (
                        <div key={recipe.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="font-medium">{recipe.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {recipe.category} • {recipe.calories} calories
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEditRecipe(recipe)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteRecipeMutation.mutate(recipe.id)}
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
                      <h3 className="text-lg font-semibold">Workout Management</h3>
                      <Dialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={resetWorkoutForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Workout
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create New Workout</DialogTitle>
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
                                  <SelectItem value="cardio">Cardio</SelectItem>
                                  <SelectItem value="strength">Strength</SelectItem>
                                  <SelectItem value="flexibility">Flexibility</SelectItem>
                                  <SelectItem value="hiit">HIIT</SelectItem>
                                  <SelectItem value="yoga">Yoga</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <Label>Description *</Label>
                              <Textarea
                                value={workoutForm.description}
                                onChange={(e) => setWorkoutForm({ ...workoutForm, description: e.target.value })}
                                placeholder="Workout description"
                                className="resize-none"
                                rows={3}
                              />
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
                              <Label>Equipment (comma-separated)</Label>
                              <Input
                                value={workoutForm.equipment}
                                onChange={(e) => setWorkoutForm({ ...workoutForm, equipment: e.target.value })}
                                placeholder="dumbbells, mat"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Exercises (one per line) *</Label>
                              <Textarea
                                value={workoutForm.exercises}
                                onChange={(e) => setWorkoutForm({ ...workoutForm, exercises: e.target.value })}
                                placeholder="Push-ups&#10;Squats&#10;Plank"
                                className="resize-none"
                                rows={4}
                              />
                            </div>
                            <div>
                              <Label>Image URL</Label>
                              <Input
                                value={workoutForm.imageUrl}
                                onChange={(e) => setWorkoutForm({ ...workoutForm, imageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsWorkoutDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleWorkoutSubmit}>
                              Create Workout
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="space-y-2">
                      {workouts.map((workout) => (
                        <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="font-medium">{workout.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {workout.category} • {workout.duration} min • {workout.caloriesBurned} cal
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteWorkoutMutation.mutate(workout.id)}
                            >
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

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === "recipe" && <Utensils className="w-4 h-4 text-secondary" />}
                        {activity.type === "workout" && <Dumbbell className="w-4 h-4 text-primary" />}
                        {activity.type === "user" && <Users className="w-4 h-4 text-accent" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {activity.item}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}