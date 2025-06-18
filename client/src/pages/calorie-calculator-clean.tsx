import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calculator, User, Save, LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CalculationResults {
  bmr: number;
  tdee: number;
  calories: number;
  goalCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  macros?: {
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
  const { toast } = useToast();
  
  // Fetch profile data using React Query
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    staleTime: 0
  });

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
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load existing calculator results for display purposes only
  const { data: calculatorResults } = useQuery({
    queryKey: ['/api/calculator-results']
  });

  // Initialize form with default values and update when profile loads
  useEffect(() => {
    if (profileData && !profileLoading) {
      console.log('Profile data structure:', JSON.stringify(profileData, null, 2));
      
      const profile = profileData as any;
      
      // Direct state updates with debug logs
      console.log('Setting age from', profile.age, 'to state');
      setAge(profile.age ? profile.age.toString() : '');
      
      console.log('Setting sex from', profile.sex, 'to state');
      setSex(profile.sex || 'male');
      
      console.log('Setting height from', profile.height, 'to state');
      setHeight(profile.height ? profile.height.toString() : '');
      
      console.log('Setting currentWeight from', profile.currentWeight, 'to state');
      setCurrentWeight(profile.currentWeight ? profile.currentWeight.toString() : '');
      
      console.log('Setting desiredWeight from', profile.desiredWeight, 'to state');
      setDesiredWeight(profile.desiredWeight ? profile.desiredWeight.toString() : '');
      
      console.log('Setting activityLevel from', profile.activityLevel, 'to state');
      setActivityLevel([parseFloat(profile.activityLevel) || 1.2]);
      
      console.log('Setting goal from', profile.goal, 'to state');
      setGoal(profile.goal || 'maintenance');
      
      console.log('Setting macroProfile from', profile.macroProfile, 'to state');
      setMacroProfile(profile.macroProfile || 'balanced');
      
      console.log('Setting unitSystem from', profile.unitSystem, 'to state');
      setUnitSystem(profile.unitSystem || 'imperial');
      
      console.log('All profile data applied to React state');
      setDataLoaded(true);
    }
  }, [profileData, profileLoading]);

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

    // Auto-save profile data when calculation is made
    const profileData = {
      age: parseInt(age),
      sex,
      height: parseInt(height),
      currentWeight: parseFloat(currentWeight),
      desiredWeight: parseFloat(desiredWeight),
      activityLevel: (activityLevel[0] || 1.2).toString(),
      goal,
      unitSystem,
      macroProfile
    };

    // Save to profile silently in background
    apiRequest("POST", "/api/user/profile", profileData).catch(console.error);

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const currentWeightNum = parseFloat(currentWeight);
    const desiredWeightNum = parseFloat(desiredWeight);

    // Validate all inputs are valid numbers
    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(currentWeightNum) || isNaN(desiredWeightNum)) {
      toast({
        title: "Invalid Input",
        description: "Please ensure all fields contain valid numbers.",
        variant: "destructive",
      });
      return;
    }

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

    // Additional validation for converted values
    if (weightKg <= 0 || heightCm <= 0 || desiredWeightKg <= 0) {
      toast({
        title: "Invalid Values",
        description: "Weight and height must be positive numbers.",
        variant: "destructive",
      });
      return;
    }

    const bmr = calculateBMR(weightKg, heightCm, ageNum, sex);
    const activityMultiplier = activityLevel[0] || 1.2;
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
      // Save calculation results
      await apiRequest("POST", "/api/calculator-results", {
        calculatorType: 'calorie',
        userInputs: JSON.stringify({
          sex,
          age: parseInt(age),
          height: parseInt(height),
          currentWeight: parseFloat(currentWeight),
          desiredWeight: parseFloat(desiredWeight),
          activityLevel: (activityLevel[0] || 1.2).toString(),
          goal,
          unitSystem,
          macroProfile,
          dietaryRestrictions,
          supplementGoals
        }),
        results: JSON.stringify(results)
      });

      // Also save data to profile for persistence
      await apiRequest("POST", "/api/user/profile", {
        age: parseInt(age),
        sex,
        height: parseInt(height),
        currentWeight: parseFloat(currentWeight),
        desiredWeight: parseFloat(desiredWeight),
        activityLevel: (activityLevel[0] || 1.2).toString(),
        goal,
        unitSystem,
        macroProfile
      });

      // Invalidate calculator results cache to refresh profile display
      queryClient.invalidateQueries({ queryKey: ['/api/calculator-results'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      
      toast({
        title: "Results Saved",
        description: "Your calculation results and profile have been saved.",
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

  // Load previous calculation results when calculatorResults data is available
  useEffect(() => {
    const results = calculatorResults as any[];
    if (results && results.length > 0) {
      try {
        console.log('Raw calculator results:', results);
        
        // Find the most recent calorie calculator result
        const latestCalorieResult = results
          ?.filter((result: any) => result.calculatorType === 'calorie')
          ?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        
        console.log('Latest calorie result:', latestCalorieResult);
        
        if (latestCalorieResult?.results) {
          // Check if results is a string that needs parsing or already an object
          const parsedResults = typeof latestCalorieResult.results === 'string' 
            ? JSON.parse(latestCalorieResult.results) 
            : latestCalorieResult.results;
          
          console.log('Setting previous calculation results:', parsedResults);
          
          // Ensure the results object has the correct structure for display
          const formattedResults = {
            bmr: parsedResults.bmr || 0,
            tdee: parsedResults.tdee || 0,
            goalCalories: parsedResults.goalCalories || parsedResults.calories || 0,
            calories: parsedResults.goalCalories || parsedResults.calories || 0,
            protein: parsedResults.protein || 0,
            carbs: parsedResults.carbs || 0,
            fat: parsedResults.fat || 0,
            goal: parsedResults.goal || 'maintenance',
            macroProfile: parsedResults.macroProfile || 'balanced',
            ...parsedResults
          };
          
          setResults(formattedResults);
        }
      } catch (calcError) {
        console.log("Error parsing calculation results:", calcError);
      }
    } else {
      console.log("No calculator results available");
    }
  }, [calculatorResults]);

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

  // Show loading while data is being fetched
  if (profileLoading || !dataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-xl">Loading your saved data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Daily Caloric Intake & Macro Calculator
          </h1>
          <p className="text-xl text-purple-100 max-w-4xl mx-auto">
            Calculate your daily caloric needs and macronutrient requirements based on your personal details, activity level, and fitness goals with support for both Metric and Imperial units.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Details Card */}
          <Card className="shadow-xl border-0 bg-white backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Details
              </CardTitle>
              <CardDescription className="text-orange-100">
                Enter your information to calculate your daily caloric needs
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
                    <Label htmlFor="imperial" className="cursor-pointer">Imperial (lb, inches)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metric" id="metric" />
                    <Label htmlFor="metric" className="cursor-pointer">Metric (kg, cm)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Sex Selection */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Sex</Label>
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
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
                />
                <div className="text-xs text-blue-600">React state value: "{age}"</div>
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height" className="text-base font-semibold">
                  Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
                </Label>
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={unitSystem === 'metric' ? 'Enter your height in cm' : 'Enter your height in inches'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
                />
              </div>

              {/* Current Weight */}
              <div className="space-y-2">
                <Label htmlFor="currentWeight" className="text-base font-semibold">
                  Current Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </Label>
                <input
                  id="currentWeight"
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder={unitSystem === 'metric' ? 'Enter your current weight in kg' : 'Enter your current weight in pounds'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
                />
              </div>

              {/* Desired Weight */}
              <div className="space-y-2">
                <Label htmlFor="desiredWeight" className="text-base font-semibold">
                  Desired Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </Label>
                <input
                  id="desiredWeight"
                  type="number"
                  value={desiredWeight}
                  onChange={(e) => setDesiredWeight(e.target.value)}
                  placeholder={unitSystem === 'metric' ? 'Enter your desired weight in kg' : 'Enter your desired weight in pounds'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
                />
              </div>

              {/* Activity Level */}
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

              {/* Action Button */}
              <div className="pt-6">
                <Button 
                  onClick={calculateCalories} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="shadow-xl border-0 bg-white backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Your Caloric & Macro Needs
              </CardTitle>
              <CardDescription className="text-green-100">
                Complete the form to see your personalized results
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {results ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Your Results</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={saveResults}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* BMR and TDEE */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-700">{Math.round(results.bmr || 0)}</div>
                      <div className="text-sm text-gray-500">BMR (calories/day)</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-700">{Math.round(results.tdee || 0)}</div>
                      <div className="text-sm text-gray-500">TDEE (calories/day)</div>
                    </div>
                  </div>

                  {/* Daily Target Calories */}
                  <div className="text-center bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{Math.round((results as any).goalCalories || results.calories || 0)}</div>
                    <div className="text-lg text-gray-600">Daily Target Calories</div>
                  </div>

                  {/* Macronutrient Breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Macronutrient Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                        <span className="font-medium text-red-700">Protein</span>
                        <span className="font-bold">{(results as any).protein || results.macros?.protein || 0}g</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="font-medium text-blue-700">Carbohydrates</span>
                        <span className="font-bold">{(results as any).carbs || results.macros?.carbs || 0}g</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                        <span className="font-medium text-yellow-700">Fat</span>
                        <span className="font-bold">{(results as any).fat || results.macros?.fat || 0}g</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {results.weeklyChangeRate && results.timeToGoal && (
                    <div className="space-y-3 bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Progress Timeline</h4>
                      <div className="space-y-2 text-sm">
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
                  )}

                  {/* Additional Metrics */}
                  {results.bodyFatPercentage && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <div className="font-bold text-lg">{results.bodyFatPercentage}%</div>
                        <div className="text-gray-600">Body Fat</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <div className="font-bold text-lg">{results.leanBodyMass}kg</div>
                        <div className="text-gray-600">Lean Mass</div>
                      </div>
                    </div>
                  )}

                  {/* Water Intake */}
                  {results.dailyWaterIntake && (
                    <div className="bg-cyan-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-600">
                        {Math.round(results.dailyWaterIntake / 250)} glasses
                      </div>
                      <div className="text-sm text-cyan-700">
                        Daily Water Intake ({results.dailyWaterIntake}ml)
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-600">Ready to Calculate Your Needs?</h3>
                  <p className="text-gray-500 mb-4">
                    Fill out the form on the left to get your personalized daily caloric intake and macronutrient breakdown.
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