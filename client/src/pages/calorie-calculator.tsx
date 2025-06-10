import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Calculator, Activity, Target, Utensils, Info } from "lucide-react";

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
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [desiredWeight, setDesiredWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<number[]>([1.2]);
  const [goal, setGoal] = useState<'maintenance' | 'loss' | 'gain'>('maintenance');
  const [macroProfile, setMacroProfile] = useState<'balanced' | 'high-protein' | 'moderate-protein' | 'high-carb' | 'custom'>('balanced');
  const [proteinMultiplier, setProteinMultiplier] = useState<number[]>([1.0]);
  const [results, setResults] = useState<CalculationResults | null>(null);

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
    'high-protein': { carbs: 15, protein: 70, fat: 15 },
    'high-carb': { carbs: 70, protein: 15, fat: 15 },
    custom: { carbs: 0, protein: 0, fat: 0 } // Will be calculated dynamically
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

    let macros;
    
    if (macroProfile === 'custom') {
      // Calculate protein based on weight and multiplier (1g per lb baseline)
      const targetWeightLbs = unitSystem === 'imperial' ? desiredWeightNum : desiredWeightKg * 2.20462;
      const proteinGrams = Math.round(targetWeightLbs * proteinMultiplier[0]);
      const proteinCalories = proteinGrams * 4;
      
      // Ensure protein doesn't exceed total calories
      const maxProteinCalories = targetCalories * 0.4; // Cap at 40% of calories
      const finalProteinCalories = Math.min(proteinCalories, maxProteinCalories);
      const finalProteinGrams = Math.round(finalProteinCalories / 4);
      
      // Distribute remaining calories between carbs and fat (60% carbs, 40% fat of remaining)
      const remainingCalories = targetCalories - finalProteinCalories;
      const carbCalories = remainingCalories * 0.6;
      const fatCalories = remainingCalories * 0.4;
      
      macros = {
        carbs: Math.round(carbCalories / 4),
        protein: finalProteinGrams,
        fat: Math.round(fatCalories / 9)
      };
    } else {
      // Use predefined macro profiles
      const profile = macroProfiles[macroProfile];
      const carbCalories = targetCalories * (profile.carbs / 100);
      const proteinCalories = targetCalories * (profile.protein / 100);
      const fatCalories = targetCalories * (profile.fat / 100);

      macros = {
        carbs: Math.round(carbCalories / 4),
        protein: Math.round(proteinCalories / 4),
        fat: Math.round(fatCalories / 9)
      };
    }

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
        return 'High Protein (70% protein) - Ideal for muscle building';
      case 'moderate-protein':
        return 'Moderate Protein (40% protein) - Balanced approach';
      case 'high-carb':
        return 'Carb Loading (70% carbs) - For endurance training';
      case 'custom':
        return 'Weight-Based Protein - Protein based on body weight multiplier';
      default:
        return 'Balanced (50% carbs, 20% protein, 30% fat)';
    }
  };

  const getProteinMultiplierDescription = (multiplier: number) => {
    if (multiplier <= 0.8) return 'Low protein (sedentary lifestyle)';
    if (multiplier <= 1.0) return 'Baseline (1g per lb - maintenance)';
    if (multiplier <= 1.2) return 'Moderate (light training)';
    if (multiplier <= 1.5) return 'High (regular training)';
    if (multiplier <= 1.8) return 'Very High (intense training)';
    return 'Maximum (competitive athletes)';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
            Daily Caloric Intake & Macro Calculator
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Calculate your daily caloric needs and macronutrient requirements based on your personal details, 
            activity level, and fitness goals with support for both Metric and Imperial units.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calculator className="h-6 w-6" />
                Personal Details
              </CardTitle>
              <CardDescription className="text-orange-100">
                Enter your information to calculate your daily caloric needs
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Unit System Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800">Unit System</Label>
                <RadioGroup 
                  value={unitSystem} 
                  onValueChange={(value: 'metric' | 'imperial') => setUnitSystem(value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imperial" id="imperial" />
                    <Label htmlFor="imperial">Imperial (lb, inches)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metric" id="metric" />
                    <Label htmlFor="metric">Metric (kg, cm)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Sex Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800">Sex</Label>
                <Select value={sex} onValueChange={(value: 'male' | 'female') => setSex(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age */}
              <div className="space-y-3">
                <Label htmlFor="age" className="text-lg font-semibold text-gray-800">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Height */}
              <div className="space-y-3">
                <Label htmlFor="height" className="text-lg font-semibold text-gray-800">
                  Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder={`Enter your height in ${unitSystem === 'metric' ? 'centimeters' : 'inches'}`}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Current Weight */}
              <div className="space-y-3">
                <Label htmlFor="currentWeight" className="text-lg font-semibold text-gray-800">
                  Current Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </Label>
                <Input
                  id="currentWeight"
                  type="number"
                  placeholder={`Enter your current weight in ${unitSystem === 'metric' ? 'kilograms' : 'pounds'}`}
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Desired Weight */}
              <div className="space-y-3">
                <Label htmlFor="desiredWeight" className="text-lg font-semibold text-gray-800">
                  Desired Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </Label>
                <Input
                  id="desiredWeight"
                  type="number"
                  placeholder={`Enter your desired weight in ${unitSystem === 'metric' ? 'kilograms' : 'pounds'}`}
                  value={desiredWeight}
                  onChange={(e) => setDesiredWeight(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Activity Level Slider */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Level
                </Label>
                <div className="px-3">
                  <Slider
                    value={activityLevel}
                    onValueChange={setActivityLevel}
                    max={1.9}
                    min={1.2}
                    step={0.001}
                    className="w-full"
                  />
                  <div className="mt-2 text-center">
                    <span className="text-sm font-medium text-gray-600">
                      {activityDescriptions[getActivityLevelValue(activityLevel[0]) as keyof typeof activityDescriptions]}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Multiplier: {activityLevel[0].toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goal
                </Label>
                <Select value={goal} onValueChange={(value: 'maintenance' | 'loss' | 'gain') => setGoal(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                    <SelectItem value="loss">Weight Loss</SelectItem>
                    <SelectItem value="gain">Weight Gain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Macro Profile Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Macro Profile
                </Label>
                <Select value={macroProfile} onValueChange={(value: 'balanced' | 'high-protein' | 'moderate-protein' | 'high-carb' | 'custom') => setMacroProfile(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select macro profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="moderate-protein">Moderate Protein</SelectItem>
                    <SelectItem value="high-protein">High Protein</SelectItem>
                    <SelectItem value="high-carb">Carb Loading</SelectItem>
                    <SelectItem value="custom">Weight-Based Protein</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  <Info className="h-4 w-4 inline mr-2" />
                  {getMacroProfileDescription(macroProfile)}
                </div>
              </div>

              {/* Protein Multiplier Slider - Only show when custom profile is selected */}
              {macroProfile === 'custom' && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Protein per Body Weight
                  </Label>
                  <div className="px-3">
                    <Slider
                      value={proteinMultiplier}
                      onValueChange={setProteinMultiplier}
                      max={2.0}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="mt-2 text-center">
                      <span className="text-sm font-medium text-gray-600">
                        {getProteinMultiplierDescription(proteinMultiplier[0])}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {proteinMultiplier[0].toFixed(1)}g protein per lb of desired weight
                      </div>
                      {desiredWeight && (
                        <div className="text-xs text-blue-600 mt-1">
                          Target: {Math.round(parseFloat(desiredWeight) * (unitSystem === 'imperial' ? 1 : 2.20462) * proteinMultiplier[0])}g protein daily
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleCalculate} 
                className="w-full text-lg py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                disabled={!age || !height || !currentWeight || !desiredWeight}
              >
                Calculate My Daily Needs
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Your Caloric & Macro Needs</CardTitle>
                <CardDescription className="text-green-100">
                  Based on your personal details and {getGoalDescription(results.goal).toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{results.bmr}</div>
                      <div className="text-sm text-blue-500">BMR (calories/day)</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{results.tdee}</div>
                      <div className="text-sm text-green-500">TDEE (calories/day)</div>
                    </div>
                  </div>

                  {/* Target Calories */}
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-lg border border-orange-200">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 mb-2">{results.calories}</div>
                      <div className="text-lg text-gray-700">Daily Calories for {getGoalDescription(results.goal)}</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Macronutrient Breakdown */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      Daily Macronutrient Targets
                    </h3>
                    
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      Profile: {getMacroProfileDescription(results.macroProfile)}
                    </div>

                    <div className="grid gap-4">
                      {/* Carbohydrates */}
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800">Carbohydrates</div>
                            <div className="text-sm text-gray-600">
                              {results.macroProfile === 'custom' 
                                ? `${Math.round((results.macros.carbs * 4 / results.calories) * 100)}% of calories`
                                : `${macroProfiles[results.macroProfile as keyof typeof macroProfiles].carbs}% of calories`
                              }
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-yellow-600">{results.macros.carbs}g</div>
                            <div className="text-sm text-yellow-500">per day</div>
                          </div>
                        </div>
                      </div>

                      {/* Protein */}
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800">Protein</div>
                            <div className="text-sm text-gray-600">
                              {results.macroProfile === 'custom' 
                                ? `${Math.round((results.macros.protein * 4 / results.calories) * 100)}% of calories`
                                : `${macroProfiles[results.macroProfile as keyof typeof macroProfiles].protein}% of calories`
                              }
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">{results.macros.protein}g</div>
                            <div className="text-sm text-red-500">per day</div>
                          </div>
                        </div>
                      </div>

                      {/* Fat */}
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800">Fat</div>
                            <div className="text-sm text-gray-600">
                              {results.macroProfile === 'custom' 
                                ? `${Math.round((results.macros.fat * 9 / results.calories) * 100)}% of calories`
                                : `${macroProfiles[results.macroProfile as keyof typeof macroProfiles].fat}% of calories`
                              }
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">{results.macros.fat}g</div>
                            <div className="text-sm text-purple-500">per day</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Tips for {getGoalDescription(results.goal)}</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      {results.goal === 'loss' && (
                        <>
                          <p>• Aim for gradual weight loss of 1-2 lbs per week</p>
                          <p>• Focus on whole foods and adequate protein to preserve muscle</p>
                          <p>• Stay hydrated and maintain consistent exercise</p>
                        </>
                      )}
                      {results.goal === 'gain' && (
                        <>
                          <p>• Combine calorie surplus with resistance training</p>
                          <p>• Eat frequent, nutrient-dense meals</p>
                          <p>• Monitor weight gain to ensure it's primarily muscle</p>
                        </>
                      )}
                      {results.goal === 'maintenance' && (
                        <>
                          <p>• Focus on balanced nutrition and consistent habits</p>
                          <p>• Adjust calories based on activity level changes</p>
                          <p>• Monitor weight trends over time, not daily fluctuations</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}