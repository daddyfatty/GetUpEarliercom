import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();
  
  console.log("SiteFooter is rendering");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    
    // Simulate newsletter subscription
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "Welcome to the Get Up Earlier community. Check your email for confirmation.",
      });
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-800/80 to-blue-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-600/30">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Up Earlier Newsletter
            </h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Weekly clean eating tips, accountability coaching insights, and new recipe updates. 
              Join the community bridging the gap from poor habits to healthy living.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-600"
                required
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            
            <p className="text-purple-200 text-sm mt-4">
              No spam, unsubscribe anytime. Join 1,000+ people transforming their health!
            </p>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Brand Section */}
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Get Up Earlier</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Bridge the gap from inactivity to strength through clean eating recipes, 
                personal training, and accountability coaching that actually works.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <a 
                  href="https://www.facebook.com/GetUpEarlier" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.instagram.com/getupearlier" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/GetUpEarlier" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@GetUpEarlier" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* App Features */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">App Features</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/recipes">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Recipe Library
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/workouts">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Workout Plans
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/calorie-calculator">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Nutrition Tracker
                    </span>
                  </Link>
                </li>
                <li>
                  <span className="text-gray-300">Recipe Book</span>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-300">Help Center</span>
                </li>
                <li>
                  <Link href="/contact">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Contact Us
                    </span>
                  </Link>
                </li>
                <li>
                  <span className="text-gray-300">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-gray-300">Terms of Service</span>
                </li>
                <li>
                  <span className="text-gray-300">Community Guidelines</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Get Up Earlier. All rights reserved. Built with passion for your health journey.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}