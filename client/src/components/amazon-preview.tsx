import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ExternalLink } from "lucide-react";

interface AmazonPreviewProps {
  url: string;
  title: string;
  price?: string;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  inStock?: boolean;
  isPrime?: boolean;
  description?: string;
}

export function AmazonPreview({
  url,
  title,
  price = "$24.99",
  rating = 4.5,
  reviews = 1247,
  imageUrl,
  inStock = true,
  isPrime = true,
  description = "Recommended by certified trainers for optimal performance and hydration during training."
}: AmazonPreviewProps) {
  return (
    <div 
      className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer group"
      onClick={() => window.open(url, '_blank')}
    >
      <div className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={imageUrl || "/attached_assets/20250702_065601_1751710941826.jpg"} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white">
              {title}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  {rating} ({reviews.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Price and Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-orange-600">
                {price}
              </span>
              {isPrime && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Prime
                </Badge>
              )}
              {inStock && (
                <div className="text-sm text-green-600 font-medium">
                  In Stock
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Amazon Logo Indicator */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-orange-500">
            <ShoppingCart className="h-4 w-4" />
            <span className="font-bold text-sm">amazon</span>
            <span className="text-xs text-gray-500">Affiliate Link</span>
          </div>
          <div className="text-xs text-gray-500">
            Click to view on Amazon
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p>As an Amazon Associate, I earn from qualifying purchases. Prices subject to change.</p>
        </div>
      </div>
    </div>
  );
}