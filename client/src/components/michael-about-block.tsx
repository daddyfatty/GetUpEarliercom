import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";

export function MichaelAboutBlock() {
  return (
    <section className="max-w-7xl mx-auto mb-16">
      <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left Side - Photo and Basic Info */}
            <div className="lg:col-span-2 bg-[hsl(var(--navy))] dark:from-blue-900 dark:to-gray-900 p-8 lg:p-12 text-white flex flex-col justify-start items-center text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-8 border-8 border-white/20 shadow-2xl">
                <img 
                  src={headshotPath} 
                  alt="Michael Baker" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-4xl font-bold mb-4 text-white">
                Michael Baker
              </h2>
              
              <div className="space-y-2 mb-6">
                <p className="text-blue-100 text-lg font-medium">Certified Personal Trainer</p>
                <p className="text-blue-100 text-lg font-medium">Integrative Nutrition Health Coach</p>
                <p className="text-blue-100 text-lg font-medium">Running Coach & Yoga Teacher</p>
                <p className="text-blue-100 text-lg font-medium">25 Year Digital Professional</p>
                <p className="text-blue-100 text-lg font-medium">Lifelong Fitness Practitioner</p>
              </div>
              
              <Link href="/contact">
                <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                  Let's Work Together →
                </Button>
              </Link>
            </div>

            {/* Right Side - Story */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                <p className="text-lg leading-relaxed mb-4">
                    Hello, I'm Michael Baker. I am a 50-year-old strength trainer, certified personal trainer, running coach, 
                    health coach, and yoga teacher. I'm also a former yoga studio owner and a dedicated health and wellness 
                    practitioner with over 30 years of experience. I began <span className="font-semibold text-blue-600">Get Up Earlier</span> (GetUpEarlier.com) because getting 
                    up earlier was step one in transforming my routine and overall well-being, especially after spending years 
                    sitting at a computer as a <a href="https://WebMBD.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">digital professional</a>.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-blue-600 mb-4">
                    <p className="text-lg leading-relaxed mb-0">
                      My primary goal is to bridge the gap from inactivity and poor diet to strength and healthy habits. I focus 
                      on helping people rely on intuition, providing a personal experience, and introducing them to strength training, 
                      alternate cardio, and yoga-inspired stretching, along with fundamental nutrition knowledge and concepts.
                    </p>
                  </div>
                  
                <p className="text-lg leading-relaxed">
                  While my own marathon training or strength achievements might seem extreme, I'm not trying to turn anyone into a 
                  bodybuilder or marathon runner. I'm simply showing that, especially beyond 40, 50, 60, and 70 years old, 
                  these things are possible. <span className="font-semibold text-blue-600">It's about inspiration and helping people make realistic, sustainable changes.</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}