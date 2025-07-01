import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { PageSubscriptionCTA } from "@/components/page-subscription-cta";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">
                {post.category}
              </Badge>
              {post.isVideo && (
                <Badge variant="outline">
                  Video
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </header>

          {/* Featured Media */}
          {post.isVideo && post.videoUrl ? (
            <div className="mb-8">
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                <iframe
                  src={post.videoUrl}
                  title={post.title}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          ) : post.imageUrl ? (
            <div className="mb-8">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : null}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 font-medium">
                {post.excerpt}
              </div>
              
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About the Author</h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{post.author}</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {post.author === 'Michael Baker' 
                    ? 'Certified Personal Trainer (ISSA), Integrative Nutrition Health Coach, Running Coach (ISSA), and RYT 200 Yoga Instructor with 30 years of experience helping clients achieve their fitness goals.'
                    : 'E-RYT 200 Certified Yoga Instructor specializing in therapeutic yoga, flexibility training, and pain relief through mindful movement and proper alignment.'
                  }
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
      
      {/* Subscription CTA */}
      <PageSubscriptionCTA />
    </div>
  );
}