import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Gym/Yoga Space Images
import gymSpace from "@assets/download - 2025-06-23T105919.083_1750690773931.png";
import yogaSpace from "@assets/download - 2025-06-23T105922.235_1750690773931.png";

export function PrivateBoutiqueSection() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <section id="studio" className="max-w-6xl mx-auto mb-16 pt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            In-Home Private Boutique
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Fitness Space Orange, CT
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={gymSpace} 
              alt="Private Strength Training Studio" 
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={yogaSpace} 
              alt="Dedicated Pristine Yoga Space" 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('private-studio')}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">01. Private Strength Training Studio</span>
              {expandedSection === 'private-studio' ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </button>
            {expandedSection === 'private-studio' && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">
                  Experience personalized training in a distraction-free private gym equipped with the 
                  essentials. Our studio includes a power rack, pulley systems, free weights, and a Rogue 
                  Echo bike, perfect for 1-on-1 sessions tailored to your fitness goals. Ideal for those seeking 
                  focused and effective strength training in a professional setting.
                </p>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('yoga-space')}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">02. Dedicated Pristine Yoga Space</span>
              {expandedSection === 'yoga-space' ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </button>
            {expandedSection === 'yoga-space' && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">
                  Step into our tranquil yoga space designed for ultimate comfort and focus. This dedicated 
                  room offers a peaceful environment for private yoga sessions, meditation, and stretching practices. 
                  Complete with props and equipment, it's the perfect sanctuary for mindful movement and relaxation 
                  away from everyday distractions.
                </p>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('instructors')}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">03. Certified, Seasoned Instructors</span>
              {expandedSection === 'instructors' ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </button>
            {expandedSection === 'instructors' && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">
                  Work with experienced professionals who bring decades of expertise to your fitness journey. 
                  Our certified trainers and yoga instructors combine technical knowledge with personalized 
                  attention, ensuring safe, effective, and enjoyable sessions tailored to your specific needs 
                  and fitness level.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}