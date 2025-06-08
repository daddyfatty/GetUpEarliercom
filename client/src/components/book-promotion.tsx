import { Button } from "@/components/ui/button";
import { Star, Leaf, Clock, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

import _493414479_10213588193416986_7983427679426833080_n from "@assets/493414479_10213588193416986_7983427679426833080_n.jpg";

export function BookPromotion() {
  const [, navigate] = useLocation();

  const handlePurchase = (type: string) => {
    navigate(`/checkout?type=${type}`);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hero-gradient rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-brand">
                Get Up Earlier
                <span className="block text-blue-200">Recipe Book</span>
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Transform your relationship with food through clean eating recipes designed for personal training clients. 
                Bridge the gap from poor diet to healthy habits with nutrition that actually works.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">150+</div>
                  <div className="text-blue-200">Clean Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">12</div>
                  <div className="text-blue-200">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">Lifetime</div>
                  <div className="text-blue-200">Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">4.9★</div>
                  <div className="text-blue-200">Rating</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 font-semibold"
                  onClick={() => handlePurchase('digital')}
                >
                  Digital Download - $29
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold"
                  onClick={() => handlePurchase('hardcopy')}
                >
                  Hardcopy - $39
                </Button>
              </div>

              <div className="mt-6 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
                  ))}
                </div>
                <span className="text-emerald-200">4.9/5 from 2,847 reviews</span>
              </div>
            </div>

            <div className="relative">
              <img 
                src={_493414479_10213588193416986_7983427679426833080_n} 
                alt="Get Up Earlier Recipe Book" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              
              {/* Floating testimonial */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-xs">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Sarah M.</p>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  "This book changed my relationship with food. The recipes are delicious and easy to follow!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Book Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Clean Ingredients
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every recipe uses whole, unprocessed ingredients that nourish your body and taste amazing.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Quick & Easy
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Most recipes take 30 minutes or less, perfect for busy lifestyles and meal prep.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Detailed Nutrition
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Complete nutritional breakdown for every recipe to help you meet your health goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
