import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, Settings, Save, Calculator, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    retry: false,
  });

  const { data: calculatorResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ["/api/calculator-results"],
    retry: false,
  });

  const [formData, setFormData] = useState({
    age: profileData?.age || "",
    sex: profileData?.sex || "",
    height: profileData?.height || "",
    currentWeight: profileData?.currentWeight || "",
    desiredWeight: profileData?.desiredWeight || "",
    activityLevel: profileData?.activityLevel || "",
    goal: profileData?.goal || "",
    unitSystem: profileData?.unitSystem || "metric",
    macroProfile: profileData?.macroProfile || "balanced"
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center text-white">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const getCalculatorLabel = (type: string) => {
    switch (type) {
      case "alcohol": return "Alcohol Weight Calculator";
      case "calorie": return "Calorie Tracker";
      case "bmi": return "BMI Calculator";
      default: return "Calculator";
    }
  };

  const formatCalculatorResult = (result: any, type: string) => {
    if (type === "alcohol") {
      return {
        summary: `${result.totalCalories} calories/week`,
        details: [
          `Weekly weight gain: ${result.weeklyWeightGain?.toFixed(2)} lbs`,
          `Monthly projection: ${result.monthlyWeightGain?.toFixed(2)} lbs`,
          `Yearly projection: ${result.yearlyWeightGain?.toFixed(1)} lbs`
        ],
        severity: result.weeklyWeightGain > 0.5 ? "high" : result.weeklyWeightGain > 0.2 ? "medium" : "low"
      };
    }
    return { summary: "Calculation completed", details: [], severity: "low" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Calculator History Section */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Calculator History</CardTitle>
              <p className="text-gray-600">Your recent calculator results and insights</p>
            </CardHeader>
            <CardContent>
              {isLoadingResults ? (
                <div className="text-center py-8 text-gray-500">Loading calculator history...</div>
              ) : calculatorResults && calculatorResults.length > 0 ? (
                <div className="space-y-4">
                  {calculatorResults.slice(0, 5).map((result: any) => {
                    const formatted = formatCalculatorResult(result.results, result.calculatorType);
                    return (
                      <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calculator className="h-4 w-4 text-blue-600" />
                              <h3 className="font-semibold text-gray-900">
                                {getCalculatorLabel(result.calculatorType)}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                formatted.severity === "high" ? "bg-red-100 text-red-800" :
                                formatted.severity === "medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }`}>
                                {formatted.severity === "high" ? "High Impact" :
                                 formatted.severity === "medium" ? "Medium Impact" :
                                 "Low Impact"}
                              </span>
                            </div>
                            <p className="text-gray-700 font-medium mb-2">{formatted.summary}</p>
                            {formatted.details.length > 0 && (
                              <div className="text-sm text-gray-600 space-y-1">
                                {formatted.details.map((detail: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <TrendingUp className="h-3 w-3 text-gray-400" />
                                    {detail}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-500 ml-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(result.createdAt), "MMM d, yyyy")}
                            </div>
                            <div className="text-xs mt-1">
                              {format(new Date(result.createdAt), "h:mm a")}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No calculator history yet</p>
                  <p className="text-sm">Your saved calculations will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Enter your age"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <Select value={formData.sex} onValueChange={(value) => setFormData(prev => ({ ...prev, sex: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height ({formData.unitSystem === 'metric' ? 'cm' : 'inches'})</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                      placeholder={`Enter height in ${formData.unitSystem === 'metric' ? 'cm' : 'inches'}`}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unitSystem">Unit System</Label>
                    <Select value={formData.unitSystem} onValueChange={(value) => setFormData(prev => ({ ...prev, unitSystem: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                        <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentWeight">Current Weight ({formData.unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
                    <Input
                      id="currentWeight"
                      type="number"
                      step="0.1"
                      value={formData.currentWeight}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentWeight: e.target.value }))}
                      placeholder={`Enter weight in ${formData.unitSystem === 'metric' ? 'kg' : 'lbs'}`}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="desiredWeight">Desired Weight ({formData.unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
                    <Input
                      id="desiredWeight"
                      type="number"
                      step="0.1"
                      value={formData.desiredWeight}
                      onChange={(e) => setFormData(prev => ({ ...prev, desiredWeight: e.target.value }))}
                      placeholder={`Enter desired weight in ${formData.unitSystem === 'metric' ? 'kg' : 'lbs'}`}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select value={formData.activityLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="extremely_active">Extremely Active (very hard exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal">Goal</Label>
                  <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loss">Weight Loss</SelectItem>
                      <SelectItem value="maintenance">Maintain Weight</SelectItem>
                      <SelectItem value="gain">Weight Gain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="macroProfile">Macro Profile</Label>
                  <Select value={formData.macroProfile} onValueChange={(value) => setFormData(prev => ({ ...prev, macroProfile: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select macro profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced (40% carbs, 30% protein, 30% fat)</SelectItem>
                      <SelectItem value="high_protein">High Protein (30% carbs, 40% protein, 30% fat)</SelectItem>
                      <SelectItem value="high_carb">High Carb (70% carbs, 15% protein, 15% fat)</SelectItem>
                      <SelectItem value="low_carb">Low Carb (20% carbs, 30% protein, 50% fat)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  disabled={updateProfileMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}