import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeCard } from "@/components/recipe-card";
import { Heart, ChefHat } from "lucide-react";

export default function Favorites() {
  const { data: favoriteRecipes, isLoading, error } = useQuery({
    queryKey: ["/api/users/dev_user_1/favorites"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">Loading your favorites...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up Required</h3>
              <p className="text-gray-600 mb-4">Create an account to save your favorite recipes and workouts.</p>
              <button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors"
              >
                Sign Up Now
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
          <p className="text-white/80">Your saved recipes and workouts</p>
        </div>

        {!favoriteRecipes || favoriteRecipes.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <ChefHat className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
              <p className="text-gray-600 mb-4">Start exploring recipes and workouts to build your collection!</p>
              <div className="space-y-2">
                <a 
                  href="/recipes"
                  className="block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors"
                >
                  Browse Recipes
                </a>
                <a 
                  href="/workouts"
                  className="block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  Browse Workouts
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {favoriteRecipes.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Favorite Recipes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteRecipes.map((recipe: any) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}