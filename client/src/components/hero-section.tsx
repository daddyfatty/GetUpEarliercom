import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar } from "lucide-react";

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/workouts">
                <Button 
                  size="lg"
                  className="font-semibold text-black hover:opacity-90 w-full"
                  style={{ backgroundColor: '#B3D7E9' }}
                >
                  View Workouts
                </Button>
              </Link>
              <Link href="/recipes">
                <Button 
                  size="lg"
                  className="font-semibold text-white hover:opacity-90 border-2 border-transparent w-full"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  View Recipes
                </Button>
              </Link>
              <Link href="/coaching">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[hsl(var(--coaching-primary))] to-[hsl(var(--coaching-accent))] hover:from-[hsl(var(--coaching-primary))]/90 hover:to-[hsl(var(--coaching-accent))]/90 text-white font-semibold w-full"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Personal Coaching
                </Button>
              </Link>
              <Button 
                size="lg"
                className="bg-white text-[hsl(var(--coaching-text))] hover:bg-[hsl(var(--coaching-light))] border-2 border-[hsl(var(--coaching-primary))] font-semibold w-full"
                onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Free Consultation
              </Button>
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
                <div className="bg-primary p-2 rounded-full">
                  <Trophy className="w-5 h-5 text-white" />
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
