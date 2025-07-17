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
            <div className="lg:col-span-2 bg-[hsl(var(--navy))] dark:from-blue-900 dark:to-gray-900 px-8 pb-8 lg:px-12 lg:pb-12 pt-[35px] text-white flex flex-col justify-start items-center text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-8 border-white/20 shadow-2xl">
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
                <p className="text-blue-100 text-3xl font-medium">Certified Personal Trainer</p>
                <p className="text-blue-100 text-3xl font-medium">Integrative Nutrition Health Coach</p>
                <p className="text-blue-100 text-3xl font-medium">Running Coach & Yoga Teacher</p>
                <p className="text-blue-100 text-3xl font-medium">25 Year Digital Professional</p>
                <p className="text-blue-100 text-3xl font-medium">Lifelong Fitness Practitioner</p>
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
                  
                  <blockquote className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-8 my-8 border-0 shadow-sm">
                    <div className="absolute top-4 left-4 text-blue-600 opacity-20">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic pl-4">
                      My primary goal is to bridge the gap from inactivity and poor diet to strength and healthy habits. I focus 
                      on helping people rely on intuition, providing a personal experience, and introducing them to strength training, 
                      alternate cardio, and yoga-inspired stretching, along with fundamental nutrition knowledge and concepts.
                    </div>
                  </blockquote>
                  
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