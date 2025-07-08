import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Check, MapPin, Award, Clock, User, MessageSquare, Target, Calendar } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";

export default function AccountabilityCoaching() {
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
              Accountability<br className="hidden sm:block" />
              <span className="text-blue-300">Coaching</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Stay consistent and motivated with personalized support, goal tracking, and regular check-ins
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-300/20 text-blue-100 px-4 py-2 rounded-full text-sm font-medium">
                <MessageSquare className="h-4 w-4" />
                Daily Check-ins
              </div>
              <div className="inline-flex items-center gap-2 bg-green-300/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium">
                <Target className="h-4 w-4" />
                Goal Tracking
              </div>
              <div className="inline-flex items-center gap-2 bg-purple-300/20 text-purple-100 px-4 py-2 rounded-full text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Weekly Reviews
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
                    Real change happens when you have someone in your corner who believes in you and holds you accountable to your goals. Accountability coaching isn't about judgment—it's about creating a supportive partnership that keeps you moving forward, even when motivation wanes.
                  </p>
                  <p>
                    Through regular check-ins, goal tracking, and personalized support, I'll help you build the habits and mindset necessary for lasting transformation. Whether you're working toward fitness goals, career changes, or personal development, accountability coaching provides the structure and encouragement you need to succeed.
                  </p>
                  <p>
                    This isn't just about tracking progress—it's about celebrating victories, learning from setbacks, and maintaining momentum through life's ups and downs. Together, we'll create a system that works for your lifestyle and keeps you consistently moving toward your vision.
                  </p>
                </div>
              </div>
              <div className="md:col-span-1">
                <img 
                  src="/assets/678aad8cfd0dcde677a14418_hike2-p-800_1750453452584.jpg" 
                  alt="Accountability coaching featured image" 
                  className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square"
                />
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
                    <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Daily Check-ins</h3>
                  </div>
                  <p className="text-gray-600">
                    Quick daily touchpoints to review progress, address challenges, and maintain momentum through text or app-based communication.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Target className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Goal Setting & Tracking</h3>
                  </div>
                  <p className="text-gray-600">
                    Clear, measurable goals with regular progress tracking and adjustments to keep you on the right path.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Weekly Review Sessions</h3>
                  </div>
                  <p className="text-gray-600">
                    30-minute weekly calls to review progress, celebrate wins, problem-solve challenges, and plan the week ahead.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <User className="h-8 w-8 text-orange-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Personalized Support</h3>
                  </div>
                  <p className="text-gray-600">
                    Customized coaching approach based on your personality, goals, and challenges, with flexible communication methods.
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Habit Formation</h3>
                <p className="text-gray-600">
                  Building new healthy habits or breaking old patterns that no longer serve you.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Goal Achievement</h3>
                <p className="text-gray-600">
                  Working toward specific fitness, career, or personal development goals with consistent support.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Motivation Maintenance</h3>
                <p className="text-gray-600">
                  Staying consistent when motivation is low and maintaining momentum through challenges.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Initial Goal Setting</h3>
                  <p className="text-gray-600">
                    We start with a comprehensive session to identify your goals, challenges, and create a personalized accountability plan.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Check-ins</h3>
                  <p className="text-gray-600">
                    Quick daily touchpoints to track progress, address challenges, and maintain momentum through your preferred communication method.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Weekly Reviews</h3>
                  <p className="text-gray-600">
                    Structured weekly sessions to celebrate progress, learn from setbacks, and adjust strategies for continued success.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-12 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Stay Accountable?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step toward consistent progress and lasting change with personalized accountability support.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white">
                Start Your Accountability Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}