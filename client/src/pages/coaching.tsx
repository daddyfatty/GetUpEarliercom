import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, Heart, Activity, Users, Star, Calendar, CreditCard } from "lucide-react";
import { SiPaypal } from "react-icons/si";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
// import PayPalButton from "@/components/PayPalButton";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";
import { CoachingSection } from "@/components/coaching-section";

export default function Coaching() {
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleStripeCheckout = async (pkg: any) => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: pkg.amount,
          currency: 'usd',
          description: `${pkg.name} - ${pkg.description}`,
          isRecurring: pkg.isRecurring
        }),
      });

      const data = await response.json();
      
      if (data.clientSecret) {
        // Redirect to Stripe checkout
        window.location.href = `/checkout?clientSecret=${data.clientSecret}&package=${encodeURIComponent(pkg.name)}`;
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };
  const services = [
    {
      title: "1-on-1 Personal Strength Training",
      description: "Powerful, distraction-free 30-minute workouts incorporating traditional compound free-weight movements, bodyweight exercises, and outdoor activities.",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Virtual Nutrition Coaching",
      description: "Providing education on clean eating, understanding calories, healthy digital shopping, and creating personalized, sustainable meal plans.",
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Accountability Coaching",
      description: "Identify unhealthy habits and break free with small changes, learning to be intuitive in real life without relying on a facility, AI, or an app. 1-on-1 live.",
      icon: Target,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Certified Running Coaching",
      description: "I work alongside beginner runners to help them break through their own limits. Learn how to progress from never running to completing a 5K, a 5-miler, a half marathon, or even a full marathon, with support for nutrition and recovery included.",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Private Yoga",
      description: "Immerse yourself in a personalized yoga experience.",
      icon: Activity,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Small Group Yoga",
      description: "Elevate your yoga practice with our semi-private Vinyasa yoga sessions.",
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  const packages = [
    {
      name: "Individual Session",
      description: "Perfect for getting started or addressing specific needs",
      price: "$50",
      duration: "30 minutes",
      features: [
        "One-on-one strength training",
        "Goal assessment",
        "Personalized recommendations",
        "Follow-up resources"
      ],
      isRecurring: false,
      amount: 50
    },
    {
      name: "Monthly Package - 5 Sessions",
      description: "Consistent support for building lasting habits",
      price: "$225/mo",
      duration: "Up to 5 sessions",
      features: [
        "Up to 5 monthly sessions",
        "Custom workout plans",
        "Progress tracking",
        "Email support",
        "Flexible scheduling"
      ],
      isRecurring: true,
      amount: 225
    },
    {
      name: "Monthly Package - 8 Sessions",
      description: "Comprehensive program for serious transformation",
      price: "$325/mo",
      duration: "Up to 8 sessions",
      features: [
        "Up to 8 monthly sessions",
        "Complete fitness assessment",
        "Detailed workout planning",
        "Priority scheduling",
        "24/7 text support",
        "Monthly progress reviews"
      ],
      isRecurring: true,
      amount: 325
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[hsl(var(--navy))] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">Personal Coaching & Training</h1>
              <p className="text-xl text-blue-200 mb-8 leading-relaxed">
                Bridging the gap from inactivity and poor diet to strength and healthy habits through 
                personalized coaching and proven methodologies.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                  <Calendar className="h-5 w-5 text-blue-200" />
                  <span className="font-medium">30 Years Experience</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                  <Star className="h-5 w-5 text-blue-200" />
                  <span>Certified Professional</span>
                </div>
              </div>

              <Button 
                size="lg"
                className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white px-8 py-3 text-lg font-medium group"
                onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
              >
                Book Free Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="lg:text-right">
              <img 
                src={headshotPath}
                alt="Michael Baker - Personal Trainer and Coach"
                className="w-full max-w-md mx-auto lg:ml-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <CoachingSection />

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive wellness support tailored to your individual needs and goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="h-full flex flex-col">
                  <CardHeader>
                    <div className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${service.color}`} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <Button 
                      variant="outline" 
                      className="w-full group border-2 border-[hsl(var(--navy))] text-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))] hover:text-white font-semibold"
                      onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Strength Training & Coaching</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the level of support that best fits your goals and lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className="relative h-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl mb-2">{pkg.name}</CardTitle>
                  <div className="text-2xl font-bold text-[hsl(var(--orange))] mb-2">{pkg.price}</div>
                  <CardDescription className="text-base">
                    {pkg.description}
                  </CardDescription>
                  <Badge variant="secondary" className="mt-2 mx-auto">{pkg.duration}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-gray-600">
                        <div className="w-2 h-2 bg-[hsl(var(--orange))] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-3 mt-6">
                    <Button 
                      className="w-full bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90"
                      onClick={() => handleStripeCheckout(pkg)}
                      disabled={isProcessingPayment}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {isProcessingPayment ? 'Processing...' : 'Pay with Card'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => window.location.href = `mailto:michaelbakerdigital@gmail.com?subject=Payment%20for%20${encodeURIComponent(pkg.name)}&body=I%20would%20like%20to%20purchase%20the%20${encodeURIComponent(pkg.name)}%20package%20for%20${pkg.price}.`}
                    >
                      <SiPaypal className="h-4 w-4 mr-2" />
                      Pay with PayPal
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Consultation First
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Coaching Philosophy</CardTitle>
              <CardDescription className="text-lg">
                Building sustainable habits through intuition and personalized guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                My approach focuses on helping people bridge the gap from inactivity and poor diet to strength and healthy habits. 
                Rather than extreme transformations, I emphasize sustainable changes that fit your lifestyle and build lasting results.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                I combine strength training, alternate cardio, yoga-inspired stretching, and fundamental nutrition knowledge 
                to create a holistic wellness experience. Every program is tailored to your current fitness level, 
                goals, and personal circumstances.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                While my own marathon training or strength achievements might seem extreme, I'm not trying to turn anyone 
                into a bodybuilder or marathon runner. I'm simply showing that, especially beyond 40, 50, 60, and 70 years old, 
                significant improvements are possible through consistent, well-guided effort.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ready to Transform Section */}
      <section className="py-20 bg-gradient-to-br from-[hsl(var(--coaching-primary))] via-purple-700 to-[hsl(var(--coaching-accent))] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform?</h2>
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              Get personalized training and coaching from a certified trainer, yoga teacher, running coach, and integrative nutrition coach. 
              Bridge the gap from inactivity to strength and sustainable healthy habits.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-[hsl(var(--coaching-text))] hover:bg-[hsl(var(--coaching-light))] font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 min-w-[200px]"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Users className="h-5 w-5 mr-2" />
              View Coaching Packages
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[hsl(var(--coaching-accent))] to-[hsl(var(--coaching-primary))] hover:from-[hsl(var(--coaching-accent))]/90 hover:to-[hsl(var(--coaching-primary))]/90 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 min-w-[200px]"
              onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Free Consultation
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-purple-200 text-sm">
              No commitment required • 30-minute consultation • Personalized recommendations
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}