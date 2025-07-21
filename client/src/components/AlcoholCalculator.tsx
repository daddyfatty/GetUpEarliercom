import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Beer, Wine, Scale, TrendingUp, Save, AlertTriangle, Activity, Target, Calendar, Heart, BarChart3, Flame, Calculator, Share2, MapPin, Eye, Zap, ThumbsUp } from "lucide-react";
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

  // Like and Share state
  const [stats, setStats] = useState({ totalLikes: 0, totalShares: 0 });
  const [hasLiked, setHasLiked] = useState(false);

  // Load calculator stats on mount
  const { data: calculatorStats } = useQuery({
    queryKey: ['/api/calculator-stats', 'alcohol'],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  useEffect(() => {
    if (calculatorStats && typeof calculatorStats === 'object' && 'totalLikes' in calculatorStats && 'totalShares' in calculatorStats) {
      setStats({ 
        totalLikes: calculatorStats.totalLikes as number, 
        totalShares: calculatorStats.totalShares as number 
      });
    }
  }, [calculatorStats]);

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/calculator-like', {
        calculatorType: 'alcohol'
      });
      return response;
    },
    onSuccess: (data) => {
      console.log("Like success data:", data);
      if (data && typeof data === 'object' && 'totalLikes' in data && 'totalShares' in data) {
        setStats({ totalLikes: data.totalLikes, totalShares: data.totalShares });
      } else {
        // Refresh stats if response format is different
        queryClient.invalidateQueries({ queryKey: ['/api/calculator-stats'] });
      }
      setHasLiked(true);
      toast({
        description: "Thanks for the like! 👍"
      });
    },
    onError: (error: any) => {
      console.log("Like error:", error);
      if (error.message && error.message.includes('Already liked')) {
        setHasLiked(true);
        toast({
          description: "You've already liked this calculator!"
        });
      } else {
        toast({
          description: "Failed to like. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Share mutation
  const shareMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest('POST', '/api/calculator-share', {
        calculatorType: 'alcohol', 
        platform
      });
      return response;
    },
    onSuccess: (data) => {
      setStats({ totalLikes: data.totalLikes, totalShares: data.totalShares });
    }
  });

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

  // Exercise calculations to burn off calories
  const milesToBurnCalories = totalCalories / 100;  // Walking: ~100 calories per mile
  const milesToRunCalories = totalCalories / 150;   // Running: ~150 calories per mile
  const hoursWeightLifting = totalCalories / 300;   // Weight lifting: ~300 calories per hour

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

  const shareResults = () => {
    if (totalCalories <= 0) {
      toast({
        title: "No Data to Share",
        description: "Please enter some alcohol consumption data first.",
        variant: "destructive",
      });
      return;
    }

    // Create detailed shareable content with actual results
    const currentWeightDisplay = currentWeight ? ` (weight: ${currentWeight} lbs)` : "";
    
    // Build consumption breakdown
    let consumptionBreakdown = "📊 MY WEEKLY ALCOHOL CONSUMPTION:" + currentWeightDisplay + "\n";
    if (beerCount > 0) consumptionBreakdown += `🍺 Beer: ${beerCount} bottles\n`;
    if (wineCount > 0) {
      const servingText = wineServing === "quarter" ? "Glass 5 oz" : wineServing === "half" ? "1/2 Bottle" : "Bottle";
      consumptionBreakdown += `🍷 Wine: ${wineCount} ${servingText}\n`;
    }
    if (spiritsCount > 0) consumptionBreakdown += `🥃 Spirits: ${spiritsCount} shots\n`;
    if (cocktailCount > 0) consumptionBreakdown += `🍸 Cocktails: ${cocktailCount} drinks\n`;
    
    const shareText = `🍺🍷 BUZZKILL REALITY CHECK!

${consumptionBreakdown}
💥 Total Weekly Impact: ${totalCalories.toLocaleString()} calories
📈 Potential Weight Gain: +${weeklyWeightGain.toFixed(2)} lbs/week (+${monthlyWeightGain.toFixed(1)} lbs/month, +${yearlyWeightGain.toFixed(1)} lbs/year)

🚶‍♀️ EXERCISE NEEDED TO BURN IT OFF:
• Walking: ${milesToBurnCalories.toFixed(1)} miles
• Running: ${milesToRunCalories.toFixed(1)} miles  
• Weightlifting: ${hoursWeightLifting.toFixed(1)} hours

💡 ${metabolicImpact.description}

Calculate yours: ${window.location.href}

#BuzzkillReality #AlcoholCalories #WeightLoss #FitnessReality #GetUpEarlier`;
    
    // Try native sharing first (mobile)
    if (navigator.share) {
      navigator.share({
        title: 'My Buzzkill Calculator Results',
        text: shareText,
        url: `${window.location.origin}/alcohol-calculator`
      }).catch(() => {
        // Fallback to manual sharing
        fallbackShare(shareText);
      });
    } else {
      // Desktop fallback - show share options
      fallbackShare(shareText);
    }
  };

  const generateShareText = () => {
    // Build share text with current form values
    const currentWeightDisplay = currentWeight ? ` (weight: ${currentWeight} lbs)` : "";
    
    // Build consumption breakdown
    let consumptionBreakdown = "📊 MY WEEKLY ALCOHOL CONSUMPTION:" + currentWeightDisplay + "\n";
    if (beerCount > 0) consumptionBreakdown += `🍺 Beer: ${beerCount} bottles\n`;
    if (wineCount > 0) {
      const servingText = wineServing === "quarter" ? "Glass 5 oz" : wineServing === "half" ? "1/2 Bottle" : "Bottle";
      consumptionBreakdown += `🍷 Wine: ${wineCount} ${servingText}\n`;
    }
    if (spiritsCount > 0) consumptionBreakdown += `🥃 Spirits: ${spiritsCount} shots\n`;
    if (cocktailCount > 0) consumptionBreakdown += `🍸 Cocktails: ${cocktailCount} drinks\n`;
    
    const shareText = `🍺🍷 BUZZKILL REALITY CHECK!

${consumptionBreakdown}
💥 Total Weekly Impact: ${totalCalories.toLocaleString()} calories
📈 Potential Weight Gain: +${weeklyWeightGain.toFixed(2)} lbs/week (+${monthlyWeightGain.toFixed(1)} lbs/month, +${yearlyWeightGain.toFixed(1)} lbs/year)

🚶‍♀️ EXERCISE NEEDED TO BURN IT OFF:
• Walking: ${milesToBurnCalories.toFixed(1)} miles
• Running: ${milesToRunCalories.toFixed(1)} miles  
• Weightlifting: ${hoursWeightLifting.toFixed(1)} hours

💡 ${metabolicImpact.description}

Calculate yours: ${window.location.href}

#BuzzkillReality #AlcoholCalories #WeightLoss #FitnessReality #GetUpEarlier`;

    // Debug logging
    console.log("=== GENERATE SHARE TEXT DEBUG ===");
    console.log("beerCount:", beerCount);
    console.log("wineCount:", wineCount);
    console.log("totalCalories:", totalCalories);
    console.log("weeklyWeightGain:", weeklyWeightGain);
    console.log("milesToBurnCalories:", milesToBurnCalories);
    console.log("metabolicImpact.description:", metabolicImpact.description);
    console.log("Generated shareText length:", shareText.length);
    console.log("Generated shareText:", shareText);
    console.log("=== END DEBUG ===");
    
    return shareText;
  };

  const fallbackShare = (passedShareText: string) => {

    // Show sharing options with direct platform links
    toast({
      title: "Share Your Buzzkill Results",
      description: "Choose how to share your alcohol consumption reality check:",
      action: (
        <div className="flex flex-col gap-2 w-full">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Generate fresh shareText and copy to clipboard
                const currentShareText = generateShareText();
                console.log("Facebook sharing - generated shareText:", currentShareText);
                navigator.clipboard?.writeText(currentShareText).then(() => {
                  // Open Facebook's main feed where users can create a new post
                  window.open('https://www.facebook.com/', '_blank');
                  
                  shareMutation.mutate('facebook');
                  
                  toast({
                    title: "✓ Complete Results Copied & Facebook Opened!",
                    description: "Your full BUZZKILL REALITY CHECK is copied to clipboard. Go to Facebook, click 'What's on your mind?' and paste with Ctrl+V (or Cmd+V on Mac).",
                    duration: 15000,
                  });
                }).catch(() => {
                  // Fallback if clipboard fails
                  window.open('https://www.facebook.com/', '_blank');
                  toast({
                    title: "Facebook Opened",
                    description: "Please manually copy your results and post them on Facebook.",
                    duration: 6000,
                  });
                });
              }}
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // LinkedIn sharing with personal data in post content
                const currentShareText = generateShareText();
                const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(currentShareText)}`;
                console.log("LinkedIn sharing - generated shareText:", currentShareText);
                window.open(linkedInUrl, '_blank');
                shareMutation.mutate('linkedin');
              }}
            >
              LinkedIn
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentShareText = generateShareText();
                const smsUrl = `sms:?body=${encodeURIComponent(currentShareText)}`;
                console.log("SMS sharing - generated shareText:", currentShareText);
                window.location.href = smsUrl;
                shareMutation.mutate('sms');
              }}
            >
              SMS Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Generate fresh shareText for email
                const currentShareText = generateShareText();
                const emailSubject = "My Buzzkill Calculator Results - Eye Opening!";
                const emailBody = currentShareText + "\n\nTry the calculator yourself: " + window.location.origin + "/alcohol-calculator";
                const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                console.log("Email sharing - generated shareText:", currentShareText);
                console.log("Email sharing - complete emailBody:", emailBody);
                window.location.href = emailUrl;
                shareMutation.mutate('email');
              }}
            >
              Email
            </Button>
          </div>
        </div>
      ),
    });
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
              <div className="space-y-4 pt-6">
                {/* Like and Share Counters */}
                <div className="flex items-center justify-center gap-6 py-4 bg-white dark:bg-gray-900 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-lg">{stats.totalLikes.toLocaleString()}</span>
                    <span className="text-gray-600 dark:text-gray-400">Likes</span>
                  </div>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-lg">{stats.totalShares.toLocaleString()}</span>
                    <span className="text-gray-600 dark:text-gray-400">Shares</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Share Button - Full Width */}
                  <Button 
                    onClick={shareResults}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-lg font-semibold py-4 h-auto min-h-[60px]"
                    size="lg"
                  >
                    <img src="/buzzkill.png" alt="Buzzkill" className="mr-0.5 flex-shrink-0 h-20 relative z-10" />
                    <span className="flex-1">Share my Buzzkill Results</span>
                  </Button>
                  
                  {/* Reset and Like Buttons - Two Column Layout */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={resetCalculator} 
                      variant="outline" 
                      size="lg"
                    >
                      Reset
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log("Like button clicked, current stats:", stats);
                        likeMutation.mutate();
                      }}
                      disabled={likeMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
                      size="lg"
                    >
                      <ThumbsUp className={`h-4 w-4 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
                      {hasLiked ? 'Liked!' : 'Like'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Walking Miles to Burn Off Calories - Fill the space below buttons */}
              {totalCalories > 0 && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-lg text-green-900 dark:text-green-100">Buzzkill Reality:</span>
                  </div>
                  <div className="space-y-2 text-green-800 dark:text-green-200 leading-relaxed">
                    <p>
                      I'd need to walk <span className="font-bold text-xl text-green-900 dark:text-green-100">{milesToBurnCalories.toFixed(1)} miles</span> to burn off the <span className="font-bold">{totalCalories.toLocaleString()} calories</span> from my weekly alcohol consumption.
                    </p>
                    <p>
                      I'd need to run <span className="font-bold text-lg text-green-900 dark:text-green-100">{milesToRunCalories.toFixed(1)} miles</span> to burn off these calories.
                    </p>
                    <p>
                      I'd need to lift weights for <span className="font-bold text-lg text-green-900 dark:text-green-100">{hoursWeightLifting.toFixed(1)} hours</span> to burn off these calories.
                    </p>
                  </div>
                </div>
              )}
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

                  {/* Share Button */}
                  <Button
                    onClick={() => {
                      const testShareText = generateShareText();
                      navigator.clipboard?.writeText(testShareText).then(() => {
                        toast({
                          title: "✓ Results Copied!",
                          description: "Your complete Buzzkill Calculator results are copied to clipboard.",
                          duration: 5000,
                        });
                      });
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share The Buzzkill Calculator
                  </Button>

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