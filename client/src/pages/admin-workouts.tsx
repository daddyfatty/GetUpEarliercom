import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Clock, Flame, Play } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Workout } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface WorkoutFormData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  equipment: string[];
  exercises: Array<{
    name: string;
    sets?: number;
    reps?: string;
    duration?: string;
    rest?: string;
    description?: string;
  }>;
  videoUrl: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
}

const initialFormData: WorkoutFormData = {
  title: "",
  description: "",
  category: "strength",
  difficulty: "beginner",
  duration: 15,
  caloriesBurned: 150,
  equipment: [],
  exercises: [],
  videoUrl: "",
  authorId: "michael",
  authorName: "Michael Baker",
  authorPhoto: "/api/placeholder/48/48"
};

export default function AdminWorkouts() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<WorkoutFormData>(initialFormData);
  const [equipmentInput, setEquipmentInput] = useState("");
  const [exerciseInput, setExerciseInput] = useState({ name: "", sets: "", reps: "", description: "" });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workouts = [], isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const createWorkoutMutation = useMutation({
    mutationFn: (data: WorkoutFormData) => apiRequest("/api/workouts", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      setIsCreating(false);
      setFormData(initialFormData);
      toast({ title: "Workout created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create workout", variant: "destructive" });
    }
  });

  const updateWorkoutMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkoutFormData }) => 
      apiRequest(`/api/workouts/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      setEditingId(null);
      setFormData(initialFormData);
      toast({ title: "Workout updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update workout", variant: "destructive" });
    }
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/workouts/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Workout deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete workout", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateWorkoutMutation.mutate({ id: editingId, data: formData });
    } else {
      createWorkoutMutation.mutate(formData);
    }
  };

  const startEdit = (workout: Workout) => {
    setEditingId(workout.id);
    setFormData({
      title: workout.title,
      description: workout.description,
      category: workout.category,
      difficulty: workout.difficulty,
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned,
      equipment: workout.equipment || [],
      exercises: workout.exercises || [],
      videoUrl: workout.videoUrl || "",
      authorId: (workout as any).authorId || "michael",
      authorName: (workout as any).authorName || "Michael Baker",
      authorPhoto: (workout as any).authorPhoto || "/api/placeholder/48/48"
    });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData(initialFormData);
    setEquipmentInput("");
    setExerciseInput({ name: "", sets: "", reps: "", description: "" });
  };

  const addEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, equipmentInput.trim()]
      });
      setEquipmentInput("");
    }
  };

  const removeEquipment = (index: number) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((_, i) => i !== index)
    });
  };

  const addExercise = () => {
    if (exerciseInput.name.trim()) {
      const newExercise = {
        name: exerciseInput.name.trim(),
        sets: exerciseInput.sets ? parseInt(exerciseInput.sets) : undefined,
        reps: exerciseInput.reps || undefined,
        description: exerciseInput.description || undefined
      };
      setFormData({
        ...formData,
        exercises: [...formData.exercises, newExercise]
      });
      setExerciseInput({ name: "", sets: "", reps: "", description: "" });
    }
  };

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    });
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    return match ? match[1] : null;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "strength": return "bg-blue-100 text-blue-800";
      case "cardio": return "bg-green-100 text-green-800";
      case "hiit": return "bg-red-100 text-red-800";
      case "flexibility": return "bg-purple-100 text-purple-800";
      case "yoga": return "bg-indigo-100 text-indigo-800";
      case "calisthenics": return "bg-orange-100 text-orange-800";
      case "tutorial": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workout Management</h1>
              <p className="text-gray-600 mt-2">Create and manage workout videos and programs</p>
            </div>
            <div className="flex gap-4">
              <Link href="/workouts">
                <Button variant="outline">View Public Page</Button>
              </Link>
              <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
                <Plus className="w-4 h-4 mr-2" />
                Add Workout
              </Button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {isCreating && (
            <Card className="mb-8 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingId ? "Edit Workout" : "Create New Workout"}
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Workout title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">YouTube Video URL</label>
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Workout description"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Category and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strength">Strength</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="hiit">HIIT</SelectItem>
                          <SelectItem value="flexibility">Flexibility</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="calisthenics">Calisthenics</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration (min)</label>
                      <Input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                        min="1"
                        max="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Calories Burned</label>
                      <Input
                        type="number"
                        value={formData.caloriesBurned}
                        onChange={(e) => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) || 0 })}
                        min="50"
                        max="1000"
                      />
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Equipment</label>
                    <div className="flex gap-2">
                      <Input
                        value={equipmentInput}
                        onChange={(e) => setEquipmentInput(e.target.value)}
                        placeholder="Add equipment (e.g. Dumbbells, Resistance bands)"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                      />
                      <Button type="button" onClick={addEquipment}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.equipment.map((item, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {item}
                          <button type="button" onClick={() => removeEquipment(index)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Exercises */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Exercises</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input
                        value={exerciseInput.name}
                        onChange={(e) => setExerciseInput({ ...exerciseInput, name: e.target.value })}
                        placeholder="Exercise name"
                      />
                      <Input
                        value={exerciseInput.sets}
                        onChange={(e) => setExerciseInput({ ...exerciseInput, sets: e.target.value })}
                        placeholder="Sets (optional)"
                        type="number"
                      />
                      <Input
                        value={exerciseInput.reps}
                        onChange={(e) => setExerciseInput({ ...exerciseInput, reps: e.target.value })}
                        placeholder="Reps (e.g. 10-12)"
                      />
                      <Button type="button" onClick={addExercise}>Add Exercise</Button>
                    </div>
                    <Input
                      value={exerciseInput.description}
                      onChange={(e) => setExerciseInput({ ...exerciseInput, description: e.target.value })}
                      placeholder="Exercise description (optional)"
                    />
                    <div className="space-y-2">
                      {formData.exercises.map((exercise, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{exercise.name}</span>
                            {exercise.sets && exercise.reps && (
                              <span className="text-sm text-gray-600 ml-2">
                                {exercise.sets} sets × {exercise.reps}
                              </span>
                            )}
                            {exercise.description && (
                              <p className="text-sm text-gray-600">{exercise.description}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExercise(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button type="submit" disabled={createWorkoutMutation.isPending || updateWorkoutMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Update Workout" : "Create Workout"}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Workouts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => {
              const youtubeId = workout.videoUrl ? extractYouTubeId(workout.videoUrl) : null;
              
              return (
                <Card key={workout.id} className="overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  {/* Video Thumbnail */}
                  {youtubeId && (
                    <div className="relative">
                      <img 
                        src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                        alt={workout.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 rounded-full p-2">
                          <Play className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getCategoryColor(workout.category)}>
                        {workout.category}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(workout.difficulty)}>
                        {workout.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{workout.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{workout.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {workout.duration} min
                      </span>
                      <span className="flex items-center">
                        <Flame className="w-4 h-4 mr-1" />
                        {workout.caloriesBurned} cal
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(workout)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this workout?")) {
                            deleteWorkoutMutation.mutate(workout.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                      <Link href={`/workouts/${workout.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {workouts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No workouts yet</h3>
              <p className="text-gray-600 mb-4">Create your first workout to get started</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Workout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}