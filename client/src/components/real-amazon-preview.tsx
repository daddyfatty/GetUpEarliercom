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
      const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch preview: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    retry: 2
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

  if (error || !preview || preview.title === 'Amazon Product') {
    // Enhanced fallback with better product display
    return (
      <div 
        className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer group"
        onClick={() => window.open(url, '_blank')}
      >
        <div className="p-4">
          <div className="flex gap-4">
            {/* Generic Product Image */}
            <div className="w-36 h-36 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            
            {/* Product Info */}
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Click to view product details and pricing on Amazon
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  Amazon Product
                </Badge>
              </div>
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
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-36 h-36 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 p-2">
            {preview.image ? (
              <img 
                src={preview.image}
                alt={preview.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/attached_assets/20250702_065601_1751710941826.jpg";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white">
              {preview.title}
            </h3>
            
            {/* Rating */}
            {preview.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(preview.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {preview.rating} ({preview.reviews?.toLocaleString() || 0} reviews)
                  </span>
                </div>
              </div>
            )}

            {/* Price and Status */}
            <div className="flex items-center gap-2 flex-wrap">
              {preview.price && (
                <span className="text-2xl font-bold text-orange-600">
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

            {/* Description */}
            {preview.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
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