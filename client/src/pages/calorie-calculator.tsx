import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Calculator, Activity, Target, Utensils, Info, Save, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface CalculationResults {
  bmr: number;
  tdee: number;
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
  goal: 'maintenance' | 'loss' | 'gain';
  macroProfile: string;
}

export default function CalorieCalculator() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [desiredWeight, setDesiredWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<number[]>([1.2]);
  const [goal, setGoal] = useState<'maintenance' | 'loss' | 'gain'>('maintenance');
  const [macroProfile, setMacroProfile] = useState<'balanced' | 'high-protein' | 'moderate-protein' | 'high-carb'>('balanced');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Activity level descriptions
  const activityDescriptions = {
    1.2: "Sedentary (little or no exercise)",
    1.375: "Lightly active (light exercise 1-3 days/week)",
    1.55: "Moderately active (moderate exercise 3-5 days/week)",
    1.725: "Very active (hard exercise 6-7 days/week)",
    1.9: "Extremely active (very hard exercise, physical job)"
  };

  // Macro ratio profiles
  const macroProfiles = {
    balanced: { carbs: 50, protein: 20, fat: 30 },
    'moderate-protein': { carbs: 35, protein: 40, fat: 25 },
    'high-protein': { carbs: 15, protein: 70, fat: 15 }, // Will be overridden by 1g per lb calculation
    'high-carb': { carbs: 70, protein: 15, fat: 15 }
  };

  const convertToMetric = (value: number, type: 'weight' | 'height'): number => {
    if (unitSystem === 'metric') return value;
    
    if (type === 'weight') {
      return value * 0.453592; // lbs to kg
    } else {
      return value * 2.54; // inches to cm
    }
  };

  const calculateBMR = (weightKg: number, heightCm: number, ageYears: number, sex: 'male' | 'female'): number => {
    // Mifflin-St Jeor Equation
    if (sex === 'male') {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + 5;
    } else {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;
    }
  };

  const calculateCalories = (): CalculationResults | null => {
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const currentWeightNum = parseFloat(currentWeight);
    const desiredWeightNum = parseFloat(desiredWeight);

    if (!ageNum || !heightNum || !currentWeightNum || !desiredWeightNum) {
      return null;
    }

    // Convert to metric for calculations
    const weightKg = convertToMetric(currentWeightNum, 'weight');
    const heightCm = convertToMetric(heightNum, 'height');
    const desiredWeightKg = convertToMetric(desiredWeightNum, 'weight');

    // Calculate BMR
    const bmr = calculateBMR(weightKg, heightCm, ageNum, sex);
    
    // Calculate TDEE
    const tdee = bmr * activityLevel[0];

    // Adjust calories based on goal
    let targetCalories = tdee;
    if (goal === 'loss') {
      targetCalories = tdee - 500; // 500 calorie deficit for ~1 lb/week loss
    } else if (goal === 'gain') {
      targetCalories = tdee + 500; // 500 calorie surplus for ~1 lb/week gain
    }

    // Calculate macros based on selected profile
    const profile = macroProfiles[macroProfile];
    let carbCalories = targetCalories * (profile.carbs / 100);
    let proteinCalories = targetCalories * (profile.protein / 100);
    let fatCalories = targetCalories * (profile.fat / 100);
    
    // Special calculation for high-protein: 1g per lb of bodyweight
    if (macroProfile === 'high-protein') {
      const bodyWeightLbs = unitSystem === 'imperial' ? currentWeightNum : currentWeightNum * 2.20462;
      const proteinGrams = Math.round(bodyWeightLbs); // 1g per lb
      proteinCalories = proteinGrams * 4; // 4 calories per gram
      
      // Recalculate remaining calories for carbs and fat
      const remainingCalories = targetCalories - proteinCalories;
      carbCalories = remainingCalories * 0.2; // 20% of remaining
      fatCalories = remainingCalories * 0.8; // 80% of remaining
    }

    // Convert calories to grams (4 cal/g for carbs & protein, 9 cal/g for fat)
    const macros = {
      carbs: Math.round(carbCalories / 4),
      protein: Math.round(proteinCalories / 4),
      fat: Math.round(fatCalories / 9)
    };

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(targetCalories),
      macros,
      goal,
      macroProfile
    };
  };

  const handleCalculate = () => {
    const result = calculateCalories();
    setResults(result);
  };

  // Auto-save profile data when form is filled and user is authenticated
  useEffect(() => {
    if (isAuthenticated && age && height && currentWeight && sex) {
      const autoSaveProfile = async () => {
        try {
          const profileData = {
            age: parseInt(age) || undefined,
            sex,
            height: parseInt(height) || undefined,
            currentWeight: parseFloat(currentWeight) || undefined,
            desiredWeight: parseFloat(desiredWeight) || undefined,
            activityLevel: activityLevel[0].toString(),
            goal,
            unitSystem,
            macroProfile
          };
          
          await apiRequest("POST", "/api/user/profile", profileData);
        } catch (error) {
          console.log("Auto-save failed:", error);
        }
      };
      
      // Debounce the auto-save to avoid too many requests
      const timeoutId = setTimeout(autoSaveProfile, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, age, sex, height, currentWeight, desiredWeight, activityLevel, goal, unitSystem, macroProfile]);

  // Save calculation results to profile
  const saveResults = async () => {
    if (!results) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Sign Up Required",
        description: "Create an account to save your calculation results and track your progress.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = "/api/login"}
          >
            Sign Up
          </Button>
        ),
      });
      return;
    }

    try {
      const resultData = {
        type: 'calorie_calculation',
        data: {
          ...results,
          inputData: {
            age,
            sex,
            height,
            currentWeight,
            desiredWeight,
            activityLevel: activityLevel[0],
            goal,
            unitSystem,
            macroProfile
          }
        }
      };

      await apiRequest("POST", "/api/user/save-result", resultData);
      
      toast({
        title: "Results Saved",
        description: "Your calculation results have been saved to your profile.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save results. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load profile data from user account
  const loadProfile = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign Up Required",
        description: "Create an account to save and load your personalized calculator settings.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = "/api/login"}
          >
            Sign Up
          </Button>
        ),
      });
      return;
    }

    setIsLoading(true);
    try {
      const profileData = await apiRequest("GET", "/api/user/profile");
      
      if (profileData.age) setAge(profileData.age.toString());
      if (profileData.sex) setSex(profileData.sex);
      if (profileData.height) setHeight(profileData.height.toString());
      if (profileData.currentWeight) setCurrentWeight(profileData.currentWeight.toString());
      if (profileData.desiredWeight) setDesiredWeight(profileData.desiredWeight.toString());
      if (profileData.activityLevel) setActivityLevel([parseFloat(profileData.activityLevel)]);
      if (profileData.goal) setGoal(profileData.goal);
      if (profileData.unitSystem) setUnitSystem(profileData.unitSystem);
      if (profileData.macroProfile) setMacroProfile(profileData.macroProfile);

      toast({
        title: "Profile Loaded",
        description: "Your saved calculator settings have been loaded.",
      });
    } catch (error) {
      toast({
        title: "Load Failed", 
        description: "Could not load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getGoalDescription = (goal: string) => {
    switch (goal) {
      case 'loss':
        return 'Weight Loss (500 calorie deficit)';
      case 'gain':
        return 'Weight Gain (500 calorie surplus)';
      default:
        return 'Weight Maintenance';
    }
  };

  const getMacroProfileDescription = (profile: string) => {
    switch (profile) {
      case 'high-protein':
        return 'High Protein (1g per lb bodyweight) - Ideal for muscle building';
      case 'moderate-protein':
        return 'Moderate Protein (40% protein) - Balanced approach';
      case 'high-carb':
        return 'Carb Loading (70% carbs) - For endurance training';
      default:
        return 'Balanced (50% carbs, 20% protein, 30% fat)';
    }
  };

  const getActivityLevelValue = (value: number) => {
    const closest = Object.keys(activityDescriptions)
      .map(Number)
      .reduce((prev, curr) => 
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );
    return closest;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            Calorie & Macro Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Calculate your daily calorie needs and macronutrient targets based on your goals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Enter your details to calculate personalized nutrition targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Unit System Toggle */}
              <div className="space-y-2">
                <Label>Unit System</Label>
                <RadioGroup
                  value={unitSystem}
                  onValueChange={(value) => setUnitSystem(value as 'metric' | 'imperial')}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imperial" id="imperial" />
                    <Label htmlFor="imperial">Imperial (lbs, in)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metric" id="metric" />
                    <Label htmlFor="metric">Metric (kg, cm)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Sex Selection */}
              <div className="space-y-2">
                <Label>Sex</Label>
                <Select value={sex} onValueChange={(value) => setSex(value as 'male' | 'female')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g., 30"
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={unitSystem === 'metric' ? 'e.g., 175' : 'e.g., 69'}
                />
              </div>

              {/* Current Weight */}
              <div className="space-y-2">
                <Label htmlFor="currentWeight">
                  Current Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </Label>
                <Input
                  id="currentWeight"
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder={unitSystem === 'metric' ? 'e.g., 70' : 'e.g., 155'}
                />
              </div>

              {/* Desired Weight */}
              <div className="space-y-2">
                <Label htmlFor="desiredWeight">
                  Target Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </Label>
                <Input
                  id="desiredWeight"
                  type="number"
                  value={desiredWeight}
                  onChange={(e) => setDesiredWeight(e.target.value)}
                  placeholder={unitSystem === 'metric' ? 'e.g., 65' : 'e.g., 145'}
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-3">
                <Label>Activity Level</Label>
                <div className="px-3">
                  <Slider
                    value={activityLevel}
                    onValueChange={setActivityLevel}
                    max={1.9}
                    min={1.2}
                    step={0.001}
                    className="w-full"
                  />
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {activityDescriptions[getActivityLevelValue(activityLevel[0])]}
                  </div>
                </div>
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <Label>Goal</Label>
                <Select value={goal} onValueChange={(value) => setGoal(value as 'maintenance' | 'loss' | 'gain')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintain Weight</SelectItem>
                    <SelectItem value="loss">Lose Weight</SelectItem>
                    <SelectItem value="gain">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getGoalDescription(goal)}
                </p>
              </div>

              {/* Macro Profile */}
              <div className="space-y-2">
                <Label>Macro Profile</Label>
                <Select value={macroProfile} onValueChange={(value) => setMacroProfile(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="moderate-protein">Moderate Protein</SelectItem>
                    <SelectItem value="high-protein">High Protein</SelectItem>
                    <SelectItem value="high-carb">High Carb</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getMacroProfileDescription(macroProfile)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCalculate} className="flex-1">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={loadProfile} disabled={isLoading}>
                  <Download className="h-4 w-4 mr-2" />
                  {isLoading ? "Loading..." : "Load Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Results
              </CardTitle>
              <CardDescription>
                Daily calorie and macronutrient targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  {/* Main Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">BMR</h3>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        {results.bmr}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">calories/day</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 dark:text-green-100">TDEE</h3>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {results.tdee}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-300">calories/day</p>
                    </div>
                  </div>

                  {/* Target Calories */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      Target Calories
                    </h3>
                    <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                      {results.calories}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-300">
                      calories per day for {getGoalDescription(results.goal).toLowerCase()}
                    </p>
                  </div>

                  {/* Macros */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Daily Macronutrients
                    </h3>
                    
                    <div className="grid gap-3">
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-orange-900 dark:text-orange-100">Carbs</span>
                          <span className="font-bold text-orange-800 dark:text-orange-200">
                            {results.macros.carbs}g
                          </span>
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-300">
                          {Math.round((results.macros.carbs * 4 / results.calories) * 100)}% of calories
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-red-900 dark:text-red-100">Protein</span>
                          <span className="font-bold text-red-800 dark:text-red-200">
                            {results.macros.protein}g
                          </span>
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-300">
                          {Math.round((results.macros.protein * 4 / results.calories) * 100)}% of calories
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-yellow-900 dark:text-yellow-100">Fat</span>
                          <span className="font-bold text-yellow-800 dark:text-yellow-200">
                            {results.macros.fat}g
                          </span>
                        </div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-300">
                          {Math.round((results.macros.fat * 9 / results.calories) * 100)}% of calories
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Tips for {results.goal === 'maintenance' ? 'Weight Maintenance' : results.goal === 'loss' ? 'Weight Loss' : 'Weight Gain'}
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Focus on balanced nutrition and consistent habits</li>
                      <li>• Adjust calories based on activity level changes</li>
                      <li>• Monitor weight trends over time, not daily fluctuations</li>
                    </ul>
                  </div>

                  {/* Save Results Button */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button 
                      onClick={saveResults}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      disabled={!results}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isAuthenticated ? "Save Results to Profile" : "Sign Up to Save Results"}
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Create an account to save your calculation results and track your progress
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Fill in your information and click "Calculate" to see your personalized nutrition targets
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}