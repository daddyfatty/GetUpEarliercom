import personalTrainerBadge from "@assets/67910d333568168655f4b0e8_Badges-PT (1) (1)_1750689834268.png";
import nutritionBadge from "@assets/67910ddf1426fe137b7a5cfa_HCTP_INHC_Badge (1)_1750689834268.png";
import runningCoachBadge from "@assets/67910e09c2597e3ff6174ecb_Badges-run-coach (1) (1)_1750689834268.png";
import eryBadge1 from "@assets/download - 2025-06-23T104234.203_1750689834267.png";
import eryBadge2 from "@assets/download - 2025-06-23T104237.082_1750689834267.png";
import ericaYogaBadge from "@assets/download - 2025-06-23T104304.623_1750689834267.png";

export function CredentialsBand() {
  const credentials = [
    { src: personalTrainerBadge, alt: "ISSA Personal Trainer Certified", name: "Personal Trainer" },
    { src: nutritionBadge, alt: "Integrative Nutrition Health Coach", name: "Nutrition Coach" },
    { src: runningCoachBadge, alt: "ISSA Running Coach Certified", name: "Running Coach" },
    { src: eryBadge1, alt: "E-RYT 200 Yoga Teacher", name: "E-RYT 200" },
    { src: eryBadge2, alt: "E-RYT 200 Yoga Alliance", name: "Yoga Alliance" },
    { src: ericaYogaBadge, alt: "Erica Lee Baker Yoga", name: "Specialized Training" },
  ];

  // Duplicate the credentials array to create seamless loop
  const duplicatedCredentials = [...credentials, ...credentials];

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Professional Credentials
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Certified by leading industry organizations
          </p>
        </div>
        
        <div className="relative">
          {/* Moving credentials band */}
          <div className="flex animate-scroll-infinite">
            {duplicatedCredentials.map((credential, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 group"
                style={{ minWidth: '120px' }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 border border-gray-200 dark:border-gray-700">
                  <img
                    src={credential.src}
                    alt={credential.alt}
                    className="h-16 w-auto mx-auto object-contain filter group-hover:brightness-110 transition-all duration-300"
                    loading="lazy"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2 font-medium">
                    {credential.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}