import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlaceDetails {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
}

interface GoogleReviewsCarouselProps {
  placeId: string;
  className?: string;
}

export default function GoogleReviewsCarousel({ placeId, className = "" }: GoogleReviewsCarouselProps) {
  const [placeDetails, setPlaceDetails] = useState<GooglePlaceDetails | null>(null);
  const [currentReview, setCurrentReview] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetchGoogleReviews();
  }, [placeId]);

  // Additional testimonials to supplement Google reviews
  const additionalTestimonials: GoogleReview[] = [
    {
      author_name: "Casey Bjorkdahl",
      text: "I've been training with Mike for close to a year now and have seen great results. My strength has increased exponentially, and I feel better overall with my body and mentally. He not only helps you become stronger, but he also coaches you on diet when you ask. If anyone is stuck in a rut or doing the same old routine without getting the results you were hoping for. Then I would recommend working with Mike. Thats what I did, and it paid off.",
      rating: 5,
      profile_photo_url: "/attached_assets/download - 2025-08-08T112056.096_1754666478414.png",
      relative_time_description: "a few hours ago",
      language: "en",
      time: Date.now() - 2 * 60 * 60 * 1000 // 2 hours ago
    },
    {
      author_name: "James McNiff",
      text: "Let me just say Mike definitely knows what he doing. I'm 48 years old and when I first started I couldn't do one push up or a pull up because of an old shoulder injury. This past week I was able to do 30 pull ups and 130 pushups in 25 minutes after a couple months training. If you are looking to get back into shape and need help I would 10000% work with Mike. Can't wait for my next session!",
      rating: 5,
      profile_photo_url: "/attached_assets/download - 2025-08-08T053258.626_1754645586619.png",
      relative_time_description: "a day ago",
      language: "en",
      time: Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 day ago
    },
    {
      author_name: "Marisol Cummings",
      text: "Peep the upper body strength on my sunrise snorkel on this first day of being 54! Managed to pull my ass in and out of this boat with no problems! Thanks Coach ❣️That's Saudi Arabia Mountains behind me 🙏🏾 I'm in the Gulf of Aqaba.",
      rating: 5,
      profile_photo_url: "/attached_assets/download---2025-07-29T171024_1753823450486.jpg",
      relative_time_description: "a week ago",
      language: "en",
      time: Date.now() - 7 * 24 * 60 * 60 * 1000 // 1 week ago
    },
    {
      author_name: "David Salinas",
      text: "Needed a kick start back to life and got that from Michael. He's knowledgeable, adapts to your preferences and optimized. Highly recommended. 10/10",
      rating: 5,
      profile_photo_url: "/attached_assets/678ae0317069e15526c3487a_download (23)_1751313478409_1752942860704.png",
      relative_time_description: "a year ago",
      language: "en",
      time: Date.now() - 365 * 24 * 60 * 60 * 1000 // 1 year ago
    },
    {
      author_name: "Mike Richetelli", 
      text: "Mike is very dedicated to health and wellness, including having a strong knowledge base about nutrition. I have trained with him for several months and have attained my fitness goals. He's taught me many alternative ways to workout, deviating from traditional exercises.",
      rating: 5,
      profile_photo_url: "/attached_assets/download - 2025-07-19T123326.220_1752942872285.png",
      relative_time_description: "a year ago",
      language: "en",
      time: Date.now() - 365 * 24 * 60 * 60 * 1000 // 1 year ago
    },
    {
      author_name: "Erica Baker",
      text: "Mike has inspired me to do so many things over the years including yoga, weight lifting, running and overall guidance on food. I am pretty sure I was his first client and he really knows how to motivate and get great results!",
      rating: 5,
      profile_photo_url: "/attached_assets/download - 2025-07-19T123321.490_1752942881598.png", 
      relative_time_description: "a year ago",
      language: "en",
      time: Date.now() - 365 * 24 * 60 * 60 * 1000 // 1 year ago
    }
  ];

  const fetchGoogleReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/google-reviews/${placeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      
      // Combine additional testimonials first, then Google reviews
      const combinedReviews = [...additionalTestimonials, ...data.reviews];
      
      const enhancedData = {
        ...data,
        reviews: combinedReviews,
        user_ratings_total: combinedReviews.length
      };
      
      setPlaceDetails(enhancedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const nextReview = () => {
    if (placeDetails?.reviews && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentReview((prev) => (prev + 3) % placeDetails.reviews.length);
        setTimeout(() => setIsTransitioning(false), 150);
      }, 150);
    }
  };

  const prevReview = () => {
    if (placeDetails?.reviews && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentReview((prev) => (prev - 3 + placeDetails.reviews.length) % placeDetails.reviews.length);
        setTimeout(() => setIsTransitioning(false), 150);
      }, 150);
    }
  };

  const renderStars = (rating: number, size = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={`${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 bg-white/20 rounded"></div>
            <div className="h-6 bg-white/20 rounded flex-1"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
            <div className="h-20 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p>Unable to load reviews at this time</p>
          <p className="text-sm text-white/70 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!placeDetails || !placeDetails.reviews || placeDetails.reviews.length === 0) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-white/70">
          <p>No reviews available</p>
        </div>
      </div>
    );
  }

  const currentReviewData = placeDetails.reviews[currentReview];

  return (
    <div className={`p-6 ${className}`}>
      {/* Google Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-semibold text-white">Google</span>
          </div>
          <span className="text-green-400 font-medium">Excellent</span>
          <div className="flex items-center gap-1">
            {renderStars(Math.floor(placeDetails.rating), 16)}
            <span className="font-semibold ml-1 text-white">{placeDetails.rating}</span>
            <span className="text-white/70">| {placeDetails.user_ratings_total} reviews</span>
          </div>
        </div>

      </div>

      {/* Reviews Carousel */}
      <div className="relative">
        <div className={`flex gap-4 overflow-hidden mx-12 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {placeDetails.reviews.slice(currentReview, currentReview + 3).map((review, index) => (
            <div key={`${currentReview}-${index}`} className="flex-1 min-w-0 rounded-lg p-4">
              {/* Review Header */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={review.profile_photo_url || '/default-avatar.png'}
                  alt={review.author_name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.png';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white truncate">{review.author_name}</h4>
                    <div className="flex-shrink-0">
                      {review.author_name === "Marisol Cummings" ? (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600">
                          <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-white/70 mb-2">{review.relative_time_description}</div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating, 14)}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-white/90 text-sm leading-relaxed">
                {review.text}
              </p>


            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {placeDetails.reviews.length > 3 && (
          <>
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white/20 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Previous reviews"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white/20 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Next reviews"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {placeDetails.reviews.length > 3 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(placeDetails.reviews.length / 3) }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentReview(i * 3);
                    setTimeout(() => setIsTransitioning(false), 150);
                  }, 150);
                }
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentReview / 3) === i ? 'bg-blue-400' : 'bg-white/30'
              }`}
              aria-label={`Go to review set ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}