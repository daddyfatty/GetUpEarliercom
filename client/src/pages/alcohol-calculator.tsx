import AlcoholCalculator from "@/components/AlcoholCalculator";
import { Beer, Wine } from "lucide-react";

export default function AlcoholCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Beer className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Alcohol Weight Impact Calculator
            </h1>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Wine className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analyze how your weekly alcohol consumption affects your weight goals with comprehensive metabolic impact calculations and personalized recommendations
          </p>
        </div>
        
        <AlcoholCalculator />
      </div>
    </div>
  );
}