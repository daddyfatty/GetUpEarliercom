import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar, Edit, Play } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { LinkPreview } from "@/components/link-preview";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, ShoppingCart, ExternalLink, X } from "lucide-react";



interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  categories?: string[];
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  readTime: number;
  isVideo: boolean;
  originalUrl: string;
}

export default function BlogPost() {
  const { id } = useParams();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{url: string, title: string} | null>(null);

  const showAmazonPreview = (url: string, title: string) => {
    setPreviewData({url, title});
    setPreviewOpen(true);
  };

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"]
  });

  const post = posts?.find(p => p.id === id);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Blog post not found.</p>
            <Link href="/blog">
              <Button className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Full-width Hero Gradient Header Section - No gaps */}
      <HeroGradient className="text-white">
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm font-medium text-blue-200 mb-4 uppercase tracking-wide">
              {post.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight max-w-4xl mx-auto">
              {post.title}
            </h1>
            
            {/* Author Block with Photo - Clickable */}
            <Link href="/about" className="flex flex-col items-center space-y-4 mt-8 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-300 bg-white">
                <img 
                  src="/attached_assets/NoterxtyAI-Wintrer-Runner3_1751625255284.png" 
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white mb-2">
                  {post.author}
                </div>
              </div>
            </Link>
            
            {/* Post Meta */}
            <div className="flex items-center justify-center space-x-4 text-blue-100 mt-6 text-sm">
              <span>{formatDate(post.publishedDate)}</span>
              <span>•</span>
              <span>{post.readTime} min read</span>
              {post.isVideo && (
                <>
                  <span>•</span>
                  <span>Video Content</span>
                </>
              )}
            </div>
          </div>
        </div>
      </HeroGradient>

      <div className="container mx-auto px-4 py-8">
        {/* Edit Button - Moved to white area */}
        <div className="mb-8 flex justify-end">
          {post && (
            <Link href={`/blog/${post.id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          )}
        </div>

        {/* Article Content Container */}
        <article className="max-w-4xl mx-auto">

          {/* Video Section */}
          {post.isVideo && post.videoUrl && (
            <div className="mb-8">
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={post.videoUrl}
                  title={post.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium border-b border-gray-200 dark:border-gray-600 pb-6">
                {post.excerpt}
              </div>
              
              <div 
                className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
                ref={(el) => {
                  if (el) {
                    // Add click handlers to Amazon link spans
                    const amazonLinks = el.querySelectorAll('.amazon-link');
                    amazonLinks.forEach((link) => {
                      const url = link.getAttribute('data-url');
                      if (url) {
                        const htmlElement = link as HTMLElement;
                        htmlElement.style.cursor = 'pointer';
                        htmlElement.style.color = '#2563eb';
                        htmlElement.style.textDecoration = 'underline';
                        htmlElement.addEventListener('click', (e) => {
                          e.preventDefault();
                          showAmazonPreview(url, link.textContent || '');
                        });
                      }
                    });
                  }
                }}
              />
            </div>
          </div>

          {/* Categories - Clickable */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {post.categories && post.categories.length > 1 ? 'Categories' : 'Category'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* Show all categories from the categories array if it exists, otherwise show the primary category */}
              {post.categories && post.categories.length > 0 ? (
                // Show all categories
                post.categories.map((category, index) => (
                  <Link key={category} href={`/category/${encodeURIComponent(category)}`}>
                    <Badge 
                      variant="outline" 
                      className={`text-sm cursor-pointer transition-colors ${
                        index === 0 || category === post.category
                          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {category}
                    </Badge>
                  </Link>
                ))
              ) : (
                // Fallback to primary category only
                post.category && (
                  <Link href={`/category/${encodeURIComponent(post.category)}`}>
                    <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 cursor-pointer transition-colors">
                      {post.category}
                    </Badge>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Author Bio - Clickable */}
          <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Link href="/about" className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
                <img 
                  src="/attached_assets/NoterxtyAI-Wintrer-Runner3_1751625255284.png" 
                  alt="Michael Baker"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{post.author}</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Bridging the gap from inactivity and poor diet to strength and healthy habits
                </p>
              </div>
            </Link>
          </div>
        </article>
      </div>

      {/* Amazon Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Product Preview
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {previewData && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src="/attached_assets/20250702_065601_1751710941826.jpg" 
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {previewData.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        4.5 (1,247 reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-600">
                      $24.99
                    </span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Prime
                    </Badge>
                  </div>

                  <div className="text-sm text-green-600 font-medium">
                    In Stock
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                Recommended by certified trainers for optimal performance and hydration during training.
              </p>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => window.open(previewData.url, '_blank')} className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View on Amazon
                </Button>
                <Button variant="outline" onClick={() => window.open(previewData.url, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center pt-2">
                <p>This preview helps you see product details before visiting Amazon.</p>
                <p>Prices and availability are subject to change.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}