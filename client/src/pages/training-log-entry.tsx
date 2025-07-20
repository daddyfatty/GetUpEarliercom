import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Timer, Route, ArrowLeft, ExternalLink, Expand } from "lucide-react";
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
          </CardContent>

          {/* Images - Full Width Outside Card Content */}
          {entry.images && entry.images.length > 0 && (
            <div className="px-8 pb-8">
              {entry.images.length === 1 ? (
                // Single image - full width
                <div 
                  className="cursor-pointer hover:shadow-xl transition-shadow group relative w-full"
                  onClick={() => {
                    setLightboxImage(entry.images![0]);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={entry.images![0]}
                    alt="Training log photo"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-lg">
                    <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ) : (
                // Multiple images - masonry layout full width
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 w-full">
                  {entry.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="cursor-pointer hover:shadow-xl transition-all duration-300 group relative break-inside-avoid mb-6"
                      onClick={() => {
                        setLightboxImage(image);
                        setLightboxOpen(true);
                      }}
                    >
                      <img 
                        src={image} 
                        alt={`Training log entry ${entry.entryNumber} image ${index + 1}`}
                        className="w-full h-auto object-cover rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-lg">
                        <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Lightbox */}
        {lightboxOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center">
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={lightboxImage} 
                alt="Training log entry image"
                className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}