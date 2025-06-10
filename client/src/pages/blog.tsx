import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, ExternalLink, Play, User, Clock } from "lucide-react";

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
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch blog posts from your live website
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog");
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      return response.json();
    },
  });

  const categories = ["all", "training", "nutrition", "wellness", "motivation", "videos"];

  const filteredPosts = posts.filter((post: BlogPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           post.category.toLowerCase() === selectedCategory ||
                           (selectedCategory === "videos" && post.isVideo);
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog & Videos</h1>
            <p className="text-gray-600 mb-8">
              Unable to load blog posts at the moment. Please visit our{" "}
              <a 
                href="https://www.getupearlier.com/blog" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[hsl(var(--orange))] hover:underline"
              >
                live blog
              </a>{" "}
              for the latest content.
            </p>
            <Button 
              onClick={() => window.open("https://www.getupearlier.com/blog", "_blank")}
              className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Live Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[hsl(var(--navy))] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Blog & Videos</h1>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Insights, tips, and inspiration for your health and fitness journey from 30 years of experience
            </p>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => window.open("https://www.getupearlier.com/blog", "_blank")}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[hsl(var(--navy))]"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Full Blog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles and videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 
                    "bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90" : 
                    ""}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No posts found</h3>
              <p className="text-gray-600 mb-8">
                Try adjusting your search terms or browse different categories.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post: BlogPost) => (
                <Card key={post.id} className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  {post.imageUrl && (
                    <div className="relative">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      {post.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="bg-white/90 rounded-full p-3">
                            <Play className="h-6 w-6 text-[hsl(var(--navy))]" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      {post.isVideo && (
                        <Badge variant="outline" className="text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl mb-3 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime} min read
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.publishedDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90"
                        onClick={() => window.open(`https://www.getupearlier.com/blog/${post.id}`, "_blank")}
                      >
                        {post.isVideo ? "Watch Video" : "Read More"}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[hsl(var(--navy))] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-200 mb-8">
            Get personalized coaching and take your health to the next level
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white px-8 py-3"
              onClick={() => window.location.href = "/coaching"}
            >
              Book Consultation
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[hsl(var(--navy))] px-8 py-3"
              onClick={() => window.open("https://www.facebook.com/groups/getupearlier", "_blank")}
            >
              Join Community
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}