import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import ericaPath from "@assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg";
import yogaAlliancePath from "@assets/67916c3970c6de430a570260_67916c07869e9844f99f5710_download%20(19)_1749497839094.png";
import eryBadge from "@assets/RYTMIKE_1749505314924.png";
import yaerBadge from "@assets/YAER_1749505224126.png";

export default function TeamErica() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-[hsl(var(--navy))] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/team">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <img 
                src={ericaPath} 
                alt="Erica Baker" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">Erica Baker</h1>
              <p className="text-xl text-blue-100 mb-4">
                E-RYT 200 Yoga Instructor
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">15+ Years Experience</Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">E-RYT 200</Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">3000+ Teaching Hours</Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">Former Studio Owner</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Bio & Experience */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Erica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Erica is an E-RYT 200 Yoga Instructor with over 3000 hours teaching experience in both 
                    large and small group settings. For the last decade, she has taught yoga from a place 
                    of authenticity and developed her own unique style and an ability to work well with all levels.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed">
                    As a former boutique yoga studio owner and wellness enthusiast, she brings her health 
                    and fitness knowledge and passion to others with her fun energy and physical classes. 
                    Every single one of her classes is unique, but you can always count on a consistent 
                    experience working on overall strength, mobility, flexibility, balance and stress relief.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Erica believes Yoga is just one facet of nourishing your body to create optimal health and prevent disease. 
                    She truly enjoys helping others improve their overall health as well as making them laugh a little too. 
                    You can find her teaching small group classes in her home studio, private lessons and recorded classes 
                    of varying lengths on her YouTube channel.
                  </p>

                  {/* Professional Credentials */}
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Certifications</h4>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                      <div className="text-center bg-white p-4 rounded-lg shadow-sm border">
                        <img 
                          src={eryBadge} 
                          alt="E-RYT 200 Yoga Teacher" 
                          className="h-16 w-auto mx-auto mb-2"
                        />
                        <p className="text-xs text-gray-600 font-medium">E-RYT 200 Yoga Alliance</p>
                      </div>
                      <div className="text-center bg-white p-4 rounded-lg shadow-sm border">
                        <img 
                          src={yaerBadge} 
                          alt="Yoga Alliance E-RYT" 
                          className="h-16 w-auto mx-auto mb-2"
                        />
                        <p className="text-xs text-gray-600 font-medium">Yoga Alliance Certified</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teaching Philosophy</CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-700 italic text-lg leading-relaxed border-l-4 border-[hsl(var(--navy))] pl-4">
                    "Yoga is more than physical movement—it's a pathway to holistic wellness. I teach from 
                    authenticity, meeting each student where they are and guiding them toward strength, 
                    flexibility, and inner peace. Every class is a unique journey of discovery."
                  </blockquote>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Class Focus Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Physical Benefits</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Overall strength building</li>
                        <li>• Improved mobility</li>
                        <li>• Enhanced flexibility</li>
                        <li>• Better balance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Mental Benefits</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Stress relief</li>
                        <li>• Mindfulness practice</li>
                        <li>• Mental clarity</li>
                        <li>• Emotional balance</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Scheduling */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Schedule</CardTitle>
                  <CardDescription>
                    Small group classes in home studio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Saturdays:</span>
                        <span className="text-[hsl(var(--navy))]">8:00-9:00am</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Wednesdays:</span>
                        <span className="text-[hsl(var(--navy))]">9:00-10:00am</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">Class fee:</span>
                        <span className="font-bold text-[hsl(var(--orange))]">$25</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-[hsl(var(--navy))]" />
                      <div>
                        <p className="font-medium">Studio Location</p>
                        <p className="text-sm">Home Studio, Orange, CT</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-3 text-[hsl(var(--navy))]" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm">(203) 331-2031</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-3 text-[hsl(var(--navy))]" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm">ejelormine@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Contact Erica for class information or private sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    className="w-full bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90"
                    onClick={() => window.location.href = 'mailto:ejelormine@gmail.com?subject=Yoga Class Inquiry'}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email for Classes
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = 'tel:2033312031'}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call (203) 331-2031
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Small Group Classes</li>
                    <li>• Private Yoga Sessions</li>
                    <li>• Online Recorded Classes</li>
                    <li>• Beginner-Friendly Instruction</li>
                    <li>• Advanced Practice Guidance</li>
                    <li>• Stress Relief Programs</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}