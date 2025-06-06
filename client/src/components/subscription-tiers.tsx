import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export function SubscriptionTiers() {
  const tiers = [
    {
      name: "Free",
      price: 0,
      description: "Perfect to get started",
      features: [
        { name: "Basic recipe library (50+ recipes)", included: true },
        { name: "Simple calorie tracking", included: true },
        { name: "Basic workout library", included: true },
        { name: "Community access", included: true },
        { name: "Advanced nutrition tracking", included: false },
        { name: "Personalized meal plans", included: false },
        { name: "1-on-1 coaching sessions", included: false },
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: 19,
      description: "Everything you need to succeed",
      features: [
        { name: "Full recipe library (200+ recipes)", included: true },
        { name: "Advanced nutrition tracking", included: true },
        { name: "Personalized meal plans", included: true },
        { name: "Premium workout library", included: true },
        { name: "Progress analytics", included: true },
        { name: "Recipe book access", included: true },
        { name: "1-on-1 coaching sessions", included: false },
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Premium",
      price: 39,
      description: "For serious health enthusiasts",
      features: [
        { name: "Everything in Pro", included: true },
        { name: "1-on-1 coaching sessions (2/month)", included: true },
        { name: "Custom workout programming", included: true },
        { name: "Supplement recommendations", included: true },
        { name: "Priority support", included: true },
        { name: "Early access to new features", included: true },
        { name: "Hardcopy recipe book included", included: true },
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "secondary" as const,
      popular: false,
    },
  ];

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start your journey with our free plan, or unlock premium features for faster results.
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

        {/* Annual Discount Banner */}
        <div className="mt-12 text-center">
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Save 20% with Annual Plans
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get 2 months free when you choose annual billing on Pro or Premium plans.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
