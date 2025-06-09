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

export default function Nutrition() {
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodForm, setFoodForm] = useState({
    foodName: "",
    quantity: "",
    unit: "grams",
    mealType: "breakfast",
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
    mutationFn: (entry: any) => apiRequest("POST", "/api/food-entries", entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries"] });
      setIsAddFoodOpen(false);
      setFoodForm({
        foodName: "",
        quantity: "",
        unit: "grams",
        mealType: "breakfast",
        protein: "",
        carbs: "",
        fat: "",
      });
      toast({ title: "Food entry added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add food entry", variant: "destructive" });
    },
  });

  // Delete food entry mutation
  const deleteFoodMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/food-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries"] });
      toast({ title: "Food entry deleted" });
    },
  });

  // Update water intake mutation
  const updateWaterMutation = useMutation({
    mutationFn: (glasses: number) => 
      apiRequest("POST", "/api/water-intake", {
        userId: CURRENT_USER_ID,
        date: new Date(selectedDate),
        glasses,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/water-intake"] });
    },
  });

  const handleAddFood = () => {
    if (!foodForm.foodName || !foodForm.quantity || !foodForm.protein || !foodForm.carbs || !foodForm.fat) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    addFoodMutation.mutate({
      userId: CURRENT_USER_ID,
      date: new Date(selectedDate),
      mealType: foodForm.mealType,
      foodName: foodForm.foodName,
      quantity: parseInt(foodForm.quantity),
      unit: foodForm.unit,
      calories: 0, // Remove calorie tracking
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
      // Wine options: 1 glass, 1/2 bottle, 1 bottle - 610 calories per full bottle
      let bottleEquivalent = 0;
      if (alcoholForm.quantity === "glass") {
        bottleEquivalent = 0.2; // 1 glass = 1/5 bottle (5 glasses per bottle)
        foodName = "Wine (1 glass)";
      } else if (alcoholForm.quantity === "0.5") {
        bottleEquivalent = 0.5;
        foodName = "Wine (1/2 bottle)";
      } else {
        bottleEquivalent = quantity;
        foodName = `Wine (${quantity} ${quantity === 1 ? "bottle" : "bottles"})`;
      }
      calories = Math.round(610 * bottleEquivalent);
      unit = alcoholForm.quantity === "glass" ? "glasses" : "bottles";
    }

    addFoodMutation.mutate({
      userId: CURRENT_USER_ID,
      date: new Date(selectedDate),
      mealType: "snack", // Alcohol goes under snacks
      foodName,
      quantity,
      unit,
      calories: 0, // Remove calorie tracking
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
      protein: totals.protein + (entry.protein || 0),
      carbs: totals.carbs + (entry.carbs || 0),
      fat: totals.fat + (entry.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
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
            Track your daily nutrition with precision. Log food by weight, volume, or scan barcodes for accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Add Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Add</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={isAddFoodOpen} onOpenChange={setIsAddFoodOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Food
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Food Entry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="foodName">Food Name</Label>
                        <Input
                          id="foodName"
                          value={foodForm.foodName}
                          onChange={(e) => setFoodForm({ ...foodForm, foodName: e.target.value })}
                          placeholder="e.g., Chicken breast"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={foodForm.quantity}
                            onChange={(e) => setFoodForm({ ...foodForm, quantity: e.target.value })}
                            placeholder="150"
                          />
                        </div>
                        <div>
                          <Label htmlFor="unit">Unit</Label>
                          <Select value={foodForm.unit} onValueChange={(value) => setFoodForm({ ...foodForm, unit: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grams">grams</SelectItem>
                              <SelectItem value="oz">oz</SelectItem>
                              <SelectItem value="cups">cups</SelectItem>
                              <SelectItem value="pieces">pieces</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="protein">Protein (g)</Label>
                          <Input
                            id="protein"
                            type="number"
                            value={foodForm.protein}
                            onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
                            placeholder="25"
                          />
                        </div>
                        <div>
                          <Label htmlFor="carbs">Carbs (g)</Label>
                          <Input
                            id="carbs"
                            type="number"
                            value={foodForm.carbs}
                            onChange={(e) => setFoodForm({ ...foodForm, carbs: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fat">Fat (g)</Label>
                          <Input
                            id="fat"
                            type="number"
                            value={foodForm.fat}
                            onChange={(e) => setFoodForm({ ...foodForm, fat: e.target.value })}
                            placeholder="3"
                          />
                        </div>
                      </div>

                      <Button onClick={handleAddFood} className="w-full" disabled={addFoodMutation.isPending}>
                        {addFoodMutation.isPending ? "Adding..." : "Add Food"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddAlcoholOpen} onOpenChange={setIsAddAlcoholOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Wine className="h-4 w-4 mr-2" />
                      Add Alcohol
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Alcohol</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="alcoholType">Type</Label>
                        <Select value={alcoholForm.type} onValueChange={(value) => setAlcoholForm({ ...alcoholForm, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beer">Beer</SelectItem>
                            <SelectItem value="wine">Wine</SelectItem>
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
                              <SelectItem value="glass">1 glass</SelectItem>
                              <SelectItem value="0.5">1/2 bottle</SelectItem>
                              <SelectItem value="1">1 bottle</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id="alcoholQuantity"
                            type="number"
                            value={alcoholForm.quantity}
                            onChange={(e) => setAlcoholForm({ ...alcoholForm, quantity: e.target.value })}
                            placeholder="1"
                            min="1"
                          />
                        )}
                      </div>

                      <Button onClick={handleAddAlcohol} className="w-full" disabled={addFoodMutation.isPending}>
                        {addFoodMutation.isPending ? "Adding..." : "Add Alcohol"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button className="w-full" variant="outline" disabled>
                  <Camera className="h-4 w-4 mr-2" />
                  Photo Scan (Coming Soon)
                </Button>

                <Button className="w-full" variant="outline" disabled>
                  <Scan className="h-4 w-4 mr-2" />
                  Barcode Scan (Coming Soon)
                </Button>

                <Button className="w-full" variant="outline" disabled>
                  <Search className="h-4 w-4 mr-2" />
                  Food Database (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            {/* Water Intake */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                  Water Intake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-blue-500">
                    {waterIntake?.glasses || 0} glasses
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Goal: 8 glasses per day
                  </p>
                  <Button 
                    onClick={handleAddWater} 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    disabled={updateWaterMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Glass
                  </Button>
                  <Progress 
                    value={Math.min(((waterIntake?.glasses || 0) / 8) * 100, 100)} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Macros */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
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
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
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
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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

            {/* Meal Breakdown */}
            <div className="space-y-4">
              {Object.entries(mealGroups).map(([mealType, entries]) => (
                <Card key={mealType}>
                  <CardHeader>
                    <CardTitle className="capitalize">{mealType}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {entries.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No entries yet</p>
                    ) : (
                      <div className="space-y-2">
                        {entries.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div>
                              <span className="font-medium">{entry.foodName}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                {entry.quantity} {entry.unit}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteFoodMutation.mutate(entry.id)}
                                disabled={deleteFoodMutation.isPending}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}