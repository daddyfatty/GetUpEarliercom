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
      image: "/assets/download - 2025-06-20T164725.183_1750453386689.png",
      badge: "PERSONAL TRAINING"
    },
    {
      icon: <Heart className="h-8 w-8 text-green-500" />,
      title: "Virtual Nutrition Coaching",
      description: "Providing education on clean eating, understanding calories, healthy digital shopping, and creating personalized sustainable meal plans.",
      color: "green",
      image: "/assets/download - 2025-06-20T170333.649_1750453429860.png",
      badge: "IIN"
    },
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      title: "Accountability Coaching",
      description: "Identify unhealthy habits and break free with small changes, learning to be mindful in real life without relying on a facility, AI, or an app. 1-on-1 live.",
      color: "red",
      image: "/assets/678aad8cfd0dcde677a14418_hike2-p-800_1750453452584.jpg",
      badge: "ACCOUNTABILITY"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Certified Running Coaching",
      description: "I work alongside beginner runners to help them break through their own limits. Learn how to progress from never running to completing a 5K, a 5-miler, or more.",
      color: "purple",
      image: "/assets/download - 2025-06-20T170430.001_1750453483739.png",
      badge: "RUNNING"
    },
    {
      icon: <Dumbbell className="h-8 w-8 text-blue-500" />,
      title: "Private Yoga",
      description: "Immerse yourself in a personalized yoga experience.",
      color: "blue",
      image: "/assets/download - 2025-06-20T170516.226_1750453530152.png",
      badge: "PRIVATE YOGA"
    },
    {
      icon: <User className="h-8 w-8 text-pink-500" />,
      title: "Small Group Yoga",
      description: "Elevate your yoga practice with our semi-private Vinyasa yoga sessions.",
      color: "pink",
      image: "/assets/download - 2025-06-20T170538.818_1750453554236.png",
      badge: "GROUP YOGA"
    }
  ];

  const packages = [
    {
      title: "First Session For New Clients",
      price: "FREE",
      priceTag: "1st Time",
      description: "It all starts with a 30-minute session! Small, incremental changes, nothing drastic.",
      features: [
        "For 1st time clients",
        "In-person Orange, CT or virtual anywhere",
        "7 days a week 4:45am-2pm"
      ],
      buttonText: "Reach Out And Book Session",
      isPopular: false,
      isFree: true,
      backgroundColor: "bg-orange-50"
    },
    {
      title: "1-on-1 Personal Training",
      price: "$50",
      priceTag: "Per 30 Minute Session",
      description: "Maximize your time with efficient, results-driven 30-minute strength sessions designed to build strength and improve fitness. Each session incorporates strength training, weight lifting, compound exercises, bodyweight movements, yoga-inspired stretches, efficient drills, portable workouts, and nutrition information you can take with you when you travel and navigate life on your own. When there is AI, no app, no coach, or no trainer to help you.",
      features: [
        "100% customized training",
        "Powerful 30 minute workouts",
        "In-person Orange, CT or virtual anywhere*"
      ],
      buttonText: "Book Session",
      isPopular: true,
      badge: "Most Popular",
      backgroundColor: "bg-slate-900",
      textColor: "text-white",
      quantityInput: true
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
      isPopular: false,
      badge: "Up to 8 Sessions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section + Services Grid with Gradient Background */}
      <section className="bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
        {/* Hero Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-purple-800/10 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              1-on-1 Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Comprehensive<br className="hidden sm:block" />
              <span className="text-purple-800">Support</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Personalized coaching tailored to your individual needs and goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-800 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">30 Years Experience</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Certified Training</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow border-0 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-medium px-2 py-1 ${
                          service.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                          service.color === 'green' ? 'bg-green-100 text-green-800' :
                          service.color === 'red' ? 'bg-red-100 text-red-800' :
                          service.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                          service.color === 'pink' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.badge}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="text-center pb-4">
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

          <div className="space-y-6">
            {packages.map((pkg, index) => (
              <Card key={index} className={`w-full ${pkg.backgroundColor || 'bg-white'} ${pkg.textColor || 'text-gray-900'} ${pkg.isPopular ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'}`}>
                {pkg.isPopular && pkg.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      {pkg.badge}
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className={`text-xl font-semibold mb-4 ${pkg.textColor || 'text-gray-900'}`}>
                      {pkg.title}
                    </h3>
                    
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className={`text-4xl font-bold ${pkg.isFree ? 'text-gray-900' : pkg.textColor || 'text-gray-900'}`}>
                        {pkg.price}
                      </span>
                      {pkg.priceTag && (
                        <Badge variant="secondary" className="bg-gray-500 text-white text-xs">
                          {pkg.priceTag}
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`text-sm leading-relaxed mb-6 ${pkg.textColor || 'text-gray-700'}`}>
                      {pkg.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className={`text-sm ${pkg.textColor || 'text-gray-700'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    {pkg.quantityInput && (
                      <div className="mb-4">
                        <label className={`block text-sm font-medium mb-2 ${pkg.textColor || 'text-gray-700'}`}>
                          30 Minute Training / Coaching Session
                        </label>
                        <input 
                          type="number" 
                          defaultValue="1" 
                          min="1"
                          className="w-16 px-3 py-2 border rounded-md text-gray-900 bg-white"
                        />
                      </div>
                    )}
                    
                    {pkg.isFree ? (
                      <Button 
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3"
                      >
                        {pkg.buttonText} →
                      </Button>
                    ) : pkg.backgroundColor === 'bg-slate-900' ? (
                      <>
                        <Button 
                          className="w-full bg-blue-400 hover:bg-blue-500 text-gray-900 font-medium py-3"
                        >
                          Book Session
                        </Button>
                        <Button 
                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3"
                        >
                          Buy now
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3"
                        >
                          💳 {pkg.buttonText}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          💰 Pay with PayPal
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full text-gray-600">
                          📅 Book Consultation First
                        </Button>
                      </>
                    )}
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