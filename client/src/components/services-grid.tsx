import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
          <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300 group">
            {showImages && service.image && (
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant="secondary" 
                    className={`bg-${service.color}-500 text-white shadow-lg`}
                  >
                    {service.badge}
                  </Badge>
                </div>
              </div>
            )}
            
            <CardHeader className="text-center">
              {!showImages && (
                <>
                  <div className="mb-4">{service.icon}</div>
                  <Badge variant="secondary" className="mb-3 w-fit mx-auto">
                    {service.badge}
                  </Badge>
                </>
              )}
              <CardTitle className={`${showImages ? 'text-lg' : 'text-xl'} mb-3`}>
                {service.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {service.description}
              </CardDescription>
              {showReadMore && (
                <div className="text-center mt-6">
                  <Button variant="outline" size="sm">
                    Read More →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}