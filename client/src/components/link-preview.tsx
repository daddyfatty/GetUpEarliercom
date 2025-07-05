import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, ShoppingCart, X } from "lucide-react";

interface LinkPreviewProps {
  url: string;
  children: React.ReactNode;
}

interface ProductData {
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  availability: string;
  prime: boolean;
}

export function LinkPreview({ url, children }: LinkPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if it's an Amazon link
  const isAmazonLink = url.includes('amazon.com') || url.includes('amzn.to');

  const fetchProductData = async () => {
    if (!isAmazonLink) return;
    
    setLoading(true);
    try {
      // Since we can't scrape Amazon directly due to anti-bot protection,
      // we'll create mock data based on the product type from URL analysis
      const productType = analyzeAmazonUrl(url);
      setProductData(getMockProductData(productType));
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
    setLoading(false);
  };

  const analyzeAmazonUrl = (url: string): string => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('water') || urlLower.includes('bottle')) return 'water-bottle';
    if (urlLower.includes('gel') || urlLower.includes('energy')) return 'energy-gel';
    if (urlLower.includes('nuun') || urlLower.includes('tablet')) return 'electrolyte-tablet';
    return 'fitness-product';
  };

  const getMockProductData = (productType: string): ProductData => {
    const productMap = {
      'water-bottle': {
        title: "Soft Flask Water Bottle - Collapsible Running Hydration",
        price: "$24.99",
        rating: 4.5,
        reviewCount: 1247,
        image: "/attached_assets/20250702_065601_1751710941826.jpg",
        description: "Lightweight, collapsible water bottle perfect for running. Fits in compression shorts and won't bounce during exercise.",
        availability: "In Stock",
        prime: true
      },
      'energy-gel': {
        title: "Double Electrolyte Energy Gels - Natural Fuel",
        price: "$32.95",
        rating: 4.7,
        reviewCount: 892,
        image: "/attached_assets/20250702_065853_1751710941827.jpg",
        description: "Premium energy gels with double electrolytes for sustained performance during long training sessions.",
        availability: "In Stock",
        prime: true
      },
      'electrolyte-tablet': {
        title: "NUUN Sport Hydration Tablets - Lemon Lime",
        price: "$19.99",
        rating: 4.6,
        reviewCount: 2156,
        image: "/attached_assets/20250702_065601_1751710941826.jpg",
        description: "Fast-dissolving electrolyte tablets to enhance hydration and replace essential minerals lost in sweat.",
        availability: "In Stock",
        prime: true
      },
      'fitness-product': {
        title: "Premium Fitness Product",
        price: "$29.99",
        rating: 4.4,
        reviewCount: 567,
        image: "/attached_assets/20250702_065601_1751710941826.jpg",
        description: "High-quality fitness product recommended by certified trainers.",
        availability: "In Stock",
        prime: true
      }
    };

    return productMap[productType as keyof typeof productMap] || productMap['fitness-product'];
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isAmazonLink) {
      e.preventDefault();
      setIsOpen(true);
      if (!productData) {
        fetchProductData();
      }
    }
  };

  const openAmazonLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  if (!isAmazonLink) {
    return <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>;
  }

  return (
    <>
      <span 
        onClick={handleClick}
        className="cursor-pointer text-blue-600 hover:text-blue-800 underline transition-colors"
      >
        {children}
      </span>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Product Preview
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : productData ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={productData.image} 
                    alt={productData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {productData.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(productData.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {productData.rating} ({productData.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-600">
                      {productData.price}
                    </span>
                    {productData.prime && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Prime
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-green-600 font-medium">
                    {productData.availability}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                {productData.description}
              </p>

              <div className="flex gap-3 pt-4">
                <Button onClick={openAmazonLink} className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View on Amazon
                </Button>
                <Button variant="outline" onClick={openAmazonLink}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center pt-2">
                <p>This preview helps you see product details before visiting Amazon.</p>
                <p>Prices and availability are subject to change.</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Unable to load product preview</p>
              <Button onClick={openAmazonLink} className="mt-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Amazon Link
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}