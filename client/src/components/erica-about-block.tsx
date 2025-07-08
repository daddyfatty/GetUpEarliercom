import { Button } from "@/components/ui/button";

export function EricaAboutBlock() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-lg">
              <img 
                src="/attached_assets/download - 2025-06-20T170516.226_1750453530152.png" 
                alt="Erica Baker" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Erica Baker</h3>
            <div className="text-center text-gray-600 space-y-1 mb-4">
              <p>E-RYT 200 Yoga Instructor</p>
              <p>2000+ Hours Teaching Experience</p>
              <p>Former Boutique Studio Owner</p>
              <p>Wellness Enthusiast</p>
              <p>YouTube Content Creator</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Let's Work Together →
            </Button>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Erica is an E-RYT 200 Yoga Instructor with over 2000 hours teaching experience in both large and small group settings. For the last decade, she has taught yoga from a place of authenticity and developed her own unique style and an ability to work well with all levels.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              As a former boutique yoga studio owner and wellness enthusiast, she brings her health and fitness knowledge and passion to others with her fun energy and physical classes. Every single one of her classes is unique, but you can always count on a consistent experience working on overall strength, mobility, flexibility, balance and stress relief.
            </p>
            <div className="bg-white bg-opacity-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-gray-700 italic">
                Erica believes Yoga is just one facet of nourishing your body to create optimal health and prevent disease. She truly enjoys helping others improve their overall health as well as making them laugh a little too.
              </p>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              You can find her teaching small group classes in her home studio, private lessons and recorded classes of varying lengths on her YouTube channel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}