import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoogleReviews() {
  const rating = 5.0;
  const reviewCount = 12;
  const googleReviewsUrl = "https://g.co/kgs/T7W69wT";

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Don't just take our word for it
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Hear from some of my amazing clients
        </p>
        
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Get Up Earlier - Personal Training
          </h3>
          <p className="text-gray-600 mb-6">
            Orange, CT - Personal Training & Nutrition Coaching
          </p>
          

          
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