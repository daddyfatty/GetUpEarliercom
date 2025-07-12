import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

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
                  href="https://www.youtube.com/@getupearlier" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors"
                  title="YouTube Channel"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.facebook.com/groups/getupearlier" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
                  title="Join Facebook Group"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Site Navigation */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Site</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Home
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/services">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      1-on-1 Services
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      About
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Blog
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/recipes">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Recipes
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/workouts">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Workouts
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/calorie-calculator">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Calculators
                    </span>
                  </Link>
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
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Get Up Earlier. All rights reserved. Built with passion for your health journey.
              </p>
              
              {/* WebMBD.com Credit */}
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 text-blue-400">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.8 3.4 14.6 3.3 14.4 3.3C14.1 3.3 13.9 3.4 13.7 3.6L12 5.3L10.3 3.6C10.1 3.4 9.9 3.3 9.6 3.3C9.4 3.3 9.2 3.4 9 3.5L3 7V9H21ZM12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM17 10C17 11.1 16.1 12 15 12C13.9 12 13 11.1 13 10C13 8.9 13.9 8 15 8C16.1 8 17 8.9 17 10ZM7 10C7 11.1 6.1 12 5 12C3.9 12 3 11.1 3 10C3 8.9 3.9 8 5 8C6.1 8 7 8.9 7 10ZM18 14H6C5.45 14 5 14.45 5 15V17H19V15C19 14.45 18.55 14 18 14ZM12 15.5C12.83 15.5 13.5 16.17 13.5 17H10.5C10.5 16.17 11.17 15.5 12 15.5ZM4 18V20C4 20.55 4.45 21 5 21H19C19.55 21 20 20.55 20 20V18H4Z"/>
                  </svg>
                </div>
                <a 
                  href="https://webmbd.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-400 transition-colors text-xs"
                >
                  Built with Agentic AI WebMBD.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}