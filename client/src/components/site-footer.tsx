import { Link } from "wouter";
import { Facebook, Youtube } from "lucide-react";

export function SiteFooter() {

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
            
            <div className="max-w-lg mx-auto bg-white rounded-lg p-6">
              <div 
                dangerouslySetInnerHTML={{
                  __html: '<div class="klaviyo-form-T2dWUC"></div>'
                }}
              ></div>
            </div>
            
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
                <div className="w-6 h-6 text-red-500 animate-pulse hover:animate-bounce">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    {/* Robot head outline */}
                    <rect x="6" y="4" width="12" height="12" rx="2" fill="currentColor"/>
                    {/* Robot eyes */}
                    <circle cx="9" cy="8" r="1.5" fill="white"/>
                    <circle cx="15" cy="8" r="1.5" fill="white"/>
                    {/* Robot eye pupils */}
                    <circle cx="9" cy="8" r="0.5" fill="black">
                      <animate attributeName="cx" values="9;9.5;9" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="15" cy="8" r="0.5" fill="black">
                      <animate attributeName="cx" values="15;14.5;15" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    {/* Robot mouth - silly grin */}
                    <path d="M8 12 Q12 14 16 12" stroke="white" strokeWidth="1" fill="none"/>
                    {/* Robot antennas with blinking */}
                    <circle cx="9" cy="2" r="1" fill="currentColor">
                      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="15" cy="2" r="1" fill="currentColor">
                      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" begin="1s"/>
                    </circle>
                    <line x1="9" y1="3" x2="9" y2="4" stroke="currentColor" strokeWidth="1"/>
                    <line x1="15" y1="3" x2="15" y2="4" stroke="currentColor" strokeWidth="1"/>
                    {/* Robot body */}
                    <rect x="8" y="16" width="8" height="6" rx="1" fill="currentColor"/>
                    {/* Robot arms */}
                    <rect x="4" y="17" width="3" height="2" rx="1" fill="currentColor"/>
                    <rect x="17" y="17" width="3" height="2" rx="1" fill="currentColor"/>
                  </svg>
                </div>
                <a 
                  href="https://webmbd.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-400 transition-colors text-xs"
                >Built with Replit AI Michael Baker Digital</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}