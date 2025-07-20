import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar, Edit, Play, Expand } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { BlogContentRenderer } from "@/components/blog-content-renderer";
import { SEO } from "@/components/seo";

import MarathonCountdown from "@/components/marathon-countdown";
import { useState, useEffect } from "react";



interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  categories?: string[];
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  readTime: number;
  isVideo: boolean;
  originalUrl: string;
}

interface TrainingLogEntry {
  id: string;
  slug: string;
  entryNumber: number;
  date: string;
  title: string;
  content: string;
  distance?: string;
  pace?: string;
  time?: string;
  images?: string[];
  categories?: string[];
  strava_data?: any;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string>("");


  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog/slug", slug],
    queryFn: async () => {
      // First try to fetch as a blog post
      let response = await fetch(`/api/blog/slug/${slug}`);
      if (response.ok) {
        return response.json();
      }
      
      // If not found as blog post, try as training log entry
      response = await fetch(`/api/training-log/slug/${slug}`);
      if (response.ok) {
        const trainingEntry = await response.json();
        // Convert training log entry to blog post format
        return {
          id: trainingEntry.id,
          slug: trainingEntry.slug,
          title: trainingEntry.title,
          excerpt: `Training Log Entry #${trainingEntry.entryNumber} - ${trainingEntry.date}`,
          content: trainingEntry.content,
          author: "Michael Baker",
          publishedDate: trainingEntry.date,
          category: "Marathon Training Log",
          categories: trainingEntry.categories || [],
          tags: trainingEntry.categories || [],
          imageUrl: trainingEntry.images && trainingEntry.images.length > 0 ? trainingEntry.images[0] : undefined,
          videoUrl: null,
          readTime: Math.max(1, Math.ceil((trainingEntry.content?.length || 0) / 200)),
          isVideo: false,
          originalUrl: ""
        };
      }
      
      throw new Error('Blog post not found');
    },
    enabled: !!slug
  });

  // Check if this is a training log entry by looking for training log categories
  const isTrainingLogEntry = post?.categories?.some(cat => 
    cat.includes('Marathon Training Log') || cat.includes('Training Log')
  );

  // Try to fetch training log data if this is a training log entry
  const { data: trainingLogEntry } = useQuery<TrainingLogEntry>({
    queryKey: ["/api/training-log/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/training-log/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Training log entry not found');
      }
      return response.json();
    },
    enabled: !!slug && isTrainingLogEntry
  });

  // Fetch all training log entries for the main training log page
  const { data: allTrainingLogEntries } = useQuery<TrainingLogEntry[]>({
    queryKey: ["/api/training-log"],
    queryFn: async () => {
      const response = await fetch(`/api/training-log`);
      if (!response.ok) {
        throw new Error('Failed to fetch training log entries');
      }
      return response.json();
    },
    enabled: isTrainingLogEntry
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTrainingDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Blog post not found.</p>
            <Link href="/blog">
              <Button className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }



  // Training Log Template
  if (isTrainingLogEntry && allTrainingLogEntries) {
    // Parse the JSON content to get individual entries
    const mainTrainingLog = allTrainingLogEntries.find(entry => entry.slug === 'hartford-marathon-training-log-2025');
    let parsedEntries = [];
    
    if (mainTrainingLog && mainTrainingLog.content) {
      try {
        const contentData = JSON.parse(mainTrainingLog.content);
        parsedEntries = contentData.entries || [];
      } catch (error) {
        console.error('Error parsing training log content:', error);
        parsedEntries = [];
      }
    }
    
    // Sort entries by entry number (newest first)
    const sortedEntries = [...parsedEntries].sort((a, b) => b.entryNumber - a.entryNumber);

    const getEntryTitle = (entry: any) => {
      return entry.title || `"ENTRY ${entry.entryNumber}"`;
    };

    const getEntrySubtitle = (entry: any) => {
      return entry.subtitle || `-Training Entry #${entry.entryNumber}`;
    };

    const getWorkoutType = (entry: any) => {
      return entry.workoutType || 'Training';
    };

    const isRunEntry = (entry: any) => {
      // Check if the entry has metrics (distance, pace, time)
      return entry.metrics && (entry.metrics.distance || entry.metrics.pace || entry.metrics.time);
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0039A6] via-[#0039A6] to-[#0039A6] text-white">
        <SEO 
          title="Hartford Marathon Training Log 2025 - Get Up Earlier"
          description="Follow Michael Baker's comprehensive Hartford Marathon training journey with detailed workout logs, nutrition insights, and race preparation strategies."
          keywords="Hartford Marathon training, marathon training log, running, Michael Baker, training diary, race preparation"
          url={`/blog/${slug}`}
          image="/hartford-marathon-featured-image.jpg"
          type="article"
          canonical={`https://www.getupearlier.com/blog/${slug}`}
        />
        {/* Featured Image with Countdown Overlay */}
        <div className="w-full mb-6 relative">
          <img 
            src="/hartford-marathon-featured-image.jpg" 
            alt="Hartford Marathon 2024 Start Line" 
            className="w-full h-auto object-cover"
            style={{ maxHeight: '400px' }}
          />
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          {/* Marathon Countdown Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl px-4">
              <MarathonCountdown />
            </div>
          </div>
        </div>
        
        {/* Training Log Header */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-4">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {post.categories?.map((category) => (
                  <Link key={category} href={`/category/${encodeURIComponent(category)}`}>
                    <Badge variant="outline" className="text-xs bg-[#94D600] text-[#0039A6] border-[#94D600] hover:bg-[#94D600]/80 hover:border-[#94D600]/80 cursor-pointer transition-colors font-semibold">
                      {category}
                    </Badge>
                  </Link>
                ))}
              </div>
              
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight text-[#94D600]">
                Hartford Marathon Training Log 2025
              </h1>
            </div>
          </div>
        </div>
        {/* Training Log Entries */}
        <div className="container mx-auto px-4" style={{ paddingTop: '0px', paddingBottom: '25px' }}>
          <div className="max-w-4xl mx-auto space-y-12">
            {sortedEntries.map((entry, index) => (
              <div key={entry.entryNumber}>
                {/* Entry Header */}
                <div className="text-left mb-2">
                  <div className="text-[35px] font-bold text-white mb-2">
                    {getEntryTitle(entry)}
                  </div>
                </div>
                
                {/* Training Metrics - Only show for actual run entries */}
                {isRunEntry(entry) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black bg-opacity-30 rounded-lg p-6" style={{ marginBottom: '25px' }}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#94D600]">{entry.metrics?.distance || 'N/A'}</div>
                      <div className="text-sm text-gray-300">Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#94D600]">{entry.metrics?.pace || 'N/A'}</div>
                      <div className="text-sm text-gray-300">Pace</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#94D600]">{entry.metrics?.time || 'N/A'}</div>
                      <div className="text-sm text-gray-300">Time</div>
                    </div>
                  </div>
                )}
                
                {/* Entry Info Bar */}
                <div className="flex justify-between items-center text-sm text-gray-300 mb-6">
                  <div>Training Log Entry #{entry.entryNumber}</div>
                  <div className="text-[#94D600]">{entry.date}</div>
                  <div>Workout Type: <span className="text-[#94D600]">{getWorkoutType(entry)}</span></div>
                </div>
                
                

                {/* Entry Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-6">
                    <BlogContentRenderer 
                      content={entry.content} 
                      onImageClick={(imageSrc) => {
                        setLightboxImage(imageSrc);
                        setLightboxOpen(true);
                      }} 
                    />
                    
                    {/* Render YouTube video if available */}
                    {entry.videoUrl && (
                      <div className="mt-6">
                        <div className="aspect-video">
                          <iframe
                            src={entry.videoUrl.replace('https://youtu.be/', 'https://www.youtube.com/embed/').split('?')[0]}
                            title="Training Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Images - Full stretch to fill space */}
                  {entry.images && entry.images.length > 0 && (
                    <div className="mt-6 -mx-6 -mb-6 px-0 pb-6">
                      {entry.images.length === 1 ? (
                        // Single image - full bleed width with left padding
                        <div 
                          className="cursor-pointer hover:shadow-xl transition-shadow group relative w-full"
                          onClick={() => {
                            setLightboxImage(entry.images[0]);
                            setLightboxOpen(true);
                          }}
                        >
                          <img
                            src={entry.images[0]}
                            alt="Training log photo"
                            className="w-full h-auto object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                      ) : (
                        // Multiple images - single column full width
                        <div className="flex flex-col gap-4 w-full">
                          {entry.images.map((imageSrc: string, imgIndex: number) => (
                            <div 
                              key={imgIndex}
                              className="cursor-pointer hover:shadow-xl transition-all duration-300 group relative break-inside-avoid mb-4"
                              onClick={() => {
                                setLightboxImage(imageSrc);
                                setLightboxOpen(true);
                              }}
                            >
                              <img
                                src={imageSrc}
                                alt={`Training log photo ${imgIndex + 1}`}
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
                </div>

                {/* Separator between entries (not after the last one) */}
                {index < sortedEntries.length - 1 && (
                  <div className="my-12">
                    <hr className="border-[#94D600] border-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-2" onClick={() => setLightboxOpen(false)}>
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxImage}
                alt="Training log photo"
                className="max-w-full max-h-full object-contain"
                style={{ maxWidth: '95vw', maxHeight: '95vh' }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-black hover:bg-opacity-50"
                onClick={() => setLightboxOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        )}
        

      </div>
    );
  }

  // Regular Blog Post Template
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO 
        title={`${post.title} - Get Up Earlier Blog`}
        description={post.excerpt || post.content.substring(0, 160)}
        keywords={`${post.categories?.join(', ')}, ${post.category}, fitness, nutrition, training, Michael Baker`}
        url={`/blog/${slug}`}
        image={post.imageUrl || "/og-image.jpg"}
        type="article"
        canonical={`https://www.getupearlier.com/blog/${slug}`}
      />
      {/* Full-width Hero Gradient Header Section - No gaps */}
      <HeroGradient className="text-white">
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {post.categories && post.categories.length > 0 ? (
                post.categories.map((category) => (
                  <Link key={category} href={`/category/${encodeURIComponent(category)}`}>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 cursor-pointer transition-colors">
                      {category}
                    </Badge>
                  </Link>
                ))
              ) : (
                post.category && (
                  post.category.split(',').map((category) => (
                    <Link key={category.trim()} href={`/category/${encodeURIComponent(category.trim())}`}>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 cursor-pointer transition-colors">
                        {category.trim()}
                      </Badge>
                    </Link>
                  ))
                )
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight max-w-4xl mx-auto">
              {post.title === "Why drop sets on incline dumbbell presses (@dr.mike.israetel approved)" 
                ? "Why Drop Sets on Incline Dumbbell Presses - Dr. Mike Israetel approved? ‪@RenaissancePeriodization"
                : post.title}
            </h1>
            
            {/* Author Block with Photo - Clickable */}
            <Link href="/about" className="flex flex-col items-center space-y-4 mt-8 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-300 bg-white">
                <img 
                  src="/attached_assets/NoterxtyAI-Wintrer-Runner3_1751625255284.png" 
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white mb-2">
                  {post.author}
                </div>
              </div>
            </Link>
            
            {/* Post Meta */}
            <div className="flex items-center justify-center space-x-4 text-blue-100 mt-6 text-sm">
              <span>{formatDate(post.publishedDate)}</span>
              {post.isVideo && (
                <>
                  <span>•</span>
                  <span>Video Content</span>
                </>
              )}
            </div>
          </div>
        </div>
      </HeroGradient>
      <div className="container mx-auto px-4 py-8">


        {/* Article Content Container */}
        <article className="max-w-4xl mx-auto">

          {/* Image Gallery Section - Only for Marathon Training post */}
          {post.id === 'marathon-training-tip-hot-long-runs-frozen-electrolyte-bottle' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image 1 - Running shoes */}
                <div 
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative bg-gray-100 dark:bg-gray-700"
                  onClick={() => {
                    setLightboxImage("/attached_assets/download - 2025-07-05T124857.113_1751734734091.png");
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src="/attached_assets/download - 2025-07-05T124857.113_1751734734091.png"
                    alt="Running shoes and hydration gear"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>

                {/* Image 2 - Fitly bottle and supplements */}
                <div 
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative bg-gray-100 dark:bg-gray-700"
                  onClick={() => {
                    setLightboxImage("/attached_assets/20250702_065601_1751734734092.jpg");
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src="/attached_assets/20250702_065601_1751734734092.jpg"
                    alt="Fitly bottle with nutrition supplements"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>

                {/* Image 3 - Fitly bottle in freezer */}
                <div 
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative bg-gray-100 dark:bg-gray-700"
                  onClick={() => {
                    setLightboxImage("/attached_assets/20250702_065853_1751734734092.jpg");
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src="/attached_assets/20250702_065853_1751734734092.jpg"
                    alt="Fitly bottle stored in freezer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Video Section */}
          {post.isVideo && post.videoUrl && (
            <div className="mb-8">
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={post.videoUrl}
                  title={post.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          )}

          {/* Featured Image Section - Show for non-video posts */}
          {!post.isVideo && post.imageUrl && (
            <div className="mb-8">
              <div 
                className="w-full bg-black rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow group relative"
                onClick={() => {
                  setLightboxImage(post.imageUrl!);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '600px' }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <BlogContentRenderer 
                content={post.content} 
                onImageClick={(imageSrc) => {
                  setLightboxImage(imageSrc);
                  setLightboxOpen(true);
                }} 
              />
            </div>
          </div>



          {/* Categories - Clickable */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {post.categories && post.categories.length > 1 ? 'Categories' : 'Category'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* Show all categories from the categories array if it exists, otherwise show the primary category */}
              {post.categories && post.categories.length > 0 ? (
                // Show all categories
                (post.categories.map((category, index) => (
                  <Link key={category} href={`/category/${encodeURIComponent(category)}`}>
                    <Badge 
                      variant="outline" 
                      className={`text-sm cursor-pointer transition-colors ${
                        index === 0 || category === post.category
                          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {category}
                    </Badge>
                  </Link>
                )))
              ) : (
                // Fallback to primary category only
                (post.category && (<Link href={`/category/${encodeURIComponent(post.category)}`}>
                  <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 cursor-pointer transition-colors">
                    {post.category}
                  </Badge>
                </Link>))
              )}
            </div>
          </div>

          {/* Author Bio - Clickable */}
          <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Link href="/about" className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
                <img 
                  src="/attached_assets/NoterxtyAI-Wintrer-Runner3_1751625255284.png" 
                  alt="Michael Baker"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{post.author}</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Bridging the gap from inactivity and poor diet to strength and healthy habits
                </p>
              </div>
            </Link>
          </div>
        </article>
      </div>
      {/* Lightbox Modal */}
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
              alt={post.title}
              className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      

    </div>
  );
}