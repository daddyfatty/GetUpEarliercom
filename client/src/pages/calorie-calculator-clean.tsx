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
    carbs: 45,
    protein: 25,
    fat: 30,
    description: "Moderate protein with balanced carbs and fats"
  },
  'high-protein': {
    carbs: 30,
    protein: 40,
    fat: 30,
    description: "High protein for muscle building and weight loss"
  },
  'low-carb': {
    carbs: 20,
    protein: 35,
    fat: 45,
    description: "Low carb for fat loss and metabolic health"
  },
  'keto': {
    carbs: 5,
    protein: 25,
    fat: 70,
    description: "Ketogenic diet for rapid fat loss"
  }
};

export default function CalorieCalculator() {
  const { toast } = useToast();
  
  // Form state
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [desiredWeight, setDesiredWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState([1.2]);
  const [goal, setGoal] = useState('loss');  
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [macroProfile, setMacroProfile] = useState('balanced');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Profile data query
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    retry: false,
  });

  // Calculator results query
  const { data: calculatorResults } = useQuery({
    queryKey: ['/api/calculator-results'],
    retry: false,
  });

  // Load existing profile data and set form defaults
  useEffect(() => {
    if (profileData && !profileLoading && !dataLoaded) {
      const profile = profileData;
      console.log('Profile data structure:', JSON.stringify(profile, null, 2));
      
      console.log('Setting age from', profile.age, 'to state');
      setAge(profile.age?.toString() || '');
      
      console.log('Setting sex from', profile.sex, 'to state');
      setSex(profile.sex || 'male');
      
      console.log('Setting height from', profile.height, 'to state');
      setHeight(profile.height?.toString() || '');
      
      console.log('Setting currentWeight from', profile.currentWeight, 'to state');
      setCurrentWeight(profile.currentWeight?.toString() || '');
      
      console.log('Setting desiredWeight from', profile.desiredWeight, 'to state');
      setDesiredWeight(profile.desiredWeight?.toString() || '');
      
      console.log('Setting activityLevel from', profile.activityLevel, 'to state');
      const activityValue = parseFloat(profile.activityLevel) || 1.2;
      setActivityLevel([activityValue]);
      
      console.log('Setting goal from', profile.goal, 'to state');
      setGoal(profile.goal || 'loss');
      
      console.log('Setting macroProfile from', profile.macroProfile, 'to state');
      setMacroProfile(profile.macroProfile || 'balanced');
      
      console.log('Setting unitSystem from', profile.unitSystem, 'to state');
      setUnitSystem(profile.unitSystem || 'imperial');
      
      console.log('All profile data applied to React state');
      setDataLoaded(true);
      
      // If we have complete profile data but no targetCalories, trigger a calculation
      if (profile.age && profile.height && profile.currentWeight && profile.desiredWeight && !profile.targetCalories) {
        setTimeout(() => {
          // Calculate directly with profile data instead of form state
          calculateCaloriesWithData(
            profile.age.toString(),
            profile.height.toString(),
            profile.currentWeight.toString(),
            profile.desiredWeight.toString()
          );
        }, 100);
      }
    }
  }, [profileData, profileLoading]);

  // Load and display previous calculation results
  useEffect(() => {
    if (calculatorResults && Array.isArray(calculatorResults)) {
      console.log('Raw calculator results:', calculatorResults);
      
      const calorieResults = calculatorResults.filter(r => r.calculatorType === 'calorie');
      if (calorieResults.length > 0) {
        const latestResult = calorieResults[0];
        console.log('Latest calorie result:', latestResult);
        console.log('Setting previous calculation results:', latestResult.results);
        setResults(latestResult.results);
      }
    }
  }, [calculatorResults]);

  const calculateCaloriesWithData = (ageValue: string, heightValue: string, currentWeightValue: string, desiredWeightValue: string) => {
    if (!ageValue || !heightValue || !currentWeightValue || !desiredWeightValue) {
      return;
    }

    const ageNum = parseInt(ageValue);
    const heightNum = parseFloat(heightValue);
    const currentWeightNum = parseFloat(currentWeightValue);
    const desiredWeightNum = parseFloat(desiredWeightValue);

    // Validate all inputs are valid numbers
    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(currentWeightNum) || isNaN(desiredWeightNum)) {
      return;
    }

    if (ageNum < 10 || ageNum > 100) {
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

    if (weightKg <= 0 || heightCm <= 0 || desiredWeightKg <= 0) {
      return;
    }

    const bmr = calculateBMR(weightKg, heightCm, ageNum, sex);
    const tdee = bmr * (activityLevel[0] || 1.2);

    let targetCalories = tdee;
    let weeklyChangeRate = 0;
    let timeToGoal = 0;
    
    if (goal === 'loss') {
      // Convert to pounds for calculation consistency
      const weightToLoseLbs = unitSystem === 'imperial' ? 
        (currentWeightNum - desiredWeightNum) : 
        (weightKg - desiredWeightKg) * 2.20462;
      
      // Safe weight loss: 0.5-2 lbs per week
      // 1 lb = 3500 calories, so 1-2 lbs/week = 500-1000 cal deficit
      let weeklyLossRate;
      if (weightToLoseLbs <= 10) {
        weeklyLossRate = 0.5; // 0.5 lbs/week for small amounts
      } else if (weightToLoseLbs <= 25) {
        weeklyLossRate = 1.0; // 1 lb/week for moderate amounts
      } else {
        weeklyLossRate = 1.5; // 1.5 lbs/week for larger amounts
      }
      
      const deficit = weeklyLossRate * 500; // 500 cal deficit = 1 lb/week
      targetCalories = tdee - deficit;
      
      // Ensure minimum calories for health (1200 for women, 1500 for men)
      const minCalories = sex === 'male' ? 1500 : 1200;
      if (targetCalories < minCalories) {
        targetCalories = minCalories;
        weeklyLossRate = (tdee - targetCalories) / 500;
      }
      
      weeklyChangeRate = -weeklyLossRate;
      timeToGoal = Math.ceil(weightToLoseLbs / weeklyLossRate);
    } else if (goal === 'gain') {
      // Convert to pounds for calculation consistency
      const weightToGainLbs = unitSystem === 'imperial' ? 
        (desiredWeightNum - currentWeightNum) : 
        (desiredWeightKg - weightKg) * 2.20462;
      
      // Healthy weight gain: 0.5-1 lb per week
      const weeklyGainRate = weightToGainLbs > 20 ? 1.0 : 0.5;
      const surplus = weeklyGainRate * 500; // 500 cal surplus = 1 lb/week
      targetCalories = tdee + surplus;
      weeklyChangeRate = weeklyGainRate;
      timeToGoal = Math.ceil(weightToGainLbs / weeklyGainRate);
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
    
    // Auto-save the target calories to profile immediately after calculation
    const profileUpdateData = {
      age: ageNum,
      sex,
      height: heightNum,
      currentWeight: currentWeightNum,
      desiredWeight: desiredWeightNum,
      activityLevel: (activityLevel[0] || 1.2).toString(),
      goal,
      unitSystem,
      macroProfile,
      targetCalories: Math.round(calculationResults.calories)
    };
    
    // Save silently in background
    apiRequest("POST", "/api/user/profile", profileUpdateData)
      .then(() => {
        // Refresh profile cache to show updated target calories
        queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      })
      .catch(console.error);

    // Save calculation results to database with all advanced metrics
    const calculationData = {
      bmr: calculationResults.bmr,
      tdee: calculationResults.tdee,
      goalCalories: calculationResults.calories,
      protein: calculationResults.macros?.protein,
      carbs: calculationResults.macros?.carbs,
      fat: calculationResults.macros?.fat,
      goal: calculationResults.goal,
      activityLevel: (activityLevel[0] || 1.2).toString(),
      weeklyChangeRate: calculationResults.weeklyChangeRate,
      timeToGoal: calculationResults.timeToGoal,
      bodyFatPercentage: calculationResults.bodyFatPercentage,
      leanBodyMass: calculationResults.leanBodyMass,
      dailyWaterIntake: calculationResults.dailyWaterIntake,
      mealTiming: calculationResults.mealTiming,
      supplementSuggestions: calculationResults.supplementSuggestions,
      calculatedAt: new Date().toISOString(),
    };

    const userInputs = {
      age: ageValue,
      sex,
      height: heightValue,
      currentWeight: currentWeightValue,
      desiredWeight: desiredWeightValue,
      activityLevel: (activityLevel[0] || 1.2).toString(),
      goal,
      unitSystem,
      macroProfile
    };

    // Save calculation result to database for history
    apiRequest("POST", "/api/calculator-results", {
      calculatorType: 'calorie',
      results: calculationResults, // Save complete results object with all metrics
      userInputs
    })
    .then(() => {
      console.log('Calculation saved successfully');
      // Refresh the calculator results cache
      queryClient.invalidateQueries({ queryKey: ['/api/calculator-results'] });
    })
    .catch(error => {
      console.error('Error saving calculation:', error);
    });
  };

  const calculateBMR = (weightKg: number, heightCm: number, ageYears: number, sex: 'male' | 'female'): number => {
    if (sex === 'male') {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + 5;
    } else {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;
    }
  };

  const calculateAdvancedMetrics = (weightKg: number, heightCm: number, age: number, sex: 'male' | 'female', calories: number) => {
    // Body fat estimation using Navy method (simplified)
    let bodyFatPercentage;
    if (sex === 'male') {
      bodyFatPercentage = 86.010 * Math.log10(100 - 78) - 70.041 * Math.log10(heightCm) + 36.76;
    } else {
      bodyFatPercentage = 163.205 * Math.log10(100 + 78 - 63) - 97.684 * Math.log10(heightCm) - 78.387 * Math.log10(63) + 4.786;
    }
    bodyFatPercentage = Math.max(5, Math.min(50, bodyFatPercentage));

    const leanBodyMass = weightKg * (1 - bodyFatPercentage / 100);
    const dailyWaterIntake = Math.round(weightKg * 35); // ml per kg bodyweight

    const mealTiming = {
      breakfast: Math.round(calories * 0.25),
      lunch: Math.round(calories * 0.35),
      dinner: Math.round(calories * 0.30),
      snacks: Math.round(calories * 0.10)
    };

    const supplementSuggestions = [
      "Whey Protein Powder",
      "Creatine Monohydrate", 
      "Omega-3 Fish Oil",
      "Vitamin D3",
      "Magnesium"
    ];

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

    calculateCaloriesWithData(age, height, currentWeight, desiredWeight);
  };

  const getActivityLevelDescription = (level: number) => {
    if (level <= 1.2) return "Sedentary (little/no exercise)";
    if (level <= 1.375) return "Lightly active (light exercise 1-3 days/week)";
    if (level <= 1.55) return "Moderately active (moderate exercise 3-5 days/week)";
    if (level <= 1.725) return "Very active (hard exercise 6-7 days/week)";
    return "Super active (very hard exercise, physical job)";
  };

  if (profileLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <LoaderCircle className="w-6 h-6 animate-spin" />
          <span>Loading your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Daily Calorie Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Calculate your daily calorie needs and macro breakdown with personalized recommendations based on your goals
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Enter your basic information to calculate your calorie needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Sex</Label>
                  <RadioGroup value={sex} onValueChange={setSex} className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <Label>Unit System</Label>
                <Select value={unitSystem} onValueChange={setUnitSystem}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
                    <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">
                    Height ({unitSystem === 'imperial' ? 'inches' : 'cm'})
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder={unitSystem === 'imperial' ? '70' : '178'}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currentWeight">
                    Current Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})
                  </Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    placeholder={unitSystem === 'imperial' ? '150' : '68'}
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="desiredWeight">
                  Desired Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})
                </Label>
                <Input
                  id="desiredWeight"
                  type="number"
                  placeholder={unitSystem === 'imperial' ? '140' : '63'}
                  value={desiredWeight}
                  onChange={(e) => setDesiredWeight(e.target.value)}
                />
              </div>

              <div>
                <Label>Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loss">Weight Loss</SelectItem>
                    <SelectItem value="maintenance">Maintain Weight</SelectItem>
                    <SelectItem value="gain">Weight Gain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Activity Level: {getActivityLevelDescription(activityLevel[0])}</Label>
                <Slider
                  value={activityLevel}
                  onValueChange={setActivityLevel}
                  max={1.9}
                  min={1.2}
                  step={0.125}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Sedentary</span>
                  <span>Super Active</span>
                </div>
              </div>

              <div>
                <Label>Macro Profile</Label>
                <Select value={macroProfile} onValueChange={setMacroProfile}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(macroProfiles).map(([key, profile]) => (
                      <SelectItem key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')} ({profile.carbs}% Carbs/{profile.protein}% Protein/{profile.fat}% Fat)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  {macroProfiles[macroProfile]?.description}
                </p>
              </div>

              <Button onClick={calculateCalories} className="w-full" size="lg">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Calories
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          {results && (
            <Card className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-600">Your Results</CardTitle>
                <CardDescription>
                  Daily calorie and macro recommendations based on your goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{results.bmr}</div>
                    <div className="text-sm text-gray-600">BMR (calories)</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{results.tdee}</div>
                    <div className="text-sm text-gray-600">TDEE (calories)</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {results.goalCalories || results.calories}
                  </div>
                  <div className="text-lg text-gray-700">Daily Calorie Target</div>
                  {results.weeklyChangeRate && (
                    <div className="text-sm text-gray-600 mt-1">
                      {results.weeklyChangeRate > 0 ? '+' : ''}{results.weeklyChangeRate} lbs/week
                    </div>
                  )}
                </div>

                {results.macros && (
                  <div>
                    <h3 className="font-semibold mb-3">Daily Macronutrients</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-yellow-600">{results.macros.carbs}g</div>
                        <div className="text-sm text-gray-600">Carbs</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-red-600">{results.macros.protein}g</div>
                        <div className="text-sm text-gray-600">Protein</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-orange-600">{results.macros.fat}g</div>
                        <div className="text-sm text-gray-600">Fat</div>
                      </div>
                    </div>
                  </div>
                )}

                {results.timeToGoal && results.timeToGoal > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-700 mb-1">Estimated Timeline</h3>
                    <p className="text-blue-600">
                      Approximately {results.timeToGoal} weeks to reach your goal
                    </p>
                  </div>
                )}

                {results.bodyFatPercentage && (
                  <div>
                    <h3 className="font-semibold mb-3">Body Composition</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-lg font-bold">{results.bodyFatPercentage}%</div>
                        <div className="text-sm text-gray-600">Est. Body Fat</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-lg font-bold">{results.leanBodyMass}kg</div>
                        <div className="text-sm text-gray-600">Lean Mass</div>
                      </div>
                    </div>
                  </div>
                )}




              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}