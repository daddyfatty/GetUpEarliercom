import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface PermanentClassScheduleProps {
  className?: string;
  showContactButton?: boolean;
}

export function PermanentClassSchedule({ 
  className = "", 
  showContactButton = true 
}: PermanentClassScheduleProps) {
  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Permanent Class Schedule
            </h3>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Take my Saturday 8am or Wednesday 9am class in my Orange, CT home studio, email me to join the class.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Saturday Schedule */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center text-purple-600 mb-2">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="text-xl font-semibold text-gray-900">Saturdays</span>
                </div>
                <div className="text-2xl font-bold text-gray-700">8-9am</div>
              </div>

              {/* Wednesday Schedule */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center text-purple-600 mb-2">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="text-xl font-semibold text-gray-900">Wednesdays</span>
                </div>
                <div className="text-2xl font-bold text-gray-700">9-10am</div>
              </div>
            </div>

            {/* Class Fee */}
            <div className="inline-block bg-purple-100 text-purple-800 px-6 py-3 rounded-full text-lg font-semibold mb-6">
              Class fee: $25
            </div>

            {/* Contact Button */}
            {showContactButton && (
              <div className="pt-4">
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                  >
                    Contact me to join!
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}