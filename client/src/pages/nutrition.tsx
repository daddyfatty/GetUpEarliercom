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
import { Search, Camera, Scan, Book, Plus, X, Wine, Coffee, Apple, Utensils } from "lucide-react";
import AlcoholCalculator from "@/components/AlcoholCalculator";
import type { FoodEntry } from "@shared/schema";

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

  const handleAddAlcohol = () => {
    const quantity = parseInt(alcoholForm.quantity);
    if (!quantity || quantity <= 0) {
      toast({ title: "Please enter a valid quantity", variant: "destructive" });
      return;
    }

    const alcoholEntry = {
      userId: CURRENT_USER_ID,
      date: new Date(selectedDate),
      mealType: "alcohol",
      foodName: alcoholForm.type === "beer" ? `Beer (${quantity} glass${quantity > 1 ? "es" : ""})` : `Wine (${quantity} glass${quantity > 1 ? "es" : ""})`,
      quantity: quantity,
      unit: "glass",
      calories: 0,
      protein: 0,
      carbs: alcoholForm.type === "beer" ? quantity * 15 : quantity * 5,
      fat: 0,
    };

    addFoodMutation.mutate(alcoholEntry);
    setIsAddAlcoholOpen(false);
    setAlcoholForm({ type: "beer", quantity: "1" });
  };

  // Calculate daily totals
  const dailyTotals = foodEntries.reduce(
    (totals, entry) => ({
      protein: totals.protein + entry.protein,
      carbs: totals.carbs + entry.carbs,
      fat: totals.fat + entry.fat,
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  // Group entries by meal type for better organization
  const groupedEntries = foodEntries.reduce((groups, entry) => {
    const key = entry.mealType || 'other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);

  const NutritionBlock = ({ title, description, icon: Icon, color, onClick }: {
    title: string;
    description: string;
    icon: any;
    color: string;
    onClick: () => void;
  }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${color} group`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')} ${color.replace('border-l-', 'text-').replace('-500', '-600')}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nutrition Calculators
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate nutrition values for meals, beverages, alcohol, and snacks with precision and ease
            </p>
          </div>

          {/* Nutrition Category Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <NutritionBlock
              title="Meals"
              description="Calculate nutrition for breakfast, lunch, dinner, and meal combinations"
              icon={Utensils}
              color="border-l-green-500"
              onClick={() => setIsAddFoodOpen(true)}
            />
            
            <NutritionBlock
              title="Non-Alcoholic Beverages"
              description="Track nutrition in smoothies, juices, protein shakes, and other drinks"
              icon={Coffee}
              color="border-l-blue-500"
              onClick={() => setIsAddFoodOpen(true)}
            />
            
            <NutritionBlock
              title="Alcohol"
              description="Calculate nutritional impact of beer, wine, and alcoholic beverages"
              icon={Wine}
              color="border-l-purple-500"
              onClick={() => setIsAddAlcoholOpen(true)}
            />
            
            <NutritionBlock
              title="Snacks"
              description="Get nutrition data for snacks, desserts, and small meals"
              icon={Apple}
              color="border-l-orange-500"
              onClick={() => setIsAddFoodOpen(true)}
            />
          </div>

          {/* Daily Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Daily Nutrition Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{dailyTotals.protein}g</span>
                  </div>
                  <Progress value={(dailyTotals.protein / 150) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Carbs</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{dailyTotals.carbs}g</span>
                  </div>
                  <Progress value={(dailyTotals.carbs / 300) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Fat</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{dailyTotals.fat}g</span>
                  </div>
                  <Progress value={(dailyTotals.fat / 100) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Entries */}
          {Object.keys(groupedEntries).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Today's Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(groupedEntries).map(([mealType, entries]) => (
                    <div key={mealType}>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
                        {mealType}
                      </h4>
                      <div className="space-y-2">
                        {entries.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <span className="font-medium">{entry.foodName}</span>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {entry.quantity} {entry.unit} • P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFoodMutation.mutate(entry.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alcohol Weight Gain Calculator */}
          <div className="mt-12">
            <AlcoholCalculator />
          </div>
        </div>
      </div>

      {/* Add Food Dialog */}
      <Dialog open={isAddFoodOpen} onOpenChange={setIsAddFoodOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Food Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mealType">Meal Type</Label>
              <Select value={foodForm.mealType} onValueChange={(value) => setFoodForm({...foodForm, mealType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                  <SelectItem value="beverage">Beverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="foodName">Food Name</Label>
              <Input
                id="foodName"
                value={foodForm.foodName}
                onChange={(e) => setFoodForm({...foodForm, foodName: e.target.value})}
                placeholder="e.g., Grilled Chicken Breast"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={foodForm.quantity}
                  onChange={(e) => setFoodForm({...foodForm, quantity: e.target.value})}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={foodForm.unit} onValueChange={(value) => setFoodForm({...foodForm, unit: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grams">Grams</SelectItem>
                    <SelectItem value="ounces">Ounces</SelectItem>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={foodForm.protein}
                  onChange={(e) => setFoodForm({...foodForm, protein: e.target.value})}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={foodForm.carbs}
                  onChange={(e) => setFoodForm({...foodForm, carbs: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={foodForm.fat}
                  onChange={(e) => setFoodForm({...foodForm, fat: e.target.value})}
                  placeholder="5"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddFood} className="flex-1" disabled={addFoodMutation.isPending}>
                {addFoodMutation.isPending ? "Adding..." : "Add Entry"}
              </Button>
              <Button variant="outline" onClick={() => setIsAddFoodOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Alcohol Dialog */}
      <Dialog open={isAddAlcoholOpen} onOpenChange={setIsAddAlcoholOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Alcohol Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="alcoholType">Type</Label>
              <Select value={alcoholForm.type} onValueChange={(value) => setAlcoholForm({...alcoholForm, type: value})}>
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
              <Label htmlFor="alcoholQuantity">Quantity (glasses)</Label>
              <Input
                id="alcoholQuantity"
                type="number"
                value={alcoholForm.quantity}
                onChange={(e) => setAlcoholForm({...alcoholForm, quantity: e.target.value})}
                placeholder="1"
                min="1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddAlcohol} className="flex-1" disabled={addFoodMutation.isPending}>
                {addFoodMutation.isPending ? "Adding..." : "Add Entry"}
              </Button>
              <Button variant="outline" onClick={() => setIsAddAlcoholOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}