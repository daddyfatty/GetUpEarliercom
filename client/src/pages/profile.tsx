import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Save, Calculator, Heart, Dumbbell, ChefHat, TrendingUp, Clock } from "lucide-react";
import { Link } from "wouter";
import { FavoriteButton } from "@/components/FavoriteButton";

interface ProfileData {
  age?: number;
  sex?: string;
  height?: number;
  currentWeight?: number;
  desiredWeight?: number;
  activityLevel?: string;
  goal?: string;
  unitSystem?: string;
  macroProfile?: string;
  targetCalories?: number;
}

interface CalculatorResult {
  id: number;
  calculatorType: string;
  results: string;
  userInputs: string;
  createdAt: string;
}

interface Recipe {
  id: number;
  title: string;
  cookTime: string;
  category: string;
  imageUrl?: string;
}

interface Workout {
  id: number;
  title: string;
  duration: string;
  category: string;
  difficulty: string;
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = useQuery<ProfileData>({
    queryKey: ['/api/user/profile'],
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  // Form state for profile data
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    height: '',
    currentWeight: '',
    desiredWeight: '',
    activityLevel: '',
    goal: '',
    unitSystem: 'imperial',
    macroProfile: 'balanced'
  });

  // Fetch calculator results
  const { data: calculatorResults = [] as CalculatorResult[] } = useQuery({
    queryKey: ['/api/calculator-results'],
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  // Fetch favorite recipe IDs
  const { data: favoriteRecipeIds = [] } = useQuery({
    queryKey: ['/api/users/dev_user_1/favorites'],
    enabled: isAuthenticated,
    staleTime: 0
  });

  // Fetch all recipes to get complete data for favorites
  const { data: allRecipes = [] } = useQuery({
    queryKey: ['/api/recipes'],
    enabled: isAuthenticated,
    staleTime: 0
  });

  // Fetch favorite workout IDs
  const { data: favoriteWorkoutIds = [] } = useQuery({
    queryKey: ['/api/users/dev_user_1/favorite-workouts'],
    enabled: isAuthenticated,
    staleTime: 0
  });

  // Fetch all workouts to get complete data for favorites
  const { data: allWorkouts = [] } = useQuery({
    queryKey: ['/api/workouts'],
    enabled: isAuthenticated,
    staleTime: 0
  });

  // Process favorite recipes with complete data
  const favoriteRecipes = favoriteRecipeIds
    .map((fav: any) => allRecipes.find((recipe: any) => recipe.id === fav.recipeId))
    .filter(Boolean);

  // Process favorite workouts with complete data
  const favoriteWorkouts = favoriteWorkoutIds
    .map((fav: any) => allWorkouts.find((workout: any) => workout.id === fav.workoutId))
    .filter(Boolean);

  useEffect(() => {
    if (profileData && !profileLoading) {
      setFormData({
        age: profileData.age?.toString() || '',
        sex: profileData.sex || '',
        height: profileData.height?.toString() || '',
        currentWeight: profileData.currentWeight?.toString() || '',
        desiredWeight: profileData.desiredWeight?.toString() || '',
        activityLevel: profileData.activityLevel || '',
        goal: profileData.goal || '',
        unitSystem: profileData.unitSystem || 'imperial',
        macroProfile: profileData.macroProfile || 'balanced'
      });
    }
  }, [profileData, profileLoading]);

  // Save profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/user/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Debounced auto-save functionality
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSave = useCallback((data: typeof formData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveProfileMutation.mutate(data);
    }, 1500);
  }, [saveProfileMutation]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    debouncedSave(updatedData);
  };

  const handleSave = () => {
    saveProfileMutation.mutate(formData);
  };

