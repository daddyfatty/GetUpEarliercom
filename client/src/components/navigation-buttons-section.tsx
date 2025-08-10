import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiFacebook } from "react-icons/si";

export function NavigationButtonsSection() {
  return (
    <section className="py-8 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Facebook Group Section - Left Side */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div 
              className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 transform"
              onClick={() => window.open('https://www.facebook.com/groups/getupearlier', '_blank')}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors duration-300">
                  <SiFacebook className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">900+ Members Facebook Group</h3>
                  <p className="text-blue-100 text-sm">Join the community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Right Side */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services" className="flex-1">
                <Button 
                  className="w-full text-white font-semibold px-8 py-4 text-lg shadow-lg hover:opacity-90 transition-all duration-200"
                  style={{ backgroundColor: '#7C3AED' }}
                >
                  Services
                </Button>
              </Link>
              <Link href="/recipes" className="flex-1">
                <Button 
                  className="w-full font-semibold text-white hover:opacity-90 border-2 border-transparent px-8 py-4 text-lg shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  Recipes
                </Button>
              </Link>
              <Link href="/workouts" className="flex-1">
                <Button 
                  className="w-full font-semibold text-black hover:opacity-90 px-8 py-4 text-lg shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#B3D7E9' }}
                >
                  Workouts & Challenges
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}