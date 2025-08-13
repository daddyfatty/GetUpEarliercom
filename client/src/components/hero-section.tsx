import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Dumbbell, ChefHat, ExternalLink, Zap, Heart, Target, User } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { HeroGradient } from "@/components/hero-gradient";

export function HeroSection() {
  return (
    <HeroGradient className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-2 sm:pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start min-h-[400px] sm:min-h-[500px]">
          <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-80 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <div className="flex flex-col pt-8 sm:pt-12 h-full">
            <div className="flex flex-col">
              <p className="text-sm text-blue-300 mb-2 tracking-wider uppercase">Get Up Earlier | Strength & Nutrition age 40+</p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight font-brand">
                Bridging the gap from inactivity and poor diet to strength and healthy habits
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col pt-8 sm:pt-12 h-full">
            {/* Services Grid */}
            <div>
              <p className="text-blue-300 text-sm font-medium mb-2 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" />
                1-on-1 Services
              </p>
              <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/services/personal-strength-training" className="group">
                    <div className="bg-slate-950/95 hover:bg-slate-900/95 backdrop-blur-sm rounded-lg p-5 transition-all duration-200 cursor-pointer border border-slate-600/50 hover:border-blue-400/50">
                      <div className="flex items-center gap-3">
                        <img 
                          src="/attached_assets/download - 2025-06-20T164725.183_1750453386689.png" 
                          alt="Personal Training" 
                          className="w-8 h-8 rounded-md object-cover flex-shrink-0 border border-gray-600"
                          style={{width: '35px', height: '35px'}} 
                        />
                        <span className="text-white font-medium text-sm group-hover:text-blue-200 transition-colors">
                          1-on-1 Personal Strength Training
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/services/virtual-nutrition-coaching" className="group">
                    <div className="bg-slate-950/95 hover:bg-slate-900/95 backdrop-blur-sm rounded-lg p-5 transition-all duration-200 cursor-pointer border border-slate-600/50 hover:border-blue-400/50">
                      <div className="flex items-center gap-3">
                        <img 
                          src="/assets/download - 2025-06-20T170333.649_1750453429860.png" 
                          alt="Nutrition Coaching" 
                          className="w-8 h-8 rounded-md object-cover flex-shrink-0 border border-gray-600"
                          style={{width: '35px', height: '35px'}} 
                        />
                        <span className="text-white font-medium text-sm group-hover:text-blue-200 transition-colors">
                          Virtual Nutrition Coaching
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/services/accountability-coaching" className="group">
                    <div className="bg-slate-950/95 hover:bg-slate-900/95 backdrop-blur-sm rounded-lg p-5 transition-all duration-200 cursor-pointer border border-slate-600/50 hover:border-blue-400/50">
                      <div className="flex items-center gap-3">
                        <img 
                          src="/assets/678aad8cfd0dcde677a14418_hike2-p-800_1750453452584.jpg" 
                          alt="Accountability Coaching" 
                          className="w-8 h-8 rounded-md object-cover flex-shrink-0 border border-gray-600"
                          style={{width: '35px', height: '35px'}} 
                        />
                        <span className="text-white font-medium text-sm group-hover:text-blue-200 transition-colors">
                          Accountability Coaching
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/services/certified-running-coaching" className="group">
                    <div className="bg-slate-950/95 hover:bg-slate-900/95 backdrop-blur-sm rounded-lg p-5 transition-all duration-200 cursor-pointer border border-slate-600/50 hover:border-blue-400/50">
                      <div className="flex items-center gap-3">
                        <img 
                          src="/attached_assets/download - 2025-06-20T170430.001_1750453483739.png" 
                          alt="Running Coaching" 
                          className="w-8 h-8 rounded-md object-cover flex-shrink-0 border border-gray-600"
                          style={{width: '35px', height: '35px'}} 
                        />
                        <span className="text-white font-medium text-sm group-hover:text-blue-200 transition-colors">
                          Certified Running Coaching
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="https://EricaLeeBaker.com" target="_blank" className="group">
                    <div className="bg-slate-950/95 hover:bg-slate-900/95 backdrop-blur-sm rounded-lg p-5 transition-all duration-200 cursor-pointer border border-slate-600/50 hover:border-blue-400/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src="/assets/download - 2025-06-20T170516.226_1750453530152.png" 
                            alt="Private Yoga" 
                            className="w-8 h-8 rounded-md object-cover flex-shrink-0 border border-gray-600"
                            style={{width: '35px', height: '35px'}} 
                          />
                          <span className="text-white font-medium text-sm group-hover:text-blue-200 transition-colors">
                            Private Yoga
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-blue-300 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="https://EricaLeeBaker.com" target="_blank" className="group">
                    <div className="bg-slate-950/95 hover:bg-slate-900/95 backdrop-blur-sm rounded-lg p-5 transition-all duration-200 cursor-pointer border border-slate-600/50 hover:border-blue-400/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src="/assets/download - 2025-06-20T170538.818_1750453554236.png" 
                            alt="Small Group Yoga" 
                            className="w-8 h-8 rounded-md object-cover flex-shrink-0 border border-gray-600"
                            style={{width: '35px', height: '35px'}} 
                          />
                          <span className="text-white font-medium text-sm group-hover:text-blue-200 transition-colors">
                            Small Group Yoga
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-blue-300 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* View All Services Button */}
                <Link href="/services">
                  <Button 
                    className="w-full mt-4 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: '#39298A' }}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    View All Services
                  </Button>
                </Link>
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </HeroGradient>
  );
}
