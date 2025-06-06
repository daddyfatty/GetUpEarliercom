import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap } from "lucide-react";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = ({ plan, price }: { plan: string; price: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast({
        title: "Payment system not ready",
        description: "Please wait for the payment system to load.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscription-success`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
      >
        {isProcessing ? "Processing..." : `Subscribe for $${price}/month`}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        You can cancel anytime. No hidden fees.
      </p>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const plans = {
    pro: {
      name: "Pro",
      price: 19,
      description: "Everything you need to succeed",
      icon: Star,
      popular: true,
      features: [
        "Full recipe library (200+ recipes)",
        "Advanced nutrition tracking",
        "Personalized meal plans",
        "Premium workout library",
        "Progress analytics",
        "Recipe book access",
        "Priority support"
      ]
    },
    premium: {
      name: "Premium",
      price: 39,
      description: "For serious health enthusiasts",
      icon: Crown,
      popular: false,
      features: [
        "Everything in Pro",
        "1-on-1 coaching sessions (2/month)",
        "Custom workout programming",
        "Supplement recommendations",
        "Priority support",
        "Early access to new features",
        "Hardcopy recipe book included"
      ]
    }
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan') || 'pro';
    setSelectedPlan(plan);

    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to subscribe.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!stripePromise) {
      setLoading(false);
      return;
    }

    // Create subscription
    apiRequest("POST", "/api/create-subscription", { 
      plan: plan,
      userId: user?.id
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch(() => {
        toast({
          title: "Failed to initialize subscription",
          description: "Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      });
  }, [selectedPlan, isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Please Log In
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You need to be logged in to subscribe to a plan.
              </p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Subscription System Not Available
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Subscription processing is not yet configured. Please contact support for assistance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Setting up your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Subscribe to {currentPlan.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Unlock premium features and accelerate your health journey
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(plans).map(([key, plan]) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedPlan === key 
                    ? "border-2 border-primary shadow-lg" 
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        key === 'pro' ? 'bg-primary/10' : 'bg-secondary/10'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          key === 'pro' ? 'text-primary' : 'text-secondary'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{plan.description}</p>
                      </div>
                    </div>
                    {plan.popular && (
                      <Badge className="bg-primary text-white">Popular</Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-600 dark:text-gray-300">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {clientSecret ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Complete Your Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm plan={selectedPlan} price={currentPlan.price} />
              </Elements>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Unable to Process Subscription
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There was an issue setting up your subscription. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}