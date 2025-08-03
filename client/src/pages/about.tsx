import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CredentialsBand } from "@/components/credentials-band";
import { ServicesGrid } from "@/components/services-grid";
import { PermanentClassSchedule } from "@/components/permanent-class-schedule";
import { ArrowLeft, Award, Calendar, Users, Heart, Target, Dumbbell, Zap, User, ChevronDown, ChevronUp } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

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
  useSEO('about');
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };



  return (
    <>
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

        {/* ABOUT SECTION */}
        <section id="about" className="max-w-7xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-5 gap-0">
                {/* Left Side - Photo and Basic Info */}
                <div className="lg:col-span-2 bg-[hsl(var(--navy))] dark:from-blue-900 dark:to-gray-900 p-8 lg:p-12 pt-[35px] text-white flex flex-col justify-start items-center text-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden mb-8 border-8 border-white/20 shadow-2xl">
                    <img 
                      src={headshotPath} 
                      alt="Michael Baker" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-4 text-white">
                    Michael Baker
                  </h2>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-blue-100 text-lg font-medium">Certified Personal Trainer</p>
                    <p className="text-blue-100 text-lg font-medium">Integrative Nutrition Health Coach</p>
                    <p className="text-blue-100 text-lg font-medium">Running Coach & Yoga Teacher</p>
                    <p className="text-blue-100 text-lg font-medium">25 Year Digital Professional</p>
                    <p className="text-blue-100 text-lg font-medium">Lifelong Fitness Practitioner</p>
                  </div>
                  

                  
                  <Link href="/contact">
                    <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                      Let's Work Together →
                    </Button>
                  </Link>
                </div>

                {/* Right Side - Story */}
                <div className="lg:col-span-3 p-8 lg:p-12">
                  <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                    <p className="text-lg leading-relaxed mb-4">
                      Hello, I'm Michael Baker. I am a 50-year-old strength trainer, certified personal trainer, running coach, 
                        health coach, and yoga teacher. I'm also a former yoga studio owner and a dedicated health and wellness 
                        practitioner with over 30 years of experience. I began <span className="font-semibold text-blue-600">Get Up Earlier</span> (GetUpEarlier.com) because getting 
                        up earlier was step one in transforming my routine and overall well-being, especially after spending years 
                        sitting at a computer as a <a href="https://WebMBD.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">digital professional</a>.
                      </p>
                      
                      <blockquote className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-8 my-8 border-0 shadow-sm">
                        <div className="absolute top-4 left-4 text-blue-600 opacity-20">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                          </svg>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic pl-4">
                          My primary goal is to bridge the gap from inactivity and poor diet to strength and healthy habits. I focus 
                          on helping people rely on intuition, providing a personal experience, and introducing them to strength training, 
                          alternate cardio, and yoga-inspired stretching, along with fundamental nutrition knowledge and concepts.
                        </div>
                      </blockquote>
                      
                    <p className="text-lg leading-relaxed">
                      While my own marathon training or strength achievements might seem extreme, I'm not trying to turn anyone into a 
                      bodybuilder or marathon runner. I'm simply showing that, especially beyond 40, 50, 60, and 70 years old, 
                      these things are possible. <span className="font-semibold text-blue-600">It's about inspiration and helping people make realistic, sustainable changes.</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ERICA SECTION */}
        <section id="erica" className="max-w-7xl mx-auto mb-16">
          <Card 
            className="bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]"
            onClick={() => window.open("https://ericaleebaker.com", "_blank")}
          >
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-5 gap-0">
                {/* Left Side - Photo and Basic Info */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#E1ECE7] to-[#C4D6CC] dark:from-green-900 dark:to-gray-900 px-8 lg:px-12 pt-[35px] text-gray-800 dark:text-white flex flex-col justify-start items-center text-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden mb-8 border-8 border-white/20 shadow-2xl">
                    <img 
                      src={ericaPath} 
                      alt="Erica Baker" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                    Erica Baker
                  </h2>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-700 dark:text-gray-100 text-lg font-medium">E-RYT 200 Yoga Instructor</p>
                    <p className="text-gray-700 dark:text-gray-100 text-lg font-medium">2000+ Hours Teaching Experience</p>
                    <p className="text-gray-700 dark:text-gray-100 text-lg font-medium">Former Boutique Studio Owner</p>
                    <p className="text-gray-700 dark:text-gray-100 text-lg font-medium">Wellness Enthusiast</p>
                    <p className="text-gray-700 dark:text-gray-100 text-lg font-medium">YouTube Content Creator</p>
                  </div>
                  

                  
                  <Button 
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-gray-800 dark:text-white border-white/30 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open("https://ericaleebaker.com", "_blank");
                    }}
                  >
                    Visit EricaLeeBaker.com →
                  </Button>
                </div>

                {/* Right Side - Story */}
                <div className="lg:col-span-3 p-8 lg:p-12">
                  <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                    <p className="text-lg leading-relaxed mb-4">
                      Erica is an E-RYT 200 Yoga Instructor with over 2000 hours teaching experience in both large and small group settings. For the last decade, she has taught yoga from a place of authenticity and developed her own unique style and an ability to work well with all levels.
                      </p>
                      
                      <p className="text-lg leading-relaxed mb-4">
                        As a former boutique yoga studio owner and wellness enthusiast, she brings her health and fitness knowledge and passion to others with her fun energy and physical classes. Every single one of her classes is unique, but you can always count on a consistent experience working on overall strength, mobility, flexibility, balance and stress relief.
                      </p>
                      
                      <blockquote className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-8 my-8 border-0 shadow-sm">
                        <div className="absolute top-4 left-4 text-green-600 opacity-20">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                          </svg>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic pl-4">
                          Erica believes Yoga is just one facet of nourishing your body to create optimal health and prevent disease. She truly enjoys helping others improve their overall health as well as making them laugh a little too.
                        </div>
                      </blockquote>
                      
                      <p className="text-lg leading-relaxed mb-4">
                        You can find her teaching small group classes in her home studio, private lessons and recorded classes of varying lengths on her YouTube channel.
                      </p>
                      
                    {/* Permanent Class Schedule */}
                    <div className="mt-6">
                      <PermanentClassSchedule />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CREDENTIALS BAND */}
        <div className="mb-[50px]">
          <CredentialsBand />
        </div>

        {/* In-Home Private Boutique Section */}
        <section id="studio" className="max-w-6xl mx-auto mb-16">
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
            <ServicesGrid 
              showImages={true} 
              showReadMore={true} 
            />

            <div className="text-center mt-12">
              <Link href="/services#services-pricing">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Services Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}