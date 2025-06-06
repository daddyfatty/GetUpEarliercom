import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorkoutCard } from "@/components/workout-card";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import type { Workout } from "@shared/schema";

export default function Workouts() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: workouts = [], isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts", { category: categoryFilter !== "all" ? categoryFilter : undefined }],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading workouts...</p>
        </div>
      </div>
    );
  }

  const categories = [
    { value: "all", label: "All Workouts" },
    { value: "strength", label: "Strength" },
    { value: "cardio", label: "Cardio" },
    { value: "flexibility", label: "Flexibility" },
    { value: "hiit", label: "HIIT" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Workout Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Simple, effective workouts for every fitness level. From beginner-friendly routines to advanced challenges.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={categoryFilter === category.value ? "default" : "outline"}
              onClick={() => setCategoryFilter(category.value)}
              className={
                categoryFilter === category.value
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Workout Grid */}
        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No workouts found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try selecting a different category to find workouts.
            </p>
            <Button 
              onClick={() => setCategoryFilter("all")}
              variant="outline"
            >
              Show All Workouts
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}

        {workouts.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Showing {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
