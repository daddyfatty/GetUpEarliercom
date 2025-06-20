import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Heart, Target, Users, Dumbbell, User } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: "1-on-1 Personal Strength Training",
      description: "Powerful, distraction-free 30-minute workouts incorporating traditional compound free-weight movements, bodyweight exercises, and outdoor activities.",
      color: "blue",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=240&fit=crop&crop=center",
      badge: "PERSONAL TRAINING"
    },
    {
      icon: <Heart className="h-8 w-8 text-green-500" />,
      title: "Virtual Nutrition Coaching",
      description: "Providing education on clean eating, understanding calories, healthy digital shopping, and creating personalized sustainable meal plans.",
      color: "green",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=240&fit=crop&crop=center",
      badge: "JIIN"
    },
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      title: "Accountability Coaching",
      description: "Identify unhealthy habits and break free with small changes, learning to be mindful in real life without relying on a facility, AI, or an app. 1-on-1 live.",
      color: "red",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop&crop=center",
      badge: "ACCOUNTABILITY"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Certified Running Coaching",
      description: "I work alongside beginner runners to help them break through their own limits. Learn how to progress from never running to completing a 5K, a 5-miler, or more.",
      color: "purple",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=240&fit=crop&crop=center",
      badge: "RUNNING"
    },
    {
      icon: <Dumbbell className="h-8 w-8 text-blue-500" />,
      title: "Private Yoga",
      description: "Immerse yourself in a personalized yoga experience.",
      color: "blue",
      image: "https://images.unsplash.com/photo-1506629905607-af5f6b13f7fe?w=400&h=240&fit=crop&crop=center",
      badge: "PRIVATE YOGA"
    },
    {
      icon: <User className="h-8 w-8 text-pink-500" />,
      title: "Small Group Yoga",
      description: "Elevate your yoga practice with our semi-private Vinyasa yoga sessions.",
      color: "pink",
      image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=240&fit=crop&crop=center",
      badge: "GROUP YOGA"
    }
  ];

  const packages = [
    {
      title: "Individual Session",
      price: "$50",
      description: "Perfect for getting started or addressing specific needs and concerns.",
      features: [
        "One-on-one strength training",
        "Goal assessment",
        "Personalized recommendations",
        "Follow-up resources"
      ],
      buttonText: "Pay with Card",
      isPopular: false
    },
    {
      title: "Monthly Package - 5 Sessions",
      price: "$225/mo",
      description: "Consistent support for building lasting transformation.",
      features: [
        "Up to 5 monthly sessions",
        "Custom workout plans",
        "Progress tracking",
        "Email support",
        "Flexible scheduling"
      ],
      buttonText: "Pay with Card",
      isPopular: true,
      badge: "Up to 5 Sessions"
    },
    {
      title: "Monthly Package - 8 Sessions",
      price: "$325/mo",
      description: "Comprehensive program for serious transformation.",
      features: [
        "Up to 8 monthly sessions",
        "Complete fitness assessment",
        "Detailed workout planning",
        "Priority scheduling",
        "24/7 text support",
        "Monthly progress reviews"
      ],
      buttonText: "Pay with Card",
      isPopular: false,
      badge: "Up to 8 Sessions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive wellness support tailored to your individual needs and goals
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow border-0">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-lg w-fit">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center mb-6 leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      Read More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Strength Training & Coaching Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Strength Training & Coaching
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the level of support that best fits your goals and lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.isPopular ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'}`}>
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      {pkg.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    {pkg.title}
                  </CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {pkg.price}
                  </div>
                  <CardDescription className="text-gray-600">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    <Button 
                      className={`w-full ${pkg.isPopular ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-900 hover:bg-gray-800'}`}
                    >
                      💳 {pkg.buttonText}
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      💰 Pay with PayPal
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-gray-600">
                      📅 Book Consultation First
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}