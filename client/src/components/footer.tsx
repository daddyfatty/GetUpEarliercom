import { useState } from "react";
import { Link } from "wouter";
import { Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import footerBgPattern from "@assets/678a4459aad73fea7208ff4c_footer-bg-pattern_1751313655156.png";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Integrate with Mailchimp or email service
      console.log("Newsletter signup:", email);
      setIsSubscribed(true);
      setEmail("");
      
      // Reset the success state after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer 
      className="bg-gray-900 text-white py-12 relative"
      style={{
        backgroundImage: `url(${footerBgPattern})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-900/80"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo and Tagline */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 font-brand">
              GET UP<br />EARLIER
            </h3>
            <p className="text-gray-300 text-lg">
              1-on-1 Training & Coaching
            </p>
          </div>

          {/* Site Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Site</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/">
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    About
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/recipes">
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Recipes
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/workouts">
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Blog
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Subscribe to our Newsletter</h4>
            <p className="text-gray-300 text-sm mb-4">
              Infrequent and informative emails. No junk or spam.
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleNewsletterSignup} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/80 text-white px-4"
                >
                  Subscribe Now
                </Button>
              </form>
            ) : (
              <div className="text-green-400 text-sm">
                Thanks for subscribing!
              </div>
            )}
          </div>
        </div>

        {/* Contact Info and Social Links */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h5 className="font-semibold text-white mb-2">Contact:</h5>
              <p className="text-gray-300 text-sm">michael@getupearlier.com</p>
              <p className="text-gray-300 text-sm">(860) 209-8002</p>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
