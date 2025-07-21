import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Beer, Wine, Scale, TrendingUp, Save, AlertTriangle, Activity, Target, Calendar, Heart, BarChart3, Flame, Calculator } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AlcoholCalculator() {
  const [beerCount, setBeerCount] = useState(0);
  const [wineCount, setWineCount] = useState(0);
  const [wineServing, setWineServing] = useState("quarter"); // quarter, half, full
  const [spiritsCount, setSpiritsCount] = useState(0);
  const [cocktailCount, setCocktailCount] = useState(0);
  const [currentWeight, setCurrentWeight] = useState("");
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  const [activityLevel, setActivityLevel] = useState("moderate");

  const [dataLoaded, setDataLoaded] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Load existing calculator results
  const { data: calculatorResults } = useQuery({
    queryKey: ['/api/calculator-results'],
    enabled: isAuthenticated
  });

  // Enhanced nutrition data
  const BEER_CALORIES = 153;
  const BEER_CARBS = 12.6;
  const BEER_PROTEIN = 1.6;

  const WINE_CALORIES_PER_BOTTLE = 615;
  const WINE_CARBS_PER_BOTTLE = 20;

  const SPIRITS_CALORIES = 97; // per 1.5 oz shot
  const COCKTAIL_CALORIES = 250; // average mixed drink

  const getWineCalories = () => {
    switch (wineServing) {
      case "quarter": return 154; // 1/4 bottle (5 oz glass)
      case "half": return 308;    // 1/2 bottle (10 oz)
      case "full": return 615;    // full bottle (25 oz)
      default: return 154;
    }
  };

  const getWineCarbs = () => {
    switch (wineServing) {
      case "quarter": return 5;   // 1/4 of 20g
      case "half": return 10;     // 1/2 of 20g
      case "full": return 20;     // full bottle
      default: return 5;
    }
  };

  // Calculate totals
  const totalCalories = (beerCount * BEER_CALORIES) + (wineCount * getWineCalories()) + 
                       (spiritsCount * SPIRITS_CALORIES) + (cocktailCount * COCKTAIL_CALORIES);
  const totalCarbs = (beerCount * BEER_CARBS) + (wineCount * getWineCarbs());
  const totalProtein = beerCount * BEER_PROTEIN;

  // Weight gain calculations (3500 calories = 1 lb)
  const weeklyWeightGain = totalCalories / 3500;
  const monthlyWeightGain = weeklyWeightGain * 4.33;
  const yearlyWeightGain = weeklyWeightGain * 52;

  // Calculate metabolic impact
  const getMetabolicImpact = () => {
    if (totalCalories < 500) return { level: "low", color: "green", description: "Minimal impact on weight goals" };
    if (totalCalories < 1000) return { level: "moderate", color: "yellow", description: "Moderate impact - monitor intake" };
    if (totalCalories < 2000) return { level: "high", color: "orange", description: "High impact - consider reducing" };
    return { level: "very-high", color: "red", description: "Very high impact - significant weight gain risk" };
  };

  const metabolicImpact = getMetabolicImpact();

  // Load saved calculator data on mount
  useEffect(() => {
    if (calculatorResults && Array.isArray(calculatorResults) && calculatorResults.length > 0 && !dataLoaded) {
      // Find the most recent alcohol calculator result
      const alcoholResults = calculatorResults
        .filter((result: any) => result.calculatorType === 'alcohol')
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (alcoholResults.length > 0) {
        const mostRecent = alcoholResults[0];
        try {
          const userInputs = typeof mostRecent.userInputs === 'string' 
            ? JSON.parse(mostRecent.userInputs) 
            : mostRecent.userInputs;
          
          console.log("Loading last alcohol calculation inputs:", userInputs);
          
          setBeerCount(userInputs.beer || 0);
          setWineCount(userInputs.wine || 0);
          setWineServing(userInputs.wineServing || "quarter");
          setSpiritsCount(userInputs.spirits || 0);
          setCocktailCount(userInputs.cocktails || 0);
          if (userInputs.currentWeight) setCurrentWeight(userInputs.currentWeight.toString());
          if (userInputs.unitSystem) setUnitSystem(userInputs.unitSystem);
          if (userInputs.activityLevel) setActivityLevel(userInputs.activityLevel);
          
          setDataLoaded(true);
          console.log("Loaded last alcohol calculation data successfully");
        } catch (error) {
          console.log("Error loading saved alcohol calculation data:", error);
        }
      }
    }
  }, [calculatorResults, dataLoaded]);

  // Auto-save profile data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && (beerCount > 0 || wineCount > 0 || spiritsCount > 0 || cocktailCount > 0)) {
      const autoSaveProfile = async () => {
        try {
          const profileData = {
            weeklyAlcoholConsumption: {
              beer: beerCount,
              wine: wineCount,
              wineServing,
              spirits: spiritsCount,
              cocktails: cocktailCount,
              totalCalories,
              calculatedAt: new Date()
            }
          };
          
          await apiRequest("POST", "/api/user/profile", profileData);
        } catch (error) {
          console.log("Auto-save failed:", error);
        }
      };
      
      // Debounce the auto-save
      const timeoutId = setTimeout(autoSaveProfile, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, beerCount, wineCount, wineServing, spiritsCount, cocktailCount, totalCalories]);

  const saveResultMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/calculator-results", {
        calculatorType: "alcohol",
        userInputs: JSON.stringify({
          beer: beerCount,
          wine: wineCount,
          wineServing,
          spirits: spiritsCount,
          cocktails: cocktailCount,
          currentWeight: currentWeight,
          unitSystem: unitSystem,
          activityLevel: activityLevel
        }),
        results: JSON.stringify({
          totalCalories,
          totalCarbs,
          totalProtein,
          weeklyGain: weeklyWeightGain,
          monthlyGain: monthlyWeightGain,
          yearlyGain: yearlyWeightGain,
          weeklyCalories: totalCalories,
          metabolicImpact: metabolicImpact.level,
          breakdown: {
            beer: { count: beerCount, calories: beerCount * BEER_CALORIES },
            wine: { count: wineCount, serving: wineServing, calories: wineCount * getWineCalories() },
            spirits: { count: spiritsCount, calories: spiritsCount * SPIRITS_CALORIES },
            cocktails: { count: cocktailCount, calories: cocktailCount * COCKTAIL_CALORIES }
          }
        })
      });
    },
    onSuccess: () => {
      // Invalidate calculator results cache to refresh profile display
      queryClient.invalidateQueries({ queryKey: ['/api/calculator-results'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      
      toast({
        title: "Results Saved",
        description: "Your alcohol calculator results have been saved to your profile.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Unable to save results. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetCalculator = () => {
    setBeerCount(0);
    setWineCount(0);
    setWineServing("quarter");
    setSpiritsCount(0);
    setCocktailCount(0);
  };

  const saveResults = () => {
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

    if (totalCalories > 0) {
      saveResultMutation.mutate();
    } else {
      toast({
        title: "No Data to Save",
        description: "Please enter some alcohol consumption data first.",
        variant: "destructive",
      });
    }
  };



  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Form - Spans 2 columns */}
        <div className="xl:col-span-2 space-y-6">
          {/* Alcohol Consumption Card */}
          <Card className="shadow-lg border-0 bg-[#d5dde5] dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Beer className="h-5 w-5" />
                Weekly Alcohol Consumption
              </CardTitle>
              <CardDescription className="text-blue-100">
                Enter your typical weekly alcohol intake for accurate calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Beer Input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Beer className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Beer</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beer-count" className="text-base font-medium">12 oz cans/bottles per week</Label>
                    <Input
                      id="beer-count"
                      type="number"
                      min="0"
                      value={beerCount}
                      onChange={(e) => setBeerCount(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="0"
                      className="text-base"
                    />
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Per beer: {BEER_CALORIES} calories, {BEER_CARBS}g carbs, {BEER_PROTEIN}g protein
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wine Input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wine className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wine</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="wine-count" className="text-base font-medium">Number of servings per week</Label>
                      <Input
                        id="wine-count"
                        type="number"
                        min="0"
                        value={wineCount}
                        onChange={(e) => setWineCount(Math.max(0, parseInt(e.target.value) || 0))}
                        placeholder="0"
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Serving size</Label>
                      <Select value={wineServing} onValueChange={setWineServing}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quarter">Glass 5 oz - 154 cal</SelectItem>
                          <SelectItem value="half">1/2 Bottle - 308 cal</SelectItem>
                          <SelectItem value="full">Bottle - 615 cal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        Per serving: {getWineCalories()} calories, {getWineCarbs()}g carbs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spirits Input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spirits</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spirits-count" className="text-base font-medium">1.5 oz shots per week</Label>
                    <Input
                      id="spirits-count"
                      type="number"
                      min="0"
                      value={spiritsCount}
                      onChange={(e) => setSpiritsCount(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="0"
                      className="text-base"
                    />
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Per shot: {SPIRITS_CALORIES} calories (vodka, whiskey, rum, etc.)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cocktails Input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-pink-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mixed Drinks</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cocktail-count" className="text-base font-medium">Cocktails/mixed drinks per week</Label>
                    <Input
                      id="cocktail-count"
                      type="number"
                      min="0"
                      value={cocktailCount}
                      onChange={(e) => setCocktailCount(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="0"
                      className="text-base"
                    />
                    <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
                      <p className="text-sm text-pink-800 dark:text-pink-200">
                        Per cocktail: ~{COCKTAIL_CALORIES} calories (margarita, cosmopolitan, etc.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>



              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <Button 
                  onClick={resetCalculator} 
                  variant="outline" 
                  className="flex-1"
                  size="lg"
                >
                  Reset
                </Button>
                <Button 
                  onClick={saveResults}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={saveResultMutation.isPending}
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isAuthenticated ? "Save Results" : "Sign Up to Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-1">
          <Card className="shadow-lg border-0 bg-[#d5dde5] dark:bg-gray-800 sticky top-8">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Impact Analysis
              </CardTitle>
              <CardDescription className="text-blue-100">
                Weekly alcohol consumption impact on weight goals
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {totalCalories > 0 ? (
                <div className="space-y-6">
                  {/* Total Calories */}
                  <div className={`bg-gradient-to-r p-6 rounded-lg text-center ${
                    metabolicImpact.color === 'green' ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' :
                    metabolicImpact.color === 'yellow' ? 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20' :
                    metabolicImpact.color === 'orange' ? 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20' :
                    'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20'
                  }`}>
                    <div className="flex items-center justify-center mb-3">
                      <Flame className={`h-6 w-6 ${
                        metabolicImpact.color === 'green' ? 'text-green-600' :
                        metabolicImpact.color === 'yellow' ? 'text-yellow-600' :
                        metabolicImpact.color === 'orange' ? 'text-orange-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <h3 className={`font-semibold mb-2 ${
                      metabolicImpact.color === 'green' ? 'text-green-900 dark:text-green-100' :
                      metabolicImpact.color === 'yellow' ? 'text-yellow-900 dark:text-yellow-100' :
                      metabolicImpact.color === 'orange' ? 'text-orange-900 dark:text-orange-100' :
                      'text-red-900 dark:text-red-100'
                    }`}>
                      Weekly Total
                    </h3>
                    <p className={`text-4xl font-bold mb-2 ${
                      metabolicImpact.color === 'green' ? 'text-green-800 dark:text-green-200' :
                      metabolicImpact.color === 'yellow' ? 'text-yellow-800 dark:text-yellow-200' :
                      metabolicImpact.color === 'orange' ? 'text-orange-800 dark:text-orange-200' :
                      'text-red-800 dark:text-red-200'
                    }`}>
                      {totalCalories.toLocaleString()}
                    </p>
                    <p className={`text-sm ${
                      metabolicImpact.color === 'green' ? 'text-green-600 dark:text-green-300' :
                      metabolicImpact.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-300' :
                      metabolicImpact.color === 'orange' ? 'text-orange-600 dark:text-orange-300' :
                      'text-red-600 dark:text-red-300'
                    }`}>
                      calories from alcohol
                    </p>
                  </div>

                  {/* Impact Level */}
                  <div className={`p-4 rounded-lg border-l-4 ${
                    metabolicImpact.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                    metabolicImpact.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                    metabolicImpact.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' :
                    'bg-red-50 dark:bg-red-900/20 border-red-500'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        metabolicImpact.color === 'green' ? 'text-green-600' :
                        metabolicImpact.color === 'yellow' ? 'text-yellow-600' :
                        metabolicImpact.color === 'orange' ? 'text-orange-600' :
                        'text-red-600'
                      }`} />
                      <span className={`font-semibold ${
                        metabolicImpact.color === 'green' ? 'text-green-900 dark:text-green-100' :
                        metabolicImpact.color === 'yellow' ? 'text-yellow-900 dark:text-yellow-100' :
                        metabolicImpact.color === 'orange' ? 'text-orange-900 dark:text-orange-100' :
                        'text-red-900 dark:text-red-100'
                      }`}>
                        {metabolicImpact.level.toUpperCase().replace('-', ' ')} IMPACT
                      </span>
                    </div>
                    <p className={`text-sm ${
                      metabolicImpact.color === 'green' ? 'text-green-800 dark:text-green-200' :
                      metabolicImpact.color === 'yellow' ? 'text-yellow-800 dark:text-yellow-200' :
                      metabolicImpact.color === 'orange' ? 'text-orange-800 dark:text-orange-200' :
                      'text-red-800 dark:text-red-200'
                    }`}>
                      {metabolicImpact.description}
                    </p>
                  </div>

                  {/* Weight Gain Projections */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Weight Gain Projections
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-900 dark:text-blue-100">Weekly</span>
                          <span className="font-bold text-blue-800 dark:text-blue-200">
                            +{weeklyWeightGain.toFixed(2)} lbs
                          </span>
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-orange-900 dark:text-orange-100">Monthly</span>
                          <span className="font-bold text-orange-800 dark:text-orange-200">
                            +{monthlyWeightGain.toFixed(1)} lbs
                          </span>
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-red-900 dark:text-red-100">Yearly</span>
                          <span className="font-bold text-red-800 dark:text-red-200">
                            +{yearlyWeightGain.toFixed(1)} lbs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Macronutrient Breakdown */}
                  {(totalCarbs > 0 || totalProtein > 0) && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Macros from Alcohol</h4>
                      <div className="space-y-2">
                        {totalCarbs > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Carbs</span>
                            <span className="font-medium">{totalCarbs.toFixed(1)}g</span>
                          </div>
                        )}
                        {totalProtein > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Protein</span>
                            <span className="font-medium">{totalProtein.toFixed(1)}g</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}


                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
                      <Calculator className="h-10 w-10 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Enter Your Consumption
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Add your weekly alcohol intake to see the impact on your weight goals
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