import { Helmet } from "react-helmet-async";
import GoogleReviewsCarousel from "@/components/google-reviews-carousel";

// Your actual Google My Business Place ID for Get Up Earlier
const PLACE_ID = "ChIJLQqz6P516IkRwqYD22g-_m8";

export default function ReviewsPage() {
  return (
    <>
      <Helmet>
        <title>Customer Reviews - Get Up Earlier</title>
        <meta name="description" content="See what our clients say about Get Up Earlier's personal training, nutrition coaching, and fitness programs. Real Google reviews from satisfied customers." />
        <meta property="og:title" content="Customer Reviews - Get Up Earlier" />
        <meta property="og:description" content="See what our clients say about Get Up Earlier's personal training, nutrition coaching, and fitness programs. Real Google reviews from satisfied customers." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                What Our Clients Say
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real reviews from real people who have transformed their health and fitness with Get Up Earlier
              </p>
            </div>

            {/* Google Reviews Carousel */}
            <div className="mb-12">
              <GoogleReviewsCarousel placeId={PLACE_ID} />
            </div>

            {/* Call to Action */}
            <div className="text-center bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Health?
              </h2>
              <p className="text-gray-600 mb-6">
                Join hundreds of satisfied clients who have achieved their fitness goals with personalized coaching
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/services"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  View Services
                </a>
                <a
                  href="/#contact"
                  className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}