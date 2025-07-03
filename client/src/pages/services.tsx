import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ServicesGrid } from "@/components/services-grid";
import { Link } from "wouter";
import CheckoutModal from "@/components/checkout-modal";
import { MapPin, Award } from "lucide-react";

export default function Services() {
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    packageTitle: string;
    price: string;
    description: string;
  }>({
    isOpen: false,
    packageTitle: '',
    price: '',
    description: ''
  });

  const [personalTrainingModal, setPersonalTrainingModal] = useState(false);
  const [nutritionCoachingModal, setNutritionCoachingModal] = useState(false);
  const [runningCoachingModal, setRunningCoachingModal] = useState(false);
  const [accountabilityCoachingModal, setAccountabilityCoachingModal] = useState(false);

  useEffect(() => {
    // Handle anchor scrolling on page load
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const openCheckout = (packageTitle: string, price: string, description: string) => {
    setCheckoutModal({
      isOpen: true,
      packageTitle,
      price,
      description
    });
  };

  const closeCheckout = () => {
    setCheckoutModal({
      isOpen: false,
      packageTitle: '',
      price: '',
      description: ''
    });
  };

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
      backgroundColor: "bg-orange-50",
      badge: undefined
    },
    {
      title: "1-on-1 Personal Strength Training",
      price: "$50",
      priceTag: "Per 30 Minute Session",
      description: "Maximize your time with efficient, results-driven 30-minute strength sessions designed to build strength and improve fitness. Each session incorporates strength training, weight lifting, compound exercises, bodyweight movements, yoga-inspired stretches, efficient drills, portable workouts, and nutrition information you can take with you when you travel and navigate life on your own. When there is AI, no app, no coach, or no trainer to help you.",
      features: [
        "100% customized training",
        "Powerful 30 minute workouts",
        "In-person Orange, CT or virtual anywhere*"
      ],
      buttonText: "Book Session",
      isPopular: false,
      backgroundColor: "bg-slate-900",
      textColor: "text-white",
      quantityInput: true,
      badge: undefined,
      hasReadMore: true
    },
    {
      title: "1-on-1 Nutrition Coaching",
      price: "$50",
      priceTag: "Per 30 Minute Session",
      description: "Achieve your goals with a personalized, one-time nutrition coaching session—no commitment required. Whether it's weight loss, muscle building, or recovery, I'll guide you through clean eating, understanding calories, and creating sustainable habits. Together, we'll simplify nutrition and tailor it to your lifestyle. In this 30-minute virtual session, you'll learn specifics based on your needs about macronutrients—protein, carbs, and fat—along with food quality and healthy digital shopping tips. Gain actionable insights to support balanced eating, better energy, and smarter choices for lasting results.",
      features: [
        "100% customized coaching",
        "1-on-1. No fake AI bots, prefabricated apps or automations.",
        "Virtual anywhere*"
      ],
      buttonText: "Book Session",
      isPopular: false,
      backgroundColor: "bg-slate-900",
      textColor: "text-white",
      quantityInput: true,
      badge: undefined,
      hasReadMore: true
    },
    {
      title: "1-on-1 Running Coaching Session",
      price: "$50",
      priceTag: "Per 30 Minute Session",
      description: "I work alongside beginner runners to help them break through their own limits. Learn how to progress from never running to completing a 5K, a 5-miler, a half marathon, or even a full marathon, with support for nutrition and recovery included.",
      features: [
        "100% customized coaching",
        "Couch to 5K and Beyond",
        "In-person Orange, CT or virtual anywhere*"
      ],
      buttonText: "Book Session",
      isPopular: false,
      backgroundColor: "bg-slate-900",
      textColor: "text-white",
      quantityInput: true,
      badge: undefined,
      hasReadMore: true
    },
    {
      title: "1-on-1 Private Yoga with Erica",
      price: "$75",
      priceTag: "Per 60 Minute Session",
      description: "Immerse yourself in a personalized yoga experience in our pristine, dedicated yoga space designed for tranquility and focus. Tailored sessions accommodate all skill levels, providing a serene environment ideal for one-on-one practice. Whether you are beginning your yoga journey or deepening your practice, our studio offers the perfect setting, customized to fit your schedule. Experience the balance and peace of mind that comes with a dedicated space and personalized attention.",
      features: [
        "Dedicated Yoga Studio",
        "Personalized Sessions",
        "Ideal for All Levels"
      ],
      buttonText: "Book Session",
      isPopular: false,
      backgroundColor: "bg-orange-50",
      textColor: "text-gray-900",
      quantityInput: true,
      badge: undefined
    },
    {
      title: "Small Group Yoga with Erica",
      price: "$25",
      priceTag: "Per 60 Minute Session",
      description: "Elevate your yoga practice with our semi-private Vinyasa yoga sessions, designed for small groups to ensure personalized attention and a supportive atmosphere. Perfect for those who prefer a more intimate setting, our classes cater to all levels, offering tailored guidance that respects individual pace and progress.",
      features: [
        "Small Group Setting",
        "Vinyasa Flow Practice",
        "Personalized Instruction"
      ],
      buttonText: "Book Session",
      isPopular: false,
      backgroundColor: "bg-orange-50",
      textColor: "text-gray-900",
      quantityInput: true,
      badge: undefined
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
              <span className="text-purple-800">Coaching & Training</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Personalized coaching tailored to your individual needs and goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="inline-flex items-center gap-2 bg-purple-800/10 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Local Orange CT or virtual anywhere
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
                <Award className="h-4 w-4" />
                Certified Training
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ServicesGrid 
              showImages={true} 
              showReadMore={true} 
              title=""
              subtitle=""
            />
          </div>
        </div>
      </section>
      {/* Strength Training & Coaching Packages */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="services-pricing" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Strength Training & Coaching
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the level of support that best fits your goals and lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {packages.map((pkg, index) => (
              <div key={index}>
                <Card 
                  className={`${pkg.backgroundColor || 'bg-white'} ${pkg.textColor || 'text-gray-900'} ${pkg.isPopular ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:ring-2 hover:ring-blue-200 h-full flex flex-col`}
                  onClick={() => {
                    if (pkg.hasReadMore) {
                      if (pkg.title === "1-on-1 Personal Strength Training") {
                        setPersonalTrainingModal(true);
                      } else if (pkg.title === "1-on-1 Nutrition Coaching") {
                        setNutritionCoachingModal(true);
                      } else if (pkg.title === "1-on-1 Running Coaching Session") {
                        setRunningCoachingModal(true);
                      }
                    } else {
                      window.location.href = "/contact";
                    }
                  }}
                >
                  {pkg.isPopular && pkg.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4 py-1">
                        {pkg.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-8 flex-1 flex flex-col">
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
                      
                      <div className={`text-sm leading-relaxed mb-6 ${pkg.textColor || 'text-gray-700'} space-y-3`}>
                        {pkg.description.split('. ').map((sentence, index, array) => {
                          if (index === array.length - 1) {
                            return <p key={index}>{sentence}</p>;
                          }
                          return <p key={index}>{sentence}.</p>;
                        })}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className={`text-sm ${pkg.textColor || 'text-gray-700'}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {pkg.isFree && (
                      <div className="space-y-3 mt-auto">
                        <Button 
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 px-8 text-lg rounded-lg h-16"
                        >
                          {pkg.buttonText} →
                        </Button>
                      </div>
                    )}
                    
                    {pkg.hasReadMore && (
                      <div className="mt-auto pt-4">
                        <Button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (pkg.title === "1-on-1 Personal Strength Training") {
                              setPersonalTrainingModal(true);
                            } else if (pkg.title === "1-on-1 Nutrition Coaching") {
                              setNutritionCoachingModal(true);
                            } else if (pkg.title === "1-on-1 Running Coaching Session") {
                              setRunningCoachingModal(true);
                            }
                          }}
                          className="w-full bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--primary))] hover:scale-[1.02] transition-all duration-300 font-medium py-3 px-6 rounded-lg"
                        >
                          Read More →
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModal.isOpen}
        onClose={closeCheckout}
        packageTitle={checkoutModal.packageTitle}
        price={checkoutModal.price}
        description={checkoutModal.description}
      />

      {/* Personal Training Details Modal */}
      <Dialog open={personalTrainingModal} onOpenChange={setPersonalTrainingModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">1-on-1 Personal Strength Training</DialogTitle>
            <DialogDescription>
              Comprehensive strength training tailored to your fitness level and goals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                I believe in "lifting heavy things" with high intensity at least twice per week. I focus on traditional compound exercises, drop sets, body-weight strength training, and physical outdoor work like running, hiking, and basic calisthenics, along with increasing flexibility through customized yoga-style stretches. All supported and built on truly understanding and implementing "clean eating."
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                I'm here to help you break free from inactivity, your gym rut, or advance your fitness. You need a push in the right direction and accountability.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                One or two 30-minute sessions per week will change your life. You will be amazed by how much we can accomplish in this short time, how quickly your strength improves, and how much you gain as you navigate life. Learn to reframe your time and thoughts about working out, and see how it can all be naturally and intuitively integrated into your life.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">100% customized training</h4>
                <p className="text-sm text-gray-600">1-on-1. No fake AI bots, prefabricated apps or automations.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Powerful 30 minute compound exercise workouts</h4>
                <p className="text-sm text-gray-600">Designed to achieve progress in a short amount of time</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">In-person Orange, CT or virtual anywhere*</h4>
                <p className="text-sm text-gray-600">*Virtual Options: Google Meet, Zoom, or Microsoft Teams</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Link href="/contact">
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
                  onClick={() => setPersonalTrainingModal(false)}
                >
                  Get Started Today →
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtual Nutrition Coaching Details Modal */}
      <Dialog open={nutritionCoachingModal} onOpenChange={setNutritionCoachingModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Virtual Nutrition Coaching</DialogTitle>
            <DialogDescription>
              Personalized nutrition guidance with live 1-on-1 coaching sessions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You can't out-train, out-run, or out-yoga a bad diet or eating too many calories. If the goal is weight loss, muscle building, endurance or muscle retention, you must learn about food. As an experienced strength trainer and certified health coach, I understand the critical role diet plays in achieving your fitness goals. Everyone has unique needs, and together, we'll develop a customized plan based on sound, actionable information. This includes a full understanding of calories, macronutrient needs, single ingredient vs. ultra-processed foods, and healthy digital shopping.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                <strong>Live 1-on-1 no automations, AI or programs. We communicate, share links and get you locked in!</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Gain insight into balanced eating habits</h4>
                <p className="text-sm text-gray-600">Learn how to create sustainable nutrition plans that work for your lifestyle.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Support weight loss and muscle recovery</h4>
                <p className="text-sm text-gray-600">Understanding how nutrition directly impacts your fitness goals.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Boost metabolism and energy levels</h4>
                <p className="text-sm text-gray-600">Optimize your food choices to feel energized throughout the day.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Improve self-confidence and body image</h4>
                <p className="text-sm text-gray-600">Build a healthy relationship with food and your body.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Learn how to shop for healthy food digitally</h4>
                <p className="text-sm text-gray-600">Navigate online grocery shopping and meal planning efficiently.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Insights into macronutrients & micronutrients</h4>
                <p className="text-sm text-gray-600">Understanding the building blocks of proper nutrition.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Strategies for sustainable lifestyle changes</h4>
                <p className="text-sm text-gray-600">Making changes that last without extreme restrictions.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Education on product labels and food trends</h4>
                <p className="text-sm text-gray-600">Learn to read labels and separate fact from marketing.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Guidance on trending diets and debunking myths</h4>
                <p className="text-sm text-gray-600">Get evidence-based advice on popular diet trends.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Continuous support to help you make smarter food choices</h4>
                <p className="text-sm text-gray-600">Ongoing guidance to build long-term healthy eating habits.</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Link href="/contact">
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
                  onClick={() => setNutritionCoachingModal(false)}
                >
                  Reach out here to get going →
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Running Coaching Details Modal */}
      <Dialog open={runningCoachingModal} onOpenChange={setRunningCoachingModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Certified Running Coaching</DialogTitle>
            <DialogDescription>
              Personalized running coaching for beginners to advanced runners
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                As a certified Running Coach, I work with beginner and intermediate runners to help them improve form, prevent injuries, and reach personal bests. Whether you're preparing for a 5k, half marathon, full marathon, or just starting your running journey, I'll develop a custom plan to fit your unique needs. My approach integrates form refinement, injury prevention, and mental support, along with nutrition guidance and recovery strategies as essential components to keep you healthy, motivated, and consistently progressing.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Coaching Includes:</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Go from Couch to 5k</h4>
                  <p className="text-sm text-gray-600">Structured progression for complete beginners</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Personalized running plans</h4>
                  <p className="text-sm text-gray-600">Custom training schedules based on your goals</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Technique and form coaching</h4>
                  <p className="text-sm text-gray-600">Improve efficiency and reduce injury risk</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Injury prevention strategies</h4>
                  <p className="text-sm text-gray-600">Stay healthy and consistent in your training</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Motivation and mental support</h4>
                  <p className="text-sm text-gray-600">Build confidence and mental resilience</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Nutrition and recovery guidance</h4>
                  <p className="text-sm text-gray-600">Fuel your body for optimal performance</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Training for all fitness levels</h4>
                  <p className="text-sm text-gray-600">Programs tailored to your current ability</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Regular progress tracking</h4>
                  <p className="text-sm text-gray-600">Monitor improvements and adjust plans</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Link href="/contact">
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
                  onClick={() => setRunningCoachingModal(false)}
                >
                  Start Your Running Journey →
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Accountability Coaching Details Modal */}
      <Dialog open={accountabilityCoachingModal} onOpenChange={setAccountabilityCoachingModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Accountability Coaching</DialogTitle>
            <DialogDescription>
              Your Partner in Achieving Health and Fitness Goals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                I offer personalized accountability & lifestyle coaching to support your health and fitness journey. With unlimited one-on-one communication via text or Facebook Messenger, I provide continuous guidance and motivation. Additionally, I hold two 20-minute live check-ins per month to assess your progress and adjust strategies as needed. This combination of daily support and regular live interactions ensures you stay on track and make consistent progress toward your objectives.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Coaching Areas:</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Weight loss</h4>
                  <p className="text-sm text-gray-600">Sustainable weight management strategies</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Running</h4>
                  <p className="text-sm text-gray-600">Running goals and training consistency</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Personal training</h4>
                  <p className="text-sm text-gray-600">Strength training accountability and form</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Fitness</h4>
                  <p className="text-sm text-gray-600">Overall fitness and activity goals</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Lifestyle</h4>
                  <p className="text-sm text-gray-600">Healthy habit formation and maintenance</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Nutrition goals</h4>
                  <p className="text-sm text-gray-600">Dietary changes and meal planning support</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Unlimited one-on-one communication via text or Facebook Messenger
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Two 20-minute live check-ins per month
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Progress assessment and strategy adjustments
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Continuous guidance and motivation
                </li>
              </ul>
            </div>

            <div className="flex justify-center pt-4">
              <Link href="/contact">
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
                  onClick={() => setAccountabilityCoachingModal(false)}
                >
                  Get Accountability Support →
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}