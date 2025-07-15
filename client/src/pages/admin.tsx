import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, CheckCircle, AlertCircle, ImageIcon, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function Admin() {
  const [scraping, setScraping] = useState(false);
  const [fixingThumbnails, setFixingThumbnails] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    savedCount?: number;
    totalFound?: number;
  } | null>(null);
  const [thumbnailResult, setThumbnailResult] = useState<{
    success: boolean;
    message: string;
    updatedCount?: number;
  } | null>(null);

  const handleWebflowScrape = async () => {
    setScraping(true);
    setResult(null);

    try {
      const response = await apiRequest("POST", "/api/scrape-webflow-blog");
      const data = await response.json();
      
      setResult({
        success: data.success,
        message: data.message,
        savedCount: data.savedCount,
        totalFound: data.totalFound
      });
    } catch (error) {
      console.error("Scraping error:", error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to scrape blog posts"
      });
    } finally {
      setScraping(false);
    }
  };

  const handleFixThumbnails = async () => {
    setFixingThumbnails(true);
    setThumbnailResult(null);

    try {
      const response = await apiRequest("POST", "/api/fix-blog-thumbnails");
      const data = await response.json();
      
      setThumbnailResult({
        success: data.success,
        message: data.message,
        updatedCount: data.updatedCount
      });
    } catch (error) {
      console.error("Thumbnail fix error:", error);
      setThumbnailResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to fix thumbnails"
      });
    } finally {
      setFixingThumbnails(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage content and system operations</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/admin/training-log">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Training Log
                </CardTitle>
                <CardDescription>
                  Add new training log entries
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/blog">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5" />
                  Blog
                </CardTitle>
                <CardDescription>
                  View blog posts and training logs
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Webflow Blog Scraper */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Webflow Blog Scraper
            </CardTitle>
            <CardDescription>
              Import blog posts from the GetUpEarlier.com Webflow site into the application database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>This will scrape all blog posts from https://www.getupearlier.com/blog and add them to the database.</p>
              <p className="mt-2">Features:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Automatically handles pagination</li>
                <li>Extracts titles, content, images, and categories</li>
                <li>Skips existing posts to prevent duplicates</li>
                <li>Preserves original URLs and metadata</li>
              </ul>
            </div>

            <Button 
              onClick={handleWebflowScrape}
              disabled={scraping}
              className="w-full sm:w-auto"
              size="lg"
            >
              {scraping ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping Blog Posts...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Start Webflow Scrape
                </>
              )}
            </Button>

            {result && (
              <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                      <div className="font-medium">{result.message}</div>
                      {result.success && result.savedCount !== undefined && result.totalFound !== undefined && (
                        <div className="mt-1 text-sm">
                          Found {result.totalFound} posts, saved {result.savedCount} new posts to database
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Thumbnail Fix Tool */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Fix Blog Thumbnails
            </CardTitle>
            <CardDescription>
              Fix duplicate thumbnails by re-scraping images from the original blog posts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>This will go through existing blog posts and re-extract their proper thumbnail images from the original Webflow pages.</p>
              <p className="mt-2">Features:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Re-scrapes each post's original URL for correct thumbnail</li>
                <li>Uses improved image extraction logic</li>
                <li>Only updates posts with different/better images</li>
                <li>Preserves existing data while fixing image URLs</li>
              </ul>
            </div>

            <Button 
              onClick={handleFixThumbnails}
              disabled={fixingThumbnails}
              className="w-full sm:w-auto"
              size="lg"
              variant="outline"
            >
              {fixingThumbnails ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fixing Thumbnails...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Fix Thumbnails
                </>
              )}
            </Button>

            {thumbnailResult && (
              <Alert className={thumbnailResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <div className="flex items-start gap-2">
                  {thumbnailResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription className={thumbnailResult.success ? "text-green-800" : "text-red-800"}>
                      <div className="font-medium">{thumbnailResult.message}</div>
                      {thumbnailResult.success && thumbnailResult.updatedCount !== undefined && (
                        <div className="mt-1 text-sm">
                          Successfully updated {thumbnailResult.updatedCount} blog post thumbnails
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Overview of system components and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">Database</h3>
                <p className="text-xs text-green-600">Connected</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">Blog System</h3>
                <p className="text-xs text-green-600">Active</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">Recipe Library</h3>
                <p className="text-xs text-green-600">Active</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">Workout Library</h3>
                <p className="text-xs text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}