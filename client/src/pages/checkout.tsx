import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, Download } from "lucide-react";

// Load Stripe when keys are available
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ bookType, price }: { bookType: string; price: number }) => {
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
        return_url: `${window.location.origin}/purchase-success`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
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
        {isProcessing ? "Processing..." : `Complete Purchase - $${price}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [bookType, setBookType] = useState("digital");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const bookOptions = {
    digital: {
      name: "Digital Download",
      price: 29,
      description: "Instant access to PDF format",
      features: [
        "150+ clean eating recipes",
        "Detailed nutrition information",
        "Weekly meal plans",
        "Instant download",
        "Lifetime access",
        "Mobile-friendly format"
      ]
    },
    hardcopy: {
      name: "Hardcopy Book",
      price: 39,
      description: "Physical book shipped to your door",
      features: [
        "150+ clean eating recipes",
        "High-quality print edition",
        "Beautiful recipe photography",
        "Spiral binding for easy use",
        "Free shipping included",
        "Digital copy included"
      ]
    }
  };

  const selectedBook = bookOptions[bookType as keyof typeof bookOptions];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'digital';
    setBookType(type);

    if (!stripePromise) {
      setLoading(false);
      return;
    }

    // Create PaymentIntent
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: selectedBook.price,
      bookType: type,
      description: `Get Up Earlier Recipe Book - ${selectedBook.name}`
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch(() => {
        toast({
          title: "Failed to initialize payment",
          description: "Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      });
  }, [bookType, selectedBook.price]);

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Payment System Not Available
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Payment processing is not yet configured. Please contact support for assistance.
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
          <p className="text-gray-600 dark:text-gray-300">Setting up your purchase...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Unable to Process Payment
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There was an issue setting up your payment. Please try again.
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get instant access to the Get Up Earlier Recipe Book
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {selectedBook.name}
                  </h3>
                  <Badge variant="secondary">
                    {bookType === 'digital' ? <Download className="w-3 h-3 mr-1" /> : null}
                    ${selectedBook.price}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {selectedBook.description}
                </p>
                <ul className="space-y-2">
                  {selectedBook.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${selectedBook.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm bookType={bookType} price={selectedBook.price} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}