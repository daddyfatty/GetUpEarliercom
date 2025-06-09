import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, Heart, Activity, Users, Star, Calendar } from "lucide-react";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";

export default function Coaching() {
  const services = [
    {
      title: "Personal Training",
      description: "One-on-one strength training sessions designed for your specific fitness level and goals.",
      features: ["Custom workout plans", "Proper form instruction", "Progressive overload", "Equipment guidance"],
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Running Coaching",
      description: "Structured training plans for all distances from 5K to marathon with technique focus.",
      features: ["Training periodization", "Running form analysis", "Injury prevention", "Race preparation"],
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Nutrition Coaching",
      description: "Fundamental nutrition education and sustainable healthy eating habit development.",
      features: ["Macro understanding", "Meal planning", "Intuitive eating", "Lifestyle integration"],
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Yoga & Mobility",
      description: "Yoga-inspired stretching and movement practices for flexibility and mindfulness.",
      features: ["Flexibility improvement", "Stress reduction", "Balance training", "Mind-body connection"],
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const packages = [
    {
      name: "Single Session",
      description: "Perfect for getting started or addressing specific needs",
      price: "Contact for pricing",
      duration: "60 minutes",
      features: [
        "Initial consultation",
        "Goal setting session",
        "Custom plan creation",
        "Follow-up guidance"
      ]
    },
    {
      name: "Monthly Package",
      description: "Comprehensive monthly coaching with regular check-ins",
      price: "Contact for pricing",
      duration: "4 sessions",
      features: [
        "Weekly coaching sessions",
        "Ongoing plan adjustments",
        "Progress tracking",
        "Email support between sessions"
      ]
    },
    {
      name: "Transformation Program",
      description: "Complete 12-week lifestyle transformation journey",
      price: "Contact for pricing",
      duration: "12 weeks",
      features: [
        "Comprehensive assessment",
        "Custom training & nutrition plan",
        "Weekly progress reviews",
        "Habit formation coaching",
        "Accountability support"
      ]
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
                onClick={() => window.open('https://calendly.com/getupearlier', '_blank')}
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

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coaching Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive wellness support tailored to your individual needs and goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${service.color}`} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-[hsl(var(--orange))] rounded-full mr-3 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coaching Packages</h2>
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
                  <Button 
                    className="w-full mt-6 bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90"
                    onClick={() => window.open('https://calendly.com/getupearlier', '_blank')}
                  >
                    Get Started
                  </Button>
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

      {/* CTA Section */}
      <section className="py-16 bg-[hsl(var(--navy))] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Transformation?</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Book a free 30-minute consultation to discuss your goals and create a personalized plan for success.
          </p>
          
          <Button 
            size="lg"
            className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white px-8 py-3 text-lg font-medium group"
            onClick={() => window.open('https://calendly.com/getupearlier', '_blank')}
          >
            Schedule Free Consultation
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
}