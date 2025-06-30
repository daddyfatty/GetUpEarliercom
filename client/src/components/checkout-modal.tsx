import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Wallet } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
  price: string;
  description: string;
}

const StripeCheckoutForm = ({ packageTitle, price, onSuccess }: { packageTitle: string; price: string; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-success',
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your training session has been purchased!",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isProcessing ? "Processing..." : `Pay ${price}`}
      </Button>
    </form>
  );
};

export default function CheckoutModal({ isOpen, onClose, packageTitle, price, description }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();

  // Extract numeric price for calculations
  const numericPrice = parseFloat(price.replace('$', ''));

  const initializeStripePayment = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", { 
        amount: numericPrice,
        description: `${packageTitle} - Virtual Training Session`
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setPaymentMethod('stripe');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment",
        variant: "destructive",
      });
    }
  };

  const initializePayPalPayment = () => {
    setPaymentMethod('paypal');
    // PayPal will be handled by the existing PayPal component
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful",
      description: "You will receive a confirmation email shortly.",
    });
    onClose();
  };

  const resetModal = () => {
    setPaymentMethod(null);
    setClientSecret("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{packageTitle}</h3>
              <p className="text-gray-600 text-sm mb-3">{description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg">Total:</span>
                <span className="text-2xl font-bold text-blue-600">{price}</span>
              </div>
            </CardContent>
          </Card>

          {!paymentMethod && (
            <div className="space-y-4">
              <p className="text-center text-gray-600">Choose your payment method:</p>
              
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={initializeStripePayment}
                  variant="outline"
                  className="h-16 flex items-center justify-center gap-3 border-2 hover:border-blue-500 hover:bg-blue-50"
                >
                  <CreditCard className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Credit Card</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                  </div>
                </Button>

                <Button
                  onClick={initializePayPalPayment}
                  variant="outline"
                  className="h-16 flex items-center justify-center gap-3 border-2 hover:border-yellow-500 hover:bg-yellow-50"
                >
                  <Wallet className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold">PayPal</div>
                    <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {paymentMethod === 'stripe' && clientSecret && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5" />
                <span className="font-semibold">Credit Card Payment</span>
              </div>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm 
                  packageTitle={packageTitle}
                  price={price}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
              <Button 
                variant="ghost" 
                onClick={resetModal}
                className="w-full mt-3"
              >
                ← Choose Different Payment Method
              </Button>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">PayPal Payment</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
                <Button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                  onClick={() => {
                    // This would integrate with the existing PayPal component
                    toast({
                      title: "PayPal Integration",
                      description: "PayPal checkout will be implemented here",
                    });
                  }}
                >
                  Continue with PayPal
                </Button>
              </div>
              <Button 
                variant="ghost" 
                onClick={resetModal}
                className="w-full mt-3"
              >
                ← Choose Different Payment Method
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}