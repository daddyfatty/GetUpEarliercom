import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calculator, Calendar } from "lucide-react";

export default function SavedResults() {
  const { data: savedResults, isLoading, error } = useQuery({
    queryKey: ["/api/user/saved-results"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">Loading your saved results...</div>
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
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up Required</h3>
              <p className="text-gray-600 mb-4">Create an account to save your calculation results.</p>
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
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Saved Results</h1>
          <p className="text-white/80">Your calculation history and results</p>
        </div>

        {!savedResults || savedResults.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Results Yet</h3>
              <p className="text-gray-600 mb-4">Use our calculators and save your results to track your progress!</p>
              <div className="space-y-2">
                <a 
                  href="/calorie-calculator"
                  className="block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors"
                >
                  Calorie Calculator
                </a>
                <a 
                  href="/body-fat-calculator"
                  className="block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  Body Fat Calculator
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedResults.map((result: any, index: number) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 capitalize">
                      {result.type.replace('-', ' ')} Result
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(result.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.type === 'calorie-calculator' && (
                      <>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">BMR:</span>
                            <p className="text-lg font-semibold">{Math.round(result.data.bmr)} cal</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">TDEE:</span>
                            <p className="text-lg font-semibold">{Math.round(result.data.tdee)} cal</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Daily Calories:</span>
                            <p className="text-lg font-semibold text-orange-600">{Math.round(result.data.calories)} cal</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Goal:</span>
                            <p className="text-sm capitalize">{result.data.goal}</p>
                          </div>
                        </div>
                        {result.data.macros && (
                          <div className="border-t pt-3">
                            <span className="font-medium text-gray-600 text-sm">Macros:</span>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              <div className="text-center">
                                <p className="text-sm font-semibold">{result.data.macros.carbs}g</p>
                                <p className="text-xs text-gray-500">Carbs</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-semibold">{result.data.macros.protein}g</p>
                                <p className="text-xs text-gray-500">Protein</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-semibold">{result.data.macros.fat}g</p>
                                <p className="text-xs text-gray-500">Fat</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {result.type === 'body-fat-calculator' && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {result.data.bodyFatPercentage}%
                        </div>
                        <p className="text-sm text-gray-600">Body Fat Percentage</p>
                        {result.data.category && (
                          <Badge className="mt-2" variant="secondary">
                            {result.data.category}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}