import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Loader } from "lucide-react";

interface RealAmazonPreviewProps {
  url: string;
  title: string;
}

interface LinkPreviewData {
  title: string;
  description: string;
  image: string;
  price?: string;
  rating?: number;
  reviews?: number;
  availability?: string;
  isPrime?: boolean;
  url: string;
}

export function RealAmazonPreview({ url, title }: RealAmazonPreviewProps) {
  const { data: preview, isLoading, error } = useQuery<LinkPreviewData>({
    queryKey: ['/api/link-preview', url],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}&t=${Date.now()}`);
        if (!response.ok) {
          console.warn(`Failed to fetch preview for ${url}: ${response.status}`);
          return null;
        }
        return response.json();
      } catch (error) {
        console.warn(`Network error fetching preview for ${url}:`, error);
        return null;
      }
    },
    staleTime: 0, // No caching - always fetch fresh data
    retry: 1,
    throwOnError: false
  });

  if (isLoading) {
    return (
      <div className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-4 flex items-center justify-center h-32">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader className="h-5 w-5 animate-spin" />
            <span>Loading product preview...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !preview || (preview && preview.title === 'Amazon Product')) {
    // Enhanced fallback with better product display
    return (
      <div 
        className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer group"
        onClick={() => window.open(url, '_blank')}
      >
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Generic Product Image */}
            <div className="w-full sm:w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            
            {/* Product Info */}
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                {title}
              </h3>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  Amazon Product
                </Badge>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm hidden sm:block">
                Click to view product details and pricing on Amazon
              </p>
            </div>
          </div>

          {/* Amazon Logo Indicator */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-orange-500">
              <ShoppingCart className="h-4 w-4" />
              <span className="font-bold text-sm">amazon</span>
            </div>
            <div className="text-xs text-gray-500">
              Click to view on Amazon
            </div>
          </div>


        </div>
      </div>
    );
  }

  return (
    <div 
      className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer group"
      onClick={() => window.open(url, '_blank')}
    >
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="w-full sm:w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 p-2">
            {preview.image ? (
              <img 
                src={`/api/proxy-image?url=${encodeURIComponent(preview.image)}`}
                alt={preview.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Failed to load product image:', preview.image);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-base sm:text-lg line-clamp-2 text-gray-900 dark:text-white">
              {preview.title}
            </h3>
            
            {/* Price and Status */}
            <div className="flex items-center gap-2 flex-wrap">
              {preview.price && (
                <span className="text-xl sm:text-2xl font-bold text-orange-600">
                  {preview.price}
                </span>
              )}
              {preview.isPrime && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Prime
                </Badge>
              )}
              {preview.availability && (
                <div className={`text-sm font-medium ${
                  preview.availability.toLowerCase().includes('stock') 
                    ? 'text-green-600' 
                    : 'text-orange-600'
                }`}>
                  {preview.availability}
                </div>
              )}
            </div>
            
            {/* Rating */}
            {preview.rating && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        i < Math.floor(preview.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {preview.rating} ({preview.reviews?.toLocaleString() || 0} reviews)
                  </span>
                </div>
              </div>
            )}

            {/* Description - Hidden on mobile to save space */}
            {preview.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 hidden sm:block">
                {preview.description}
              </p>
            )}
          </div>
        </div>

        {/* Amazon Logo Indicator */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-orange-500">
            <ShoppingCart className="h-4 w-4" />
            <span className="font-bold text-sm">amazon</span>
          </div>
          <div className="text-xs text-gray-500">
            Click to view on Amazon
          </div>
        </div>


      </div>
    </div>
  );
}