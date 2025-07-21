import AlcoholCalculator from "@/components/AlcoholCalculator";
import { Beer, Wine } from "lucide-react";
import { SEO } from "@/components/seo";
import { Schema } from "@/components/schema";

export default function AlcoholCalculatorPage() {
  return (
    <>
      <SEO 
        title="Buzzkill Calculator | Alcohol Weight Gain Calculator"
        description="Discover the hidden weight gain impact of your daily beer and wine habits. This eye-opening calculator reveals how alcohol calories accumulate over time and affect your fitness progress."
        keywords="alcohol calculator, beer calories, wine calories, weight gain calculator, alcohol weight gain, fitness calculator, drinking habits, calorie tracking"
        image="/buzzkill-calc.png"
        url="/alcohol-calculator"
      />
      <Schema 
        type="calculator"
        data={{
          name: "Buzzkill Calculator - Alcohol Weight Gain Impact",
          description: "Calculate how daily beer and wine consumption affects your weight gain. Interactive alcohol calorie calculator shows the impact of habitual drinking on your fitness goals.",
          url: "https://www.getupearlier.com/alcohol-calculator"
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Beer className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
                Alcohol Weight Gain Calculator
              </h1>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Wine className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BUZZKILL CALCULATOR
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Analyze how habitual alcohol consumption can affect your weight</p>
        </div>
        
        <AlcoholCalculator />
      </div>
    </div>
    </>
  );
}