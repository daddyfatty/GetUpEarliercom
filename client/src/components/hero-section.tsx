import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Dumbbell, ChefHat, ExternalLink } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { HeroGradient } from "@/components/hero-gradient";

export function HeroSection() {
  return (
    <HeroGradient className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch min-h-[400px] sm:min-h-[500px]">
          <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-80 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <div className="flex flex-col justify-between pt-4 sm:pt-8 h-full">
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm text-blue-200 mb-2 sm:mb-3 tracking-wider uppercase">Get Up Earlier | Strength & Nutrition age 40+</p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-6 sm:mb-8 font-brand">
                Bridging the gap from inactivity and poor diet to strength and healthy habits
              </h1>

            </div>
          </div>
          
          <div className="flex flex-col justify-start pt-4 sm:pt-8 space-y-3 sm:space-y-4 h-full">
            {/* Services Grid */}
            <div>
              <p className="text-purple-300 text-sm font-medium mb-4 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" />
                Coaching Services
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/services/personal-strength-training" className="group">
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 cursor-pointer border border-white/10 hover:border-purple-400/30">
                      <span className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                        1-on-1 Personal Strength Training
                      </span>
                    </div>
                  </Link>
                  
                  <Link href="/services/virtual-nutrition-coaching" className="group">
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 cursor-pointer border border-white/10 hover:border-purple-400/30">
                      <span className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                        Virtual Nutrition Coaching
                      </span>
                    </div>
                  </Link>
                  
                  <Link href="/services/accountability-coaching" className="group">
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 cursor-pointer border border-white/10 hover:border-purple-400/30">
                      <span className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                        Accountability Coaching
                      </span>
                    </div>
                  </Link>
                  
                  <Link href="/services/certified-running-coaching" className="group">
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 cursor-pointer border border-white/10 hover:border-purple-400/30">
                      <span className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                        Certified Running Coaching
                      </span>
                    </div>
                  </Link>
                  
                  <Link href="https://EricaLeeBaker.com" target="_blank" className="group">
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 cursor-pointer border border-white/10 hover:border-purple-400/30">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                          Private Yoga
                        </span>
                        <ExternalLink className="w-4 h-4 text-purple-300 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="https://EricaLeeBaker.com" target="_blank" className="group">
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 cursor-pointer border border-white/10 hover:border-purple-400/30">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                          Small Group Yoga
                        </span>
                        <ExternalLink className="w-4 h-4 text-purple-300 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* View All Services Button */}
                <Link href="/services">
                  <Button 
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    View All Services
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Facebook Group Section */}
            <div>
              <div 
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 transform"
                onClick={() => window.open('https://www.facebook.com/groups/getupearlier', '_blank')}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors duration-300">
                    <SiFacebook className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">900+ Members Facebook Group</h3>
                    <p className="text-blue-100">Join the community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroGradient>
  );
}
