import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { PermanentClassSchedule } from "@/components/permanent-class-schedule";
import ericaPath from "@assets/678ab3d4caec71062e65470f_erddd_1749497849578.jpg";

export function EricaAboutBlock() {
  return (
    <section className="max-w-7xl mx-auto mb-16">
      <Card className="bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left Side - Photo and Basic Info */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#E1ECE7] to-[#C4D6CC] dark:from-green-900 dark:to-gray-900 px-8 lg:px-12 pt-[35px] text-gray-800 dark:text-white flex flex-col justify-start items-center text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-8 border-white/20 shadow-2xl">
                <img 
                  src={ericaPath} 
                  alt="Erica Baker" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                Erica Baker
              </h2>
              
              <div className="space-y-2 mb-6">
                <p className="text-gray-700 dark:text-gray-100 text-3xl font-medium">E-RYT 200 Yoga Instructor</p>
                <p className="text-gray-700 dark:text-gray-100 text-3xl font-medium">2000+ Hours Teaching Experience</p>
                <p className="text-gray-700 dark:text-gray-100 text-3xl font-medium">Former Boutique Studio Owner</p>
                <p className="text-gray-700 dark:text-gray-100 text-3xl font-medium">Wellness Enthusiast</p>
                <p className="text-gray-700 dark:text-gray-100 text-3xl font-medium">YouTube Content Creator</p>
              </div>
              

              
              <Link href="/contact">
                <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-gray-800 dark:text-white border-white/30 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                  Let's Work Together →
                </Button>
              </Link>
            </div>

            {/* Right Side - Story */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                <p className="text-lg leading-relaxed mb-4">
                  Erica is an E-RYT 200 Yoga Instructor with over 2000 hours teaching experience in both large and small group settings. For the last decade, she has taught yoga from a place of authenticity and developed her own unique style and an ability to work well with all levels.
                </p>
                
                <p className="text-lg leading-relaxed mb-4">
                  As a former boutique yoga studio owner and wellness enthusiast, she brings her health and fitness knowledge and passion to others with her fun energy and physical classes. Every single one of her classes is unique, but you can always count on a consistent experience working on overall strength, mobility, flexibility, balance and stress relief.
                </p>
                
                <blockquote className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-8 my-8 border-0 shadow-sm">
                  <div className="absolute top-4 left-4 text-green-600 opacity-20">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic pl-4">
                    Erica believes Yoga is just one facet of nourishing your body to create optimal health and prevent disease. She truly enjoys helping others improve their overall health as well as making them laugh a little too.
                  </div>
                </blockquote>
                
                <p className="text-lg leading-relaxed mb-4">
                  You can find her teaching small group classes in her home studio, private lessons and recorded classes of varying lengths on her YouTube channel.
                </p>
                
                {/* Permanent Class Schedule */}
                <div className="mt-6">
                  <PermanentClassSchedule />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}