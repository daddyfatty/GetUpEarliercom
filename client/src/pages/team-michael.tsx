import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";

export default function TeamMichael() {
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
                src={headshotPath} 
                alt="Michael Baker" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">Michael Baker</h1>
              <p className="text-xl text-blue-100 mb-4">
                Certified Personal Trainer & Nutrition Coach
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">30+ Years Experience</Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">Certified Trainer</Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">Nutrition Coach</Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">Running Coach</Badge>
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
                  <CardTitle>About Michael</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Michael brings over 30 years of experience as a certified personal trainer, nutrition coach, 
                    and health practitioner. His approach focuses on sustainable lifestyle changes through 
                    strength training, nutrition, and personalized wellness guidance.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed">
                    With three decades in the fitness industry, Michael has helped countless individuals 
                    transform their lives through proven methods that emphasize long-term health over 
                    quick fixes. His expertise spans from beginner fitness programs to advanced athletic 
                    training, always prioritizing safety and sustainable progress.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Michael's holistic approach combines physical training with nutrition education and 
                    lifestyle coaching, ensuring clients develop the knowledge and habits needed for 
                    lasting success. His philosophy centers on building strength, confidence, and 
                    healthy relationships with food and exercise.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Philosophy</CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-700 italic text-lg leading-relaxed border-l-4 border-[hsl(var(--navy))] pl-4">
                    "True fitness isn't about perfection—it's about progress, consistency, and building 
                    sustainable habits that enhance your quality of life. Every journey is unique, and 
                    my role is to guide you towards becoming the strongest, healthiest version of yourself."
                  </blockquote>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Scheduling */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-[hsl(var(--navy))]" />
                      <div>
                        <p className="font-medium">Training Location</p>
                        <p className="text-sm">455 Ridgeview Road, Orange, CT</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-3 text-[hsl(var(--navy))]" />
                      <div>
                        <p className="font-medium">Availability</p>
                        <p className="text-sm">7 days/week • 4:45am-2pm EST</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule Consultation</CardTitle>
                  <CardDescription>
                    Book a 30-minute consultation to discuss your fitness goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90"
                    onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Personal Training Sessions</li>
                    <li>• Nutrition Coaching</li>
                    <li>• Running Coaching</li>
                    <li>• Strength Training Programs</li>
                    <li>• Lifestyle Coaching</li>
                    <li>• Group Training Classes</li>
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