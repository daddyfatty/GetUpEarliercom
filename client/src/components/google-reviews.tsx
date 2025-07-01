import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoogleReviews() {
  const rating = 4.8;
  const reviewCount = 46;
  const googleReviewsUrl = "https://g.co/kgs/T7W69wT";

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          See What Our Customers Are Saying
        </h2>
        
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Get Up Earlier - Personal Training
          </h3>
          <p className="text-gray-600 mb-6">
            Orange, CT - Personal Training & Nutrition Coaching
          </p>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-4xl font-bold text-gray-900">{rating}</span>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-6 h-6 ${
                    i < Math.floor(rating) 
                      ? 'text-yellow-400 fill-current' 
                      : i < rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-gray-600 text-lg">{reviewCount} reviews</span>
          </div>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            onClick={() => window.open(googleReviewsUrl, '_blank')}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">G</span>
              <span>View on Google</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}