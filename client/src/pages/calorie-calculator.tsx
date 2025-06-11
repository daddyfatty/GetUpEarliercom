import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Calculator, Activity, Target, Utensils, Info, Save, Download, TrendingUp, Heart, Zap, Apple, Clock, User, Scale, Trophy, Coffee, Moon, Sunrise, Flame } from "lucide-react";
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

export default function CalorieCalculator() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [desiredWeight, setDesiredWeight] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<number[]>([1.2]);
  const [goal, setGoal] = useState<'maintenance' | 'loss' | 'gain'>('maintenance');
  const [macroProfile, setMacroProfile] = useState<'balanced' | 'high-protein' | 'moderate-protein' | 'high-carb' | 'keto' | 'paleo'>('balanced');
  const [workoutDays, setWorkoutDays] = useState<string>('3');
  const [sleepHours, setSleepHours] = useState<string>('8');
  const [stressLevel, setStressLevel] = useState<string>('moderate');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [mealPreference, setMealPreference] = useState<string>('3');
  const [supplementGoals, setSupplementGoals] = useState<string[]>([]);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Activity level descriptions
  const activityDescriptions = {
    1.2: "Sedentary (desk job, little exercise)",
    1.375: "Lightly active (light exercise 1-3 days/week)",
    1.55: "Moderately active (moderate exercise 3-5 days/week)",
    1.725: "Very active (hard exercise 6-7 days/week)",
    1.9: "Extremely active (physical job + exercise)"
  };

  // Enhanced macro ratio profiles
  const macroProfiles = {
    balanced: { carbs: 50, protein: 20, fat: 30, description: "Balanced approach for general health" },
    'moderate-protein': { carbs: 35, protein: 40, fat: 25, description: "Higher protein for muscle maintenance" },
    'high-protein': { carbs: 15, protein: 70, fat: 15, description: "1g per lb bodyweight - muscle building" },
    'high-carb': { carbs: 70, protein: 15, fat: 15, description: "Carb loading for endurance training" },
    'keto': { carbs: 5, protein: 25, fat: 70, description: "Very low carb, high fat ketogenic" },
    'paleo': { carbs: 30, protein: 35, fat: 35, description: "Whole foods, moderate carb approach" }
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

  const calculateBodyFatPercentage = (weightKg: number, heightCm: number, age: number, sex: 'male' | 'female'): number => {
    // US Navy method estimation
    if (bodyFat) return parseFloat(bodyFat);
    
    // Rough estimation based on BMI and demographics
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
    
    // Daily water intake (ml) - basic formula
    const dailyWaterIntake = Math.round(weightKg * 35 + (targetCalories * 0.5));
    
    // Meal timing based on preference
    const mealCount = parseInt(mealPreference);
    let mealTiming;
    
    if (mealCount === 3) {
      mealTiming = {
        breakfast: Math.round(targetCalories * 0.25),
        lunch: Math.round(targetCalories * 0.35),
        dinner: Math.round(targetCalories * 0.30),
        snacks: Math.round(targetCalories * 0.10)
      };
    } else if (mealCount === 4) {
      mealTiming = {
        breakfast: Math.round(targetCalories * 0.25),
        lunch: Math.round(targetCalories * 0.25),
        dinner: Math.round(targetCalories * 0.25),
        snacks: Math.round(targetCalories * 0.25)
      };
    } else {
      mealTiming = {
        breakfast: Math.round(targetCalories * 0.20),
        lunch: Math.round(targetCalories * 0.20),
        dinner: Math.round(targetCalories * 0.20),
        snacks: Math.round(targetCalories * 0.40)
      };
    }

    // Supplement suggestions based on goals
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
    
    // Calculate TDEE with adjustments
    let activityMultiplier = activityLevel[0];
    
    // Adjust for workout frequency
    const workoutDaysNum = parseInt(workoutDays);
    if (workoutDaysNum > 5) {
      activityMultiplier += 0.1;
    } else if (workoutDaysNum < 2) {
      activityMultiplier -= 0.05;
    }
    
    // Adjust for sleep (poor sleep reduces metabolism)
    const sleepHoursNum = parseInt(sleepHours);
    if (sleepHoursNum < 7) {
      activityMultiplier -= 0.05;
    } else if (sleepHoursNum > 8) {
      activityMultiplier += 0.02;
    }
    
    // Adjust for stress
    if (stressLevel === 'high') {
      activityMultiplier -= 0.05;
    } else if (stressLevel === 'low') {
      activityMultiplier += 0.02;
    }
    
    const tdee = bmr * activityMultiplier;

    // Adjust calories based on goal
    let targetCalories = tdee;
    let weeklyChangeRate = 0;
    let timeToGoal = 0;
    
    if (goal === 'loss') {
      const weightToLose = weightKg - desiredWeightKg;
      // Adaptive deficit based on how much weight to lose
      let deficit;
      if (weightToLose > 20) {
        deficit = 750; // 1.5 lbs/week
      } else if (weightToLose > 10) {
        deficit = 500; // 1 lb/week
      } else {
        deficit = 250; // 0.5 lbs/week
      }
      targetCalories = tdee - deficit;
      weeklyChangeRate = -(deficit * 7 / 3500); // lbs per week
      timeToGoal = Math.ceil(weightToLose / Math.abs(weeklyChangeRate));
    } else if (goal === 'gain') {
      const weightToGain = desiredWeightKg - weightKg;
      const surplus = weightToGain > 5 ? 500 : 300;
      targetCalories = tdee + surplus;
      weeklyChangeRate = surplus * 7 / 3500; // lbs per week
      timeToGoal = Math.ceil(weightToGain / weeklyChangeRate);
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

    // Calculate advanced metrics
    const advancedMetrics = calculateAdvancedMetrics(weightKg, heightCm, ageNum, sex, targetCalories);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(targetCalories),
      macros,
      goal,
      macroProfile,
      weeklyChangeRate: Math.round(weeklyChangeRate * 10) / 10,
      timeToGoal,
      ...advancedMetrics
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
            bodyFat,
            activityLevel: activityLevel[0],
            workoutDays,
            sleepHours,
            stressLevel,
            goal,
            unitSystem,
            macroProfile,
            mealPreference,
            dietaryRestrictions,
            supplementGoals
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
            Get personalized nutrition targets with advanced metabolic calculations, lifestyle factors, and supplement recommendations
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

                  {/* Body Fat Percentage (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="bodyFat" className="text-base font-semibold">
                      Body Fat % <span className="text-sm text-gray-500">(optional)</span>
                    </Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                      placeholder="e.g., 15"
                      className="text-base"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity & Lifestyle Card */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity & Lifestyle
                </CardTitle>
                <CardDescription className="text-green-100">
                  Tell us about your activity level and lifestyle factors
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Activity Level Slider */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Activity Level</Label>
                  <div className="px-3">
                    <Slider
                      value={activityLevel}
                      onValueChange={setActivityLevel}
                      max={1.9}
                      min={1.2}
                      step={0.001}
                      className="w-full"
                    />
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {activityDescriptions[getActivityLevelValue(activityLevel[0])]}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Multiplier: {activityLevel[0].toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Workout Days */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Workout Days/Week
                    </Label>
                    <Select value={workoutDays} onValueChange={setWorkoutDays}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6, 7].map(days => (
                          <SelectItem key={days} value={days.toString()}>{days} days</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sleep Hours */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Sleep Hours/Night
                    </Label>
                    <Select value={sleepHours} onValueChange={setSleepHours}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 6, 7, 8, 9, 10].map(hours => (
                          <SelectItem key={hours} value={hours.toString()}>{hours} hours</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stress Level */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Stress Level
                    </Label>
                    <Select value={stressLevel} onValueChange={setStressLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
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

                  {/* Meal Preference */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Meals Per Day
                    </Label>
                    <Select value={mealPreference} onValueChange={setMealPreference}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 meals + snacks</SelectItem>
                        <SelectItem value="4">4 smaller meals</SelectItem>
                        <SelectItem value="6">6 mini meals</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="flex gap-3 pt-6">
                  <Button 
                    onClick={handleCalculate} 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    size="lg"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate Nutrition Plan
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={loadProfile} 
                    disabled={isLoading}
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? "Loading..." : "Load"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="xl:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-8">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Nutrition Plan
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Personalized daily targets and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {results ? (
                  <div className="space-y-6">
                    {/* Main Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Flame className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">BMR</h3>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                          {results.bmr}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-300">cal/day</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Activity className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100 text-sm">TDEE</h3>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                          {results.tdee}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300">cal/day</p>
                      </div>
                    </div>

                    {/* Target Calories */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-3">
                        <Target className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                        Daily Target
                      </h3>
                      <p className="text-4xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                        {results.calories}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-300">
                        calories for {getGoalDescription(results.goal).toLowerCase()}
                      </p>
                      {results.weeklyChangeRate && (
                        <p className="text-xs text-purple-500 dark:text-purple-400 mt-2">
                          {Math.abs(results.weeklyChangeRate)} lbs/week • {results.timeToGoal} weeks to goal
                        </p>
                      )}
                    </div>

                    {/* Macronutrients */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Utensils className="h-4 w-4" />
                        Daily Macronutrients
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-orange-900 dark:text-orange-100">Carbs</span>
                            <span className="font-bold text-orange-800 dark:text-orange-200">
                              {results.macros.carbs}g
                            </span>
                          </div>
                          <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full" 
                              style={{width: `${Math.round((results.macros.carbs * 4 / results.calories) * 100)}%`}}
                            />
                          </div>
                          <div className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                            {Math.round((results.macros.carbs * 4 / results.calories) * 100)}% of calories
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-red-900 dark:text-red-100">Protein</span>
                            <span className="font-bold text-red-800 dark:text-red-200">
                              {results.macros.protein}g
                            </span>
                          </div>
                          <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{width: `${Math.round((results.macros.protein * 4 / results.calories) * 100)}%`}}
                            />
                          </div>
                          <div className="text-xs text-red-600 dark:text-red-300 mt-1">
                            {Math.round((results.macros.protein * 4 / results.calories) * 100)}% of calories
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-yellow-900 dark:text-yellow-100">Fat</span>
                            <span className="font-bold text-yellow-800 dark:text-yellow-200">
                              {results.macros.fat}g
                            </span>
                          </div>
                          <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{width: `${Math.round((results.macros.fat * 9 / results.calories) * 100)}%`}}
                            />
                          </div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                            {Math.round((results.macros.fat * 9 / results.calories) * 100)}% of calories
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Metrics */}
                    {results.bodyFatPercentage && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Body Composition</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400">Body Fat</p>
                            <p className="font-bold">{results.bodyFatPercentage}%</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400">Lean Mass</p>
                            <p className="font-bold">{results.leanBodyMass}kg</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Meal Timing */}
                    {results.mealTiming && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Meal Distribution
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>🌅 Breakfast</span>
                            <span className="font-medium">{results.mealTiming.breakfast} cal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>☀️ Lunch</span>
                            <span className="font-medium">{results.mealTiming.lunch} cal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🌙 Dinner</span>
                            <span className="font-medium">{results.mealTiming.dinner} cal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🍎 Snacks</span>
                            <span className="font-medium">{results.mealTiming.snacks} cal</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hydration */}
                    {results.dailyWaterIntake && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                          💧 Daily Hydration
                        </h4>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                          {Math.round(results.dailyWaterIntake / 250)} glasses
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                          ({results.dailyWaterIntake}ml total)
                        </p>
                      </div>
                    )}

                    {/* Supplement Suggestions */}
                    {results.supplementSuggestions && results.supplementSuggestions.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Apple className="h-4 w-4" />
                          Recommended Supplements
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {results.supplementSuggestions.map((supplement, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
                            >
                              {supplement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pro Tips */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Pro Tips
                      </h4>
                      <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
                        <li>• Track weight weekly, not daily</li>
                        <li>• Prioritize protein at each meal</li>
                        <li>• Stay consistent for 2-4 weeks before adjusting</li>
                        <li>• Focus on whole, minimally processed foods</li>
                      </ul>
                    </div>

                    {/* Save Results Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <Button 
                        onClick={saveResults}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                        disabled={!results}
                        size="lg"
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
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                        <Calculator className="h-10 w-10 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Ready to Calculate?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Fill in your information and click "Calculate Nutrition Plan" to see your personalized targets
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}