import { processBlogPostAmazonLinks } from './server/amazon-auto-detection.js';

const testContent = `Fueling todays long run (13–15 miles), expected start: 7:00 AM.
Prep: Drastically lowered fat and increased low fiber carbs for 3 days (200-350g per day) while maintaining protein. Stayed within maintenance calories (2,000–2,400/day) during this carb-loading phase.

The logic behind this is to fully stock your muscle and liver glycogen so you don't "bonk" during the run. Bonking means running out of fuel, your body seizes up and performance crashes. Loading up with clean, fast digesting fuel in the days, hours, and even during the run is key to avoiding that breakdown.
A typical trained person can store around 400 to 600 grams of glycogen total, roughly 1,600 to 2,400 calories worth, split between the muscles and liver. Once depleted, performance drops rapidly unless fuel is replaced.

Glycogen is your body's stored form of carbohydrate. It's like a fuel tank made from the carbs you eat, and it's stored mainly in your muscles and liver. During exercise, your body breaks it down into glucose to power your movement, especially during long or intense efforts.
4:40 AM – Dave's Killer Berry Bagel, 2 Medjool Dates, 1 Hardboiled Egg, NUUN Electrolyte Tablet, lemon juice, 12oz water,15g Creatine, Black Coffee

6:45 AM – 1 Banana, 1 tbsp Honey, 1 Huma Plus Gel (Double Electrolytes – Chia-Based) (My gel: https://amzn.to/4jrhT6E )

Total (pre-run):
Carbohydrates: ~160g
Protein: ~14g
Fat: ~7.5g
Calories: ~730 kcal
Sodium: ~600–700mg
Potassium: ~600–700mg`;

async function testAmazonAutoDetection() {
  try {
    console.log('Testing Amazon auto-detection...');
    const processedContent = await processBlogPostAmazonLinks('carb-loading-test', testContent);
    console.log('Processed content:');
    console.log(processedContent);
  } catch (error) {
    console.error('Error testing Amazon auto-detection:', error);
  }
}

testAmazonAutoDetection();