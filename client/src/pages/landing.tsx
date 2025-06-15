import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { BookPromotion } from "@/components/BookPromotion";
import { Dumbbell, Utensils, Target, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Get Up Earlier
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Transform your health and fitness with expert guidance from certified professionals. 
            Access personalized nutrition plans, effective workouts, and proven strategies to achieve your wellness goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Utensils className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nutrition Guidance</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Expert-crafted recipes and meal plans for optimal health and performance
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Dumbbell className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Effective Workouts</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Professional training programs designed for real results
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Goal Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Advanced calculators and tools to monitor your progress
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expert Coaching</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                30+ years of certified professional experience guiding you
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Book Promotion - temporarily commented out */}
        {/* <div className="max-w-3xl mx-auto mb-16">
          <BookPromotion />
        </div> */}

        {/* About Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Expert Guidance You Can Trust
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Led by Michael Baker, ISSA Personal Trainer with over 30 years of experience helping people 
              achieve their health and fitness goals through proven, sustainable methods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Professional Credentials
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• ISSA Certified Personal Trainer</li>
                <li>• Integrative Nutrition Health Coach</li>
                <li>• ISSA Running Coach</li>
                <li>• RYT 200 Yoga Instructor</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                What You'll Get
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Authentic, tested recipes</li>
                <li>• Professional workout routines</li>
                <li>• Advanced nutrition calculators</li>
                <li>• Personalized meal planning</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}