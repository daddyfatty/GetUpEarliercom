import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Check, MapPin, Award, Clock, User, Heart, Flower, Sparkles } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";

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
              Immerse yourself in a personalized yoga experience in our pristine, dedicated yoga space designed for tranquility and focus
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

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Makes It Special</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-8 w-8 text-purple-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Dedicated Yoga Studio</h3>
                  </div>
                  <p className="text-gray-600">
                    A pristine, purpose-built yoga space designed for tranquility and focus, creating the perfect environment for your practice.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <User className="h-8 w-8 text-pink-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Personalized Sessions</h3>
                  </div>
                  <p className="text-gray-600">
                    Every session is tailored to your individual needs, goals, and physical capabilities, ensuring safe and effective practice.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Heart className="h-8 w-8 text-red-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Mindful Approach</h3>
                  </div>
                  <p className="text-gray-600">
                    Focus on breath awareness, proper alignment, and mindful movement to create a holistic yoga experience.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Flower className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">All Levels Welcome</h3>
                  </div>
                  <p className="text-gray-600">
                    Whether you're beginning your yoga journey or deepening your practice, sessions are adapted to your experience level.
                  </p>
                </CardContent>
              </Card>
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
    </div>
  );
}