import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Target, Activity, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CalorieCalculatorSimple() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form data with default values
  const [formData, setFormData] = useState({
    age: '',
    sex: 'male',
    height: '',
    currentWeight: '',
    desiredWeight: '',
    activityLevel: '1.55',
    goal: 'loss',
    unitSystem: 'imperial',
    macroProfile: 'high-protein'
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Load profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/user/profile'],
  });

  // Load previous calculation results
  const { data: calculatorResults } = useQuery({
    queryKey: ['/api/calculator-results'],
  });

  // Apply profile data to form when it loads - SIMPLE APPROACH
  useEffect(() => {
    if (profileData && !profileLoading) {
      console.log("SIMPLE: Loading profile data", profileData);
      
      const profile = profileData as any;
      
      // Direct assignment - no complex state management
      const newFormData = {
        age: profile.age ? String(profile.age) : '',
        sex: profile.sex || 'male',
        height: profile.height ? String(profile.height) : '',
        currentWeight: profile.currentWeight ? String(profile.currentWeight) : '',
        desiredWeight: profile.desiredWeight ? String(profile.desiredWeight) : '',
        activityLevel: profile.activityLevel || '1.55',
        goal: profile.goal || 'loss',
        unitSystem: profile.unitSystem || 'imperial',
        macroProfile: profile.macroProfile || 'high-protein'
      };
      
      console.log("SIMPLE: Setting form data", newFormData);
      setFormData(newFormData);
    }
  }, [profileData, profileLoading]);

  // Load previous calculation results
  useEffect(() => {
    if (calculatorResults) {
      const results = calculatorResults as any[];
      const latestCalorieResult = results
        ?.filter((result: any) => result.calculatorType === 'calorie')
        ?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      
      if (latestCalorieResult?.results) {
        try {
          setResults(JSON.parse(latestCalorieResult.results));
          console.log("SIMPLE: Loaded previous results");
        } catch (e) {
          console.log("SIMPLE: No previous results");
        }
      }
    }
  }, [calculatorResults]);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/user/profile', {
        age: parseInt(data.age) || 0,
        sex: data.sex,
        height: parseInt(data.height) || 0,
        currentWeight: parseInt(data.currentWeight) || 0,
        desiredWeight: parseInt(data.desiredWeight) || 0,
        activityLevel: data.activityLevel,
        goal: data.goal,
        unitSystem: data.unitSystem,
        macroProfile: data.macroProfile,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      toast({
        title: "Profile Saved",
        description: "Your profile data has been saved successfully.",
      });
    },
  });

  // Save calculation mutation
  const saveCalculationMutation = useMutation({
    mutationFn: async (results: any) => {
      return apiRequest('POST', '/api/calculator-results', {
        calculatorType: 'calorie',
        results: JSON.stringify(results),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calculator-results'] });
    },
  });

  const calculateCalories = async () => {
    setIsCalculating(true);
    
    try {
      // Save profile first
      await saveProfileMutation.mutateAsync(formData);
      
      // Calculate BMR using Mifflin-St Jeor equation
      const age = parseInt(formData.age);
      const height = formData.unitSystem === 'metric' ? parseInt(formData.height) : parseInt(formData.height) * 2.54;
      const weight = formData.unitSystem === 'metric' ? parseInt(formData.currentWeight) : parseInt(formData.currentWeight) * 0.453592;
      
      let bmr;
      if (formData.sex === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }
      
      const tdee = bmr * parseFloat(formData.activityLevel);
      
      let goalCalories;
      switch (formData.goal) {
        case 'loss':
          goalCalories = tdee - 500; // 1 lb per week
          break;
        case 'gain':
          goalCalories = tdee + 500; // 1 lb per week
          break;
        default:
          goalCalories = tdee; // maintenance
      }
      
      // Calculate macros based on profile
      let proteinRatio, carbRatio, fatRatio;
      switch (formData.macroProfile) {
        case 'high-protein':
          proteinRatio = 0.30; carbRatio = 0.40; fatRatio = 0.30;
          break;
        case 'low-carb':
          proteinRatio = 0.25; carbRatio = 0.20; fatRatio = 0.55;
          break;
        case 'high-carb':
          proteinRatio = 0.20; carbRatio = 0.60; fatRatio = 0.20;
          break;
        default: // balanced
          proteinRatio = 0.25; carbRatio = 0.45; fatRatio = 0.30;
      }
      
      const proteinCalories = goalCalories * proteinRatio;
      const carbCalories = goalCalories * carbRatio;
      const fatCalories = goalCalories * fatRatio;
      
      const calculationResults = {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        goalCalories: Math.round(goalCalories),
        protein: Math.round(proteinCalories / 4), // 4 cal/g
        carbs: Math.round(carbCalories / 4), // 4 cal/g
        fat: Math.round(fatCalories / 9), // 9 cal/g
        goal: formData.goal,
        activityLevel: formData.activityLevel,
        calculatedAt: new Date().toISOString()
      };
      
      setResults(calculationResults);
      
      // Save calculation results
      await saveCalculationMutation.mutateAsync(calculationResults);
      
      toast({
        title: "Calculation Complete",
        description: "Your personalized calorie and macro targets have been calculated.",
      });
      
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getActivityLevelText = (level: string) => {
    switch (level) {
      case '1.2': return 'Sedentary (little/no exercise)';
      case '1.375': return 'Light activity (light exercise 1-3 days/week)';
      case '1.55': return 'Moderate activity (moderate exercise 3-5 days/week)';
      case '1.725': return 'Very active (hard exercise 6-7 days/week)';
      case '1.9': return 'Super active (very hard exercise, physical job)';
      default: return 'Moderate activity';
    }
  };

  const getGoalText = (goal: string) => {
    switch (goal) {
      case 'loss': return 'Weight Loss';
      case 'gain': return 'Weight Gain';
      default: return 'Maintenance';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full mb-6">
            <Calculator className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Daily Calorie Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get your personalized daily calorie intake and macronutrient breakdown
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Fill in your details to calculate your daily needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Enter your age"
                  />
                  <div className="text-xs text-blue-600 mt-1">Value: "{formData.age}"</div>
                </div>
                <div>
                  <Label htmlFor="sex">Sex</Label>
                  <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height ({formData.unitSystem === 'metric' ? 'cm' : 'inches'})</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder={`Enter height in ${formData.unitSystem === 'metric' ? 'cm' : 'inches'}`}
                  />
                  <div className="text-xs text-blue-600 mt-1">Value: "{formData.height}"</div>
                </div>
                <div>
                  <Label htmlFor="currentWeight">Current Weight ({formData.unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    value={formData.currentWeight}
                    onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                    placeholder={`Enter weight in ${formData.unitSystem === 'metric' ? 'kg' : 'lbs'}`}
                  />
                  <div className="text-xs text-blue-600 mt-1">Value: "{formData.currentWeight}"</div>
                </div>
              </div>

              {/* Goal Weight */}
              <div>
                <Label htmlFor="desiredWeight">Goal Weight ({formData.unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
                <Input
                  id="desiredWeight"
                  type="number"
                  value={formData.desiredWeight}
                  onChange={(e) => handleInputChange('desiredWeight', e.target.value)}
                  placeholder={`Enter goal weight in ${formData.unitSystem === 'metric' ? 'kg' : 'lbs'}`}
                />
                <div className="text-xs text-blue-600 mt-1">Value: "{formData.desiredWeight}"</div>
              </div>

              {/* Activity Level */}
              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.2">Sedentary (little/no exercise)</SelectItem>
                    <SelectItem value="1.375">Light activity (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="1.55">Moderate activity (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="1.725">Very active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="1.9">Super active (very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Goal */}
              <div>
                <Label htmlFor="goal">Goal</Label>
                <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loss">Weight Loss</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="gain">Weight Gain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateCalories} 
                className="w-full"
                disabled={isCalculating || !formData.age || !formData.height || !formData.currentWeight}
              >
                {isCalculating ? 'Calculating...' : 'Calculate My Daily Needs'}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Daily Targets
                </CardTitle>
                <CardDescription>Based on your profile and goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calorie Targets */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {results.bmr}
                    </div>
                    <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      BMR (Base Metabolic Rate)
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {results.tdee}
                    </div>
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      TDEE (Total Daily Energy)
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {results.goalCalories} calories/day
                  </div>
                  <div className="text-lg font-medium text-purple-700 dark:text-purple-300">
                    For {getGoalText(results.goal)}
                  </div>
                </div>

                {/* Macronutrient Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Daily Macronutrient Targets</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="font-medium text-red-700 dark:text-red-300">Protein</span>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        {results.protein}g
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <span className="font-medium text-yellow-700 dark:text-yellow-300">Carbohydrates</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        {results.carbs}g
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="font-medium text-green-700 dark:text-green-300">Fat</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {results.fat}g
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div>Activity Level: {getActivityLevelText(results.activityLevel)}</div>
                  <div>Calculated: {new Date(results.calculatedAt).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {!results && (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Ready to Calculate Your Needs?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill out the form to get your personalized daily calorie intake and macronutrient breakdown.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}