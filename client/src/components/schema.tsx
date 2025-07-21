import { Helmet } from "react-helmet-async";

interface SchemaProps {
  type: 'website' | 'calculator' | 'blog' | 'service' | 'organization' | 'person';
  data: any;
}

export function Schema({ type, data }: SchemaProps) {
  const generateSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case 'calculator':
        return {
          ...baseSchema,
          "@type": "SoftwareApplication",
          "name": data.name,
          "description": data.description,
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "url": data.url,
          "author": {
            "@type": "Person",
            "name": "Michael Baker",
            "url": "https://www.getupearlier.com/about"
          },
          "provider": {
            "@type": "Organization",
            "name": "Get Up Earlier Strength & Nutrition Coaching",
            "url": "https://www.getupearlier.com"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };

      case 'service':
        return {
          ...baseSchema,
          "@type": "Service",
          "name": data.name,
          "description": data.description,
          "provider": {
            "@type": "Person",
            "name": "Michael Baker",
            "jobTitle": "Personal Trainer & Nutrition Coach",
            "url": "https://www.getupearlier.com/about",
            "sameAs": [
              "https://www.facebook.com/groups/getupearliergroup",
              "https://www.youtube.com/@GetUpEarlierFitness"
            ]
          },
          "areaServed": {
            "@type": "Place",
            "name": "Orange, Connecticut and Virtual Worldwide"
          },
          "serviceType": data.serviceType || "Fitness and Nutrition Coaching",
          "url": data.url
        };

      case 'organization':
        return {
          ...baseSchema,
          "@type": "LocalBusiness",
          "name": "Get Up Earlier Strength & Nutrition Coaching",
          "description": "Personal training, nutrition coaching, and accountability services to help you build strength, healthy habits, and achieve your fitness goals.",
          "url": "https://www.getupearlier.com",
          "logo": "https://www.getupearlier.com/og-image.jpg",
          "image": "https://www.getupearlier.com/og-image.jpg",
          "founder": {
            "@type": "Person",
            "name": "Michael Baker",
            "jobTitle": "Personal Trainer & Nutrition Coach"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Orange",
            "addressRegion": "CT",
            "addressCountry": "US"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "English"
          },
          "sameAs": [
            "https://www.facebook.com/groups/getupearliergroup",
            "https://www.youtube.com/@GetUpEarlierFitness"
          ],
          "serviceArea": {
            "@type": "Place",
            "name": "Orange, Connecticut and Virtual Worldwide"
          },
          "priceRange": "$$$"
        };

      case 'person':
        return {
          ...baseSchema,
          "@type": "Person",
          "name": data.name || "Michael Baker",
          "jobTitle": "Personal Trainer & Nutrition Coach",
          "description": data.description || "Certified personal trainer and nutrition coach specializing in strength training, marathon coaching, and healthy habit formation.",
          "url": "https://www.getupearlier.com/about",
          "image": "https://www.getupearlier.com/images/michael-baker-photo.png",
          "worksFor": {
            "@type": "Organization",
            "name": "Get Up Earlier Strength & Nutrition Coaching"
          },
          "knowsAbout": [
            "Personal Training",
            "Nutrition Coaching", 
            "Marathon Training",
            "Strength Training",
            "Accountability Coaching",
            "Healthy Habits"
          ],
          "sameAs": [
            "https://www.facebook.com/groups/getupearliergroup",
            "https://www.youtube.com/@GetUpEarlierFitness"
          ]
        };

      case 'blog':
        return {
          ...baseSchema,
          "@type": "BlogPosting",
          "headline": data.headline,
          "description": data.description,
          "author": {
            "@type": "Person",
            "name": "Michael Baker",
            "url": "https://www.getupearlier.com/about"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Get Up Earlier Strength & Nutrition Coaching",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.getupearlier.com/og-image.jpg"
            }
          },
          "datePublished": data.datePublished,
          "dateModified": data.dateModified || data.datePublished,
          "image": data.image,
          "url": data.url,
          "mainEntityOfPage": data.url,
          "articleSection": data.category || "Health & Fitness"
        };

      case 'website':
      default:
        return {
          ...baseSchema,
          "@type": "WebSite",
          "name": data.name || "Get Up Earlier Strength & Nutrition Coaching",
          "description": data.description || "Personal training, nutrition coaching, and accountability services to help you build strength, healthy habits, and achieve your fitness goals.",
          "url": data.url || "https://www.getupearlier.com",
          "publisher": {
            "@type": "Organization",
            "name": "Get Up Earlier Strength & Nutrition Coaching"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.getupearlier.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
    }
  };

  const schema = generateSchema();

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
}