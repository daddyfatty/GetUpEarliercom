import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CredentialsBand } from "@/components/credentials-band";
import { ServicesGrid } from "@/components/services-grid";
import { ArrowLeft, Award, Calendar, Users, Heart, Target, Dumbbell, Zap, User, ChevronDown, ChevronUp } from "lucide-react";

import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";
import ericaPath from "@assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg";
import personalTrainerBadge from "@assets/67910d333568168655f4b0e8_Badges-PT (1)_1749504702546.png";
import nutritionBadge from "@assets/67910ddf1426fe137b7a5cfa_HCTP_INHC_Badge (1)-p-500 (1)_1749504702546.png";
import runningCoachBadge from "@assets/67910e09c2597e3ff6174ecb_Badges-run-coach (1)_1749504702546.png";
import rytMikeBadge from "@assets/RYTMIKE_1749505314924.png";
import eryBadge from "@assets/67910e23033a488a11f42952_erty (1)_1749505199203.png";
import yaerBadge from "@assets/YAER_1749505224126.png";

// Gym/Yoga Space Images
import gymSpace from "@assets/download - 2025-06-23T105919.083_1750690773931.png";
import yogaSpace from "@assets/download - 2025-06-23T105922.235_1750690773931.png";
import ericaYogaPose from "@assets/download - 2025-06-23T105914.482_1750690773931.png";
import michaelHeadshot from "@assets/download - 2025-06-23T105909.352_1750690773932.png";

export default function About() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Meet the Team
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-black dark:text-white">About</span><br className="hidden sm:block" />
            <span className="text-blue-900 dark:text-blue-400">Get Up Earlier</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            1-on-1 Strength Training, Nutrition, Yoga & Accountability Coaching
          </p>
        </div>

        {/* Michael Baker Section */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="mb-6">
                  <Badge className="mb-2">Founder & Head Coach</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Michael Baker
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    I'm driven by the belief that everyone deserves to feel strong and confident in their own skin. 
                    My journey began with my own transformation - from being out of shape to becoming a certified 
                    personal trainer and nutrition coach. I've dedicated my career to helping people unlock their 
                    potential through personalized training and nutrition guidance.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    With multiple certifications and years of experience, I specialize in creating sustainable 
                    programs that fit your lifestyle. Whether you're just starting your fitness journey or 
                    looking to break through plateaus, I'm here to provide the support and expertise you need.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">ISSA Certified Personal Trainer</Badge>
                    <Badge variant="outline">ISSA Certified Running Coach</Badge>
                    <Badge variant="outline">IIN Certified Nutrition Coach</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <img src={personalTrainerBadge} alt="ISSA Personal Trainer" className="h-4" />
                    <img src={runningCoachBadge} alt="ISSA Running Coach" className="h-4" />
                    <img src={nutritionBadge} alt="IIN Nutrition Coach" className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative">
                  <img 
                    src={headshotPath} 
                    alt="Michael Baker - Certified Personal Trainer" 
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Erica Baker Section */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <div className="relative">
                  <img 
                    src={ericaPath} 
                    alt="Erica Baker - Certified Yoga Instructor" 
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
              <div className="order-2">
                <div className="mb-6">
                  <div className="text-center">
                    <div className="bg-[#F0886A] text-black px-4 py-2 font-bold text-lg rounded-t-lg">
                      ERICA LEE BAKER YOGA
                    </div>
                    <div className="bg-[#A8E6B2] p-6 rounded-b-lg">
                      <div className="mb-4">
                        <p className="text-gray-800 mb-4">
                          Erica brings over 15 years of experience helping people discover their inner strength and flexibility. 
                          Her gentle approach creates a safe space for practitioners of all levels to explore movement, 
                          mindfulness, and personal growth.
                        </p>
                        <p className="text-gray-800 mb-4">
                          With extensive training in various yoga styles, Erica specializes in creating personalized 
                          sequences that honor your body's unique needs and limitations. Her classes blend physical 
                          practice with meditation and breathwork for a truly transformative experience.
                        </p>
                        <div className="flex justify-center mb-4">
                          <span className="bg-[#F0886A] text-black px-4 py-2 rounded-full text-sm font-bold">
                            15+ Years Experience
                          </span>
                        </div>
                        <div className="flex justify-center mb-4">
                          <img src={rytMikeBadge} alt="RYT-200" className="h-5 w-5 mr-2" />
                          <img src={eryBadge} alt="Advanced Certification" className="h-5 w-5 mr-2" />
                          <img src={yaerBadge} alt="Yoga Alliance" className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold mb-2">Class Schedule</h3>
                        <div className="text-sm text-gray-600">
                          <p>Small Group Yoga:</p>
                          <p>• Saturdays 8:00-9:00 AM</p>
                          <p>• Wednesdays 9:00-10:00 AM</p>
                          <p>• $25 per class</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* In-Home Private Boutique Section */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16 -mx-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-left mb-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                In-Home Private Boutique
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Fitness Space Orange, CT
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={gymSpace} 
                  alt="Private Strength Training Studio" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={yogaSpace} 
                  alt="Dedicated Pristine Yoga Space" 
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('private-studio')}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">01. Private Strength Training Studio</span>
                  {expandedSection === 'private-studio' ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </button>
                {expandedSection === 'private-studio' && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">
                      Experience personalized training in a distraction-free private gym equipped with the 
                      essentials. Our studio includes a power rack, pulley systems, free weights, and a Rogue 
                      Echo bike, perfect for 1-on-1 sessions tailored to your fitness goals. Ideal for those seeking 
                      focused and effective strength training in a professional setting.
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('yoga-space')}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">02. Dedicated Pristine Yoga Space</span>
                  {expandedSection === 'yoga-space' ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </button>
                {expandedSection === 'yoga-space' && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">
                      Immerse yourself in a peaceful, dedicated yoga space designed for mindful practice. 
                      Our pristine studio provides the perfect environment for private or small group yoga sessions, 
                      featuring natural lighting and a calming atmosphere that promotes relaxation and focus.
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('instructors')}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">03. Certified, Seasoned Instructors</span>
                  {expandedSection === 'instructors' ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </button>
                {expandedSection === 'instructors' && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">
                      Work with certified professionals who bring decades of experience in personal training, 
                      nutrition coaching, and yoga instruction. Our team is dedicated to helping you achieve 
                      your health and fitness goals through personalized guidance and expert knowledge.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* COACHING SECTION */}
        <section id="coaching" className="bg-white dark:bg-gray-900 py-16 -mx-4 px-4 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Coaching Services
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Personalized programs designed for your unique goals and lifestyle
              </p>
            </div>
            
            <ServicesGrid />
          </div>
        </section>
      </div>
    </div>
  );
}