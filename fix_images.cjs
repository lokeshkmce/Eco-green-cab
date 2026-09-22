const fs = require('fs');
const content = fs.readFileSync('src/data/cars.jsx', 'utf8');

const localImages = [
  '/images/cars/car_1_tata_tiago_ev.jpg',
  '/images/cars/car_2_mg_comet_ev.jpg',
  '/images/cars/car_3_tata_punch_ev.jpg',
  '/images/cars/car_4_tata_nexon_ev.jpg',
  '/images/cars/car_5_tata_tigor_ev.jpg',
  '/images/cars/car_6_mg_windsor_ev.jpg',
  '/images/cars/car_7_mahindra_xuv400_ev.jpg',
  '/images/cars/car_8_hyundai_creta_electric.jpg',
  '/images/cars/car_9_maruti_e_vitara.jpg',
  '/images/cars/car_10_tata_curvv_ev.jpg',
];

let imgIndex = 0;

let newContent = content.replace(/image:\s*"(http[^"]+)"/g, () => {
  const replacement = localImages[imgIndex % localImages.length];
  imgIndex++;
  return `image: "${replacement}"`;
});

newContent = newContent.replace(/"(http[^"]+)"/g, (match, url) => {
    // Only replace image URLs (jpeg, jpg, png, webp) to avoid replacing external avatar URLs
    if (url.includes('aeplcdn.com')) {
        const replacement = localImages[Math.floor(Math.random() * localImages.length)];
        return `"${replacement}"`;
    }
    return match;
});

fs.writeFileSync('src/data/cars.jsx', newContent);
console.log('Images fixed!');
