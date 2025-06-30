import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Leaf, Clock, TrendingUp, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import _493414479_10213588193416986_7983427679426833080_n from "@assets/493414479_10213588193416986_7983427679426833080_n.jpg";

export function BookPromotion() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handlePurchase = (type: string) => {
    setSelectedType(type);
    setIsDialogOpen(true);
    setIsSubmitted(false);
    setEmail("");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // Here you would normally send to your backend/email service
      // For now, we'll just show success
      setIsSubmitted(true);
      toast({
        title: "Thank you!",
        description: "We'll notify you when the book becomes available.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hero-gradient rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-brand">
                Get Up Earlier
                <span className="block text-blue-200">The Clean & Lean Eating Guide</span>
              </h2>
              <p className="text-xl mb-8 text-blue-100">The last diet advice you'll ever need! Recipes and tips to focus on protein, eat real food and hit your target macros, fuel your best life with practical, balanced nutrition. </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-blue-200">Clean Recipes</div>
                  <div className="text-xs text-orange-300 font-medium mt-1">BETA COMING SOON</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">12</div>
                  <div className="text-blue-200">Categories</div>
                  <div className="text-xs text-orange-300 font-medium mt-1">BETA COMING SOON</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">Lifetime</div>
                  <div className="text-blue-200">Updates</div>
                  <div className="text-xs text-orange-300 font-medium mt-1">BETA COMING SOON</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">Beta</div>
                  <div className="text-blue-200">Launch Soon</div>
                  <div className="text-xs text-orange-300 font-medium mt-1">BETA COMING SOON</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 font-semibold"
                  onClick={() => handlePurchase('digital')}
                >
                  Digital Download - $29
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold bg-transparent"
                  onClick={() => handlePurchase('hardcopy')}
                >
                  Hardcopy - $39
                </Button>
              </div>

              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="w-5 h-5 text-orange-300" />
                  <span className="text-white font-semibold">Get notified when we launch!</span>
                </div>
                <p className="text-blue-100 text-sm">
                  Be the first to know when our Clean & Lean Eating Guide becomes available. 
                  Join our beta launch notification list.
                </p>
              </div>
            </div>

            <div className="relative">
              <img 
                src={_493414479_10213588193416986_7983427679426833080_n} 
                alt="Get Up Earlier Recipe Book" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              
              {/* Beta Launch Notification */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-xs">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Beta Launch</p>
                    <div className="text-xs text-orange-500 font-medium">COMING SOON</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  "Join our notification list to be the first to get access when we launch!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Book Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Clean Ingredients
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every recipe uses whole, unprocessed ingredients that nourish your body and taste amazing.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#0d5effc9]">
              <Clock className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Quick & Easy
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Most recipes take 30 minutes or less, perfect for busy lifestyles and meal prep.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Detailed Nutrition
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Complete nutritional breakdown for every recipe to help you meet your health goals.
            </p>
          </div>
        </div>
      </div>
      {/* Coming Soon Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-primary" />
              <span>
                {selectedType === 'digital' ? 'Digital Download' : 'Hard Copy'} - Coming Soon
              </span>
            </DialogTitle>
            <DialogDescription>
              We're putting the finishing touches on the "Get Up Earlier: Eat Clean & Lean" recipe book. 
              Enter your email to be notified when it becomes available.
            </DialogDescription>
          </DialogHeader>
          
          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs">💡</span>
                </div>
                <span>
                  {selectedType === 'digital' 
                    ? 'Digital version will be $29 when released' 
                    : 'Hard copy will be $39 when released'
                  }
                </span>
              </div>
              <Button type="submit" className="w-full">
                Notify Me When Available
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                You're on the list!
              </h3>
              <p className="text-gray-600 mb-4">
                We'll send you an email as soon as the book is ready for purchase.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
