import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, TrendingUp, Timer, Route } from "lucide-react";
import { TrainingLogEntry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function TrainingLog() {
  const { data: entries, isLoading } = useQuery<TrainingLogEntry[]>({
    queryKey: ['/api/training-log'],
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
    // Convert line breaks to paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        {paragraph}
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Route className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hartford Marathon Training Log
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Follow my journey training for the Hartford Marathon with detailed logs, insights, and lessons learned along the way.
          </p>
        </div>

        {/* Training Log Entries */}
        <div className="space-y-8">
          {entries?.map((entry) => (
            <Card key={entry.id} className="bg-white dark:bg-gray-800 shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        Entry #{entry.entryNumber}
                      </Badge>
                      {entry.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-blue-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                      {entry.distance && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{entry.distance}</span>
                        </div>
                      )}
                      {entry.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{entry.time}</span>
                        </div>
                      )}
                      {entry.pace && (
                        <div className="flex items-center gap-1">
                          <Timer className="h-4 w-4" />
                          <span>{entry.pace}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link href={`/training-log/${entry.slug}`}>
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-lg max-w-none">
                  {renderEntryContent(entry.content)}
                </div>
                
                {/* Images */}
                {entry.images && entry.images.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {entry.images.map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <img 
                          src={image} 
                          alt={`Training log entry ${entry.entryNumber} image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!entries || entries.length === 0 ? (
          <div className="text-center py-12">
            <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Training Entries Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Training log entries will appear here as they are added.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}