import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Camera, Scan, Book, Plus, X, Droplets, Wine } from "lucide-react";
import type { FoodEntry, WaterIntake } from "@shared/schema";

// Mock current user - in a real app, this would come from auth context
const CURRENT_USER_ID = 2;

export default function Tracker() {
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodForm, setFoodForm] = useState({
    foodName: "",
    quantity: "",
    unit: "grams",
    mealType: "breakfast",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const [isAddAlcoholOpen, setIsAddAlcoholOpen] = useState(false);
  const [alcoholForm, setAlcoholForm] = useState({
    type: "beer", // beer or wine
    quantity: "1",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch food entries for today
  const { data: foodEntries = [] } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries", CURRENT_USER_ID, { date: selectedDate }],
  });

  // Fetch water intake for today
  const { data: waterIntake } = useQuery<WaterIntake>({
    queryKey: ["/api/water-intake", CURRENT_USER_ID, { date: selectedDate }],
  });

  // Add food entry mutation
  const addFoodMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/food-entries", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries", CURRENT_USER_ID] });
      setIsAddFoodOpen(false);
      setFoodForm({
        foodName: "",
        quantity: "",
        unit: "grams",
        mealType: "breakfast",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
      toast({ title: "Food added successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to add food", variant: "destructive" });
    },
  });

  // Delete food entry mutation
  const deleteFoodMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/food-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries", CURRENT_USER_ID] });
      toast({ title: "Food entry deleted" });
    },
  });

  // Update water intake mutation
  const updateWaterMutation = useMutation({
    mutationFn: (glasses: number) => 
      apiRequest("POST", "/api/water-intake", {
        userId: CURRENT_USER_ID,
        date: selectedDate,
        glasses,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/water-intake", CURRENT_USER_ID] });
    },
  });

  const handleAddFood = () => {
    if (!foodForm.foodName || !foodForm.quantity || !foodForm.calories) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    addFoodMutation.mutate({
      userId: CURRENT_USER_ID,
      date: new Date(selectedDate),
      mealType: foodForm.mealType,
      foodName: foodForm.foodName,
      quantity: parseInt(foodForm.quantity),
      unit: foodForm.unit,
      calories: parseInt(foodForm.calories),
      protein: parseInt(foodForm.protein) || 0,
      carbs: parseInt(foodForm.carbs) || 0,
      fat: parseInt(foodForm.fat) || 0,
    });
  };

  const handleAddWater = () => {
    const currentGlasses = waterIntake?.glasses || 0;
    updateWaterMutation.mutate(currentGlasses + 1);
  };

  const handleAddAlcohol = () => {
    const quantity = parseInt(alcoholForm.quantity);
    if (!quantity || quantity <= 0) {
      toast({ title: "Please enter a valid quantity", variant: "destructive" });
      return;
    }

    let calories = 0;
    let foodName = "";
    let unit = "";

    if (alcoholForm.type === "beer") {
      calories = 160 * quantity;
      foodName = `Beer (${quantity} ${quantity === 1 ? "bottle" : "bottles"})`;
      unit = "bottles";
    } else if (alcoholForm.type === "wine") {
      // Wine options: 1/4, 1/2, 1 bottle - 610 calories per full bottle
      let bottleEquivalent = 0;
      if (alcoholForm.quantity === "0.25") {
        bottleEquivalent = 0.25;
        foodName = "Wine (1/4 bottle)";
      } else if (alcoholForm.quantity === "0.5") {
        bottleEquivalent = 0.5;
        foodName = "Wine (1/2 bottle)";
      } else {
        bottleEquivalent = quantity;
        foodName = `Wine (${quantity} ${quantity === 1 ? "bottle" : "bottles"})`;
      }
      calories = Math.round(610 * bottleEquivalent);
      unit = "bottles";
    }

    addFoodMutation.mutate({
      userId: CURRENT_USER_ID,
      date: new Date(selectedDate),
      mealType: "snack", // Alcohol goes under snacks
      foodName,
      quantity,
      unit,
      calories,
      protein: 0,
      carbs: alcoholForm.type === "beer" ? Math.round(quantity * 13) : Math.round(quantity * 4), // Approximate carbs
      fat: 0,
    });

    setIsAddAlcoholOpen(false);
    setAlcoholForm({
      type: "beer",
      quantity: "1",
    });
  };

  // Calculate daily totals
  const dailyTotals = foodEntries.reduce(
    (totals, entry) => ({
      calories: totals.calories + entry.calories,
      protein: totals.protein + (entry.protein || 0),
      carbs: totals.carbs + (entry.carbs || 0),
      fat: totals.fat + (entry.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Group entries by meal type
  const mealGroups = {
    breakfast: foodEntries.filter(entry => entry.mealType === "breakfast"),
    lunch: foodEntries.filter(entry => entry.mealType === "lunch"),
    dinner: foodEntries.filter(entry => entry.mealType === "dinner"),
    snack: foodEntries.filter(entry => entry.mealType === "snack"),
  };

  // Daily goals
  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nutrition Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track your daily nutrition with ease. Log food by type, weight, volume, or even upload photos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Food Entry */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Log Your Food</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Quick Add Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Dialog open={isAddFoodOpen} onOpenChange={setIsAddFoodOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="p-4 h-auto flex flex-col gap-2">
                        <Plus className="w-6 h-6 text-primary" />
                        <span className="text-sm font-medium">Add Food</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Food Entry</DialogTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Add a food item to track your daily nutrition intake.
                        </p>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="foodName">Food Name *</Label>
                            <Input
                              id="foodName"
                              value={foodForm.foodName}
                              onChange={(e) => setFoodForm({ ...foodForm, foodName: e.target.value })}
                              placeholder="e.g., Banana"
                            />
                          </div>
                          <div>
                            <Label htmlFor="mealType">Meal Type</Label>
                            <Select value={foodForm.mealType} onValueChange={(value) => setFoodForm({ ...foodForm, mealType: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                                <SelectItem value="snack">Snack</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={foodForm.quantity}
                              onChange={(e) => setFoodForm({ ...foodForm, quantity: e.target.value })}
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <Label htmlFor="unit">Unit</Label>
                            <Select value={foodForm.unit} onValueChange={(value) => setFoodForm({ ...foodForm, unit: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="grams">Grams</SelectItem>
                                <SelectItem value="cups">Cups</SelectItem>
                                <SelectItem value="pieces">Pieces</SelectItem>
                                <SelectItem value="tablespoons">Tablespoons</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="calories">Calories *</Label>
                            <Input
                              id="calories"
                              type="number"
                              value={foodForm.calories}
                              onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                              placeholder="95"
                            />
                          </div>
                          <div>
                            <Label htmlFor="protein">Protein (g)</Label>
                            <Input
                              id="protein"
                              type="number"
                              value={foodForm.protein}
                              onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
                              placeholder="1"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="carbs">Carbs (g)</Label>
                            <Input
                              id="carbs"
                              type="number"
                              value={foodForm.carbs}
                              onChange={(e) => setFoodForm({ ...foodForm, carbs: e.target.value })}
                              placeholder="23"
                            />
                          </div>
                          <div>
                            <Label htmlFor="fat">Fat (g)</Label>
                            <Input
                              id="fat"
                              type="number"
                              value={foodForm.fat}
                              onChange={(e) => setFoodForm({ ...foodForm, fat: e.target.value })}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        
                        <Button onClick={handleAddFood} disabled={addFoodMutation.isPending} className="w-full">
                          {addFoodMutation.isPending ? "Adding..." : "Add Food"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="p-4 h-auto flex flex-col gap-2" disabled>
                    <Camera className="w-6 h-6 text-secondary" />
                    <span className="text-sm font-medium">Photo</span>
                  </Button>
                  
                  <Button variant="outline" className="p-4 h-auto flex flex-col gap-2" disabled>
                    <Scan className="w-6 h-6 text-accent" />
                    <span className="text-sm font-medium">Scan</span>
                  </Button>
                  
                  <Dialog open={isAddAlcoholOpen} onOpenChange={setIsAddAlcoholOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="p-4 h-auto flex flex-col gap-2">
                        <Wine className="w-6 h-6 text-purple-600" />
                        <span className="text-sm font-medium">Alcohol</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Alcohol</DialogTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Track beer and wine consumption with automatic calorie calculation.
                        </p>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="alcoholType">Type</Label>
                          <Select value={alcoholForm.type} onValueChange={(value) => setAlcoholForm({ ...alcoholForm, type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beer">Beer (160 cal each)</SelectItem>
                              <SelectItem value="wine">Wine (610 cal per bottle)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="alcoholQuantity">Quantity</Label>
                          {alcoholForm.type === "wine" ? (
                            <Select value={alcoholForm.quantity} onValueChange={(value) => setAlcoholForm({ ...alcoholForm, quantity: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0.25">1/4 bottle (153 cal)</SelectItem>
                                <SelectItem value="0.5">1/2 bottle (305 cal)</SelectItem>
                                <SelectItem value="1">1 bottle (610 cal)</SelectItem>
                                <SelectItem value="2">2 bottles (1,220 cal)</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              id="alcoholQuantity"
                              type="number"
                              min="1"
                              value={alcoholForm.quantity}
                              onChange={(e) => setAlcoholForm({ ...alcoholForm, quantity: e.target.value })}
                              placeholder="Number of beers"
                            />
                          )}
                        </div>
                        
                        <Button onClick={handleAddAlcohol} disabled={addFoodMutation.isPending} className="w-full">
                          {addFoodMutation.isPending ? "Adding..." : "Add to Tracker"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Food Search */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">Search Food</Label>
                  <div className="relative">
                    <Input placeholder="Search for food..." className="pl-12" />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                {/* Today's Meals */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Today's Meals</h4>
                  
                  {Object.entries(mealGroups).map(([mealType, entries]) => (
                    <Card key={mealType} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900 dark:text-white capitalize">{mealType}</h5>
                          <Dialog open={isAddFoodOpen} onOpenChange={setIsAddFoodOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary hover:text-primary/80"
                                onClick={() => setFoodForm({ ...foodForm, mealType })}
                              >
                                + Add Food
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                        
                        {entries.length === 0 ? (
                          <div className="text-gray-500 text-center py-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Plus className="w-6 h-6" />
                            </div>
                            <p>No foods logged yet</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {entries.map((entry) => (
                              <div key={entry.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                    <Plus className="w-4 h-4 text-accent" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{entry.foodName}</p>
                                    <p className="text-sm text-gray-500">
                                      {entry.quantity} {entry.unit}, {entry.calories} cal
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteFoodMutation.mutate(entry.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Summary */}
          <div className="space-y-6">
            {/* Daily Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calories Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-gray-500">
                      {dailyTotals.calories} / {goals.calories}
                    </span>
                  </div>
                  <Progress value={(dailyTotals.calories / goals.calories) * 100} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.max(0, goals.calories - dailyTotals.calories)} remaining
                  </p>
                </div>

                {/* Macros */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-accent rounded-full"></div>
                        <span className="text-sm font-medium">Carbs</span>
                      </div>
                      <span className="text-sm">
                        {dailyTotals.carbs}g / {goals.carbs}g
                      </span>
                    </div>
                    <Progress value={(dailyTotals.carbs / goals.carbs) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">Protein</span>
                      </div>
                      <span className="text-sm">
                        {dailyTotals.protein}g / {goals.protein}g
                      </span>
                    </div>
                    <Progress value={(dailyTotals.protein / goals.protein) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                        <span className="text-sm font-medium">Fat</span>
                      </div>
                      <span className="text-sm">
                        {dailyTotals.fat}g / {goals.fat}g
                      </span>
                    </div>
                    <Progress value={(dailyTotals.fat / goals.fat) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Water Intake */}
            <Card>
              <CardHeader>
                <CardTitle>Water Intake</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Droplets className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {waterIntake?.glasses || 0}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {waterIntake?.glasses || 0} of 8 glasses
                  </p>
                  <Button
                    onClick={handleAddWater}
                    disabled={updateWaterMutation.isPending}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800"
                  >
                    + Add Glass
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average Calories</span>
                    <span className="text-sm font-medium">1,850</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Days Tracked</span>
                    <span className="text-sm font-medium">5 / 7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Goal Progress</span>
                    <span className="text-sm font-medium text-primary">82%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
