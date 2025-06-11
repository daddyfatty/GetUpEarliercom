import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, Settings, Save } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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