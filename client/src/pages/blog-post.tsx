import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar, Edit, Play } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";



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

  // Debug log to see the structure of the post data
  console.log("Blog post data:", post);
  console.log("Post categories:", post.categories);
  console.log("Post category:", post.category);

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
              
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                {post.content?.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Categories - Clickable */}
          {(post.category || (post.categories && post.categories.length > 0)) && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {post.categories && post.categories.length > 1 ? 'Categories' : 'Category'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Primary category */}
                {post.category && (
                  <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>
                    <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 cursor-pointer transition-colors">
                      {post.category}
                    </Badge>
                  </Link>
                )}
                {/* Additional categories */}
                {post.categories?.filter(cat => cat !== post.category).map((category) => (
                  <Link key={category} href={`/blog?category=${encodeURIComponent(category)}`}>
                    <Badge variant="outline" className="text-sm bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300 cursor-pointer transition-colors">
                      {category}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

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
    </div>
  );
}