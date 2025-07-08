import { Button } from "@/components/ui/button";

export function MichaelAboutBlock() {
  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="bg-slate-900 rounded-lg p-8 w-full max-w-sm text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6">
                <img 
                  src="/attached_assets/493414479_10213588193416986_7983427679426833080_n.jpg" 
                  alt="Michael Baker" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Michael Baker</h3>
              <div className="text-gray-300 space-y-1 text-sm mb-6">
                <p>Certified Personal Trainer</p>
                <p>Integrative Nutrition Health Coach</p>
                <p>Running Coach & Yoga Teacher</p>
                <p>25 Year Digital Professional</p>
                <p>Lifelong Fitness Practitioner</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                Let's Work Together →
              </Button>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Hello, I'm Michael Baker. I am a 50-year-old strength trainer, certified personal trainer, running coach, health coach, and yoga teacher. I'm also a former yoga studio owner and a dedicated health and wellness practitioner with over 30 years of experience. I began <a href="#" className="text-blue-600 underline">Get Up Earlier</a> (GetUpEarlier.com) because getting up earlier was step one in transforming my routine and overall well-being, especially after spending years sitting at a computer as a <a href="#" className="text-blue-600 underline">digital professional</a>.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-gray-700">
                My primary goal is to bridge the gap from inactivity and poor diet to strength and healthy habits. I focus on helping people rely on intuition, providing a personal experience, and introducing them to strength training, alternate cardio, and yoga-inspired stretching, along with fundamental nutrition knowledge and concepts.
              </p>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              While my own marathon training or strength achievements might seem extreme, I'm not trying to turn anyone into a bodybuilder or marathon runner. I'm simply showing that, especially beyond 40, 50, 60, and 70 years old, these things are possible. <a href="#" className="text-blue-600 underline">It's about inspiration and helping people make realistic, sustainable changes.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}