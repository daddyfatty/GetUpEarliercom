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

  // Extract Amazon links from all blog content and training log
  useEffect(() => {
    const fetchAmazonProducts = async () => {
      try {
        // Get all blog posts
        const blogResponse = await fetch('/api/blog');
        const posts = await blogResponse.json();
        
        // Get training log entries
        const trainingLogResponse = await fetch('/api/training-log/slug/hartford-marathon-training-log-2025');
        const trainingLogData = await trainingLogResponse.json();
        
        // Extract Amazon links from content
        const amazonUrls = new Set<string>();
        
        // Process blog posts
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

        // Process training log entries
        if (trainingLogData && trainingLogData.content && trainingLogData.content.entries) {
          trainingLogData.content.entries.forEach((entry: any) => {
            const amazonLinkRegex = /<span[^>]*class="amazon-link"[^>]*data-url="([^"]*)"[^>]*>/g;
            const directAmazonRegex = /https?:\/\/(amzn\.to|amazon\.com)[^\s<>"]*/g;
            
            let match;
            while ((match = amazonLinkRegex.exec(entry.content)) !== null) {
              amazonUrls.add(match[1]);
            }
            
            while ((match = directAmazonRegex.exec(entry.content)) !== null) {
              amazonUrls.add(match[0]);
            }
          });
        }

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
            <div className="flex flex-col items-center justify-center mb-6">
              <img 
                src="/attached_assets/Daco_4533095_1753878634621.png" 
                alt="Amazon"
                className="h-32 md:h-40 lg:h-48 w-auto object-contain mb-4"
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Picks</h1>
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
                <a
                  key={index}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-50 flex items-center justify-center overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2 leading-snug">
                          {product.title}
                        </h3>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl font-semibold text-[#B12704]">
                            {product.price}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
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
                                    ? 'text-[#FFA41C]' 
                                    : i < product.rating 
                                      ? 'text-[#FFA41C]' 
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
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-[#FF9900] text-sm font-medium">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="currentColor">
                          <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                          <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
                        </svg>
                        amazon
                      </div>
                      <div className="text-sm text-gray-500">
                        Click to view on Amazon
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}