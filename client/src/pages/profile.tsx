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
    enabled: isAuthenticated
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
    unitSystem: 'metric',
    macroProfile: 'balanced'
  });

  // Fetch calculator results
  const { data: calculatorResults = [] as CalculatorResult[] } = useQuery({
    queryKey: ['/api/user/saved-results'],
    enabled: isAuthenticated
  });

  // Fetch favorite recipes
  const { data: favoriteRecipes = [] as Recipe[] } = useQuery({
    queryKey: ['/api/users/dev_user_1/favorites'],
    enabled: isAuthenticated
  });

  // Fetch all workouts for favorites (simplified for now)
  const { data: allWorkouts = [] as Workout[] } = useQuery({
    queryKey: ['/api/workouts'],
    enabled: isAuthenticated
  });

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
        unitSystem: profileData.unitSystem || 'metric',
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
  const recentResults = calculatorResults?.slice(0, 5) || [];

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
                        {profileData.age || "Not specified"}
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
                        {profileData.sex ? profileData.sex.charAt(0).toUpperCase() + profileData.sex.slice(1) : "Not specified"}
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
                        {profileData.height ? `${profileData.height} ${formData.unitSystem === 'metric' ? 'cm' : 'inches'}` : "Not specified"}
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
                        {profileData.currentWeight ? `${profileData.currentWeight} ${formData.unitSystem === 'metric' ? 'kg' : 'lbs'}` : "Not specified"}
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
                        {profileData.desiredWeight ? `${profileData.desiredWeight} ${formData.unitSystem === 'metric' ? 'kg' : 'lbs'}` : "Not specified"}
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
                        {profileData.activityLevel ? profileData.activityLevel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Not specified"}
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
                        {profileData.goal ? profileData.goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
                      data = JSON.parse(result.results || '{}');
                    } catch (e) {
                      data = {};
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
                                {((data as any).weeklyGain)?.toFixed(2)} lbs
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monthly Gain:</span>
                              <span className="text-orange-600 font-medium">
                                {((data as any).monthlyGain)?.toFixed(2)} lbs
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Yearly Gain:</span>
                              <span className="text-red-600 font-medium">
                                {((data as any).yearlyGain)?.toFixed(2)} lbs
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {isCalorie && (data as any).bmr && (
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>BMR:</span>
                              <span className="font-medium">{Math.round((data as any).bmr)} calories/day</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Daily Needs:</span>
                              <span className="font-medium">{Math.round((data as any).dailyCalories)} calories/day</span>
                            </div>
                          </div>
                        )}
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
              {favoriteRecipes.length > 0 ? (
                <div className="space-y-3">
                  {favoriteRecipes.slice(0, 3).map((recipe) => (
                    <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                      <div className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          {recipe.imageUrl && (
                            <img 
                              src={recipe.imageUrl} 
                              alt={recipe.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
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
                        </div>
                      </div>
                    </Link>
                  ))}
                  {favoriteRecipes.length > 3 && (
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
                {calculatorResults.slice(0, 3).map((result) => (
                  <div key={result.id} className="flex items-center gap-3 text-sm">
                    <Calculator className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <span>Used {result.calculatorType} calculator</span>
                      <div className="text-xs text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {favoriteRecipes.slice(0, 2).map((recipe) => (
                  <div key={`fav-${recipe.id}`} className="flex items-center gap-3 text-sm">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div className="flex-1">
                      <span>Favorited "{recipe.title}"</span>
                      <div className="text-xs text-gray-500">Recently</div>
                    </div>
                  </div>
                ))}

                {hasProfileData && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <span>Updated profile information</span>
                      <div className="text-xs text-gray-500">Recently</div>
                    </div>
                  </div>
                )}

                {!calculatorResults.length && !favoriteRecipes.length && !hasProfileData && (
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