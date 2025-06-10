import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4 font-brand">Get Up Earlier</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Bridge the gap from inactivity to strength through clean eating recipes, personal training, 
              and accountability coaching that actually works.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">App Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/recipes">
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Recipe Library
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/workouts">
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Workout Plans
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/tracker">
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Nutrition Tracker
                  </span>
                </Link>
              </li>

              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Recipe Book
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Get Up Earlier. All rights reserved. Built with passion for your health journey.</p>
        </div>
      </div>
    </footer>
  );
}
