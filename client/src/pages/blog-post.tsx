import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar, Edit, Play, Expand } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { BlogContentRenderer } from "@/components/blog-content-renderer";
import { useState } from "react";



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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string>("");

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

          {/* Featured Image Section - Smaller with Lightbox */}
          {post.imageUrl && (
            <div className="mb-8 flex justify-center">
              <div 
                className="max-w-md rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 cursor-pointer hover:shadow-xl transition-shadow group relative"
                onClick={() => {
                  setLightboxImage(post.imageUrl!);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.style.display = 'none';
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            </div>
          )}

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
              
              <BlogContentRenderer content={post.content} />
            </div>
          </div>

          {/* Image Gallery Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image 1 - Running shoes */}
              <div 
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative bg-gray-100 dark:bg-gray-700"
                onClick={() => {
                  setLightboxImage("/attached_assets/download - 2025-07-05T124857.113_1751734734091.png");
                  setLightboxOpen(true);
                }}
              >
                <img
                  src="/attached_assets/download - 2025-07-05T124857.113_1751734734091.png"
                  alt="Running shoes and hydration gear"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>

              {/* Image 2 - Fitly bottle and supplements */}
              <div 
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative bg-gray-100 dark:bg-gray-700"
                onClick={() => {
                  setLightboxImage("/attached_assets/20250702_065601_1751734734092.jpg");
                  setLightboxOpen(true);
                }}
              >
                <img
                  src="/attached_assets/20250702_065601_1751734734092.jpg"
                  alt="Fitly bottle with nutrition supplements"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>

              {/* Image 3 - Fitly bottle in freezer */}
              <div 
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative bg-gray-100 dark:bg-gray-700"
                onClick={() => {
                  setLightboxImage("/attached_assets/20250702_065853_1751734734092.jpg");
                  setLightboxOpen(true);
                }}
              >
                <img
                  src="/attached_assets/20250702_065853_1751734734092.jpg"
                  alt="Fitly bottle stored in freezer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
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

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={lightboxImage}
              alt={post.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}