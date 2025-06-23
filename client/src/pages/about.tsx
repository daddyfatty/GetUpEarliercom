import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CredentialsBand } from "@/components/credentials-band";
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

  const services = [
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: "1-on-1 Personal Strength Training",
      description: "Powerful, distraction-free 30-minute workouts incorporating traditional compound free-weight movements, bodyweight exercises, and outdoor activities.",
      color: "blue",
      badge: "PERSONAL TRAINING"
    },
    {
      icon: <Heart className="h-8 w-8 text-green-500" />,
      title: "Virtual Nutrition Coaching",
      description: "Providing education on clean eating, understanding calories, healthy digital shopping, and creating personalized sustainable meal plans.",
      color: "green",
      badge: "IIN"
    },
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      title: "Accountability Coaching",
      description: "Identify unhealthy habits and break free with small changes, learning to be mindful in real life without relying on a facility, AI, or an app. 1-on-1 live.",
      color: "red",
      badge: "ACCOUNTABILITY"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Certified Running Coaching",
      description: "I work alongside beginner runners to help them break through their own limits. Learn how to progress from never running to completing a 5K, a 5-miler, or more.",
      color: "purple",
      badge: "RUNNING"
    },
    {
      icon: <Dumbbell className="h-8 w-8 text-blue-500" />,
      title: "Private Yoga",
      description: "Immerse yourself in a personalized yoga experience.",
      color: "blue",
      badge: "PRIVATE YOGA"
    },
    {
      icon: <User className="h-8 w-8 text-pink-500" />,
      title: "Small Group Yoga",
      description: "Elevate your yoga practice with our semi-private Vinyasa yoga sessions.",
      color: "pink",
      badge: "GROUP YOGA"
    }
  ];

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

        {/* ABOUT SECTION */}
        <section id="about" className="max-w-6xl mx-auto mb-16">
          {/* Bio Section */}
          <div className="text-center mb-16">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-8 border-white shadow-xl">
              <img 
                src={headshotPath} 
                alt="Michael Baker" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Michael Baker
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Certified Personal Trainer, Integrative Nutrition Health Coach & Running Coach
            </p>
          </div>

          <Card className="mb-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Story</h3>
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                <p className="mb-4">
                  Hello, I'm Michael Baker. I am a 50-year-old strength trainer, certified personal trainer, running coach, 
                  health coach, and yoga teacher. I'm also a former yoga studio owner and a digital professional with over 
                  30 years of experience.
                </p>
                
                <p className="mb-4">
                  My approach to health and fitness is both authentic and sustainable. I believe in the power of small, 
                  consistent changes that create lasting transformation. Whether you're just starting your fitness journey 
                  or looking to break through plateaus, I'm here to guide you with personalized strategies that work for 
                  your unique lifestyle.
                </p>
                
                <p className="mb-4">
                  As someone who has maintained peak physical condition into my 50s, I understand the challenges of staying 
                  fit as we age. My training philosophy emphasizes functional movement, strength building, and injury prevention. 
                  I've helped hundreds of clients achieve their health goals through a combination of smart training, 
                  practical nutrition, and mindful accountability.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CREDENTIALS BAND */}
        <CredentialsBand />

        {/* TEAM SECTION */}
        <section id="team" className="bg-white dark:bg-gray-900 py-16 -mx-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Certified Professionals
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto items-center">
              {/* Michael Baker */}
              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-4 overflow-hidden shadow-lg border-4 border-gray-200 rounded-lg">
                  <img 
                    src={michaelHeadshot} 
                    alt="Michael Baker" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Personal Trainer, Nutrition Coach</p>
                <h3 className="text-xl font-bold text-gray-900">Michael Baker</h3>
              </div>

              {/* Erica Baker */}
              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-4 overflow-hidden shadow-lg border-4 border-gray-200 rounded-lg">
                  <img 
                    src={ericaYogaPose} 
                    alt="Erica Baker" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">RYT Yoga Teacher</p>
                <h3 className="text-xl font-bold text-gray-900">Erica Baker</h3>
              </div>
            </div>

            {/* In-Home Private Boutique Section */}
            <div className="mt-20 max-w-6xl mx-auto">
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
          </div>
        </section>

        {/* COACHING SECTION */}
        <section id="coaching" className="bg-white dark:bg-gray-900 py-16 -mx-4 px-4 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                1-on-1 Services
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Personalized coaching services designed to help you achieve your health and fitness goals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="mb-4">{service.icon}</div>
                    <Badge variant="secondary" className="mb-3 w-fit mx-auto">
                      {service.badge}
                    </Badge>
                    <CardTitle className="text-xl mb-3">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/services">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  View Full Services & Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}