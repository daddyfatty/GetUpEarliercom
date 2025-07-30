import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { SEO } from "@/components/seo";
import { useState, useEffect } from "react";

interface AmazonProduct {
  url: string;
  title: string;
  description: string;
  image: string;
  price: string;
  rating: number;
  reviews: number;
  availability: string;
  isPrime: boolean;
}

export default function AmazonProductsPage() {
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract Amazon links from all blog content
  useEffect(() => {
    const fetchAmazonProducts = async () => {
      try {
        // Get all blog posts
        const response = await fetch('/api/blog');
        const posts = await response.json();
        
        // Extract Amazon links from content
        const amazonUrls = new Set<string>();
        
        posts.forEach((post: any) => {
          // Look for Amazon links in content using regex
          const amazonLinkRegex = /<span[^>]*class="amazon-link"[^>]*data-url="([^"]*)"[^>]*>/g;
          const directAmazonRegex = /https?:\/\/(amzn\.to|amazon\.com)[^\s<>"]*/g;
          
          let match;
          while ((match = amazonLinkRegex.exec(post.content)) !== null) {
            amazonUrls.add(match[1]);
          }
          
          while ((match = directAmazonRegex.exec(post.content)) !== null) {
            amazonUrls.add(match[0]);
          }
        });

        // Fetch product data for each URL
        const productPromises = Array.from(amazonUrls).map(async (url) => {
          try {
            const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            return data;
          } catch (error) {
            console.error('Error fetching product data for', url, error);
            return null;
          }
        });

        const productData = await Promise.all(productPromises);
        const validProducts = productData.filter(product => product && product.title);
        
        setProducts(validProducts);
      } catch (error) {
        console.error('Error fetching Amazon products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmazonProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Loading Amazon products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
      <SEO 
        title="Amazon Product Recommendations - Get Up Earlier"
        description="Discover Michael Baker's curated Amazon product recommendations for fitness, nutrition, and wellness. Quality gear tested and approved by a certified trainer."
        keywords="Amazon products, fitness gear, nutrition supplements, workout equipment, running gear, yoga props, training accessories"
        url="/amazon"
        image="/og-image.jpg"
        type="website"
        canonical="https://www.getupearlier.com/amazon"
      />
      {/* Hero Section */}
      <HeroGradient className="text-white">
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/attached_assets/download - 2025-07-30T075447.321_1753876500380.png" 
                alt="Amazon Our Picks"
                className="h-32 md:h-40 lg:h-48 w-auto object-contain"
              />
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">Vetted fitness and wellness products from Amazon. Tested and highly recommended!</p>
          </div>
        </div>
      </HeroGradient>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No Amazon products found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {products.map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-2xl font-bold text-orange-600">
                            {product.price}
                          </span>
                          {product.isPrime && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Prime
                            </Badge>
                          )}
                          <span className="text-sm text-green-600">
                            {product.availability}
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) 
                                    ? 'text-yellow-400' 
                                    : i < product.rating 
                                      ? 'text-yellow-400' 
                                      : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating.toFixed(1)} ({product.reviews.toLocaleString()} reviews)
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {product.description}
                        </p>

                        {/* Amazon Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-orange-500 text-sm">
                            <svg viewBox="0 0 48 48" className="w-4 h-4 mr-1" fill="currentColor">
                              <path d="M35.93 34.82c-5.46 4.05-13.38 6.18-20.2 6.18-9.55 0-18.15-3.53-24.65-9.4-.51-.46-.05-1.09.56-.73 7.03 4.09 15.73 6.56 24.71 6.56 6.06 0 12.72-1.26 18.85-3.87.92-.39 1.7.61.73 1.26z"/>
                              <path d="M37.74 32.57c-.7-.9-4.64-.42-6.41-.21-.54.06-.62-.4-.14-.74 3.14-2.21 8.29-1.57 8.89-.83.6.74-.16 5.89-3.09 8.35-.45.38-.88.18-.68-.32.66-1.66 2.13-5.38 1.43-6.25z"/>
                            </svg>
                            amazon
                          </div>
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Click to view on Amazon
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}