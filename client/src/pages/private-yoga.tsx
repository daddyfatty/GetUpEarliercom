import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Check, MapPin, Award, Clock, User, Heart, Flower, Sparkles } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { EricaAboutBlock } from "@/components/erica-about-block";

export default function PrivateYoga() {
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
              Private Yoga<br className="hidden sm:block" />
              <span className="text-pink-300">with Erica</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Experience the journey of self-discovery, mindfulness, and inner peace in our dedicated yoga studio
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-300/20 text-purple-100 px-4 py-2 rounded-full text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Dedicated Yoga Studio
              </div>
              <div className="inline-flex items-center gap-2 bg-pink-300/20 text-pink-100 px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4" />
                60-minute sessions
              </div>
              <div className="inline-flex items-center gap-2 bg-green-300/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium">
                <User className="h-4 w-4" />
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
                    Yoga is more than just physical movement—it's a journey of self-discovery, mindfulness, and inner peace. In our dedicated yoga studio, I create a sacred space where you can disconnect from the outside world and reconnect with your true self through personalized practice.
                  </p>
                  <p>
                    Whether you're a complete beginner taking your first steps into yoga or an experienced practitioner looking to deepen your practice, I tailor each session to meet you exactly where you are. My approach emphasizes proper alignment, breath awareness, and mindful movement while honoring your body's unique needs and limitations.
                  </p>
                  <p>
                    In our tranquil studio environment, free from distractions and external pressures, you'll have the space to explore poses at your own pace, ask questions freely, and develop a sustainable practice that serves your physical, mental, and emotional well-being.
                  </p>
                </div>
              </div>
              <div className="md:col-span-1">
                <img 
                  src="/assets/download - 2025-06-20T170516.226_1750453530152.png" 
                  alt="Private yoga featured image" 
                  className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square"
                />
                <div className="mt-4 flex justify-center">
                  <img 
                    src="/assets/yoga-alliance-cert-logo.png" 
                    alt="Yoga Alliance Certification" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* What Makes It Special Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Makes It Special</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Dedicated Yoga Studio</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  A pristine, tranquil space specifically designed for yoga practice, promoting peace and focus.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Personalized Sessions</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Customized yoga classes tailored to individual skill levels and personal goals, ensuring optimal progression and comfort.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Flexible Scheduling</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Sessions arranged to fit your unique timetable, making it easy to integrate yoga into your busy life.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">All Levels Welcome</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Suitable for beginners through advanced practitioners, with modifications and challenges to suit everyone.
                </p>
              </div>
            </div>
          </div>



          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Benefits of Private Yoga</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Attention</h3>
                <p className="text-gray-600">
                  Receive individualized guidance, adjustments, and modifications tailored to your unique body and goals.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  Schedule sessions at times that work best for your lifestyle and commitments.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Safe Environment</h3>
                <p className="text-gray-600">
                  Practice without judgment or comparison in a comfortable, private setting that encourages exploration.
                </p>
              </div>
            </div>
          </div>

          {/* Session Types */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Session Options</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Beginner Foundations</h3>
                  <p className="text-gray-600">
                    Learn basic poses, breathing techniques, and yoga principles in a supportive, non-intimidating environment.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Therapeutic Yoga</h3>
                  <p className="text-gray-600">
                    Address specific physical concerns or injuries with gentle, restorative practices designed to promote healing.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Practice</h3>
                  <p className="text-gray-600">
                    Explore challenging poses, advanced breathing techniques, and deeper meditation practices.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 p-12 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Begin Your Yoga Journey?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the transformative power of personalized yoga in our beautiful, dedicated studio space.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white">
                Book Your Private Session
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Erica About Block */}
      <EricaAboutBlock />
    </div>
  );
}