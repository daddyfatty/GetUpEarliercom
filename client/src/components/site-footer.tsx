import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Mail, Phone, MapPin, Instagram, Youtube, Facebook } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Get Up Earlier
              </h3>
              <p className="text-gray-300 mt-2">
                Bridging the gap from inactivity and poor diet to strength and healthy habits.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Heart className="h-4 w-4 text-red-400" />
              <span>Built with dedication by Michael Baker</span>
            </div>
            
            <div className="text-sm text-gray-400">
              Certified Personal Trainer • Health Coach • 30 Years Experience
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
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
                <Link href="/coaching">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Coaching
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
                <Link href="/about">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    About
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Calculators & Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/calorie-calculator">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Calorie Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/alcohol-calculator">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Alcohol Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Profile Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/recipes/archive">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Recipe Archive
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4" />
                <a href="mailto:michael@getupearlier.com" className="hover:text-white transition-colors">
                  michael@getupearlier.com
                </a>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="https://www.youtube.com/@GetUpEarlier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Youtube className="h-5 w-5" />
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
                href="https://www.facebook.com/GetUpEarlier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
              >
                Book Free Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Get Up Earlier. All rights reserved.
            </div>
            
            <div className="flex gap-6 text-sm">
              <Link href="/privacy">
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
              <Link href="/terms">
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </Link>
              <Link href="/contact">
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Contact
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}