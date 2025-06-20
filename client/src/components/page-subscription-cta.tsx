import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export function PageSubscriptionCTA() {
  const tiers = [
    {
      name: "Free Trial",
      price: 0,
      description: "Get started with clean eating basics",
      features: [
        { name: "Access to 20+ clean eating recipes", included: true },
        { name: "Basic food and calorie tracking", included: true },
        { name: "Essential workout library", included: true },
        { name: "Facebook community access", included: true },
        { name: "Recipe book previews", included: true },
        { name: "Full nutrition tracking", included: false },
        { name: "Personal coaching sessions", included: false },
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Get Up Earlier Pro",
      price: 19,
      description: "Complete clean eating & training system",
      features: [
        { name: "Full clean eating recipe library (200+ recipes)", included: true },
        { name: "Complete 'Get Up Earlier' recipe book (digital)", included: true },
        { name: "Advanced nutrition & macro tracking", included: true },
        { name: "Personal training workout library", included: true },
        { name: "Goal setting & accountability tools", included: true },
        { name: "Regular recipe book updates", included: true },
        { name: "1-on-1 coaching sessions", included: false },
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Elite Coaching",
      price: 79,
      description: "Complete personal training & accountability",
      features: [
        { name: "Everything in Get Up Earlier Pro", included: true },
        { name: "Weekly 1-on-1 coaching sessions", included: true },
        { name: "Custom workout & nutrition programming", included: true },
        { name: "Physical 'Get Up Earlier' recipe book shipped", included: true },
        { name: "Direct access via text & email", included: true },
        { name: "Supplement & lifestyle coaching", included: true },
        { name: "Priority support", included: true },
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-brand">
            Transform Your Life with Get Up Earlier
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Access clean eating recipes, personal training workouts, and accountability coaching. Plus get the continuously updated "Get Up Earlier" recipe book.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative ${
                tier.popular ? "border-2 border-primary shadow-lg" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  ${tier.price}
                  <span className="text-lg font-normal text-gray-600 dark:text-gray-300">
                    /month
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{tier.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400" />
                      )}
                      <span 
                        className={
                          feature.included 
                            ? "text-gray-600 dark:text-gray-300" 
                            : "text-gray-400"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={tier.buttonVariant}
                  disabled={tier.price === 0}
                >
                  {tier.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}