import AlcoholCalculator from "@/components/AlcoholCalculator";
import { Beer, Wine } from "lucide-react";
import { SEO } from "@/components/seo";
import { Schema } from "@/components/schema";

export default function AlcoholCalculatorPage() {
  return (
    <>
      <SEO 
        title="Buzzkill | Beer and Wine Weight Gain Calculator"
        description="Calculate how daily beer and wine consumption affects your weight gain. Interactive alcohol calorie calculator shows the impact of habitual drinking on your fitness goals."
        keywords="alcohol calculator, beer calories, wine calories, weight gain calculator, alcohol weight gain, fitness calculator, drinking habits, calorie tracking"
        image="/buzzkill-calculator-og-image.png"
        url="/alcohol-calculator"
      />
      <Schema 
        type="calculator"
        data={{
          name: "Buzzkill - Beer and Wine Weight Gain Calculator",
          description: "Calculate how daily beer and wine consumption affects your weight gain. Interactive alcohol calorie calculator shows the impact of habitual drinking on your fitness goals.",
          url: "https://www.getupearlier.com/alcohol-calculator"
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Beer className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Buzzkill Calculator
            </h1>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Wine className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Analyze how habitual alcohol consumption can affect your weight</p>
        </div>
        
        <AlcoholCalculator />
      </div>
    </div>
    </>
  );
}