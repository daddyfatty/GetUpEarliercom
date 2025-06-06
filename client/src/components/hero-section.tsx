import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Transform Your Health,{" "}
              <span className="text-emerald-200">One Day Earlier</span>
            </h1>
            <p className="text-xl mb-8 text-emerald-100">
              Bridge the gap from inactivity to strength with personalized nutrition, 
              workouts, and accountability coaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/recipes">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 font-semibold"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/recipes">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold"
                >
                  View Recipes
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="People exercising outdoors" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            
            {/* Floating success card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-full">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">500+ Success Stories</p>
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
