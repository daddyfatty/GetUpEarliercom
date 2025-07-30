import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Play } from "lucide-react";

interface BlogPost {
  id: string;
  slug?: string;
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

  // Filter posts by category (handle exact match with original category names)
  const filteredPosts = posts?.filter((post: BlogPost) => {
    // For exact match, compare original category name with URL-decoded category
    const matchesCategory = post.category === categoryName ||
                           (post.categories && post.categories.some(cat => cat === categoryName));
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

  // Get category-specific information
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "Workouts & Challenges":
        return {
          title: "Workouts & Challenges",
          subtitle: "Workout & Challenge Collection",
          description: "Strength, Calisthenics, Yoga, Guided Runs, Challenges and Tutorials to Keep You Moving",
          badges: ["New Workouts Weekly", "15-45 Min Sessions"]
        };
      case "Strength Training":
        return {
          title: "Strength Training",
          subtitle: "Strength Training Collection",
          description: "Build muscle, increase power, and transform your physique with expert-guided strength workouts",
          badges: ["Progressive Overload", "All Fitness Levels"]
        };
      case "Running":
        return {
          title: "Running",
          subtitle: "Running Collection",
          description: "Training plans, running tips, race preparation, and motivation to help you achieve your goals",
          badges: ["All Distances", "Beginner to Advanced"]
        };
      case "Marathon Training":
        return {
          title: "Marathon Training",
          subtitle: "Marathon Training Collection",
          description: "Complete marathon preparation guides, training schedules, and race day strategies",
          badges: ["26.2 Mile Prep", "Race Day Ready"]
        };
      case "Marathon Training Log":
        return {
          title: "Marathon Training Log",
          subtitle: "Hartford Marathon Training Log",
          description: "Follow Michael's complete marathon training journey with detailed entries, tips, and race preparation",
          badges: ["Real Training Data", "Daily Updates"]
        };
      case "Yoga":
        return {
          title: "Yoga",
          subtitle: "Yoga Collection",
          description: "Mindful movement, flexibility training, and wellness practices for body and mind",
          badges: ["All Levels", "Mind-Body Connection"]
        };
      case "AI":
        return {
          title: "AI",
          subtitle: "AI & Technology Collection",
          description: "Explore how artificial intelligence and technology enhance fitness, nutrition, and wellness",
          badges: ["Cutting Edge", "Tech Innovation"]
        };
      case "Inspiration":
        return {
          title: "Inspiration",
          subtitle: "Inspiration Collection", 
          description: "Motivational content, success stories, and mindset shifts to fuel your fitness journey",
          badges: ["Motivation Daily", "Success Stories"]
        };
      case "5k":
        return {
          title: "5k Training",
          subtitle: "5k Training Collection",
          description: "Everything you need to train for and excel at the 5k distance, from beginner to PR",
          badges: ["3.1 Miles", "Race Ready"]
        };
      default:
        return {
          title: categoryName,
          subtitle: `${categoryName} Collection`,
          description: `All content related to ${categoryName.toLowerCase()}`,
          badges: ["Expert Content", "Updated Regularly"]
        };
    }
  };

  const categoryInfo = getCategoryInfo(categoryName);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50">
              {categoryInfo.subtitle}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">{categoryInfo.title.split(' ').slice(0, -1).join(' ')}</span>
              {categoryInfo.title.split(' ').length > 1 && (
                <><br /><span className="text-blue-600">{categoryInfo.title.split(' ').slice(-1)[0]}</span></>
              )}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {categoryInfo.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {categoryInfo.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                  {index === 0 ? "●" : "●"} {badge}
                </Badge>
              ))}
              <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-100 text-green-700">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-12">
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
            {filteredPosts.map((post) => {
              // Determine the correct link based on post type
              const postLink = post.slug ? `/blog/${post.slug}` : `/blog/${post.id}`;
              
              return (
                <Link key={post.id} href={postLink} className="block">
                  <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
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
                            <Badge 
                              key={category}
                              variant="outline" 
                              className={`text-xs transition-colors ${
                                category === categoryName
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {category}
                            </Badge>
                          ))
                        ) : (
                          post.category && (
                            post.category.split(',').map((category) => (
                              <Badge key={category.trim()} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {category.trim()}
                              </Badge>
                            ))
                          )
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {post.title}
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
                            <span>{post.author}</span>
                          </span>
                        </div>
                        <span>{formatDate(post.publishedDate)}</span>
                      </div>

                      {/* Read More Button */}
                      <div className="w-full">
                        <Button className="w-full">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}