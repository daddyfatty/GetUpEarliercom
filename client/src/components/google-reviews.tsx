import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoogleReviews() {
  const rating = 5.0;
  const reviewCount = 12;
  const googleReviewsUrl = "https://g.co/kgs/T7W69wT";

  return (
    <section className="py-16 bg-[hsl(var(--navy))]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Don't just take our word for it
        </h2>
        <p className="text-xl text-white/80 mb-8">
          Hear from some of my amazing clients
        </p>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Get Up Earlier - Personal Training
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Orange, CT - Personal Training & Nutrition Coaching
          </p>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-gray-900">5.0</span>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-600 text-sm">12 reviews</span>
          </div>
          
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-1.5 rounded text-sm transition-colors"
            onClick={() => window.open(googleReviewsUrl, '_blank')}
          >
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm">G</span>
              <span>View on Google</span>
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}