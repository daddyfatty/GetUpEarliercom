import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Calendar } from "lucide-react";
import { SiFacebook } from "react-icons/si";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[hsl(var(--navy))] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contact Us</h1>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">PERSONAL MEANS PERSONAL</h2>
            <p className="text-xl text-blue-200">
              Reach out below or text direct: 203.907.8902
            </p>
            <p className="text-lg text-blue-100">
              100% customized sessions. Let us know your objectives:
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Text</h3>
                    <p className="text-gray-600">203.907.8902</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">
                      Mike: <a href="mailto:mike@webmbd.com" className="text-blue-600 hover:underline">mike@webmbd.com</a>
                    </p>
                    <p className="text-gray-600">
                      Erica: <a href="mailto:ejelormine@gmail.com" className="text-blue-600 hover:underline">ejelormine@gmail.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Our Location</h3>
                    <p className="text-gray-600">Virtual Anywhere</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Hours</h3>
                    <p className="text-gray-600">Coaching and Training: M-F 4:45am-10am</p>
                    <p className="text-gray-600">
                      Yoga: <a href="https://www.ericaleebaker.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Click here for schedule</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Find Us</h3>
              <div className="rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2998.7426847646!2d-73.02577068403!3d41.29127977925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e7d8b5b8b5b5b5%3A0x1234!2s455%20Ridgeview%20Rd%2C%20Orange%2C%20CT%2006477!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="455 Ridgeview Road, Orange, CT"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Take direct action to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90"
                  onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Free 30-Minute Consultation
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'sms:2039078902'}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Text: 203.907.8902
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://www.facebook.com/groups/getupearlier', '_blank')}
                >
                  <SiFacebook className="h-4 w-4 mr-2" />
                  Join Facebook Community
                </Button>
              </CardContent>
            </Card>

            {/* Address */}
            <div className="mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Physical Location</h3>
                </div>
                <p className="text-gray-600">455 Ridgeview Road</p>
                <p className="text-gray-600">Orange, CT</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">How do I get started?</h3>
                  <p className="text-gray-600 mb-4">
                    Book a free 30-minute consultation where we'll discuss your goals, current situation, and create a personalized plan.
                  </p>

                  <h3 className="font-medium text-gray-900 mb-2">Do you offer virtual coaching?</h3>
                  <p className="text-gray-600 mb-4">
                    Yes! Virtual coaching sessions are available via video call, making it easy to work together regardless of location.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">What if I'm a complete beginner?</h3>
                  <p className="text-gray-600 mb-4">
                    Perfect! We specialize in helping beginners build sustainable habits. Every program is customized to your current fitness level.
                  </p>

                  <h3 className="font-medium text-gray-900 mb-2">How much does coaching cost?</h3>
                  <p className="text-gray-600">
                    Pricing varies based on your specific needs and goals. Book a free consultation to discuss options that fit your budget.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}