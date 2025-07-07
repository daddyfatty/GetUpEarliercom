import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link, useLocation } from "wouter";
import { Zap, Heart, Target, Users, Dumbbell, User } from "lucide-react";

export interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  image?: string;
  badge: string;
}

export const servicesData: Service[] = [
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
    description: "I work alongside beginner runners to help them break through their own limits. Learn how to progress from never running to completing a 5K, a 5-miler, a half marathon, or even a full marathon, with support for nutrition and recovery included.",
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

interface ServicesGridProps {
  title?: string;
  subtitle?: string;
  showImages?: boolean;
  showReadMore?: boolean;
  className?: string;
}

export function ServicesGrid({ 
  title = "1-on-1 Services",
  subtitle = "Personalized coaching services designed to help you achieve your health and fitness goals",
  showImages = false,
  showReadMore = false,
  className = ""
}: ServicesGridProps) {
  const [, setLocation] = useLocation();
  const [personalTrainingModal, setPersonalTrainingModal] = useState(false);
  const [nutritionCoachingModal, setNutritionCoachingModal] = useState(false);
  const [runningCoachingModal, setRunningCoachingModal] = useState(false);
  const [accountabilityCoachingModal, setAccountabilityCoachingModal] = useState(false);
  const [privateYogaModal, setPrivateYogaModal] = useState(false);
  const [smallGroupYogaModal, setSmallGroupYogaModal] = useState(false);

  return (
    <div className={className}>
      {title && (
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={`grid gap-8 ${showImages ? 'grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {servicesData.map((service, index) => (
          <Card 
            key={index} 
            className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
            onClick={() => {
              if (showReadMore && service.title === "1-on-1 Personal Strength Training") {
                setLocation("/services/personal-strength-training");
              } else if (showReadMore && service.title === "Virtual Nutrition Coaching") {
                setLocation("/services/virtual-nutrition-coaching");
              } else if (showReadMore && service.title === "Certified Running Coaching") {
                setRunningCoachingModal(true);
              } else if (showReadMore && service.title === "Accountability Coaching") {
                setLocation("/services/accountability-coaching");
              } else if (showReadMore && service.title === "Private Yoga") {
                setPrivateYogaModal(true);
              } else if (showReadMore && service.title === "Small Group Yoga") {
                setSmallGroupYogaModal(true);
              }
            }}
          >
            {showImages && service.image && (
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-6 right-6">
                  <Badge 
                    variant="secondary" 
                    className={`bg-${service.color}-500 text-white shadow-lg text-sm px-3 py-1`}
                  >
                    {service.badge}
                  </Badge>
                </div>
              </div>
            )}
            
            <CardHeader className="text-center px-8 py-6">
              {!showImages && (
                <>
                  <div className="mb-4">{service.icon}</div>
                  <Badge variant="secondary" className="mb-3 w-fit mx-auto">
                    {service.badge}
                  </Badge>
                </>
              )}
              <CardTitle className={`${showImages ? 'text-2xl' : 'text-xl'} mb-4 font-bold leading-tight`}>
                {service.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <CardDescription className={`text-gray-600 dark:text-gray-300 ${showImages ? 'text-lg' : 'text-base'} leading-relaxed`}>
                {service.description}
              </CardDescription>
              {showReadMore && service.title === "1-on-1 Personal Strength Training" && (
                <div className="text-center mt-8">
                  <Button 
                    size="lg" 
                    className="text-lg px-6 py-3 bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--primary))] hover:scale-[1.02] transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation("/services/personal-strength-training");
                    }}
                  >
                    Read More →
                  </Button>
                </div>
              )}
              {showReadMore && service.title === "Virtual Nutrition Coaching" && (
                <div className="text-center mt-8">
                  <Button 
                    size="lg" 
                    className="text-lg px-6 py-3 bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--primary))] hover:scale-[1.02] transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation("/services/virtual-nutrition-coaching");
                    }}
                  >
                    Read More →
                  </Button>
                </div>
              )}
              {showReadMore && service.title === "Certified Running Coaching" && (
                <div className="text-center mt-8">
                  <Button 
                    size="lg" 
                    className="text-lg px-6 py-3 bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--primary))] hover:scale-[1.02] transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRunningCoachingModal(true);
                    }}
                  >
                    Read More →
                  </Button>
                </div>
              )}
              {showReadMore && service.title === "Accountability Coaching" && (
                <div className="text-center mt-8">
                  <Button 
                    size="lg" 
                    className="text-lg px-6 py-3 bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--primary))] hover:scale-[1.02] transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation("/services/accountability-coaching");
                    }}
                  >
                    Read More →
                  </Button>
                </div>
              )}
              {showReadMore && service.title === "Private Yoga" && (
                <div className="text-center mt-8">
                  <Button 
                    size="lg" 
                    className="text-lg px-6 py-3 bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--primary))] hover:scale-[1.02] transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrivateYogaModal(true);
                    }}
                  >
                    Read More →
                  </Button>
                </div>
              )}
              {showReadMore && service.title === "Small Group Yoga" && (
                <div className="text-center mt-8">
                  <Button 
                    size="lg" 
                    className="text-lg px-6 py-3 bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--primary))] hover:scale-[1.02] transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSmallGroupYogaModal(true);
                    }}
                  >
                    Read More →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
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
              <p className="text-gray-700 leading-relaxed">As a certified Running Coach, I work with beginner and intermediate runners to help them improve form, prevent injuries, and reach personal bests. Whether you're preparing for a 5k, half marathon, full marathon, or just starting your running journey, I'll provide 1-on-1 guidance or develop a custom plan to fit your unique needs. My approach integrates form refinement, injury prevention, and mental support, along with nutrition guidance and recovery strategies as essential components to keep you healthy, motivated, and consistently progressing.</p>
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

      {/* Private Yoga Details Modal */}
      <Dialog open={privateYogaModal} onOpenChange={setPrivateYogaModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Private Yoga</DialogTitle>
            <DialogDescription>
              Personalized yoga in our dedicated studio space designed for tranquility and focus
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Immerse yourself in a personalized yoga experience in our pristine, dedicated yoga space designed for tranquility and focus. Tailored sessions accommodate all skill levels, providing a serene environment ideal for one-on-one practice. Whether you are beginning your yoga journey or deepening your practice, our studio offers the perfect setting, customized to fit your schedule. Experience the balance and peace of mind that comes with a dedicated space and personalized attention.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Dedicated Yoga Studio</h4>
                <p className="text-sm text-gray-600">A pristine, tranquil space specifically designed for yoga practice, promoting peace and focus.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Personalized Sessions</h4>
                <p className="text-sm text-gray-600">Customized yoga classes tailored to individual skill levels and personal goals, ensuring optimal progression and comfort.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Flexible Scheduling</h4>
                <p className="text-sm text-gray-600">Sessions arranged to fit your unique timetable, making it easy to integrate yoga into your busy life.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Ideal for All Levels</h4>
                <p className="text-sm text-gray-600">Suitable for beginners through advanced practitioners, with modifications and challenges to suit everyone.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Private One-on-One Instruction</h4>
                <p className="text-sm text-gray-600">Personal attention from experienced instructors, enhancing your practice through detailed guidance and support.</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Link href="/contact">
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
                  onClick={() => setPrivateYogaModal(false)}
                >
                  Book Your Private Session →
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Small Group Yoga Details Modal */}
      <Dialog open={smallGroupYogaModal} onOpenChange={setSmallGroupYogaModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Small Group Yoga with Erica</DialogTitle>
            <DialogDescription>
              Elevate your yoga practice with personalized attention in a supportive group setting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Elevate your yoga practice with our semi-private Vinyasa yoga sessions, designed for small groups to ensure personalized attention and a supportive atmosphere. Perfect for those who prefer a more intimate setting, our classes cater to all levels, offering tailored guidance that respects individual pace and progress.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Schedule:</h3>
              <p className="text-gray-700 mb-6">Take my Saturday 8am or Wednesday 9am class in my Orange, CT home studio:</p>
              <div className="space-y-3 text-gray-700 mb-6">
                <div className="flex items-center">
                  <span className="font-semibold min-w-[100px]">Saturdays:</span>
                  <span>8-9am</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold min-w-[100px]">Wednesdays:</span>
                  <span>9-10am</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold min-w-[100px]">Class fee:</span>
                  <span>$25</span>
                </div>
              </div>
              <p className="text-gray-700">Contact me to join or to make private class arrangements.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Small Group Setting</h4>
                <p className="text-sm text-gray-600">Limited class sizes (6 max) for a more intimate and focused experience, fostering a strong sense of community.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Vinyasa Flow Practice</h4>
                <p className="text-sm text-gray-600">Dynamic sessions that synchronize movement with breath, suitable for enhancing flexibility, strength, and balance.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Personalized Instruction</h4>
                <p className="text-sm text-gray-600">Attentive coaching that addresses the needs and goals of each participant, ensuring everyone receives the benefits of expert guidance.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Flexible Class Times</h4>
                <p className="text-sm text-gray-600">Classes scheduled to accommodate various lifestyles, making regular yoga practice accessible and convenient.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Supportive Environment</h4>
                <p className="text-sm text-gray-600">A nurturing space that encourages personal growth and mind-body connection, ideal for deepening yoga skills collectively.</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Link href="/contact">
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
                  onClick={() => setSmallGroupYogaModal(false)}
                >
                  Contact to Join Classes →
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}