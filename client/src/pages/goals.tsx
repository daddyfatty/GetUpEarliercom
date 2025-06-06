import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Target, Plus, Trophy, TrendingUp, Lightbulb, Calendar } from "lucide-react";
import type { Goal, Achievement } from "@shared/schema";

// Mock current user - in a real app, this would come from auth context
const CURRENT_USER_ID = 2;

export default function Goals() {
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    type: "",
    targetValue: "",
    unit: "",
    deadline: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user goals
  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals", CURRENT_USER_ID],
  });

  // Fetch user achievements
  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements", CURRENT_USER_ID],
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/goals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals", CURRENT_USER_ID] });
      setIsNewGoalOpen(false);
      setGoalForm({
        title: "",
        description: "",
        type: "",
        targetValue: "",
        unit: "",
        deadline: "",
      });
      toast({ title: "Goal created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create goal", variant: "destructive" });
    },
  });

  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => 
      apiRequest("PUT", `/api/goals/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals", CURRENT_USER_ID] });
      toast({ title: "Goal updated successfully!" });
    },
  });

  const handleCreateGoal = () => {
    if (!goalForm.title || !goalForm.type || !goalForm.targetValue || !goalForm.unit) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    createGoalMutation.mutate({
      userId: CURRENT_USER_ID,
      title: goalForm.title,
      description: goalForm.description,
      type: goalForm.type,
      targetValue: parseInt(goalForm.targetValue),
      unit: goalForm.unit,
      deadline: goalForm.deadline ? new Date(goalForm.deadline) : null,
    });
  };

  const handleUpdateProgress = (goalId: number, newValue: number) => {
    updateGoalMutation.mutate({
      id: goalId,
      updates: { currentValue: newValue },
    });
  };

  const getGoalStatus = (goal: Goal) => {
    const progress = (goal.currentValue / goal.targetValue) * 100;
    if (progress >= 100) return { status: "completed", color: "bg-green-500" };
    if (progress >= 75) return { status: "on track", color: "bg-primary" };
    if (progress >= 50) return { status: "behind", color: "bg-accent" };
    return { status: "needs attention", color: "bg-red-500" };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading goals...</p>
        </div>
      </div>
    );
  }

  // Mock achievements data
  const mockAchievements = [
    {
      id: 1,
      title: "7-Day Streak!",
      description: "Logged food for 7 consecutive days",
      type: "streak",
      earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: Trophy,
      color: "bg-primary",
    },
    {
      id: 2,
      title: "Calorie Champion",
      description: "Met calorie goals 5 days this week",
      type: "goal_completion",
      earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      icon: Target,
      color: "bg-accent",
    },
    {
      id: 3,
      title: "Workout Warrior",
      description: "Completed 10 strength workouts",
      type: "milestone",
      earnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      icon: TrendingUp,
      color: "bg-secondary",
    },
  ];

  // Mock insights data
  const insights = [
    {
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
      title: "Great Progress!",
      description: "You've been consistent with your nutrition tracking. Your average daily protein intake increased by 15% this week.",
    },
    {
      icon: Lightbulb,
      color: "bg-accent/10 text-accent",
      title: "Tip for You",
      description: "Try adding more variety to your breakfast routine. Our Greek yogurt parfait recipe might be perfect for you!",
    },
    {
      icon: Target,
      color: "bg-secondary/10 text-secondary",
      title: "Goal Reminder",
      description: "You're 68% of the way to your weight loss goal. Consider adding one more cardio session this week to boost progress.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Goals & Progress
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Set meaningful goals and track your progress. Stay motivated with personalized insights and achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Goals */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Current Goals</CardTitle>
                  <Dialog open={isNewGoalOpen} onOpenChange={setIsNewGoalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        New Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Goal</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Goal Title *</Label>
                          <Input
                            id="title"
                            value={goalForm.title}
                            onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                            placeholder="e.g., Lose 10 pounds"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={goalForm.description}
                            onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                            placeholder="Optional description..."
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="type">Goal Type *</Label>
                            <Select value={goalForm.type} onValueChange={(value) => setGoalForm({ ...goalForm, type: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                                <SelectItem value="exercise_frequency">Exercise Frequency</SelectItem>
                                <SelectItem value="water_intake">Water Intake</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                              id="deadline"
                              type="date"
                              value={goalForm.deadline}
                              onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="targetValue">Target Value *</Label>
                            <Input
                              id="targetValue"
                              type="number"
                              value={goalForm.targetValue}
                              onChange={(e) => setGoalForm({ ...goalForm, targetValue: e.target.value })}
                              placeholder="10"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="unit">Unit *</Label>
                            <Select value={goalForm.unit} onValueChange={(value) => setGoalForm({ ...goalForm, unit: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                <SelectItem value="sessions">Sessions</SelectItem>
                                <SelectItem value="glasses">Glasses</SelectItem>
                                <SelectItem value="days">Days</SelectItem>
                                <SelectItem value="hours">Hours</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleCreateGoal} 
                          disabled={createGoalMutation.isPending}
                          className="w-full"
                        >
                          {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {goals.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No goals yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Create your first goal to start tracking your progress.
                    </p>
                    <Dialog open={isNewGoalOpen} onOpenChange={setIsNewGoalOpen}>
                      <DialogTrigger asChild>
                        <Button>Create First Goal</Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {goals.map((goal) => {
                      const progress = (goal.currentValue / goal.targetValue) * 100;
                      const { status, color } = getGoalStatus(goal);
                      
                      return (
                        <Card key={goal.id} className="border-gray-200">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h4>
                                {goal.deadline && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Target: {new Date(goal.deadline).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${color}`}>
                                {status}
                              </span>
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {goal.currentValue} / {goal.targetValue} {goal.unit}
                                </span>
                              </div>
                              <Progress value={progress} className="h-3" />
                              <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-300">
                                {Math.max(0, goal.targetValue - goal.currentValue)} {goal.unit} to go
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newValue = prompt(`Update progress for "${goal.title}":`, goal.currentValue.toString());
                                  if (newValue !== null && !isNaN(Number(newValue))) {
                                    handleUpdateProgress(goal.id, Number(newValue));
                                  }
                                }}
                                className="text-primary hover:text-primary/80"
                              >
                                Update Progress
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Achievements & Insights */}
          <div className="space-y-8">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAchievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className={`w-12 h-12 ${achievement.color} text-white rounded-full flex items-center justify-center`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {achievement.earnedAt.toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Weekly Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`w-8 h-8 ${insight.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{insight.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
