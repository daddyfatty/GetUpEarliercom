import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Zap, Target, Heart, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="px-4 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Get Up <span className="text-green-600">Earlier</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your health with personalized nutrition, expert workouts, and professional coaching. 
            Start your wellness journey with 30 years of proven expertise.
          </p>
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Personalized Nutrition</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Custom meal plans and recipes tailored to your goals, dietary preferences, and lifestyle.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Expert Workouts</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Professional workout routines designed by certified trainers for all fitness levels.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Progress Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced calculators and tracking tools to monitor your health and fitness progress.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-20 shadow-lg">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">30+</div>
              <div className="text-gray-600 dark:text-gray-300">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-300">Success Stories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Healthy Recipes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-300">Expert Support</div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center mb-20">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-current text-yellow-400" />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl mb-4 italic">
            "Get Up Earlier transformed my relationship with health and fitness. The personalized approach and expert guidance made all the difference."
          </blockquote>
          <cite className="text-green-100">- Sarah M., Certified Success Story</cite>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands who have already started their wellness journey with our proven system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
              onClick={() => window.location.href = '/api/login'}
            >
              <Users className="mr-2 h-5 w-5" />
              Join Now - It's Free
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
            >
              <Heart className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Get Up Earlier. Empowering your health journey with 30 years of expertise.
          </p>
        </div>
      </footer>
    </div>
  );
}