import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Timer, Route, ArrowLeft, ExternalLink } from "lucide-react";
import { TrainingLogEntry } from "@shared/schema";

export default function TrainingLogEntryPage() {
  const { slug } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string>("");

  const { data: entry, isLoading, error } = useQuery<TrainingLogEntry>({
    queryKey: ["/api/training-log/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/training-log/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Training log entry not found');
      }
      return response.json();
    },
    enabled: !!slug
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderEntryContent = (content: string) => {
    // Convert line breaks to paragraphs and handle links
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        {paragraph.split('\n').map((line, lineIndex) => (
          <span key={lineIndex}>
            {lineIndex > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Training Log Entry Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The requested training log entry could not be found.
            </p>
            <Link href="/training-log">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Training Log
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/training-log">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Training Log
            </Button>
          </Link>
        </div>

        {/* Entry Header */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-white/20 text-white text-lg px-3 py-1">
                    Entry #{entry.entryNumber}
                  </Badge>
                  {entry.title}
                </CardTitle>
                <div className="flex items-center gap-6 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-lg">{formatDate(entry.date)}</span>
                  </div>
                  {entry.distance && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span className="text-lg">{entry.distance}</span>
                    </div>
                  )}
                  {entry.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span className="text-lg">{entry.time}</span>
                    </div>
                  )}
                  {entry.pace && (
                    <div className="flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      <span className="text-lg">{entry.pace}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Route className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              {renderEntryContent(entry.content)}
            </div>
            
            {/* Images */}
            {entry.images && entry.images.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entry.images.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg cursor-pointer group">
                    <img 
                      src={image} 
                      alt={`Training log entry ${entry.entryNumber} image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onClick={() => {
                        setLightboxImage(image);
                        setLightboxOpen(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lightbox */}
        {lightboxOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="max-w-4xl max-h-full p-4">
              <img 
                src={lightboxImage} 
                alt="Training log entry image"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}