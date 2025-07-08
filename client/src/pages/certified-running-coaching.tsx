import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Check, MapPin, Award, Clock, User, Target, Trophy, Activity } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { MichaelAboutBlock } from "@/components/michael-about-block";

export default function CertifiedRunningCoaching() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroGradient>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/services">
              <Button variant="outline" className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Certified Running<br className="hidden sm:block" />
              <span className="text-orange-300">Coaching</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              From couch to 5K and beyond - personalized running coaching to help you achieve your distance goals
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-300/20 text-blue-100 px-4 py-2 rounded-full text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Orange, CT or Virtual
              </div>
              <div className="inline-flex items-center gap-2 bg-orange-300/20 text-orange-100 px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4" />
                30-minute sessions
              </div>
              <div className="inline-flex items-center gap-2 bg-green-300/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium">
                <Trophy className="h-4 w-4" />
                All Levels Welcome
              </div>
            </div>
          </div>
        </div>
      </HeroGradient>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Philosophy Section */}
          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Running is one of the most accessible and transformative forms of exercise, but it requires the right approach to be safe, enjoyable, and effective. My coaching philosophy centers on gradual progression, injury prevention, and building a sustainable relationship with running that lasts a lifetime.
                  </p>
                  <p>
                    Whether you're taking your first steps as a runner or working toward your next race goal, I'll help you develop proper form, create a training plan that fits your schedule, and provide the motivation and accountability you need to stay consistent. Every runner's journey is unique, and I tailor my coaching to your current fitness level, goals, and lifestyle.
                  </p>
                  <p>
                    From couch to 5K programs to marathon training, nutrition strategies, and recovery protocols, I provide comprehensive support that goes beyond just running workouts. Together, we'll build your confidence, endurance, and love for the sport while keeping you healthy and injury-free.
                  </p>
                </div>
              </div>
              <div className="md:col-span-1">
                <img 
                  src="/attached_assets/download - 2025-06-20T170430.001_1750453483739.png" 
                  alt="Running coaching featured image" 
                  className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square"
                />
                <div className="mt-4 flex justify-center">
                  <img 
                    src="/assets/running-coach-cert-logo.png" 
                    alt="Running Coach Certification" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What You'll Get</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Target className="h-8 w-8 text-orange-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Personalized Training Plans</h3>
                  </div>
                  <p className="text-gray-600">
                    Custom running programs based on your current fitness level, goals, and schedule, with weekly adjustments as you progress.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Activity className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Form & Technique Analysis</h3>
                  </div>
                  <p className="text-gray-600">
                    Running form assessment and corrections to improve efficiency, reduce injury risk, and enhance performance.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Award className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Race Preparation</h3>
                  </div>
                  <p className="text-gray-600">
                    Complete race training including pacing strategies, nutrition planning, and mental preparation for 5Ks to marathons.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <User className="h-8 w-8 text-purple-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Injury Prevention</h3>
                  </div>
                  <p className="text-gray-600">
                    Strength training, mobility work, and recovery strategies specifically designed for runners to prevent common injuries.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Training Levels */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Training Programs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Couch to 5K</h3>
                <p className="text-gray-600">
                  Perfect for complete beginners. Safe, gradual progression from walking to running your first 5K race.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5K to Half Marathon</h3>
                <p className="text-gray-600">
                  Build endurance and speed for intermediate distances with structured training and race strategies.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marathon Training</h3>
                <p className="text-gray-600">Insight, guidance or comprehensive 16-20 week programs for first-time marathoners.</p>
              </div>
            </div>
          </div>

          {/* What Makes It Special */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose My Coaching?</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Experience</h3>
                  <p className="text-gray-600">
                    Years of experience helping runners of all levels achieve their goals, from first-time 5K finishers to Boston Marathon qualifiers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Holistic Approach</h3>
                  <p className="text-gray-600">
                    Running coaching that includes nutrition guidance, strength training, recovery protocols, and mental preparation for complete development.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Delivery</h3>
                  <p className="text-gray-600">
                    Choose between in-person sessions in Orange, CT or virtual coaching that fits your schedule and location preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-orange-50 to-blue-50 p-12 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Running Journey?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step toward achieving your running goals with personalized coaching and proven training methods.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white">
                Begin Your Training
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Michael About Block */}
      <MichaelAboutBlock />
    </div>
  );
}