const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrl = 'https://m.media-amazon.com/images/I/71GRhKXXjFL._AC_SX679_.jpg';
const outputPath = path.join(__dirname, '../attached_assets/amazon_B06XS38TDV_terrasoul_pea_protein.jpg');

// Download with proper headers
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

https.get(imageUrl, options, (response) => {
  if (response.statusCode === 200) {
    const fileStream = fs.createWriteStream(outputPath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log('Image downloaded successfully to:', outputPath);
      console.log('File size:', fs.statSync(outputPath).size, 'bytes');
    });
  } else {
    console.error('Failed to download. Status code:', response.statusCode);
  }
}).on('error', (err) => {
  console.error('Download error:', err);
});