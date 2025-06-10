import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Calculator, Target, Activity, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
}

export default function CalorieCalculator() {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [desiredWeight, setDesiredWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [macroRatio, setMacroRatio] = useState('balanced');
  const [results, setResults] = useState<CalculationResults | null>(null);

  const activityLevels = [
    { value: 'sedentary', label: 'Desk Job + No Working Out (Sedentary)', multiplier: 1.2 },
    { value: 'lightly_active', label: 'Desk Job + A Few Workouts a Week (Lightly Active)', multiplier: 1.375 },
    { value: 'moderately_active', label: 'Desk Job + Strength Training (Moderately Active)', multiplier: 1.55 },
    { value: 'very_active', label: 'Active Job (Very Active)', multiplier: 1.725 },
  ];

  const macroRatios = {
    balanced: { carbs: 50, protein: 20, fat: 30, name: 'Balanced (50% carbs, 20% protein, 30% fat)' },
    high_protein: { carbs: 40, protein: 30, fat: 30, name: 'High Protein (40% carbs, 30% protein, 30% fat)' },
    low_carb: { carbs: 25, protein: 35, fat: 40, name: 'Low Carb (25% carbs, 35% protein, 40% fat)' },
    athletic: { carbs: 55, protein: 25, fat: 20, name: 'Athletic (55% carbs, 25% protein, 20% fat)' }
  };

  const calculateCalories = () => {
    if (!age || !height || !currentWeight || !desiredWeight || !activityLevel) {
      return;
    }

    const ageNum = parseInt(age);
    let heightCm = parseFloat(height);
    let currentWeightKg = parseFloat(currentWeight);
    let desiredWeightKg = parseFloat(desiredWeight);

    // Convert imperial to metric if needed
    if (unitSystem === 'imperial') {
      heightCm = heightCm * 2.54; // inches to cm
      currentWeightKg = currentWeightKg * 0.453592; // lbs to kg
      desiredWeightKg = desiredWeightKg * 0.453592; // lbs to kg
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (sex === 'male') {
      bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    // Calculate TDEE
    const activityMultiplier = activityLevels.find(level => level.value === activityLevel)?.multiplier || 1.2;
    const tdee = bmr * activityMultiplier;

    // Determine goal and adjust calories
    let goal: 'maintenance' | 'loss' | 'gain';
    let calories: number;

    if (desiredWeightKg < currentWeightKg) {
      goal = 'loss';
      calories = tdee - 500; // 500 calorie deficit for 1 lb/week loss
    } else if (desiredWeightKg > currentWeightKg) {
      goal = 'gain';
      calories = tdee + 300; // 300 calorie surplus for lean gain
    } else {
      goal = 'maintenance';
      calories = tdee;
    }

    // Calculate macros
    const selectedRatio = macroRatios[macroRatio as keyof typeof macroRatios];
    const carbCalories = calories * (selectedRatio.carbs / 100);
    const proteinCalories = calories * (selectedRatio.protein / 100);
    const fatCalories = calories * (selectedRatio.fat / 100);

    const macros = {
      carbs: Math.round(carbCalories / 4), // 4 calories per gram
      protein: Math.round(proteinCalories / 4), // 4 calories per gram
      fat: Math.round(fatCalories / 9), // 9 calories per gram
    };

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(calories),
      macros,
      goal
    });
  };

  const getGoalDescription = (goal: string) => {
    switch (goal) {
      case 'loss':
        return 'Weight Loss - 500 calorie deficit for ~1 lb/week loss';
      case 'gain':
        return 'Weight Gain - 300 calorie surplus for lean muscle gain';
      default:
        return 'Weight Maintenance - Calories to maintain current weight';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-orange-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Calculator className="h-10 w-10 text-orange-400" />
            Daily Caloric Intake & Macro Calculator
          </h1>
          <p className="text-gray-200 text-lg">
            Calculate your daily caloric needs and optimal macronutrient distribution
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-400" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter your details to calculate your caloric needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Unit System */}
              <div className="space-y-3">
                <Label className="text-white">Unit System</Label>
                <RadioGroup value={unitSystem} onValueChange={(value: 'metric' | 'imperial') => setUnitSystem(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imperial" id="imperial" />
                    <Label htmlFor="imperial" className="text-gray-200">Imperial (lbs, inches)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metric" id="metric" />
                    <Label htmlFor="metric" className="text-gray-200">Metric (kg, cm)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Sex */}
              <div className="space-y-3">
                <Label className="text-white">Sex</Label>
                <Select value={sex} onValueChange={(value: 'male' | 'female') => setSex(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age */}
              <div className="space-y-3">
                <Label htmlFor="age" className="text-white">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Height */}
              <div className="space-y-3">
                <Label htmlFor="height" className="text-white">
                  Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={`Enter height in ${unitSystem === 'metric' ? 'centimeters' : 'inches'}`}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Current Weight */}
              <div className="space-y-3">
                <Label htmlFor="current-weight" className="text-white">
                  Current Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </Label>
                <Input
                  id="current-weight"
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder={`Enter current weight in ${unitSystem === 'metric' ? 'kilograms' : 'pounds'}`}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Desired Weight */}
              <div className="space-y-3">
                <Label htmlFor="desired-weight" className="text-white">
                  Desired Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </Label>
                <Input
                  id="desired-weight"
                  type="number"
                  value={desiredWeight}
                  onChange={(e) => setDesiredWeight(e.target.value)}
                  placeholder={`Enter desired weight in ${unitSystem === 'metric' ? 'kilograms' : 'pounds'}`}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-3">
                <Label className="text-white flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity Level
                </Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Macro Ratio */}
              <div className="space-y-3">
                <Label className="text-white">Macronutrient Ratio</Label>
                <Select value={macroRatio} onValueChange={setMacroRatio}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(macroRatios).map(([key, ratio]) => (
                      <SelectItem key={key} value={key}>
                        {ratio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateCalories} 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!age || !height || !currentWeight || !desiredWeight || !activityLevel}
              >
                Calculate Daily Intake
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {results && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Your Results</CardTitle>
                  <CardDescription className="text-gray-300">
                    {getGoalDescription(results.goal)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-500/20 p-4 rounded-lg">
                      <p className="text-blue-200 text-sm">BMR</p>
                      <p className="text-white text-2xl font-bold">{results.bmr}</p>
                      <p className="text-blue-200 text-xs">calories/day</p>
                    </div>
                    <div className="bg-green-500/20 p-4 rounded-lg">
                      <p className="text-green-200 text-sm">TDEE</p>
                      <p className="text-white text-2xl font-bold">{results.tdee}</p>
                      <p className="text-green-200 text-xs">calories/day</p>
                    </div>
                  </div>

                  <div className="bg-orange-500/20 p-4 rounded-lg">
                    <p className="text-orange-200 text-sm">Daily Caloric Intake</p>
                    <p className="text-white text-3xl font-bold">{results.calories}</p>
                    <p className="text-orange-200 text-xs">calories/day</p>
                  </div>

                  <Separator className="bg-white/20" />

                  <div>
                    <h4 className="text-white font-semibold mb-3">Daily Macronutrients</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-red-500/20 p-3 rounded-lg text-center">
                        <p className="text-red-200 text-sm">Carbs</p>
                        <p className="text-white text-xl font-bold">{results.macros.carbs}g</p>
                      </div>
                      <div className="bg-yellow-500/20 p-3 rounded-lg text-center">
                        <p className="text-yellow-200 text-sm">Protein</p>
                        <p className="text-white text-xl font-bold">{results.macros.protein}g</p>
                      </div>
                      <div className="bg-purple-500/20 p-3 rounded-lg text-center">
                        <p className="text-purple-200 text-sm">Fat</p>
                        <p className="text-white text-xl font-bold">{results.macros.fat}g</p>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-blue-500/20 border-blue-500/50">
                    <Info className="h-4 w-4 text-blue-300" />
                    <AlertDescription className="text-blue-200">
                      <strong>Your inputs:</strong> {sex === 'male' ? 'Male' : 'Female'}, {age} years old, 
                      {height}{unitSystem === 'metric' ? 'cm' : '"'} tall, 
                      {currentWeight}{unitSystem === 'metric' ? 'kg' : 'lbs'} → {desiredWeight}{unitSystem === 'metric' ? 'kg' : 'lbs'}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-400" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-gray-300 space-y-2 text-sm">
                  <p>• These calculations are estimates based on the Mifflin-St Jeor equation</p>
                  <p>• Individual metabolic rates can vary by ±10-15%</p>
                  <p>• For weight loss: 500 calorie deficit = ~1 lb/week</p>
                  <p>• For weight gain: 300 calorie surplus for lean muscle gain</p>
                  <p>• Monitor your progress and adjust as needed</p>
                  <p>• Consult a healthcare professional for personalized advice</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}