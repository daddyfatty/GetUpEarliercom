import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, X, Trash2, Loader2, ImageIcon, Play } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

export default function BlogEdit() {
  const [, params] = useRoute("/blog/:id/edit");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<BlogPost>>({});

  const categories = ["running", "nutrition", "workouts", "inspiration", "yoga / stretching", "iron master dumbbells"];

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${params?.id}`],
    enabled: !!params?.id
  });

  useEffect(() => {
    if (post) {
      // Initialize categories array properly - ensure it always includes the primary category
      const initialCategories = post.categories && post.categories.length > 0 
        ? post.categories 
        : [post.category].filter(Boolean);

      setEditData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        categories: initialCategories,
        imageUrl: post.imageUrl,
        videoUrl: post.videoUrl,
        isVideo: post.isVideo
      });
    }
  }, [post]);

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<BlogPost>) => {
      const response = await apiRequest("PUT", `/api/blog/${params?.id}`, updates);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: [`/api/blog/${params?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/blog/${params?.id}`);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      setLocation("/blog");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!editData.title?.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(editData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (post) {
      // Reset to original post data
      const initialCategories = post.categories && post.categories.length > 0 
        ? post.categories 
        : [post.category].filter(Boolean);

      setEditData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        categories: initialCategories,
        imageUrl: post.imageUrl,
        videoUrl: post.videoUrl,
        isVideo: post.isVideo
      });
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blog post not found</h1>
            <Button onClick={() => setLocation("/blog")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setLocation("/blog")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? "Edit Blog Post" : post.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDate(post.publishedDate)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this blog post? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleSave} 
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Image Preview */}
        {(post.imageUrl || editData.imageUrl) && (
          <div className="mb-8">
            <img
              src={isEditing ? editData.imageUrl || post.imageUrl : post.imageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  {isEditing ? (
                    <Input
                      value={editData.title || ""}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      placeholder="Blog post title"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{post.title}</p>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt</label>
                  {isEditing ? (
                    <Textarea
                      value={editData.excerpt || ""}
                      onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
                      placeholder="Brief description of the blog post"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  {isEditing ? (
                    <Textarea
                      value={editData.content || ""}
                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                      placeholder="Full blog post content"
                      rows={12}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{post.content}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image URL */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL</label>
                      <Input
                        value={editData.imageUrl || ""}
                        onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">or</p>
                      <div 
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/10');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/10');
                        }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/10');
                          
                          const files = e.dataTransfer.files;
                          const file = files[0];
                          
                          if (file && file.type.startsWith('image/')) {
                            try {
                              const formData = new FormData();
                              formData.append('image', file);
                              
                              const response = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                              });
                              
                              if (response.ok) {
                                const data = await response.json();
                                setEditData({ ...editData, imageUrl: data.url });
                              } else {
                                throw new Error('Upload failed');
                              }
                            } catch (error) {
                              console.error('Error uploading file:', error);
                              // Fallback to local file preview
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setEditData({ ...editData, imageUrl: e.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const formData = new FormData();
                                formData.append('image', file);
                                
                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData,
                                });
                                
                                if (response.ok) {
                                  const data = await response.json();
                                  setEditData({ ...editData, imageUrl: data.url });
                                } else {
                                  throw new Error('Upload failed');
                                }
                              } catch (error) {
                                console.error('Error uploading file:', error);
                                // Fallback to local file preview
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  setEditData({ ...editData, imageUrl: e.target?.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {(editData.imageUrl || post.imageUrl) && (
                      <div>
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <div className="relative">
                          <img
                            src={editData.imageUrl || post.imageUrl}
                            alt="Featured image preview"
                            className="w-full h-40 object-cover rounded-lg border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dy='.3em'%3EImage not found%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {post.imageUrl ? (
                      <div className="space-y-2">
                        <img
                          src={post.imageUrl}
                          alt="Featured image"
                          className="w-full h-40 object-cover rounded-lg border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dy='.3em'%3EImage not found%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <p className="text-xs text-gray-500 break-words">{post.imageUrl}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm">No image set</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video URL */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Video Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Video URL (YouTube Embed)</label>
                      <Input
                        value={editData.videoUrl || ""}
                        onChange={(e) => setEditData({ ...editData, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use YouTube embed format: https://www.youtube.com/embed/VIDEO_ID
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isVideo"
                        checked={editData.isVideo || false}
                        onChange={(e) => setEditData({ ...editData, isVideo: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="isVideo" className="text-sm font-medium">
                        Mark as video post
                      </label>
                    </div>

                    {(editData.videoUrl || post.videoUrl) && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Video Preview:</p>
                        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                          <iframe
                            src={editData.videoUrl || post.videoUrl}
                            title="Video preview"
                            className="w-full h-full border-0"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {post.videoUrl ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={post.isVideo ? "default" : "secondary"}>
                            {post.isVideo ? "Video Post" : "Regular Post"}
                          </Badge>
                        </div>
                        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                          <iframe
                            src={post.videoUrl}
                            title="Video content"
                            className="w-full h-full border-0"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          />
                        </div>
                        <p className="text-xs text-gray-500 break-words">{post.videoUrl}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Play className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm">No video set</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Primary Category */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Category</label>
                      <Select 
                        value={editData.category} 
                        onValueChange={(value) => {
                          // When primary category changes, update the categories array
                          const currentCategories = editData.categories || [];
                          const newCategories = currentCategories.filter(cat => cat !== editData.category);
                          if (!newCategories.includes(value)) {
                            newCategories.unshift(value); // Add new primary category at the beginning
                          }
                          setEditData({ 
                            ...editData, 
                            category: value,
                            categories: newCategories
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Additional Categories */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Additional Categories</label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.filter(cat => cat !== editData.category).map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={category}
                              checked={editData.categories?.includes(category) || false}
                              onCheckedChange={(checked) => {
                                const currentCategories = editData.categories || [editData.category || ''];
                                if (checked) {
                                  setEditData({ 
                                    ...editData, 
                                    categories: [...currentCategories, category] 
                                  });
                                } else {
                                  setEditData({ 
                                    ...editData, 
                                    categories: currentCategories.filter(c => c !== category) 
                                  });
                                }
                              }}
                            />
                            <label htmlFor={category} className="text-sm">
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">{post.category}</Badge>
                    {post.categories?.filter(cat => cat !== post.category).map((category) => (
                      <Badge key={category} variant="secondary">{category}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>



            {/* Post Info */}
            <Card>
              <CardHeader>
                <CardTitle>Post Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Author:</span> {post.author}
                </div>
                <div>
                  <span className="font-medium">Published:</span> {formatDate(post.publishedDate)}
                </div>
                <div>
                  <span className="font-medium">Read Time:</span> {post.readTime} min
                </div>
                <div>
                  <span className="font-medium">Type:</span> {post.isVideo ? "Video" : "Article"}
                </div>
                {post.originalUrl && (
                  <div>
                    <span className="font-medium">Original URL:</span>
                    <a 
                      href={post.originalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-words"
                    >
                      {post.originalUrl}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}