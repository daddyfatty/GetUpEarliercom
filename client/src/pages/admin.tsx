import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Admin() {
  const [scraping, setScraping] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    savedCount?: number;
    totalFound?: number;
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage content and system operations</p>
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