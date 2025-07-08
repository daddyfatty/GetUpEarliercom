import { Button } from "@/components/ui/button";

export function MichaelAboutBlock() {
  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              I believe in "lifting heavy things" with high intensity at least twice per week. I focus on traditional compound exercises, drop sets, bodyweight strength training, and physical outdoor work like running, hiking, and basic calisthenics, along with increasing flexibility through customized yoga-style stretches. All supported and built on truly understanding and implementing "clean eating."
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              I'm here to help you break free from inactivity, your gym rut, or advance your fitness. You need a push in the right direction and accountability.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              One or two 30-minute sessions per week will change your life. You will be amazed by how much we can accomplish in this short time, how quickly your strength improves, and how much you gain as you navigate life. Learn to reframe your time and thoughts about working out, and see how it can all be naturally and intuitively integrated into your life.
            </p>
          </div>
          <div className="md:col-span-1 flex flex-col items-center">
            <img 
              src="/attached_assets/download - 2025-06-20T164725.183_1750453386689.png" 
              alt="Michael Baker training setup" 
              className="w-full max-w-sm rounded-lg shadow-lg mb-4"
            />
            <img 
              src="/assets/personal-trainer-cert-logo.png" 
              alt="Personal Trainer Certification" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}