import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Check, MapPin, Award, Clock, Users, Heart, Flower, Sparkles, Star } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { PermanentClassSchedule } from "@/components/permanent-class-schedule";

export default function SmallGroupYoga() {
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
              Small Group Yoga<br className="hidden sm:block" />
              <span className="text-teal-300">with Erica</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Experience the energy and connection of practicing yoga with a small group in our beautiful, dedicated studio space
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-300/20 text-purple-100 px-4 py-2 rounded-full text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Dedicated Yoga Studio
              </div>
              <div className="inline-flex items-center gap-2 bg-teal-300/20 text-teal-100 px-4 py-2 rounded-full text-sm font-medium">
                <Users className="h-4 w-4" />
                Small Groups (3-6 people)
              </div>
              <div className="inline-flex items-center gap-2 bg-green-300/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4" />
                60-minute sessions
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
                Small group yoga combines the personalized attention of private sessions with the inspiring energy and community connection that comes from practicing alongside others. In our intimate studio setting, you'll experience the perfect balance of individual guidance and group synergy.
              </p>
              <p>
                With groups limited to just 3-6 participants, I can provide personalized adjustments, modifications, and guidance while creating a supportive community where everyone feels seen and included. This intimate setting allows for deeper connections, shared growth, and the motivation that comes from practicing with like-minded individuals.
              </p>
              <p>
                Whether you're new to yoga or have an established practice, small group sessions offer a welcoming environment where you can explore poses, learn from others, and develop your practice in a supportive, non-competitive atmosphere that celebrates individual progress and collective growth.
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
                    <Users className="h-8 w-8 text-teal-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Intimate Group Size</h3>
                  </div>
                  <p className="text-gray-600">
                    Small groups of 3-6 people ensure personal attention while creating a supportive community atmosphere.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-8 w-8 text-purple-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Beautiful Studio Space</h3>
                  </div>
                  <p className="text-gray-600">
                    Practice in our serene, purpose-built yoga studio designed to create the perfect environment for group practice.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Heart className="h-8 w-8 text-red-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Community Connection</h3>
                  </div>
                  <p className="text-gray-600">
                    Build meaningful connections with fellow practitioners while sharing the journey of growth and mindfulness.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Star className="h-8 w-8 text-yellow-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Personalized Guidance</h3>
                  </div>
                  <p className="text-gray-600">
                    Receive individual attention, adjustments, and modifications within the supportive group setting.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Benefits of Small Group Yoga</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shared Energy</h3>
                <p className="text-gray-600">
                  Experience the collective energy and motivation that comes from practicing with others on similar journeys.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Effective</h3>
                <p className="text-gray-600">
                  Enjoy personalized instruction and a beautiful studio environment at a more accessible price point.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Together</h3>
                <p className="text-gray-600">
                  Learn from others' experiences and insights while sharing your own journey in a supportive environment.
                </p>
              </div>
            </div>
          </div>



          {/* How to Join */}
          <div className="mb-16 bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Join a Small Group</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Existing Groups</h3>
                <p className="text-gray-600 mb-4">
                  Join one of our ongoing small group classes. We'll match you with a group that fits your experience level and schedule preferences.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Form Your Own</h3>
                <p className="text-gray-600 mb-4">
                  Gather 2-5 friends or family members and we'll create a custom small group session tailored to your collective needs and goals.
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="mb-16">
            <PermanentClassSchedule />
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-teal-50 to-purple-50 p-12 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Practice Together?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join a small group yoga class and experience the perfect blend of personal attention and community connection.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white">
                Join a Small Group
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}