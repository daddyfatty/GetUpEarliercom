import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Recipe, Workout } from "@shared/schema";

const DEVELOPMENT_USER_ID = "dev_user_1";

export function useFavorites() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's favorite recipes
  const { data: favoriteRecipes = [] } = useQuery<Recipe[]>({
    queryKey: [`/api/users/${DEVELOPMENT_USER_ID}/favorites`],
    retry: false,
  });

  // Fetch user's favorite workouts
  const { data: favoriteWorkouts = [] } = useQuery<Workout[]>({
    queryKey: [`/api/users/${DEVELOPMENT_USER_ID}/favorite-workouts`],
    retry: false,
  });

  // Check if a recipe is favorited
  const isRecipeFavorited = useCallback((recipeId: number) => {
    return favoriteRecipes.some((recipe: Recipe) => recipe.id === recipeId);
  }, [favoriteRecipes]);

  // Check if a workout is favorited
  const isWorkoutFavorited = useCallback((workoutId: number) => {
    return favoriteWorkouts.some((workout: Workout) => workout.id === workoutId);
  }, [favoriteWorkouts]);

  // Add recipe to favorites
  const addRecipeFavorite = useMutation({
    mutationFn: async (recipeId: number) => {
      return apiRequest("POST", `/api/users/${DEVELOPMENT_USER_ID}/favorites`, {
        recipeId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEVELOPMENT_USER_ID}/favorites`] });
      toast({
        title: "Added to Favorites",
        description: "Recipe saved to your favorites!",
      });
    },
    onError: (error) => {
      console.error("Error adding recipe favorite:", error);
      toast({
        title: "Error",
        description: "Failed to add recipe to favorites",
        variant: "destructive",
      });
    },
  });

  // Remove recipe from favorites
  const removeRecipeFavorite = useMutation({
    mutationFn: async (recipeId: number) => {
      return apiRequest("DELETE", `/api/users/${DEVELOPMENT_USER_ID}/favorites/${recipeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEVELOPMENT_USER_ID}/favorites`] });
      toast({
        title: "Removed from Favorites",
        description: "Recipe removed from your favorites",
      });
    },
    onError: (error) => {
      console.error("Error removing recipe favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove recipe from favorites",
        variant: "destructive",
      });
    },
  });

  // Add workout to favorites
  const addWorkoutFavorite = useMutation({
    mutationFn: async (workoutId: number) => {
      return apiRequest("POST", `/api/users/${DEVELOPMENT_USER_ID}/favorite-workouts`, {
        workoutId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEVELOPMENT_USER_ID}/favorite-workouts`] });
      toast({
        title: "Added to Favorites",
        description: "Workout saved to your favorites!",
      });
    },
    onError: (error) => {
      console.error("Error adding workout favorite:", error);
      toast({
        title: "Error",
        description: "Failed to add workout to favorites",
        variant: "destructive",
      });
    },
  });

  // Remove workout from favorites
  const removeWorkoutFavorite = useMutation({
    mutationFn: async (workoutId: number) => {
      return apiRequest("DELETE", `/api/users/${DEVELOPMENT_USER_ID}/favorite-workouts/${workoutId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEVELOPMENT_USER_ID}/favorite-workouts`] });
      toast({
        title: "Removed from Favorites",
        description: "Workout removed from your favorites",
      });
    },
    onError: (error) => {
      console.error("Error removing workout favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove workout from favorites",
        variant: "destructive",
      });
    },
  });

  // Toggle recipe favorite
  const toggleRecipeFavorite = useCallback((recipeId: number) => {
    if (isRecipeFavorited(recipeId)) {
      removeRecipeFavorite.mutate(recipeId);
    } else {
      addRecipeFavorite.mutate(recipeId);
    }
  }, [isRecipeFavorited, addRecipeFavorite, removeRecipeFavorite]);

  // Toggle workout favorite
  const toggleWorkoutFavorite = useCallback((workoutId: number) => {
    if (isWorkoutFavorited(workoutId)) {
      removeWorkoutFavorite.mutate(workoutId);
    } else {
      addWorkoutFavorite.mutate(workoutId);
    }
  }, [isWorkoutFavorited, addWorkoutFavorite, removeWorkoutFavorite]);

  return {
    favoriteRecipes,
    favoriteWorkouts,
    isRecipeFavorited,
    isWorkoutFavorited,
    toggleRecipeFavorite,
    toggleWorkoutFavorite,
    isLoading: addRecipeFavorite.isPending || 
              removeRecipeFavorite.isPending || 
              addWorkoutFavorite.isPending || 
              removeWorkoutFavorite.isPending,
  };
}