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
    <div className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Amazon Header */}
      <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-4 py-2">
        <div className="flex items-center gap-2 text-white">
          <ShoppingCart className="h-4 w-4" />
          <span className="font-bold text-sm">amazon</span>
          <span className="text-xs opacity-90">Affiliate Link</span>
        </div>
      </div>

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

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            onClick={() => window.open(url, '_blank')} 
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            View on Amazon
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open(url, '_blank')}
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Link
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p>As an Amazon Associate, I earn from qualifying purchases. Prices subject to change.</p>
        </div>
      </div>
    </div>
  );
}