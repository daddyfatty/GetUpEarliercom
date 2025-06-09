import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Calendar, MessageSquare } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const subject = encodeURIComponent(formData.subject || "Contact from Get Up Earlier");
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n\n` +
      `Message:\n${formData.message}`
    );
    
    window.location.href = `mailto:mike@webmbd.com?subject=${subject}&body=${body}`;
    
    toast({
      title: "Email Client Opened",
      description: "Your default email client should now be open with the message pre-filled.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[hsl(var(--navy))] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Ready to start your health and fitness journey? Let's connect and discuss how we can help you achieve your goals.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
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
                    <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">12039078902</p>
                    <p className="text-sm text-gray-500 mt-1">Available for calls and text messages</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">mike@webmbd.com</p>
                    <p className="text-sm text-gray-500 mt-1">Best for detailed inquiries and scheduling</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">Based in Connecticut</p>
                    <p className="text-sm text-gray-500 mt-1">In-person and virtual coaching available</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Response Time</h3>
                    <p className="text-gray-600">Within 24 hours</p>
                    <p className="text-sm text-gray-500 mt-1">Usually much faster during business hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Skip the form and take direct action
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90"
                  onClick={() => window.open('https://calendly.com/getupearlier', '_blank')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Free 30-Minute Consultation
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'tel:12039078902'}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now: (203) 907-8902
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
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(203) 555-0123"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Tell us about your fitness goals, current challenges, or any questions you have..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90"
                  >
                    Send Message
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    * Required fields. Your information is kept private and secure.
                  </p>
                </form>
              </CardContent>
            </Card>
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
                    Perfect! My approach is designed to bridge the gap from inactivity to healthy habits, with programs tailored to any fitness level.
                  </p>

                  <h3 className="font-medium text-gray-900 mb-2">How often should we meet?</h3>
                  <p className="text-gray-600">
                    This depends on your goals and preferences. Options range from single sessions to weekly meetings as part of ongoing coaching packages.
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