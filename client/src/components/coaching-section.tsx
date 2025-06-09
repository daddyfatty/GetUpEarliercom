import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";

import _678aad8cfd0dcde677a14418_hike2_p_500 from "@assets/678aad8cfd0dcde677a14418_hike2-p-500.jpg";

export function CoachingSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Content Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">
                  Personal Training, Nutrition & Accountability Coaching
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
                  Bridging the gap from inactivity and poor diet to strength and healthy habits
                </h2>
              </div>
              
              <div className="mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Hello, I'm Michael Baker. I am a 50-year-old strength trainer, certified personal trainer, running coach, health coach, and yoga teacher. I'm also a former yoga studio owner and a{" "}
                  <span className="text-blue-600 font-medium">digital professional</span>{" "}
                  with over 30 years of experience. I began{" "}
                  <span className="font-medium italic">Get Up Earlier</span>{" "}
                  because getting up earlier was step one in transforming my routine and overall well-being, especially after spending years sitting at a computer.
                </p>
              </div>

              <div className="mb-8">
                <Link href="/about">
                  <div className="flex items-center space-x-4 cursor-pointer group hover:bg-gray-50 p-3 rounded-lg transition-all duration-200">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-100 group-hover:border-blue-200 transition-colors">
                      <img 
                        src={headshotPath} 
                        alt="Michael Baker" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex-1 flex items-center">
                      <p className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                        Dedicated & authentic health and wellness practitioner
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <div>
                <Button 
                  className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium text-lg group transition-all duration-200"
                  onClick={() => window.open('https://calendly.com/michaelbakerdigital/30minute', '_blank')}
                >
                  Book A Free 30 Minute Session
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative lg:min-h-[600px]">
              <img 
                src={_678aad8cfd0dcde677a14418_hike2_p_500}
                alt="Michael Baker - Personal Trainer and Health Coach"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}