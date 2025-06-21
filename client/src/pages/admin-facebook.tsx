import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function AdminFacebook() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const { toast } = useToast();

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest("POST", "/api/blog/create-facebook-post", postData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Facebook post added to blog successfully!",
      });
      // Reset form
      setTitle("");
      setContent("");
      setImages("");
      setPostUrl("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    const imageArray = images.split('\n').map(url => url.trim()).filter(url => url);
    
    createPostMutation.mutate({
      title,
      content,
      images: imageArray,
      postUrl
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Add Facebook Post to Blog
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Manually add your latest Facebook group post to the blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="postUrl">Facebook Post URL (optional)</Label>
                <Input
                  id="postUrl"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="https://www.facebook.com/groups/getupearlier/posts/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Post Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Post Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the full post content here..."
                  rows={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Image URLs (one per line)</Label>
                <Textarea
                  id="images"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg
https://example.com/image3.jpg"
                  rows={4}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The first image will be used as the featured image
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Adding Post..." : "Add to Blog"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}