import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CredentialsBand } from "@/components/credentials-band";
import { ArrowLeft, Award, Calendar, Users, Heart, Target, Dumbbell, Zap, User } from "lucide-react";

import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";
import ericaPath from "@assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg";
import personalTrainerBadge from "@assets/67910d333568168655f4b0e8_Badges-PT (1)_1749504702546.png";
import nutritionBadge from "@assets/67910ddf1426fe137b7a5cfa_HCTP_INHC_Badge (1)-p-500 (1)_1749504702546.png";
import runningCoachBadge from "@assets/67910e09c2597e3ff6174ecb_Badges-run-coach (1)_1749504702546.png";
import rytMikeBadge from "@assets/RYTMIKE_1749505314924.png";
import eryBadge from "@assets/67910e23033a488a11f42952_erty (1)_1749505199203.png";
import yaerBadge from "@assets/YAER_1749505224126.png";

export default function About() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-8 border-white shadow-xl">
            <img 
              src={headshotPath} 
              alt="Michael Baker" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Michael Baker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Dedicated & authentic health and wellness practitioner with over 30 years of experience
          </p>
        </div>

        {/* Bio Section */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Story</h2>
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

        {/* Credentials Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Credentials</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">ISSA Certified</h3>
                <p className="text-gray-600 dark:text-gray-300">Personal Trainer</p>
              </div>
              <div className="text-center">
                <Heart className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">IIN Certified</h3>
                <p className="text-gray-600 dark:text-gray-300">Health Coach</p>
              </div>
              <div className="text-center">
                <Target className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">ISSA Certified</h3>
                <p className="text-gray-600 dark:text-gray-300">Running Coach</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">RYT 200</h3>
                <p className="text-gray-600 dark:text-gray-300">Yoga Teacher</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CREDENTIALS BAND */}
      <CredentialsBand />

      {/* TEAM SECTION */}
      <section id="team" className="bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Certified professionals with decades of combined experience, dedicated to transforming lives
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">
            {/* Michael Baker */}
            <Link href="/team/michael">
              <Card className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 group bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden h-full flex flex-col">
                <CardHeader className="text-center p-8 relative z-10 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col">
                    <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 group-hover:ring-purple-200 transition-all duration-300">
                      <img 
                        src={headshotPath} 
                        alt="Michael Baker" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <CardTitle className="text-3xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      Michael Baker
                    </CardTitle>
                    
                    <CardDescription className="text-lg mb-6 text-gray-600 leading-relaxed max-w-md mx-auto">
                      Certified Personal Trainer, Integrative Nutrition Health Coach & Running Coach
                    </CardDescription>
                    
                    {/* Professional Certification Badges */}
                    <div className="mb-6 flex-1">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Professional Certifications</h4>
                      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={personalTrainerBadge} 
                            alt="ISSA Personal Trainer" 
                            className="h-12 w-auto mx-auto mb-1"
                          />
                          <p className="text-xs text-gray-600 font-medium text-center">ISSA Personal Trainer</p>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={nutritionBadge} 
                            alt="Integrative Nutrition Health Coach" 
                            className="h-12 w-auto mx-auto mb-1"
                          />
                          <p className="text-xs text-gray-600 font-medium text-center">Nutrition Coach</p>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={runningCoachBadge} 
                            alt="ISSA Running Coach" 
                            className="h-12 w-auto mx-auto mb-1"
                          />
                          <p className="text-xs text-gray-600 font-medium text-center">Running Coach</p>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={rytMikeBadge} 
                            alt="RYT 200 Yoga Teacher" 
                            className="h-12 w-auto mx-auto mb-1"
                          />
                          <p className="text-xs text-gray-600 font-medium text-center">RYT 200 Yoga</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            {/* Erica Baker */}
            <Link href="/team/erica">
              <Card className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 group bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden h-full flex flex-col">
                <CardHeader className="text-center p-8 relative z-10 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col">
                    <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 group-hover:ring-purple-200 transition-all duration-300">
                      <img 
                        src={ericaPath} 
                        alt="Erica Baker" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <CardTitle className="text-3xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      Erica Baker
                    </CardTitle>
                    
                    <CardDescription className="text-lg mb-6 text-gray-600 leading-relaxed max-w-md mx-auto">
                      Registered Yoga Teacher & Wellness Specialist
                    </CardDescription>
                    
                    {/* Professional Certification Badges */}
                    <div className="mb-6 flex-1">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Professional Certifications</h4>
                      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={eryBadge} 
                            alt="ERY Certification" 
                            className="h-12 w-auto mx-auto mb-1"
                          />
                          <p className="text-xs text-gray-600 font-medium text-center">ERY Certified</p>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <img 
                            src={yaerBadge} 
                            alt="YAER Certification" 
                            className="h-12 w-auto mx-auto mb-1"
                          />
                          <p className="text-xs text-gray-600 font-medium text-center">YAER Specialist</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* COACHING SECTION */}
      <section id="coaching" className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
  );
}