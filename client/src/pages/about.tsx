import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Phone, Mail, Calendar, Award, Target, Heart, Users } from "lucide-react";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";
import certificationsPath from "@assets/download - 2025-06-09T135407.583_1749492034107.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[hsl(var(--navy))] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Meet Our Team</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Dedicated health and wellness professionals committed to helping you bridge the gap 
            from inactivity and poor diet to strength and healthy habits.
          </p>
        </div>
      </section>

      {/* Team Profiles */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Michael Baker Profile */}
          <div className="mb-16">
            <Card className="overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Content Side */}
                <div className="p-8 lg:p-12">
                  <div className="mb-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-100">
                        <img 
                          src={headshotPath} 
                          alt="Michael Baker" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Michael Baker</h2>
                        <p className="text-xl text-blue-600 mb-2">Personal Trainer, Nutrition Coach</p>
                        <p className="text-gray-600">Founder & Lead Coach</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">30 Years Experience</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">12039078902</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">mike@webmbd.com</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-gray-700 leading-relaxed">
                      I'm a 50-year-old strength trainer, certified personal trainer, running coach, health coach, and yoga teacher. 
                      I'm also a former yoga studio owner and dedicated health and wellness practitioner with over 30 years of experience.
                    </p>
                    
                    <p className="text-gray-700 leading-relaxed">
                      I began Get Up Earlier because getting up earlier was step one in transforming my routine and overall well-being, 
                      especially after spending years sitting at a computer as a digital professional.
                    </p>
                    
                    <p className="text-gray-700 leading-relaxed">
                      My primary goal is to bridge the gap from inactivity and poor diet to strength and healthy habits. 
                      I focus on helping people rely on intuition, providing a personal experience, and introducing them to 
                      strength training, alternate cardio, and yoga-inspired stretching.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary">ISSA Personal Trainer</Badge>
                    <Badge variant="secondary">ISSA Running Coach</Badge>
                    <Badge variant="secondary">IIN Health Coach</Badge>
                    <Badge variant="secondary">RYT 200 Yoga</Badge>
                  </div>

                  <Button 
                    className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white px-6 py-2 font-medium group"
                    onClick={() => window.open('https://calendly.com/getupearlier', '_blank')}
                  >
                    Book Session with Michael
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Image Side */}
                <div className="relative lg:min-h-[500px]">
                  <img 
                    src={headshotPath}
                    alt="Michael Baker - Personal Trainer and Health Coach"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Certifications Section for Michael */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Michael's Professional Certifications</h3>
            </div>
            
            <div className="flex justify-center mb-8">
              <img 
                src={certificationsPath}
                alt="Professional Certifications - ISSA Personal Trainer, ISSA Running Coach, IIN Integrative Nutrition Health Coach, RYT 200 Yoga Alliance"
                className="max-w-full h-auto"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Placeholder for Future Team Members */}
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">More Team Members Coming Soon</h3>
            <p className="text-gray-600">
              We're expanding our team of health and wellness professionals to better serve you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[hsl(var(--navy))] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work with Our Team?</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Connect with Michael Baker to start your health and wellness journey today.
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