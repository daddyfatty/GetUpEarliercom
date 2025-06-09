import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Phone, Mail, Calendar, Award, Target, Heart, Users } from "lucide-react";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";
import certificationsPath from "@assets/download - 2025-06-09T135407.583_1749492034107.png";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[hsl(var(--navy))] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-6">
                  <img 
                    src={headshotPath} 
                    alt="Michael Baker" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">Michael Baker</h1>
                <p className="text-xl text-blue-200 mb-2">Personal Trainer, Nutrition Coach</p>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Bridging the gap from inactivity and poor diet to strength and healthy habits
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                  <Calendar className="h-5 w-5 text-blue-200" />
                  <span className="font-medium">30 Years Experience</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                  <Phone className="h-5 w-5 text-blue-200" />
                  <span>12039078902</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                  <Mail className="h-5 w-5 text-blue-200" />
                  <span>mike@webmbd.com</span>
                </div>
              </div>

              <Button 
                className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white px-8 py-3 text-lg font-medium group"
                onClick={() => window.open('https://calendly.com/getupearlier', '_blank')}
              >
                Book A Free 30 Minute Session
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="lg:text-right">
              <img 
                src={headshotPath}
                alt="Michael Baker - Personal Trainer"
                className="w-full max-w-md mx-auto lg:ml-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">About Michael</CardTitle>
              <CardDescription className="text-lg">
                Dedicated health and wellness practitioner with over 30 years of experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Hello, I'm Michael Baker. I am a 50-year-old strength trainer, certified personal trainer, running coach, health coach, and yoga teacher. I'm also a former yoga studio owner and a dedicated health and wellness practitioner with over 30 years of experience. I began Get Up Earlier (GetUpEarlier.com) because getting up earlier was step one in transforming my routine and overall well-being, especially after spending years sitting at a computer as a digital professional.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                My primary goal is to bridge the gap from inactivity and poor diet to strength and healthy habits. I focus on helping people rely on intuition, providing a personal experience, and introducing them to strength training, alternate cardio, and yoga-inspired stretching, along with fundamental nutrition knowledge and concepts.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                While my own marathon training or strength achievements might seem extreme, I'm not trying to turn anyone into a bodybuilder or marathon runner. I'm simply showing that, especially beyond 40, 50, 60, and 70 years old, these things are possible. It's about inspiration and helping people make realistic, sustainable changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Certifications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recognized credentials from leading fitness and wellness organizations
            </p>
          </div>
          
          <div className="flex justify-center">
            <img 
              src={certificationsPath}
              alt="Professional Certifications - ISSA Personal Trainer, ISSA Running Coach, IIN Integrative Nutrition Health Coach, RYT 200 Yoga Alliance"
              className="max-w-full h-auto"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card>
              <CardHeader className="text-center">
                <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <CardTitle className="text-lg">ISSA Certified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">Personal Trainer & Running Coach</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">IIN Certified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">Integrative Nutrition Health Coach</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">RYT 200</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">Registered Yoga Teacher</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Studio Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">Former Yoga Studio Owner</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Training & Coaching Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Personalized approach to help you achieve sustainable health and fitness goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Strength Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Build functional strength and muscle with personalized workout programs designed for your fitness level and goals.
                </p>
                <Badge variant="secondary">Beginner to Advanced</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Running Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Develop endurance and proper running form with structured training plans and technique guidance.
                </p>
                <Badge variant="secondary">All Distances</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Nutrition Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Learn fundamental nutrition concepts and develop healthy eating habits that support your lifestyle.
                </p>
                <Badge variant="secondary">Sustainable Habits</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Yoga & Stretching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Improve flexibility, balance, and mindfulness with yoga-inspired stretching and movement practices.
                </p>
                <Badge variant="secondary">Mind-Body Connection</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Health Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive wellness support focusing on sustainable lifestyle changes and habit formation.
                </p>
                <Badge variant="secondary">Holistic Approach</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Accountability Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Stay motivated and on track with regular check-ins, goal setting, and progress monitoring.
                </p>
                <Badge variant="secondary">Consistent Support</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[hsl(var(--navy))] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Health?</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Let's work together to bridge the gap from where you are to where you want to be. 
            Start with a free 30-minute consultation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white px-8 py-3 text-lg font-medium group"
              onClick={() => window.open('https://calendly.com/getupearlier', '_blank')}
            >
              Schedule Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center space-x-4 text-blue-200">
              <a href="tel:12039078902" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
                <span>12039078902</span>
              </a>
              <a href="mailto:mike@webmbd.com" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
                <span>mike@webmbd.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}