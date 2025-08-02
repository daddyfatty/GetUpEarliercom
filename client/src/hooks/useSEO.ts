import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { businessConfig, generateLocalBusinessSchema, generatePersonSchema, generateArticleSchema, generateRecipeSchema, generateWorkoutSchema, generateProductSchema } from '../config/seo-config';
import { useSEOContext } from '../components/SEOProvider';

interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'business.business';
  noIndex?: boolean;
  // Content-specific data
  recipe?: {
    ingredients: string[];
    instructions: string[];
    prepTime?: string;
    cookTime?: string;
    servings?: number;
    nutrition?: any;
  };
  workout?: {
    exerciseType: string;
    duration?: string;
    difficulty?: string;
    targetMuscles?: string[];
  };
  product?: {
    brand?: string;
    price?: string;
    rating?: number;
    reviewCount?: number;
    url?: string;
  };
}

const truncateDescription = (text: string, maxLength: number = 155): string => {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
};

const extractKeywords = (title: string, description: string): string[] => {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
  const words = (title + ' ' + description).toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
};

export const useSEO = (pageType: string, data: SEOData = {}) => {
  const [location] = useLocation();
  const { setSEOConfig } = useSEOContext();
  
  useEffect(() => {
    const generateSEOConfig = () => {
      let title = data.title || businessConfig.name;
      let description = data.description || businessConfig.defaultDescription;
      let structuredData: any = null;
      let keywords = data.keywords || [];
      let ogType = data.type || 'website';

      // Auto-generate keywords if not provided
      if (keywords.length === 0) {
        keywords = extractKeywords(title, description);
      }

      switch (pageType) {
        case 'homepage':
          title = `Get Up Earlier | Strength & Nutrition`;
          description = `Transform your health with professional strength training and nutrition coaching. Clean eating recipes, workout libraries, and marathon training guidance by ${businessConfig.author}.`;
          structuredData = generateLocalBusinessSchema(businessConfig);
          keywords = ['fitness coaching', 'nutrition coaching', 'strength training', 'marathon training', 'clean eating', 'supplement reviews'];
          break;

        case 'blog':
          if (data.title) {
            title = `${data.title} | ${businessConfig.author} - Get Up Earlier Strength & Nutrition`;
            description = data.description ? truncateDescription(data.description) : `${data.title} - Training and nutrition insights from ${businessConfig.author}.`;
            ogType = 'article';
            structuredData = generateArticleSchema(
              data.title,
              description,
              data.author || businessConfig.author,
              data.publishedDate || new Date().toISOString(),
              data.modifiedDate || new Date().toISOString(),
              data.image || businessConfig.defaultImage,
              `${businessConfig.baseUrl}${location}`
            );
          }
          break;

        case 'recipe':
          if (data.title && data.recipe) {
            title = `${data.title} - Healthy Recipe | Get Up Earlier Strength & Nutrition`;
            description = data.description ? truncateDescription(`Learn how to make ${data.title}. ${data.description}`) : `Healthy ${data.title} recipe by ${businessConfig.author}. Clean ingredients, detailed instructions.`;
            ogType = 'article';
            structuredData = generateRecipeSchema({
              name: data.title,
              description: description,
              ...data.recipe,
              image: data.image
            });
            keywords = ['healthy recipe', 'clean eating', 'nutrition', 'cooking', data.title.toLowerCase()];
          }
          break;

        case 'workout':
          if (data.title && data.workout) {
            title = `${data.title} - Training Workout | Get Up Earlier Strength & Nutrition`;
            description = data.description ? truncateDescription(data.description) : `${data.workout.exerciseType} workout routine by ${businessConfig.author}. Professional training guidance.`;
            ogType = 'article';
            structuredData = generateWorkoutSchema({
              name: data.title,
              description: description,
              ...data.workout
            });
            keywords = ['workout', 'training', 'fitness', 'exercise', data.workout.exerciseType.toLowerCase()];
          }
          break;

        case 'product':
          if (data.title && data.product) {
            title = `${data.title} - Supplement Review | Get Up Earlier Strength & Nutrition`;
            description = data.description ? truncateDescription(`${data.title} review by ${businessConfig.author}. ${data.description}`) : `Professional review of ${data.title}. Single ingredient supplement analysis by ${businessConfig.author}.`;
            ogType = 'article';
            structuredData = generateProductSchema({
              name: data.title,
              description: description,
              image: data.image,
              ...data.product
            });
            keywords = ['supplement review', 'nutrition', 'fitness supplements', data.title.toLowerCase()];
          }
          break;

        case 'training-log':
          if (data.title) {
            title = `${data.title} - Training Log | ${businessConfig.author}`;
            description = data.description ? truncateDescription(data.description) : `Training log entry: ${data.title}. Marathon and strength training insights from ${businessConfig.author}.`;
            ogType = 'article';
            structuredData = generateArticleSchema(
              data.title,
              description,
              businessConfig.author,
              data.publishedDate || new Date().toISOString(),
              data.modifiedDate || new Date().toISOString(),
              data.image || businessConfig.defaultImage,
              `${businessConfig.baseUrl}${location}`
            );
            keywords = ['training log', 'marathon training', 'fitness diary', 'workout tracking'];
          }
          break;

        case 'about':
          title = `About ${businessConfig.author} - Fitness Coach & Nutritionist`;
          description = `Meet ${businessConfig.author}, professional fitness coach and nutritionist specializing in marathon training, strength training, and clean eating coaching.`;
          structuredData = generatePersonSchema(businessConfig.author, businessConfig.baseUrl);
          keywords = ['fitness coach', 'nutritionist', 'marathon training', 'personal trainer'];
          break;

        case 'amazon':
          title = `Recommended Supplements & Products | Get Up Earlier Strength & Nutrition`;
          description = `Curated collection of single-ingredient supplements and fitness products recommended by ${businessConfig.author}. Clean, research-backed nutrition products.`;
          keywords = ['supplements', 'fitness products', 'nutrition', 'single ingredient', 'clean eating'];
          break;
      }

      return {
        title,
        description,
        canonical: location,
        ogImage: data.image || businessConfig.defaultImage,
        ogType,
        keywords: Array.from(new Set([...keywords, 'fitness', 'nutrition', 'training'])), // Add base keywords
        structuredData,
        noIndex: data.noIndex || false,
        author: data.author || businessConfig.author,
        publishedTime: data.publishedDate,
        modifiedTime: data.modifiedDate
      };
    };

    const seoConfig = generateSEOConfig();
    setSEOConfig(seoConfig);
    
  }, [pageType, location, setSEOConfig, data.title, data.description, data.author]);

  return null; // This hook primarily handles side effects
};