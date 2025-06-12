import https from 'https';

function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Fetching recipes from deployed site...');
    const recipes = await fetchData('https://get-up-earlier-mbakerbakermedi.replit.app/api/recipes');
    console.log('RECIPES:', JSON.stringify(recipes, null, 2));
    
    console.log('\nFetching workouts from deployed site...');
    const workouts = await fetchData('https://get-up-earlier-mbakerbakermedi.replit.app/api/workouts');
    console.log('WORKOUTS:', JSON.stringify(workouts, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();