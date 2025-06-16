import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Image, Video, Clock, User } from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  imageUrl?: string;
  gallery?: string[];
  videoUrl?: string;
  createdAt: string;
  category?: string[];
  authorName?: string;
}

interface ContentStats {
  total: number;
  withImages: number;
  withVideos: number;
  withoutImages: number;
  recentlyAdded: number;
}

export default function AdminDashboard() {
  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ["/api/recipes"],
  });

  const { data: workouts = [], isLoading: workoutsLoading } = useQuery({
    queryKey: ["/api/workouts"],
  });

  const getContentStats = (items: ContentItem[]): ContentStats => {
    const withImages = items.filter(item => item.imageUrl || (item.gallery && item.gallery.length > 0)).length;
    const withVideos = items.filter(item => item.videoUrl).length;
    const recentlyAdded = items.filter(item => {
      const created = new Date(item.createdAt);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return created > dayAgo;
    }).length;

    return {
      total: items.length,
      withImages,
      withVideos,
      withoutImages: items.length - withImages,
      recentlyAdded
    };
  };

  const recipeStats = getContentStats(recipes);
  const workoutStats = getContentStats(workouts);

  const ContentTable = ({ items, type }: { items: ContentItem[], type: string }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Images</TableHead>
          <TableHead>Video</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const hasImage = item.imageUrl || (item.gallery && item.gallery.length > 0);
          const imageCount = item.gallery ? item.gallery.length : (item.imageUrl ? 1 : 0);
          
          return (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-xs truncate">
                {item.title}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {hasImage ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Image className="w-3 h-3 mr-1" />
                      {imageCount}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      No Image
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {item.videoUrl ? (
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    <Video className="w-3 h-3 mr-1" />
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {item.authorName || 'Unknown'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                {hasImage && item.videoUrl ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Partial
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  const StatsCards = ({ stats, type }: { stats: ContentStats, type: string }) => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
          <CardDescription>Total {type}</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-green-600">{stats.withImages}</CardTitle>
          <CardDescription>With Images</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-red-600">{stats.withoutImages}</CardTitle>
          <CardDescription>Missing Images</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-blue-600">{stats.withVideos}</CardTitle>
          <CardDescription>With Videos</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-purple-600">{stats.recentlyAdded}</CardTitle>
          <CardDescription>Added Today</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  if (recipesLoading || workoutsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Management Dashboard</h1>
        <p className="text-gray-600">Monitor and track all recipes and workouts at scale</p>
      </div>

      {/* Overall Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{recipeStats.total + workoutStats.total}</div>
              <div className="text-sm text-gray-600">Total Content Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{recipeStats.withImages + workoutStats.withImages}</div>
              <div className="text-sm text-gray-600">Items with Images</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{recipeStats.withoutImages + workoutStats.withoutImages}</div>
              <div className="text-sm text-gray-600">Missing Images</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(((recipeStats.withImages + workoutStats.withImages) / (recipeStats.total + workoutStats.total)) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recipes">
            Recipes ({recipeStats.total})
          </TabsTrigger>
          <TabsTrigger value="workouts">
            Workouts ({workoutStats.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="space-y-4">
          <StatsCards stats={recipeStats} type="Recipes" />
          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
              <CardDescription>
                Complete overview of all recipes with media status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTable items={recipes} type="recipe" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <StatsCards stats={workoutStats} type="Workouts" />
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
              <CardDescription>
                Complete overview of all workouts with media status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTable items={workouts} type="workout" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Items */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recipeStats.withoutImages > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                {recipeStats.withoutImages} recipes need images
              </div>
            )}
            {workoutStats.withoutImages > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                {workoutStats.withoutImages} workouts need images
              </div>
            )}
            {(recipeStats.withoutImages === 0 && workoutStats.withoutImages === 0) && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                All content has proper images assigned
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}