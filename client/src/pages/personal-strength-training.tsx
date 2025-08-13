import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Check, MapPin, Award, Clock, User } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { MichaelAboutBlock } from "@/components/michael-about-block";

export default function PersonalStrengthTraining() {
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
              1-on-1 Personal Strength<br className="hidden sm:block" />
              <span className="text-purple-300">Training</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Comprehensive strength training tailored to your fitness level and goals
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-300/20 text-purple-100 px-4 py-2 rounded-full text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Orange, CT or Virtual
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-300/20 text-amber-100 px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4" />
                30-minute sessions
              </div>
              <div className="inline-flex items-center gap-2 bg-green-300/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium">
                <User className="h-4 w-4" />
                100% Customized
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Strength Training for Life</h2>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    The underlying goal of strength training is to remain independent for life. In your 30s, 40s, and even 50s it is easy to think that independence will always be there, but strength fades faster than most people realize unless you train for it. Use it or lose it is true. No assistance to do the normal day-to-day things, stand up easily, carry groceries, open bottles, stay active, play with your kids and grandkids. Strength training builds not just muscle, but confidence, capability, and vibrance at every age.
                  </p>
                  
                  <p>
                    I believe in lifting heavy things with high intensity at least twice per week. I focus on traditional compound exercises, drop sets, body-weight strength training, and physical outdoor work like running, hiking, and calisthenics, along with increasing flexibility through customized yoga-style stretches. All supported and built on truly understanding and implementing clean eating.
                  </p>
                  
                  <p>
                    While my own marathon training or strength achievements might seem extreme, I am not trying to turn anyone into a bodybuilder or marathon runner. Especially beyond 40, 50, 60, and 70 years old, these things are possible and my goal is to inspire and help people make realistic, sustainable changes that keep them strong and active for decades to come.
                  </p>
                  
                  <p>
                    I am here to help you break free from inactivity, your gym rut, or take your fitness to the next level. You need a push in the right direction and accountability.
                  </p>
                  
                  <p>
                    One or two 30-minute sessions per week will change your life. You will be amazed by how much we can accomplish in this short time, how quickly your strength improves, and how much you gain as you navigate life. Learn to reframe your time and thoughts about working out, and see how it can all be naturally and intuitively integrated into your life.
                  </p>
                </div>
              </div>
              <div className="md:col-span-1">
                <img 
                  src="/attached_assets/download - 2025-06-20T164725.183_1750453386689.png" 
                  alt="Personal strength training featured image" 
                  className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square"
                />
                <div className="mt-4 flex justify-center">
                  <img 
                    src="/assets/personal-trainer-cert-logo.png" 
                    alt="Personal Trainer Certification" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes This Different</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">100% Customized Training</h3>
                    <p className="text-sm text-gray-600">1-on-1. No fake AI bots, prefabricated apps or automations.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">Powerful 30 Minute Compound Exercise Workouts</h3>
                    <p className="text-sm text-gray-600">Designed to achieve progress in a short amount of time</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">In-person Orange, CT or Virtual Anywhere</h3>
                    <p className="text-sm text-gray-600">*Virtual Options: Google Meet, Zoom, or Microsoft Teams</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What You'll Experience</h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Traditional Compound Exercises</h4>
                        <p className="text-sm text-gray-600">Master the fundamentals that build real strength</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">High-Intensity Training</h4>
                        <p className="text-sm text-gray-600">Maximize results in minimal time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Body-Weight Strength Training</h4>
                        <p className="text-sm text-gray-600">Build functional strength using your own body</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Outdoor Physical Work</h4>
                        <p className="text-sm text-gray-600">Running, hiking, and basic calisthenics</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Customized Yoga-Style Stretches</h4>
                        <p className="text-sm text-gray-600">Increase flexibility and mobility</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Clean Eating Integration</h4>
                        <p className="text-sm text-gray-600">Understanding nutrition to support your training</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Drop Sets & Advanced Techniques</h4>
                        <p className="text-sm text-gray-600">Progressive overload methods for continued growth</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Accountability & Motivation</h4>
                        <p className="text-sm text-gray-600">Push through barriers with expert guidance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-50 to-amber-50 border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Strength?</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Break free from inactivity and discover how 30-minute sessions can change your life. 
                  Get the push in the right direction with personalized accountability.
                </p>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg"
                  >
                    Get Started Today →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Michael About Block */}
      <MichaelAboutBlock />
    </div>
  );
}