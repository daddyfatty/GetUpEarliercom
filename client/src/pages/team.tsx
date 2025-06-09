import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Clock, MapPin, Star, ChevronDown, ChevronUp } from "lucide-react";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";
import ericaPath from "@assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg";
import yogaAlliancePath from "@assets/67916c3970c6de430a570260_67916c07869e9844f99f5710_download%20(19)_1749497839094.png";

export default function Team() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const toggleExpanded = (memberId: string) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[hsl(var(--navy))] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Meet Our Team</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experienced professionals dedicated to helping you achieve your health and fitness goals
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            
            {/* Michael Baker */}
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg">
              <CardHeader 
                className="pb-4"
                onClick={() => toggleExpanded('michael')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src={headshotPath} 
                        alt="Michael Baker" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-xl">Michael Baker</CardTitle>
                      <CardDescription>
                        Certified Personal Trainer & Nutrition Coach
                      </CardDescription>
                      <Badge variant="secondary" className="mt-1">30+ Years Experience</Badge>
                    </div>
                  </div>
                  {expandedMember === 'michael' ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              
              {expandedMember === 'michael' && (
                <CardContent className="space-y-4 pt-0">
                  <p className="text-gray-700 leading-relaxed">
                    Michael brings over 30 years of experience as a certified personal trainer, nutrition coach, 
                    and health practitioner. His approach focuses on sustainable lifestyle changes through 
                    strength training, nutrition, and personalized wellness guidance.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Contact & Location</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>455 Ridgeview Road, Orange, CT</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>7 days/week • 4:45am-2pm EST</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Credentials</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Certified Trainer</Badge>
                        <Badge variant="secondary">Nutrition Coach</Badge>
                        <Badge variant="secondary">Running Coach</Badge>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90"
                    onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Erica Baker */}
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg">
              <CardHeader 
                className="pb-4"
                onClick={() => toggleExpanded('erica')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src={ericaPath} 
                        alt="Erica Baker" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-xl">Erica Baker</CardTitle>
                      <CardDescription>
                        E-RYT 200 Yoga Instructor
                      </CardDescription>
                      <Badge variant="secondary" className="mt-1">15+ Years Experience</Badge>
                    </div>
                  </div>
                  {expandedMember === 'erica' ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              
              {expandedMember === 'erica' && (
                <CardContent className="space-y-4 pt-0">
                  <div className="flex justify-center mb-4">
                    <div className="w-20">
                      <img 
                        src={yogaAlliancePath} 
                        alt="Yoga Alliance Certified" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Current Schedule</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between items-center">
                          <span>Saturdays:</span>
                          <span className="font-medium">8-9am</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Wednesdays:</span>
                          <span className="font-medium">9-10am</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Class fee:</span>
                          <span className="font-medium text-[hsl(var(--orange))]">$25</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Contact & Location</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Home Studio, Orange, CT</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>(203) 331-2031</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>ejelormine@gmail.com</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Credentials</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">E-RYT 200</Badge>
                      <Badge variant="secondary">3000+ Teaching Hours</Badge>
                      <Badge variant="secondary">Former Studio Owner</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90"
                      onClick={() => window.location.href = 'mailto:ejelormine@gmail.com?subject=Yoga Class Inquiry'}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact for Classes
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => window.location.href = 'tel:2033312031'}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call (203) 331-2031
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Philosophy Section */}
          <div className="mt-16">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Our Philosophy</CardTitle>
                <CardDescription className="text-lg">
                  Authentic, personalized wellness through proven methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                  Erica believes Yoga is just one facet of nourishing your body to create optimal health and prevent disease. 
                  She truly enjoys helping others improve their overall health as well as making them laugh a little too. 
                  You can find her teaching small group classes in her home studio, private lessons and recorded classes 
                  of varying lengths on her YouTube channel.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-[hsl(var(--navy))]" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Authentic Teaching</h3>
                    <p className="text-sm text-gray-600">
                      Teaching from a place of authenticity with unique style for all levels
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-[hsl(var(--navy))]" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
                    <p className="text-sm text-gray-600">
                      Group classes, private lessons, and recorded sessions available
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-[hsl(var(--navy))]" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Consistent Experience</h3>
                    <p className="text-sm text-gray-600">
                      Focus on strength, mobility, flexibility, balance and stress relief
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}