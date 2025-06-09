import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";
import ericaPath from "@assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg";

export default function Team() {
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
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Michael Baker */}
            <Link href="/team/michael">
              <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg group">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={headshotPath} 
                      alt="Michael Baker" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl mb-2">Michael Baker</CardTitle>
                  <CardDescription className="mb-3">
                    Certified Personal Trainer & Nutrition Coach
                  </CardDescription>
                  <Badge variant="secondary" className="mb-4">30+ Years Experience</Badge>
                  <Button variant="outline" className="group-hover:bg-[hsl(var(--navy))] group-hover:text-white transition-colors">
                    View Full Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
              </Card>
            </Link>

            {/* Erica Baker */}
            <Link href="/team/erica">
              <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg group">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={ericaPath} 
                      alt="Erica Baker" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl mb-2">Erica Baker</CardTitle>
                  <CardDescription className="mb-3">
                    E-RYT 200 Yoga Instructor
                  </CardDescription>
                  <Badge variant="secondary" className="mb-4">15+ Years Experience</Badge>
                  <Button variant="outline" className="group-hover:bg-[hsl(var(--navy))] group-hover:text-white transition-colors">
                    View Full Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}