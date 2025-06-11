import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, User, Target, Activity, Save, LoaderCircle } from "lucide-react";

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
  weeklyChangeRate?: number;
  timeToGoal?: number;
  bodyFatPercentage?: number;
  leanBodyMass?: number;
  dailyWaterIntake?: number;
  mealTiming?: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
  supplementSuggestions?: string[];
}

const macroProfiles = {
  balanced: {
    carbs: 40,
    protein: 30,
    fat: 30,
    description: "Balanced macronutrient distribution for general health"
  },
  'moderate-protein': {
    carbs: 35,
    protein: 35,
    fat: 30,
    description: "Moderate protein for active individuals"
  },
  'high-protein': {
    carbs: 30,
    protein: 40,
    fat: 30,
    description: "High protein for muscle building and recovery"
  },
  'high-carb': {
    carbs: 55,
    protein: 20,
    fat: 25,
    description: "High carb for endurance athletes"
  },
  keto: {
    carbs: 5,
    protein: 25,
    fat: 70,
    description: "Very low carb ketogenic diet"
  },
  paleo: {
    carbs: 30,
    protein: 30,
    fat: 40,
    description: "Paleo-friendly macronutrient ratios"
  }
};

const activityDescriptions = {
  1.2: "Sedentary (little/no exercise)",
  1.375: "Light activity (light exercise 1-3 days/week)", 
  1.55: "Moderate activity (moderate exercise 3-5 days/week)",
  1.725: "Very active (hard exercise 6-7 days/week)",
  1.9: "Extremely active (very hard exercise, physical job)"
};

