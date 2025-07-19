interface GooglePlaceDetailsResponse {
  result: {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: Array<{
      author_name: string;
      author_url?: string;
      language: string;
      profile_photo_url: string;
      rating: number;
      relative_time_description: string;
      text: string;
      time: number;
    }>;
  };
  status: string;
}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.warn('GOOGLE_API_KEY not found in environment variables');
}

export async function getGooglePlaceDetails(placeId: string) {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API key not configured');
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.append('place_id', placeId);
  url.searchParams.append('fields', 'name,rating,user_ratings_total,reviews');
  url.searchParams.append('key', GOOGLE_API_KEY);

  console.log('Fetching Google Place details for place ID:', placeId);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
    }

    const data: GooglePlaceDetailsResponse = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API returned status: ${data.status}`);
    }

    console.log(`Successfully fetched ${data.result.reviews?.length || 0} reviews for ${data.result.name}`);

    return {
      name: data.result.name,
      rating: data.result.rating,
      user_ratings_total: data.result.user_ratings_total,
      reviews: data.result.reviews || []
    };
  } catch (error) {
    console.error('Error fetching Google Place details:', error);
    throw error;
  }
}

// Cache reviews for 1 hour to avoid API rate limits
const reviewsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getCachedGooglePlaceDetails(placeId: string) {
  const cacheKey = placeId;
  const cached = reviewsCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Returning cached Google reviews for place ID:', placeId);
    return cached.data;
  }

  const data = await getGooglePlaceDetails(placeId);
  reviewsCache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}