  const hasProfileData = profileData && (profileData.age || profileData.sex || profileData.height || profileData.currentWeight);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get recent results for display
  const recentResults = Array.isArray(calculatorResults) ? calculatorResults.slice(0, 5) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your personal information and view your activity history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      {hasProfileData ? "Your health and fitness profile" : "Complete your profile to get personalized recommendations"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={saveProfileMutation.isPending}
                  >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="25"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {profileData?.age || "Not specified"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    {isEditing ? (
                      <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {profileData?.sex ? profileData.sex.charAt(0).toUpperCase() + profileData.sex.slice(1) : "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Physical Measurements */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="height">Height ({formData.unitSystem === 'metric' ? 'cm' : 'inches'})</Label>
                    {isEditing ? (
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder={formData.unitSystem === 'metric' ? "175" : "69"}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {profileData?.height ? `${profileData.height} ${formData.unitSystem === 'metric' ? 'cm' : 'inches'}` : "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentWeight">Current Weight ({formData.unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
                    {isEditing ? (
                      <Input
                        id="currentWeight"
                        type="number"
                        step="0.1"
                        value={formData.currentWeight}
                        onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                        placeholder={formData.unitSystem === 'metric' ? "70.0" : "154.3"}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {profileData?.currentWeight ? `${Math.round(profileData.currentWeight * 10) / 10} ${formData.unitSystem === 'metric' ? 'kg' : 'lbs'}` : "Not specified"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="desiredWeight">Desired Weight ({formData.unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
                    {isEditing ? (
                      <Input
                        id="desiredWeight"
                        type="number"
                        step="0.1"
                        value={formData.desiredWeight}
                        onChange={(e) => handleInputChange('desiredWeight', e.target.value)}
                        placeholder={formData.unitSystem === 'metric' ? "65.0" : "143.3"}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {profileData?.desiredWeight ? `${Math.round(profileData.desiredWeight * 10) / 10} ${formData.unitSystem === 'metric' ? 'kg' : 'lbs'}` : "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <Separator />
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    {isEditing ? (
                      <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                          <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                          <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                          <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                          <SelectItem value="extremely_active">Extremely Active (very hard exercise, physical job)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {profileData?.activityLevel ? profileData.activityLevel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Not specified"}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="goal">Primary Goal</Label>
                    {isEditing ? (
                      <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose_weight">Lose Weight</SelectItem>
                          <SelectItem value="gain_weight">Gain Weight</SelectItem>
                          <SelectItem value="maintain_weight">Maintain Weight</SelectItem>
                          <SelectItem value="build_muscle">Build Muscle</SelectItem>
                          <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {profileData?.goal ? profileData.goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Summary */}
          {profileData?.targetCalories && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Current Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Target Calories:</span>
                    <span className="text-lg font-bold text-blue-600">{profileData.targetCalories} calories/day</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>TDEE:</span>
                    <span className="font-medium">{calculatorResults && calculatorResults.length > 0 ? 
                      Math.round((JSON.parse(calculatorResults[0].results) as any).tdee || 0) : 'N/A'} calories/day</span>
                  </div>
                  <div className="pt-2 border-t">
                    <Link to="/calorie-calculator" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <Calculator className="h-3 w-3" />
                      Recalculate
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Calculator History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculator History
              </CardTitle>
              <CardDescription>
                Your recent calculation results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentResults.length > 0 ? (
                <div className="space-y-3">
                  {recentResults.map((result) => {
                    let data = {};
                    try {
                      // Handle both string and object formats
                      data = typeof result.results === 'string' ? JSON.parse(result.results) : result.results;
                    } catch (e) {
                      data = result.results || {};
                    }
                    
                    const isAlcohol = result.calculatorType === 'alcohol';
                    const isCalorie = result.calculatorType === 'calorie';
                    const weeklyGain = (data as any).weeklyGain;
                    const impactLevel = isAlcohol && weeklyGain > 1 ? 'high' : 
                                      isAlcohol && weeklyGain > 0.5 ? 'medium' : 'low';
                    
                    return (
                      <div key={result.id} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="capitalize">
                            {result.calculatorType} Calculator
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(result.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {isAlcohol && (
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Weekly Gain:</span>
                              <span className={`font-medium ${
                                impactLevel === 'high' ? 'text-red-600' : 
                                impactLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {(data as any).weeklyGain ? (data as any).weeklyGain.toFixed(2) : '0.00'} lbs
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Weekly Calories:</span>
                              <span className="font-medium">{(data as any).weeklyCalories || (data as any).totalCalories || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monthly Gain:</span>
                              <span className="text-orange-600 font-medium">
                                {(data as any).monthlyGain ? (data as any).monthlyGain.toFixed(2) : '0.00'} lbs
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Yearly Gain:</span>
                              <span className="text-red-600 font-medium">
                                {(data as any).yearlyGain ? (data as any).yearlyGain.toFixed(2) : '0.00'} lbs
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {isCalorie && (
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>BMR:</span>
                              <span className="font-medium">{Math.round((data as any).bmr || 0)} calories/day</span>
                            </div>
                            <div className="flex justify-between">
                              <span>TDEE:</span>
                              <span className="font-medium">{Math.round((data as any).tdee || 0)} calories/day</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Target Calories:</span>
                              <span className="font-semibold text-blue-600">{Math.round((data as any).goalCalories || (data as any).calories || 0)} calories/day</span>
                            </div>
                            {(data as any).macros && (
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex justify-between text-xs">
                                  <span>Carbs: {(data as any).macros.carbs}g</span>
                                  <span>Protein: {(data as any).macros.protein}g</span>
                                  <span>Fat: {(data as any).macros.fat}g</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Navigation Link */}
                        <div className="mt-3 pt-2 border-t">
                          <Link 
                            to={isAlcohol ? "/alcohol-calculator" : "/calorie-calculator"} 
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Calculator className="h-3 w-3" />
                            View in {isAlcohol ? "Alcohol" : "Calorie"} Calculator
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No calculator results yet</p>
                  <p className="text-sm">Use our calculators to see your results here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favorite Recipes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Favorite Recipes
              </CardTitle>
              <CardDescription>
                Your saved recipe collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(favoriteRecipes) && favoriteRecipes.length > 0 ? (
                <div className="space-y-3">
                  {favoriteRecipes.slice(0, 3).map((recipe: any, index: number) => (
                    <div key={`recipe-${recipe.id}-${index}`} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <Link href={`/recipes/${recipe.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                            {recipe.imageUrl ? (
                              <img 
                                src={recipe.imageUrl} 
                                alt={recipe.title}
                                className="w-10 h-10 rounded object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = '<svg class="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>';
                                }}
                              />
                            ) : (
                              <ChefHat className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{recipe.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <ChefHat className="h-3 w-3" />
                              {recipe.cookTime}
                              <Badge variant="secondary" className="text-xs">
                                {recipe.category}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                        <FavoriteButton
                          type="recipe"
                          id={recipe.id}
                          className="flex-shrink-0"
                        />
                      </div>
                    </div>
                  ))}
                  {Array.isArray(favoriteRecipes) && favoriteRecipes.length > 3 && (
                    <Link href="/favorites">
                      <Button variant="outline" size="sm" className="w-full">
                        View All ({favoriteRecipes.length})
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No favorite recipes yet</p>
                  <p className="text-sm">
                    <Link href="/recipes" className="text-primary hover:underline">
                      Browse recipes
                    </Link> to add favorites
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favorite Workouts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Favorite Workouts
              </CardTitle>
              <CardDescription>
                Your saved workout collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(favoriteWorkouts) && favoriteWorkouts.length > 0 ? (
                <div className="space-y-3">
                  {favoriteWorkouts.slice(0, 3).map((workout: any) => (
                    <div key={workout.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <Link href={`/workouts/${workout.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{workout.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {workout.duration}min
                              <Badge variant="secondary" className="text-xs">
                                {workout.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                        <FavoriteButton
                          type="workout"
                          id={workout.id}
                          className="flex-shrink-0"
                        />
                      </div>
                    </div>
                  ))}
                  {Array.isArray(favoriteWorkouts) && favoriteWorkouts.length > 3 && (
                    <Link href="/workouts">
                      <Button variant="outline" size="sm" className="w-full">
                        View All ({favoriteWorkouts.length})
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No favorite workouts yet</p>
                  <p className="text-sm">
                    <Link href="/workouts" className="text-primary hover:underline">
                      Browse workouts
                    </Link> to add favorites
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest actions on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(calculatorResults) ? calculatorResults.slice(0, 3).map((result: any) => (
                  <div key={result.id} className="flex items-center gap-3 text-sm">
                    <Calculator className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <span>Used {result.calculatorType} calculator</span>
                      <div className="text-xs text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )) : null}
                
                {Array.isArray(favoriteRecipes) ? favoriteRecipes.slice(0, 2).map((recipe: any) => (
                  <div key={`fav-${recipe.id}`} className="flex items-center gap-3 text-sm">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div className="flex-1">
                      <span>Favorited "{recipe.title}"</span>
                      <div className="text-xs text-gray-500">Recently</div>
                    </div>
                  </div>
                )) : null}

                {hasProfileData && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <span>Updated profile information</span>
                      <div className="text-xs text-gray-500">Recently</div>
                    </div>
                  </div>
                )}

                {(!Array.isArray(calculatorResults) || calculatorResults.length === 0) && (!Array.isArray(favoriteRecipes) || favoriteRecipes.length === 0) && !hasProfileData && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Start using the platform to see your activity here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}