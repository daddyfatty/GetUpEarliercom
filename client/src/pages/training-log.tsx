import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Target, Route } from "lucide-react";
import { TrainingLogEntry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { BlogContentRenderer } from "@/components/blog-content-renderer";

interface ParsedTrainingEntry {
  entryNumber: number;
  title: string;
  subtitle: string;
  date: string;
  workoutType: string;
  metrics?: {
    distance?: string;
    pace?: string;
    time?: string;
  };
  content: string;
  images?: string[];
  videoUrl?: string;
}

export default function TrainingLog() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const { data: rawEntries, isLoading } = useQuery<TrainingLogEntry[]>({
    queryKey: ['/api/training-log'],
  });

  // Parse the Hartford Marathon Training Log entries from JSON content
  const parsedEntries: ParsedTrainingEntry[] = [];
  
  if (rawEntries && rawEntries.length > 0) {
    const hartfordLog = rawEntries.find(entry => entry.title === 'Hartford Marathon Training Log 2025');
    if (hartfordLog && hartfordLog.content) {
      try {
        const contentObj = JSON.parse(hartfordLog.content);
        if (contentObj.entries && Array.isArray(contentObj.entries)) {
          parsedEntries.push(...contentObj.entries);
        }
      } catch (error) {
        console.error('Error parsing training log content:', error);
      }
    }
  }

  // Hartford Marathon countdown
  useEffect(() => {
    const calculateCountdown = () => {
      const raceDate = new Date('2025-10-11T07:55:00-04:00');
      const now = new Date();
      const difference = raceDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Top anchor for navigation */}
        <div id="top"></div>
        
        {/* Featured Image Header */}
        <div className="relative h-64 bg-cover bg-center" style={{
          backgroundImage: "url('/attached_assets/hartford-marathon-2024-start_1752664876322.jpg')"
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          {/* Countdown Timer */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#0039A6] bg-opacity-90 text-white px-8 py-6 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Hartford Marathon 2025 Countdown</h2>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#94D600]">{countdown.days}</div>
                  <div className="text-sm uppercase tracking-wide">DAYS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#94D600]">{countdown.hours}</div>
                  <div className="text-sm uppercase tracking-wide">HOURS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#94D600]">{countdown.minutes}</div>
                  <div className="text-sm uppercase tracking-wide">MINUTES</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#94D600]">{countdown.seconds}</div>
                  <div className="text-sm uppercase tracking-wide">SECONDS</div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                Race Day: October 11, 2025 at 7:55 AM
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <Badge className="bg-[#94D600] text-black hover:bg-[#7CB800] px-3 py-1">
              Marathon Training Log
            </Badge>
            <Badge className="bg-[#94D600] text-black hover:bg-[#7CB800] px-3 py-1">
              Marathon Training
            </Badge>
            <Badge className="bg-[#94D600] text-black hover:bg-[#7CB800] px-3 py-1">
              Running
            </Badge>
          </div>

          {/* Main Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#0039A6] mb-2">
              Hartford Marathon Training Log 2025
            </h1>
          </div>

          {/* 200px spacing before training entries */}
          <div style={{ height: '200px' }}></div>

          {/* Training Log Entries */}
          <div className="space-y-8">
            {parsedEntries.map((entry) => (
            <div key={entry.entryNumber} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Entry Header */}
              <div className="bg-[#0039A6] text-white px-6 py-4">
                <h2 className="text-3xl font-bold text-left" style={{ fontSize: '35px' }}>
                  {entry.title}
                </h2>
                <p className="text-xl text-gray-200 mt-1">{entry.subtitle}</p>
              </div>

              {/* Training Metrics */}
              {entry.metrics && (
                <div className="bg-gray-900 bg-opacity-70 text-white px-6 py-4">
                  <div className="flex flex-wrap gap-8">
                    {entry.metrics.distance && (
                      <div className="text-center">
                        <div className="text-white text-sm uppercase tracking-wide">Distance</div>
                        <div className="text-[#94D600] text-2xl font-bold">{entry.metrics.distance}</div>
                      </div>
                    )}
                    {entry.metrics.pace && (
                      <div className="text-center">
                        <div className="text-white text-sm uppercase tracking-wide">Pace</div>
                        <div className="text-[#94D600] text-2xl font-bold">{entry.metrics.pace}</div>
                      </div>
                    )}
                    {entry.metrics.time && (
                      <div className="text-center">
                        <div className="text-white text-sm uppercase tracking-wide">Time</div>
                        <div className="text-[#94D600] text-2xl font-bold">{entry.metrics.time}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Entry Info Bar */}
              <div className="bg-[#0039A6] bg-opacity-80 text-white px-6 py-2 text-sm">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span>Training Log Entry #{entry.entryNumber}</span>
                  <span className="text-[#94D600] font-semibold">{entry.date}</span>
                  <div className="flex items-center gap-4">
                    <span>Workout Type: <span className="text-[#94D600]">{entry.workoutType}</span></span>
                    <a 
                      href="#top" 
                      className="text-white hover:text-[#94D600] text-xs underline transition-colors border border-white/30 px-2 py-1 rounded"
                    >
                      Top
                    </a>
                  </div>
                </div>
              </div>

              {/* Entry Content */}
              <div className="bg-white p-6">
                <BlogContentRenderer content={entry.content} />
                
                {/* Images Gallery */}
                {entry.images && entry.images.length > 0 && (
                  <div className="mt-6">
                    <div className={`grid gap-4 ${
                      entry.images.length === 1 ? 'grid-cols-1' :
                      entry.images.length === 2 ? 'grid-cols-2' :
                      entry.images.length === 3 ? 'grid-cols-3' :
                      'grid-cols-2'
                    }`}>
                      {entry.images.map((image, index) => (
                        <div key={index} className="aspect-auto overflow-hidden rounded-lg shadow-lg">
                          <img 
                            src={image} 
                            alt={`Training log entry ${entry.entryNumber} image ${index + 1}`}
                            className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => {
                              // Create lightbox functionality
                              const lightbox = document.createElement('div');
                              lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
                              lightbox.onclick = () => document.body.removeChild(lightbox);
                              
                              const img = document.createElement('img');
                              img.src = image;
                              img.className = 'max-w-[95vw] max-h-[95vh] object-contain';
                              
                              lightbox.appendChild(img);
                              document.body.appendChild(lightbox);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            ))}
          </div>

          {/* Empty State */}
          {!parsedEntries || parsedEntries.length === 0 ? (
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
    </div>
  );
}