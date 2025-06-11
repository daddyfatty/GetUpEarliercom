import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Beer, Wine, Scale, TrendingUp } from "lucide-react";

export default function AlcoholCalculator() {
  const [beerCount, setBeerCount] = useState(0);
  const [wineCount, setWineCount] = useState(0);
  const [wineServing, setWineServing] = useState("quarter"); // quarter, half, full

  // Nutrition data
  const BEER_CALORIES = 153;
  const BEER_CARBS = 12.6;
  const BEER_PROTEIN = 1.6;

  const WINE_CALORIES_PER_BOTTLE = 615;
  const WINE_CARBS_PER_BOTTLE = 20;

  const getWineCalories = () => {
    switch (wineServing) {
      case "quarter": return 154; // 1/4 bottle
      case "half": return 308;    // 1/2 bottle
      case "full": return 615;    // full bottle
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

  const getWineServingLabel = () => {
    switch (wineServing) {
      case "quarter": return "1/4 bottle (6.3 oz)";
      case "half": return "1/2 bottle (12.7 oz)";
      case "full": return "Full bottle (25.4 oz)";
      default: return "1/4 bottle";
    }
  };

  // Calculate totals
  const totalBeerCalories = beerCount * BEER_CALORIES;
  const totalBeerCarbs = beerCount * BEER_CARBS;
  const totalBeerProtein = beerCount * BEER_PROTEIN;

  const totalWineCalories = wineCount * getWineCalories();
  const totalWineCarbs = wineCount * getWineCarbs();

  const totalCalories = totalBeerCalories + totalWineCalories;
  const totalCarbs = totalBeerCarbs + totalWineCarbs;
  const totalProtein = totalBeerProtein; // Wine has 0 protein

  const weeklyWeightGain = totalCalories / 3500; // 3500 calories = 1 lb

  const resetCalculator = () => {
    setBeerCount(0);
    setWineCount(0);
    setWineServing("quarter");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Beer className="h-6 w-6 text-amber-600" />
          Alcohol Weight Gain Calculator
          <Wine className="h-6 w-6 text-purple-600" />
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate potential weight gain from weekly alcohol consumption
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Beer Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Beer className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Beer</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="beer-count">12 oz cans/bottles per week</Label>
              <Input
                id="beer-count"
                type="number"
                min="0"
                value={beerCount}
                onChange={(e) => setBeerCount(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Per beer: 153 calories, 12.6g carbs, 1.6g protein
              </p>
            </div>
          </div>

          {/* Wine Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wine className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wine</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wine-serving">Serving size</Label>
              <Select value={wineServing} onValueChange={setWineServing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarter">1/4 bottle (6.3 oz) - 154 cal</SelectItem>
                  <SelectItem value="half">1/2 bottle (12.7 oz) - 308 cal</SelectItem>
                  <SelectItem value="full">Full bottle (25.4 oz) - 615 cal</SelectItem>
                </SelectContent>
              </Select>
              
              <Label htmlFor="wine-count">Servings per week</Label>
              <Input
                id="wine-count"
                type="number"
                min="0"
                value={wineCount}
                onChange={(e) => setWineCount(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Per serving: {getWineCalories()} calories, {getWineCarbs()}g carbs
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {totalCalories > 0 && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Weekly Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{totalCalories}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Calories</div>
              </div>
              
              <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{totalCarbs.toFixed(1)}g</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Carbohydrates</div>
              </div>
              
              <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalProtein.toFixed(1)}g</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
              </div>
              
              <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg border-2 border-red-200 dark:border-red-800">
                <div className="text-2xl font-bold text-red-700 dark:text-red-400 flex items-center justify-center gap-1">
                  <TrendingUp className="h-5 w-5" />
                  {weeklyWeightGain.toFixed(2)} lbs
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Est. Weight Gain/Week</div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {beerCount > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Beer className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800 dark:text-amber-200">
                      {beerCount} beers/week
                    </span>
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    {totalBeerCalories} calories • {totalBeerCarbs.toFixed(1)}g carbs • {totalBeerProtein.toFixed(1)}g protein
                  </div>
                </div>
              )}
              
              {wineCount > 0 && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wine className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800 dark:text-purple-200">
                      {wineCount} × {getWineServingLabel()}/week
                    </span>
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    {totalWineCalories} calories • {totalWineCarbs.toFixed(1)}g carbs • 0g protein
                  </div>
                </div>
              )}
            </div>

            {/* Warning */}
            {weeklyWeightGain > 0.5 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>High Impact:</strong> This alcohol consumption could lead to significant weight gain. 
                  Consider reducing intake or balancing with increased physical activity.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {totalCalories > 0 && (
            <Button 
              variant="outline" 
              onClick={resetCalculator}
              className="min-w-[120px]"
            >
              Reset Calculator
            </Button>
          )}
        </div>

        {/* Information */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Calculations based on average values for popular beer (~5% ABV) and wine.</p>
          <p>Formula: 3,500 calories = 1 pound of body weight</p>
        </div>
      </CardContent>
    </Card>
  );
}