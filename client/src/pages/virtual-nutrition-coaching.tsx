import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Check, MapPin, Award, Clock, User, Video, Calendar } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { MichaelAboutBlock } from "@/components/michael-about-block";

export default function VirtualNutritionCoaching() {
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
              Virtual Nutrition<br className="hidden sm:block" />
              <span className="text-green-300">Coaching</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Transform your relationship with food through personalized nutrition guidance and sustainable habit building
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-300/20 text-blue-100 px-4 py-2 rounded-full text-sm font-medium">
                <Video className="h-4 w-4" />
                100% Virtual Sessions
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-300/20 text-amber-100 px-4 py-2 rounded-full text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Weekly Check-ins
              </div>
              <div className="inline-flex items-center gap-2 bg-green-300/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium">
                <User className="h-4 w-4" />
                Personalized Plans
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
                    Nutrition isn't about restriction or perfect eating—it's about creating a sustainable relationship with food that supports your goals and lifestyle. My approach focuses on education, gradual changes, and building habits that last.
                  </p>
                  <p>
                    Through virtual coaching sessions, I'll help you understand your body's needs, decode nutrition labels, and develop practical strategies for meal planning, grocery shopping, and eating out. We'll work together to create a personalized plan that fits your schedule, preferences, and health goals.
                  </p>
                  <p>
                    Whether you're looking to lose weight, gain muscle, improve energy levels, or simply develop healthier eating habits, I'll provide the guidance and accountability you need to succeed—all from the comfort of your home.
                  </p>
                </div>
              </div>
              <div className="md:col-span-1">
                <img 
                  src="/assets/download - 2025-06-20T170333.649_1750453429860.png" 
                  alt="Virtual nutrition coaching featured image" 
                  className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square"
                />
                <div className="mt-4 flex justify-center">
                  <img 
                    src="/assets/iin-cert-logo.png" 
                    alt="IIN Health Coach Certification" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What You'll Get</h2>
            <div className="grid md:grid-cols-3 gap-8">


              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Video className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Virtual Sessions</h3>
                  </div>
                  <p className="text-gray-600">
                    Weekly 45-minute video calls to review progress, troubleshoot challenges, and adjust your plan as needed.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Meal Planning Support</h3>
                  </div>
                  <p className="text-gray-600">
                    Learn to plan and prep meals efficiently, with grocery lists, recipes, and time-saving strategies.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <User className="h-8 w-8 text-orange-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Ongoing Support</h3>
                  </div>
                  <p className="text-gray-600">
                    24/7 access to ask questions, share victories, and get guidance between sessions through our coaching platform.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Perfect For Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Perfect For</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Weight Management</h3>
                <p className="text-gray-600">
                  Sustainable weight loss or gain through balanced nutrition and lifestyle changes.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Busy Professionals</h3>
                <p className="text-gray-600">
                  Quick, healthy meal solutions that fit your hectic schedule and travel demands.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Athletes & Active Individuals</h3>
                <p className="text-gray-600">
                  Performance nutrition to fuel your workouts and optimize recovery.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 p-12 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Nutrition?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step toward sustainable nutrition habits that will support your goals for life.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white">
                Schedule Your Consultation
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