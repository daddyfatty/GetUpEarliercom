import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Play } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  categories?: string[];
  imageUrl?: string;
  videoUrl?: string;
  readTime: number;
  isVideo: boolean;
  originalUrl: string;
}

export default function CategoryPage() {
  const params = useParams();
  const [location] = useLocation();
  
  // Get category from URL params
  const categoryName = params?.category ? decodeURIComponent(params.category) : "";
  
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

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

  // Filter posts by category
  const filteredPosts = posts?.filter((post: BlogPost) => {
    const matchesCategory = post.category.toLowerCase() === categoryName.toLowerCase() ||
                           (post.categories && post.categories.some(cat => cat.toLowerCase() === categoryName.toLowerCase()));
    return matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Error loading posts.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Category: {categoryName}
            </h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </Badge>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            All posts in the "{categoryName}" category
          </p>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No posts found in this category.
            </p>
            <Link href="/blog">
              <Button>
                View All Posts
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Featured Image */}
                {post.imageUrl && (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log("Image loaded successfully:", post.imageUrl)}
                      onError={(e) => {
                        console.error("Failed to load image:", post.imageUrl);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {post.isVideo && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Play className="h-16 w-16 text-white opacity-80" />
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories && post.categories.length > 0 ? (
                      post.categories.map((category, index) => (
                        <Link key={category} href={`/category/${encodeURIComponent(category)}`}>
                          <Badge 
                            variant="outline" 
                            className={`text-xs cursor-pointer transition-colors ${
                              category === categoryName
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {category}
                          </Badge>
                        </Link>
                      ))
                    ) : (
                      <Link href={`/category/${encodeURIComponent(post.category)}`}>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {post.category}
                        </Badge>
                      </Link>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    <Link
                      href={`/blog/${post.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min read
                      </span>
                    </div>
                    <span>{formatDate(post.publishedDate)}</span>
                  </div>

                  {/* Read More Button */}
                  <Link href={`/blog/${post.id}`}>
                    <Button className="w-full">
                      Read More
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}