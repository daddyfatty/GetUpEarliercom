import AlcoholCalculator from "@/components/AlcoholCalculator";

export default function AlcoholCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Alcohol Weight Gain Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Understand how your weekly alcohol consumption impacts your weight goals with our comprehensive calculator.
          </p>
        </div>
        
        <AlcoholCalculator />
      </div>
    </div>
  );
}