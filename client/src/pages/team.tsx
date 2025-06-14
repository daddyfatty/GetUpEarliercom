import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";
import ericaPath from "@assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg";
import personalTrainerBadge from "@assets/67910d333568168655f4b0e8_Badges-PT (1)_1749504702546.png";
import nutritionBadge from "@assets/67910ddf1426fe137b7a5cfa_HCTP_INHC_Badge (1)-p-500 (1)_1749504702546.png";
import runningCoachBadge from "@assets/67910e09c2597e3ff6174ecb_Badges-run-coach (1)_1749504702546.png";
import rytMikeBadge from "@assets/RYTMIKE_1749505314924.png";
import eryBadge from "@assets/67910e23033a488a11f42952_erty (1)_1749505199203.png";
import yaerBadge from "@assets/YAER_1749505224126.png";

export default function Team() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-900/20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(var(--coaching-primary))] via-purple-700 to-[hsl(var(--coaching-accent))] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              Expert Team
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Meet Our Team
            </h1>
            <p className="text-xl lg:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              Certified professionals with decades of combined experience, dedicated to transforming lives through personalized health and fitness coaching
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-24 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">
            
            {/* Michael Baker */}
            <Link href="/team/michael">
              <Card className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 group bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
                <div className="relative">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--coaching-primary))]/5 via-purple-500/5 to-[hsl(var(--coaching-accent))]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="text-center p-8 relative z-10">
                    <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 group-hover:ring-purple-200 transition-all duration-300">
                      <img 
                        src={headshotPath} 
                        alt="Michael Baker" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <CardTitle className="text-3xl font-bold mb-2 text-gray-900 group-hover:text-[hsl(var(--coaching-primary))] transition-colors">
                      Michael Baker
                    </CardTitle>
                    
                    <CardDescription className="text-lg mb-6 text-gray-600 leading-relaxed max-w-md mx-auto">
                      Certified Personal Trainer, Integrative Nutrition Health Coach & Running Coach
                    </CardDescription>
                    
                    {/* Professional Certification Badges */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Professional Certifications</h4>
                      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={personalTrainerBadge} 
                            alt="ISSA Personal Trainer" 
                            className="h-12 w-auto mx-auto"
                          />
                          <p className="text-xs text-gray-600 mt-1 font-medium">ISSA Personal Trainer</p>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={nutritionBadge} 
                            alt="Integrative Nutrition Health Coach" 
                            className="h-12 w-auto mx-auto"
                          />
                          <p className="text-xs text-gray-600 mt-1 font-medium">Nutrition Coach</p>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={runningCoachBadge} 
                            alt="ISSA Running Coach" 
                            className="h-12 w-auto mx-auto"
                          />
                          <p className="text-xs text-gray-600 mt-1 font-medium">Running Coach</p>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={rytMikeBadge} 
                            alt="RYT 200 Yoga Teacher" 
                            className="h-12 w-auto mx-auto"
                          />
                          <p className="text-xs text-gray-600 mt-1 font-medium">RYT 200 Yoga</p>
                        </div>
                      </div>
                    </div>
                    

                    
                    <Button className="bg-gradient-to-r from-[hsl(var(--coaching-primary))] to-purple-600 hover:from-purple-700 hover:to-[hsl(var(--coaching-accent))] text-white px-8 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      View Full Profile
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardHeader>
                </div>
              </Card>
            </Link>

            {/* Erica Baker */}
            <Link href="/team/erica">
              <Card className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 group bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
                <div className="relative">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--coaching-primary))]/5 via-purple-500/5 to-[hsl(var(--coaching-accent))]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="text-center p-8 relative z-10">
                    <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 group-hover:ring-purple-200 transition-all duration-300">
                      <img 
                        src={ericaPath} 
                        alt="Erica Baker" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <CardTitle className="text-3xl font-bold mb-2 text-gray-900 group-hover:text-[hsl(var(--coaching-primary))] transition-colors">
                      Erica Baker
                    </CardTitle>
                    
                    <CardDescription className="text-lg mb-6 text-gray-600 leading-relaxed max-w-md mx-auto">
                      E-RYT 200 Experienced Registered Yoga Teacher
                    </CardDescription>
                    
                    {/* Professional Certification Badges */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Professional Certifications</h4>
                      <div className="flex justify-center gap-6 max-w-sm mx-auto">
                        <div className="bg-white/80 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow flex-1">
                          <img 
                            src={eryBadge} 
                            alt="E-RYT 200 Yoga Teacher" 
                            className="h-14 w-auto mx-auto"
                          />
                          <p className="text-xs text-gray-600 mt-2 font-medium">E-RYT 200 Yoga Alliance</p>
                        </div>
                        <div className="bg-white/80 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow flex-1">
                          <img 
                            src={yaerBadge} 
                            alt="Yoga Alliance E-RYT" 
                            className="h-14 w-auto mx-auto"
                          />
                          <p className="text-xs text-gray-600 mt-2 font-medium">Yoga Alliance Certified</p>
                        </div>
                      </div>
                    </div>
                    

                    
                    <Button className="bg-gradient-to-r from-[hsl(var(--coaching-primary))] to-purple-600 hover:from-purple-700 hover:to-[hsl(var(--coaching-accent))] text-white px-8 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      View Full Profile
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardHeader>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}