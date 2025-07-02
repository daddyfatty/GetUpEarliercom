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
        
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
          <p className="text-gray-600 mb-6">
            Orange, CT - Personal Training & Nutrition Coaching
          </p>
          

          
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md text-sm transition-colors"
            onClick={() => window.open(googleReviewsUrl, '_blank')}
          >
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base">G</span>
              <span>View on Google</span>
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}