export default function CalorieCalculator() {
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [desiredWeight, setDesiredWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<number[]>([1.2]);
  const [goal, setGoal] = useState<'maintenance' | 'loss' | 'gain'>('maintenance');
  const [macroProfile, setMacroProfile] = useState<'balanced' | 'high-protein' | 'moderate-protein' | 'high-carb' | 'keto' | 'paleo'>('balanced');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [supplementGoals, setSupplementGoals] = useState<string[]>([]);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateBMR = (weightKg: number, heightCm: number, ageYears: number, sex: 'male' | 'female'): number => {
    if (sex === 'male') {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + 5;
    } else {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;
    }
  };

  const calculateBodyFatPercentage = (weightKg: number, heightCm: number, age: number, sex: 'male' | 'female'): number => {
    const bmi = weightKg / ((heightCm / 100) ** 2);
    let estimatedBF;
    
    if (sex === 'male') {
      estimatedBF = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
      estimatedBF = (1.20 * bmi) + (0.23 * age) - 5.4;
    }
    
    return Math.max(5, Math.min(50, estimatedBF));
  };

  const calculateAdvancedMetrics = (weightKg: number, heightCm: number, ageYears: number, sex: 'male' | 'female', targetCalories: number) => {
    const bodyFatPercentage = calculateBodyFatPercentage(weightKg, heightCm, ageYears, sex);
    const leanBodyMass = weightKg * (1 - bodyFatPercentage / 100);
    
    const dailyWaterIntake = Math.round(weightKg * 35 + (targetCalories * 0.5));
    
    const mealTiming = {
      breakfast: Math.round(targetCalories * 0.25),
      lunch: Math.round(targetCalories * 0.35),
      dinner: Math.round(targetCalories * 0.30),
      snacks: Math.round(targetCalories * 0.10)
    };

    const supplementSuggestions = [];
    if (supplementGoals.includes('muscle-building')) {
      supplementSuggestions.push('Whey Protein', 'Creatine Monohydrate');
    }
    if (supplementGoals.includes('fat-loss')) {
      supplementSuggestions.push('Green Tea Extract', 'L-Carnitine');
    }
    if (supplementGoals.includes('energy')) {
      supplementSuggestions.push('B-Complex', 'Caffeine');
    }
    if (supplementGoals.includes('recovery')) {
      supplementSuggestions.push('Magnesium', 'Omega-3');
    }

    return {
      bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
      leanBodyMass: Math.round(leanBodyMass * 10) / 10,
      dailyWaterIntake,
      mealTiming,
      supplementSuggestions
    };
  };

  const calculateCalories = () => {
    if (!age || !height || !currentWeight || !desiredWeight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const currentWeightNum = parseFloat(currentWeight);
    const desiredWeightNum = parseFloat(desiredWeight);

    if (ageNum < 10 || ageNum > 100) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age between 10 and 100.",
        variant: "destructive",
      });
      return;
    }

    let weightKg, heightCm, desiredWeightKg;
    
    if (unitSystem === 'imperial') {
      weightKg = currentWeightNum * 0.453592;
      heightCm = heightNum * 2.54;
      desiredWeightKg = desiredWeightNum * 0.453592;
    } else {
      weightKg = currentWeightNum;
      heightCm = heightNum;
      desiredWeightKg = desiredWeightNum;
    }

    const bmr = calculateBMR(weightKg, heightCm, ageNum, sex);
    let activityMultiplier = activityLevel[0];
    const tdee = bmr * activityMultiplier;

    let targetCalories = tdee;
    let weeklyChangeRate = 0;
    let timeToGoal = 0;
    
    if (goal === 'loss') {
      const weightToLose = weightKg - desiredWeightKg;
      let deficit;
      if (weightToLose > 20) {
        deficit = 750;
      } else if (weightToLose > 10) {
        deficit = 500;
      } else {
        deficit = 250;
      }
      targetCalories = tdee - deficit;
      weeklyChangeRate = -(deficit * 7 / 3500);
      timeToGoal = Math.ceil(weightToLose / Math.abs(weeklyChangeRate));
    } else if (goal === 'gain') {
      const weightToGain = desiredWeightKg - weightKg;
      const surplus = weightToGain > 5 ? 500 : 300;
      targetCalories = tdee + surplus;
      weeklyChangeRate = surplus * 7 / 3500;
      timeToGoal = Math.ceil(weightToGain / weeklyChangeRate);
    }

    const profile = macroProfiles[macroProfile];
    const proteinCals = targetCalories * (profile.protein / 100);
    const carbCals = targetCalories * (profile.carbs / 100);
    const fatCals = targetCalories * (profile.fat / 100);

    const macros = {
      protein: Math.round(proteinCals / 4),
      carbs: Math.round(carbCals / 4),
      fat: Math.round(fatCals / 9)
    };

    const advancedMetrics = calculateAdvancedMetrics(weightKg, heightCm, ageNum, sex, targetCalories);

    const calculationResults: CalculationResults = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(targetCalories),
      macros,
      goal,
      macroProfile,
      weeklyChangeRate: Math.round(weeklyChangeRate * 100) / 100,
      timeToGoal,
      ...advancedMetrics
    };

    setResults(calculationResults);
  };

  const saveResults = async () => {
    if (!results) return;

    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/calculator-results", {
        type: 'calorie',
        inputs: {
          sex,
          age: parseInt(age),
          height: parseInt(height),
          currentWeight: parseFloat(currentWeight),
          desiredWeight: parseFloat(desiredWeight),
          activityLevel: activityLevel[0].toString(),
          goal,
          unitSystem,
          macroProfile,
          dietaryRestrictions,
          supplementGoals
        },
        results
      });

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
    } finally {
      setIsSaving(false);
    }
  };

  const loadProfile = async () => {
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
        return 'Weight Loss';
      case 'gain':
        return 'Weight Gain';
      default:
        return 'Weight Maintenance';
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

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction) 
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const toggleSupplementGoal = (goal: string) => {
    setSupplementGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Advanced Calorie & Macro Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get personalized nutrition targets with advanced metabolic calculations and supplement recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Form - Spans 2 columns */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter your basic details for accurate calculations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Unit System Toggle */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Unit System</Label>
                  <RadioGroup
                    value={unitSystem}
                    onValueChange={(value) => setUnitSystem(value as 'metric' | 'imperial')}
                    className="flex gap-8"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="imperial" id="imperial" />
                      <Label htmlFor="imperial" className="cursor-pointer">Imperial (lbs, in)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="metric" id="metric" />
                      <Label htmlFor="metric" className="cursor-pointer">Metric (kg, cm)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sex Selection */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Biological Sex</Label>
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
                    <Label htmlFor="age" className="text-base font-semibold">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g., 30"
                      className="text-base"
                    />
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-base font-semibold">
                      Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder={unitSystem === 'metric' ? 'e.g., 175' : 'e.g., 69'}
                      className="text-base"
                    />
                  </div>

                  {/* Current Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="currentWeight" className="text-base font-semibold">
                      Current Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                    </Label>
                    <Input
                      id="currentWeight"
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder={unitSystem === 'metric' ? 'e.g., 70' : 'e.g., 155'}
                      className="text-base"
                    />
                  </div>

                  {/* Target Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="desiredWeight" className="text-base font-semibold">
                      Target Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                    </Label>
                    <Input
                      id="desiredWeight"
                      type="number"
                      value={desiredWeight}
                      onChange={(e) => setDesiredWeight(e.target.value)}
                      placeholder={unitSystem === 'metric' ? 'e.g., 65' : 'e.g., 145'}
                      className="text-base"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Level Card */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Level
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Select your typical weekly activity level
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Activity Level: {activityDescriptions[getActivityLevelValue(activityLevel[0]) as keyof typeof activityDescriptions]}
                  </Label>
                  <Slider
                    value={activityLevel}
                    onValueChange={setActivityLevel}
                    min={1.2}
                    max={1.9}
                    step={0.175}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Sedentary</span>
                    <span>Very Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals & Preferences Card */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goals & Nutrition Preferences
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Customize your nutrition plan based on your goals
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Goal */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Primary Goal</Label>
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
                  </div>

                  {/* Macro Profile */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Macro Profile</Label>
                    <Select value={macroProfile} onValueChange={(value) => setMacroProfile(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="moderate-protein">Moderate Protein</SelectItem>
                        <SelectItem value="high-protein">High Protein</SelectItem>
                        <SelectItem value="high-carb">High Carb</SelectItem>
                        <SelectItem value="keto">Ketogenic</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {macroProfiles[macroProfile]?.description}
                    </p>
                  </div>
                </div>

                {/* Advanced Options Toggle */}
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                  </Button>
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-6 pt-4 border-t">
                    {/* Dietary Restrictions */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Dietary Restrictions</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'keto'].map(restriction => (
                          <Button
                            key={restriction}
                            variant={dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleDietaryRestriction(restriction)}
                            className="justify-start"
                          >
                            {restriction.charAt(0).toUpperCase() + restriction.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Supplement Goals */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Supplement Goals</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['muscle-building', 'fat-loss', 'energy', 'recovery'].map(goal => (
                          <Button
                            key={goal}
                            variant={supplementGoals.includes(goal) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSupplementGoal(goal)}
                            className="justify-start"
                          >
                            {goal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button 
                    onClick={calculateCalories} 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate Nutrition Plan
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={loadProfile}
                    disabled={isLoading}
                    className="sm:w-auto"
                  >
                    {isLoading ? (
                      <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <User className="h-4 w-4 mr-2" />
                    )}
                    Load Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="xl:col-span-1">
            {results ? (
              <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 sticky top-8">
                <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Nutrition Plan</span>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={saveResults}
                      disabled={isSaving}
                      className="bg-white/20 hover:bg-white/30"
                    >
                      {isSaving ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Goal: {getGoalDescription(results.goal)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Calorie Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Daily Calories</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {results.calories}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">calories per day</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div className="font-medium">BMR</div>
                        <div className="text-gray-600 dark:text-gray-400">{results.bmr} cal</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div className="font-medium">TDEE</div>
                        <div className="text-gray-600 dark:text-gray-400">{results.tdee} cal</div>
                      </div>
                    </div>
                  </div>

                  {/* Macronutrients */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Daily Macros</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-red-600 font-medium">Protein</span>
                        <span className="font-bold">{results.macros.protein}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium">Carbs</span>
                        <span className="font-bold">{results.macros.carbs}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-600 font-medium">Fat</span>
                        <span className="font-bold">{results.macros.fat}g</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {results.weeklyChangeRate && results.timeToGoal && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Progress Timeline</h3>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span>Weekly Rate:</span>
                            <span className="font-medium">
                              {Math.abs(results.weeklyChangeRate)} lbs/week
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time to Goal:</span>
                            <span className="font-medium">{results.timeToGoal} weeks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Advanced Metrics */}
                  {results.bodyFatPercentage && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Body Composition</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                          <div className="font-medium">Body Fat</div>
                          <div className="text-gray-600 dark:text-gray-400">{results.bodyFatPercentage}%</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                          <div className="font-medium">Lean Mass</div>
                          <div className="text-gray-600 dark:text-gray-400">{results.leanBodyMass}kg</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Meal Timing */}
                  {results.mealTiming && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Meal Distribution</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Breakfast:</span>
                          <span className="font-medium">{results.mealTiming.breakfast} cal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lunch:</span>
                          <span className="font-medium">{results.mealTiming.lunch} cal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dinner:</span>
                          <span className="font-medium">{results.mealTiming.dinner} cal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Snacks:</span>
                          <span className="font-medium">{results.mealTiming.snacks} cal</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Water Intake */}
                  {results.dailyWaterIntake && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Hydration</h3>
                      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                          {Math.round(results.dailyWaterIntake / 250)} glasses
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ({results.dailyWaterIntake}ml daily)
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Supplement Suggestions */}
                  {results.supplementSuggestions && results.supplementSuggestions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Recommended Supplements</h3>
                      <div className="space-y-2">
                        {results.supplementSuggestions.map((supplement, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                            {supplement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-8">
                <CardContent className="p-8 text-center">
                  <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill in your information and click "Calculate Nutrition Plan" to see your personalized results.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}