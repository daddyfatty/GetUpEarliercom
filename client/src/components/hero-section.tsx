import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Dumbbell, ChefHat } from "lucide-react";
import { SiFacebook } from "react-icons/si";

import _20250517_073713_00_00_08_03_Still003 from "@assets/20250517_073713.00_00_08_03.Still003.jpg";

export function HeroSection() {
  return (
    <section className="hero-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-brand">Back to Basics: Strength Training, Clean Eating & Accountability</h1>
            <p className="text-xl mb-8 text-blue-100">
              Bridge the gap from inactivity and poor diet to strength and healthy habits. 
              Strength training, nutrition coaching, and accountability that actually works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/recipes" className="w-full sm:w-auto">
                <Button 
                  className="w-full font-semibold text-white hover:opacity-90 border-2 border-transparent px-8 py-4 text-lg"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  View Recipes
                </Button>
              </Link>
              <Link href="/workouts" className="w-full sm:w-auto">
                <Button 
                  className="w-full font-semibold text-black hover:opacity-90 px-8 py-4 text-lg"
                  style={{ backgroundColor: '#B3D7E9' }}
                >
                  View Workouts
                </Button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <Button 
                  className="w-full bg-[hsl(var(--coaching-primary))] hover:bg-[hsl(var(--coaching-primary))]/90 text-white font-semibold px-8 py-4 text-lg"
                >
                  View Services
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={_20250517_073713_00_00_08_03_Still003} 
              alt="People exercising outdoors" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            
            {/* Floating Facebook group card */}
            <div 
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => window.open('https://www.facebook.com/groups/getupearlier', '_blank')}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-full">
                  <SiFacebook className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">1000+ Members Facebook Group</p>
                  <p className="text-sm text-gray-600">Join the community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
