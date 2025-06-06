import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeNewsletter = useMutation({
    mutationFn: (email: string) => apiRequest("POST", "/api/newsletter", { email }),
    onSuccess: () => {
      setEmail("");
      toast({ 
        title: "Successfully subscribed!", 
        description: "You'll receive weekly health tips and updates." 
      });
    },
    onError: () => {
      toast({ 
        title: "Subscription failed", 
        description: "Please try again later.",
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ 
        title: "Email required", 
        description: "Please enter your email address.",
        variant: "destructive" 
      });
      return;
    }
    subscribeNewsletter.mutate(email);
  };

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="hero-gradient rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Get weekly nutrition tips, new recipes, and exclusive content delivered to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-4 focus:ring-white/20"
                required
              />
              <Button 
                type="submit" 
                disabled={subscribeNewsletter.isPending}
                className="bg-white text-primary hover:bg-gray-100 font-semibold"
              >
                {subscribeNewsletter.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
          
          <p className="text-sm text-emerald-200 mt-4">
            No spam, unsubscribe anytime. Join 50,000+ health enthusiasts!
          </p>
        </div>
      </div>
    </section>
  );
}
