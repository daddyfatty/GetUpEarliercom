interface BusinessInfo {
  name: string;
  baseUrl: string;
  defaultDescription: string;
  defaultImage: string;
  author: string;
  locations: string[];
  services: string[];
  phone?: string;
  email?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

export const businessConfig: BusinessInfo = {
  name: "Get Up Earlier Strength & Nutrition",
  baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
  defaultDescription: "Professional strength training and nutrition coaching for endurance athletes. Clean eating recipes, workout libraries, and accountability coaching by Michael Baker.",
  defaultImage: "/attached_assets/single-ingredient-supplements.png",
  author: "Michael Baker",
  locations: ["Online", "Connecticut"],
  services: [
    "Personal Training",
    "Nutrition Coaching", 
    "Marathon Training",
    "Strength Training",
    "Clean Eating Recipes",
    "Supplement Reviews"
  ],
  socialMedia: {
    youtube: "https://youtube.com/@getupearlier"
  }
};

export const generateLocalBusinessSchema = (businessInfo: BusinessInfo) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${businessInfo.baseUrl}#business`,
  "name": businessInfo.name,
  "url": businessInfo.baseUrl,
  "description": businessInfo.defaultDescription,
  "founder": {
    "@type": "Person",
    "name": businessInfo.author,
    "url": `${businessInfo.baseUrl}/about`
  },
  "serviceArea": businessInfo.locations,
  "knowsAbout": businessInfo.services,
  "sameAs": businessInfo.socialMedia ? Object.values(businessInfo.socialMedia).filter(Boolean) : []
});

export const generatePersonSchema = (author: string, baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${baseUrl}/about#person`,
  "name": author,
  "url": `${baseUrl}/about`,
  "jobTitle": "Fitness Coach & Nutritionist",
  "worksFor": {
    "@type": "Organization",
    "name": "Get Up Earlier Strength & Nutrition",
    "url": baseUrl
  },
  "knowsAbout": [
    "Marathon Training",
    "Strength Training", 
    "Nutrition Coaching",
    "Clean Eating",
    "Supplement Analysis"
  ]
});

export const generateArticleSchema = (
  title: string,
  description: string,
  author: string,
  publishedDate: string,
  modifiedDate: string,
  imageUrl: string,
  url: string
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "author": {
    "@type": "Person",
    "name": author,
    "url": `${businessConfig.baseUrl}/about`
  },
  "publisher": {
    "@type": "Organization",
    "name": businessConfig.name,
    "url": businessConfig.baseUrl
  },
  "datePublished": publishedDate,
  "dateModified": modifiedDate,
  "image": imageUrl,
  "url": url,
  "mainEntityOfPage": url
});

export const generateRecipeSchema = (recipe: {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  nutrition?: any;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": recipe.name,
  "description": recipe.description,
  "author": {
    "@type": "Person",
    "name": businessConfig.author,
    "url": `${businessConfig.baseUrl}/about`
  },
  "recipeIngredient": recipe.ingredients,
  "recipeInstructions": recipe.instructions.map(instruction => ({
    "@type": "HowToStep",
    "text": instruction
  })),
  "prepTime": recipe.prepTime,
  "cookTime": recipe.cookTime,
  "recipeYield": recipe.servings,
  "nutrition": recipe.nutrition,
  "image": recipe.image
});

export const generateWorkoutSchema = (workout: {
  name: string;
  description: string;
  exerciseType: string;
  duration?: string;
  difficulty?: string;
  targetMuscles?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "ExercisePlan",
  "name": workout.name,
  "description": workout.description,
  "exerciseType": workout.exerciseType,
  "author": {
    "@type": "Person",
    "name": businessConfig.author,
    "url": `${businessConfig.baseUrl}/about`
  },
  "duration": workout.duration,
  "difficulty": workout.difficulty,
  "targetMuscles": workout.targetMuscles
});

export const generateProductSchema = (product: {
  name: string;
  description: string;
  brand?: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  url?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "brand": product.brand,
  "image": product.image,
  "url": product.url,
  "offers": {
    "@type": "Offer",
    "price": product.price?.replace('$', ''),
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": product.url
  },
  "aggregateRating": product.rating ? {
    "@type": "AggregateRating",
    "ratingValue": product.rating,
    "reviewCount": product.reviewCount || 1
  } : undefined
});