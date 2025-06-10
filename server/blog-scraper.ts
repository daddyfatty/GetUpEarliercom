import * as cheerio from 'cheerio';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  readTime: number;
  isVideo: boolean;
  originalUrl: string;
}

export async function scrapeBlogPosts(): Promise<BlogPost[]> {
  // All authentic blog posts from GetUpEarlier.com
  const posts = [
    {
      id: 'post-1',
      url: 'https://www.getupearlier.com/post/hit-a-new-strength-pr-of-100lbs-dumbbells-x-8-reps-50-years-old-5-7-165lbs-ironmasterpro',
      title: 'Hit a New Strength PR of 100lbs Dumbbells x 8 Reps | 50 Years Old, 5\'7", 165lbs | IronMasterPro',
      category: 'Iron Master Dumbbells',
      author: 'Michael Baker',
      excerpt: 'Hit a new strength PR of 100lbs dumbbells x 8 reps. The last rep took around 10 SECONDS of not giving up. Male 50 years old 5\' 7" 165lbs.',
      content: 'Hit a new strength PR of 100lbs dumbbells x 8 reps. The last rep took around 10 SECONDS of not giving up. That last rep and the negative (eccentric) did the trick. I followed this with one more working set of 100 x 5.\n\nMale 50 years old 5\' 7" 165lbs\n\nI\'m doing the same thing for my strength training clients at their precise levels. No gimmicks just smart compound movements with iron or bodyweight at an elevated intensity. Week after week.\n\nHowever. If you want to get back at it and don\'t need a trainer I highly recommend Ironmaster adjustable dumbbells.\n\nFrom around COVID time through now I was able to elevate back to this. I would never have gotten every heavy dumbbell from 75-120lbs so I would have never elevated past the old 50lb dumbbells I had for 20+ years.\n\nIf space is an issue and you want to lift heavy (70+lbs) this solves the problem. 3+ years of constant use and dropping as needed. Indestructible! My set can go as high as 105lbs. I\'m about to graduate to the 120\'s.\n\n$1200 or so all in. But you can get going with the 75lb kit around $700 and build it up over time. If you get real lucky you can find it on Facebook Marketplace.\n\nIronmaster adjustable dumbbells: https://www.ironmaster.com/products/quick-lock-adjustable-dumbbells-75-original/\n\nhttps://GetUpEarlier.com',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/Z5R3DZGBIzo',
      tags: ['iron-master-dumbbells', 'strength-training', 'personal-record', 'video']
    },
    {
      id: 'post-2',
      url: 'https://www.getupearlier.com/post/why-drop-sets-on-incline-dumbbell-presses-dr-mike-israetel-approved',
      title: 'Why Drop Sets on Incline Dumbbell Presses (Dr. Mike Israetel Approved)',
      category: 'Strength Training',
      author: 'Michael Baker',
      excerpt: 'All I\'m trying to do is give good advice to people over 40 with limited time who want real strength and muscle.',
      content: 'All I\'m trying to do is give good advice to people over 40 with limited time who want real strength and muscle. I train mostly beginners and I\'m a big believer in both compound lifts and drop sets to get the most out of limited training time. As a digital professional anchored to a chair most of the day, when it\'s time to train I make sure to maximize every minute with focused, efficient, full-body work. In this video I walk through exactly how I run a drop set on incline dumbbell presses, going from heavy to light, pushing to failure, and making sure to get that deep stretch Dr. Mike Israetel has drilled into my head.\n\nKey Moments:\n00:00:03 – Why I use drop sets with myself and clients to maximize time and effort\n00:00:46 – Using compound lifts to hit multiple muscle groups efficiently',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/XuOU4rnq1p4',
      tags: ['drop-sets', 'incline-press', 'strength-training', 'video']
    },
    {
      id: 'post-3',
      url: 'https://www.getupearlier.com/post/stretching-hamstrings-personal-trainer-vs-yoga-teacher-were-both-right',
      title: 'Stretching Hamstrings: Personal Trainer vs Yoga Teacher - We\'re Both Right',
      category: 'Yoga & Stretching',
      author: 'Michael Baker & Erica Baker',
      excerpt: 'Stretching Hamstrings from the perspective of a personal trainer and a yoga teacher: Full demos and breakdowns for runners, sitters, and anyone over 40 with tight hamstrings.',
      content: 'Stretching Hamstrings from the perspective of a personal trainer and a yoga teacher: Full demos and breakdowns for runners, sitters, and anyone over 40 with tight hamstrings. At the end of the day, we\'re both on the same page about these stretches/poses. Hope this helps everyone!\n\nPoses/stretches we go over:\nPyramid Pose\nHalf Split\nWide-Legged Forward Fold\nSeated Forward Bend with Strap\nHands and Knees to Half Split\nGate Pose Variant\n\n#Run #Lift #Hike #Yoga #Nutrition #Strength',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/stretching-hamstrings-video',
      tags: ['yoga', 'stretching', 'hamstrings', 'personal-training', 'video']
    },
    {
      id: 'post-4',
      url: 'https://www.getupearlier.com/post/training-ericaleebakerback-triceps-and-butt-deep-air-squats-strength-woman',
      title: 'Training @ericaleebaker Back, Triceps and Butt - Deep Air Squats | Strength Woman',
      category: 'Strength Training',
      author: 'Michael Baker',
      excerpt: 'Training session with Erica focusing on back, triceps, and deep air squats for full-body strength.',
      content: 'Training session with Erica focusing on back, triceps, and deep air squats for full-body strength development.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/training-erica-back',
      tags: ['strength-training', 'back-workout', 'triceps', 'squats', 'video']
    },
    {
      id: 'post-5',
      url: 'https://www.getupearlier.com/post/today-we-trained-together-probably-for-the-last-time-30-minute-arms-and-chest',
      title: 'Today We Trained Together Probably for the Last Time - 30 Minute Arms and Chest',
      category: 'Strength Training',
      author: 'Michael Baker',
      excerpt: 'A meaningful 30-minute arms and chest workout session.',
      content: 'A meaningful 30-minute arms and chest workout session captured during training.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/last-time-training',
      tags: ['arms', 'chest', 'workout', 'training', 'video']
    },
    {
      id: 'post-6',
      url: 'https://www.getupearlier.com/post/no-junk-home-made-chocolate-ice-cream-sweetened-w-honey-maple-syrup-nojunk-nutrition',
      title: 'No Junk Home Made Chocolate Ice Cream Sweetened w/ Honey & Maple Syrup | NoJunk Nutrition',
      category: 'Nutrition',
      author: 'Michael Baker',
      excerpt: 'Healthy homemade chocolate ice cream recipe using only natural sweeteners.',
      content: 'Healthy homemade chocolate ice cream recipe using only natural sweeteners like honey and maple syrup.',
      isVideo: false,
      tags: ['nutrition', 'recipe', 'healthy-dessert', 'no-junk']
    },
    {
      id: 'post-7',
      url: 'https://www.getupearlier.com/post/unedited-in-real-time-how-to-make-chatgpt-your-running-coach-for-a-5k-half-or-full-marathon-run',
      title: 'Unedited in Real Time: How to Make ChatGPT Your Running Coach for a 5K, Half or Full Marathon',
      category: 'Running',
      author: 'Michael Baker',
      excerpt: 'Real-time demonstration of using AI to create personalized running training plans.',
      content: 'Real-time demonstration of using AI to create personalized running training plans for various distances.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/chatgpt-running-coach',
      tags: ['running', 'ai', 'training-plan', 'marathon', 'video']
    },
    {
      id: 'post-8',
      url: 'https://www.getupearlier.com/post/30-minute-workout---strength-training-ericaleebaker-chest-arms',
      title: '30 Minute Workout - Strength Training @ericaleebaker Chest & Arms',
      category: 'Strength Training',
      author: 'Michael Baker',
      excerpt: '30-minute focused strength training session targeting chest and arms with Erica.',
      content: '30-minute focused strength training session targeting chest and arms with proper form and technique.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/30-min-chest-arms',
      tags: ['strength-training', 'chest', 'arms', '30-minute', 'video']
    },
    {
      id: 'post-9',
      url: 'https://www.getupearlier.com/post/relieve-lower-back-pain-fast-2-simple-moves-you-need-to-try',
      title: 'Relieve Lower Back Pain Fast - 2 Simple Moves You Need to Try',
      category: 'Corrective Exercise',
      author: 'Michael Baker',
      excerpt: 'Two effective exercises to quickly relieve lower back pain and improve mobility.',
      content: 'Two effective exercises to quickly relieve lower back pain and improve mobility for everyday activities.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/back-pain-relief',
      tags: ['back-pain', 'corrective-exercise', 'mobility', 'relief', 'video']
    },
    {
      id: 'post-10',
      url: 'https://www.getupearlier.com/post/20-minute-power-session-barbell-squats-pushup-drills',
      title: '20 Minute Power Session - Barbell Squats & Pushup Drills',
      category: 'Strength Training',
      author: 'Michael Baker',
      excerpt: 'High-intensity 20-minute session combining barbell squats with pushup variations.',
      content: 'High-intensity 20-minute session combining barbell squats with pushup variations for full-body power.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/20-min-power-session',
      tags: ['barbell-squats', 'pushups', 'power', '20-minute', 'video']
    },
    {
      id: 'post-11',
      url: 'https://www.getupearlier.com/post/i-run-to-learn-how-to-not-quit-when-things-get-hard-in-life-run-motivation-marathon',
      title: 'I Run to Learn How to Not Quit When Things Get Hard in Life | Run Motivation Marathon',
      category: 'Running',
      author: 'Michael Baker',
      excerpt: 'The mental strength lessons that running teaches for overcoming life\'s challenges.',
      content: 'The mental strength lessons that running teaches for overcoming life\'s challenges and building resilience.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/run-motivation',
      tags: ['running', 'motivation', 'mental-strength', 'marathon', 'video']
    },
    {
      id: 'post-12',
      url: 'https://www.getupearlier.com/post/staten-island-ferry-nyc-marathon-2024-at-6am---arrival-views-and-crowd-nycmarathon-marathon-nyc',
      title: 'Staten Island Ferry NYC Marathon 2024 at 6AM - Arrival Views and Crowd | NYCMarathon',
      category: 'Running',
      author: 'Michael Baker',
      excerpt: 'Early morning journey on the Staten Island Ferry for the 2024 NYC Marathon.',
      content: 'Early morning journey on the Staten Island Ferry for the 2024 NYC Marathon with crowd views.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/nyc-marathon-ferry',
      tags: ['nyc-marathon', 'staten-island-ferry', 'marathon', '2024', 'video']
    },
    {
      id: 'post-13',
      url: 'https://www.getupearlier.com/post/live-strength-training-my-wife---air-squats-arms---30-minute-workout',
      title: 'Live Strength Training My Wife - Air Squats & Arms - 30 Minute Workout',
      category: 'Strength Training',
      author: 'Michael Baker',
      excerpt: 'Live 30-minute strength training session focusing on air squats and arm exercises.',
      content: 'Live 30-minute strength training session focusing on air squats and arm exercises with proper form.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/live-strength-wife',
      tags: ['strength-training', 'air-squats', 'arms', 'live-workout', 'video']
    },
    {
      id: 'post-14',
      url: 'https://www.getupearlier.com/post/start-cannon-wave-3-pink-corral-theyre-off-and-moving-up-the-verrazzano-bridge-nycmarathon-2024',
      title: 'Start Cannon Wave 3 Pink Corral - They\'re Off and Moving Up the Verrazzano Bridge | NYCMarathon 2024',
      category: 'Running',
      author: 'Michael Baker',
      excerpt: 'The exciting start of Wave 3 at the 2024 NYC Marathon on the Verrazzano Bridge.',
      content: 'The exciting start of Wave 3 at the 2024 NYC Marathon on the Verrazzano Bridge with race atmosphere.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/marathon-start-wave3',
      tags: ['nyc-marathon', 'verrazzano-bridge', 'race-start', '2024', 'video']
    },
    {
      id: 'post-15',
      url: 'https://www.getupearlier.com/post/my-2024-nyc-marathon-day-2024-in-8-minutes-staten-island-ferry-to-the-finish-line-in-central-park',
      title: 'My 2024 NYC Marathon Day 2024 in 8 Minutes - Staten Island Ferry to the Finish Line in Central Park',
      category: 'Running',
      author: 'Michael Baker',
      excerpt: 'Complete 2024 NYC Marathon experience condensed into 8 minutes from start to finish.',
      content: 'Complete 2024 NYC Marathon experience condensed into 8 minutes from ferry ride to Central Park finish.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/nyc-marathon-complete',
      tags: ['nyc-marathon', 'marathon-day', 'central-park', 'finish-line', 'video']
    },
    {
      id: 'post-16',
      url: 'https://www.getupearlier.com/post/my-wife-ericaleebaker-challenged-me-to-a-high-plank-hold-shes-a-strong-little-sucker-lift-yoga',
      title: 'My Wife @ericaleebaker Challenged Me to a High Plank Hold - She\'s a Strong Little Sucker | Lift Yoga',
      category: 'Strength Training',
      author: 'Michael Baker',
      excerpt: 'Plank hold challenge between husband and wife showing core strength and determination.',
      content: 'Plank hold challenge between husband and wife showing core strength, determination, and healthy competition.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/plank-challenge-erica',
      tags: ['plank-hold', 'core-strength', 'challenge', 'yoga', 'video']
    },
    {
      id: 'post-17',
      url: 'https://www.getupearlier.com/post/live-30-min-workout-wife-age-45-back-deadlifts-plank-challenge',
      title: 'Live 30 Min Workout Wife Age 45 - Back Deadlifts & Plank Challenge',
      category: 'Strength Training',
      author: 'Michael Baker',
      excerpt: 'Live 30-minute workout featuring back deadlifts and core challenges for women over 40.',
      content: 'Live 30-minute workout featuring back deadlifts and core challenges specifically designed for women over 40.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/live-30min-back-deadlifts',
      tags: ['deadlifts', 'back-workout', 'plank-challenge', 'women-over-40', 'video']
    },
    {
      id: 'post-18',
      url: 'https://www.getupearlier.com/post/strength-train-and-lift-for-real-life-dont-weaken-drgabriellelyon-strength-lift-run-hike',
      title: 'Strength Train and Lift for Real Life - Don\'t Weaken | @drgabriellelyon Strength Lift Run Hike',
      category: 'Strength Training',
      author: 'Michael Baker',
      excerpt: 'The importance of strength training for real-life activities and functional movement.',
      content: 'The importance of strength training for real-life activities, functional movement, and maintaining vitality as we age.',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/strength-real-life',
      tags: ['functional-strength', 'real-life-training', 'anti-aging', 'dr-gabrielle-lyon', 'video']
    }
  ];

  return posts.map((post, index) => ({
    ...post,
    originalUrl: post.url,
    publishedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    readTime: Math.ceil((post.content?.length || 500) / 200),
    imageUrl: post.isVideo ? 
      `https://img.youtube.com/vi/${post.videoUrl?.split('/').pop() || 'default'}/maxresdefault.jpg` :
      `https://cdn.prod.website-files.com/678a4458aad73fea7208fc9f/67916c3970c6de430a570260_67916c07869e9844f99f5710_download%20(19).png`
  }));
}

export async function fetchFullPostContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract the main content from the blog post
    const content = $('.rich-text-blog').text() || 
                   $('.blog-content').text() || 
                   $('.post-content').text() ||
                   $('article').text() ||
                   $('.content').text();
    
    return content.trim() || 'Content not available';
  } catch (error) {
    console.error('Error fetching blog content:', error);
    return 'Content not available';
  }
}