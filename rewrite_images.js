import fs from 'fs';

let content = fs.readFileSync('src/data/cars.js', 'utf-8');

const bingImage = (query) => `https://tse1.mm.bing.net/th?q=${encodeURIComponent(query)}&w=800&h=500&c=7`;

// We'll replace the image and gallery arrays.
// Regex to match image: "..."
// But it's easier to just match by object name if possible, or use a function.
// Let's replace line by line, detecting the current car name.

let lines = content.split('\n');
let currentCar = "";

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  let nameMatch = line.match(/name:\s*"([^"]+)"/);
  if (nameMatch) {
    currentCar = nameMatch[1];
  }
  
  if (line.includes('image: "https://images.unsplash.com')) {
    let newImg = bingImage(currentCar + ' electric car india');
    lines[i] = line.replace(/"https:\/\/images\.unsplash\.com[^"]+"/, `"${newImg}"`);
  }
  
  if (line.includes('"https://images.unsplash.com') && line.trim().startsWith('"')) {
    let newImg = bingImage(currentCar + ' electric car india auto');
    lines[i] = line.replace(/"https:\/\/images\.unsplash\.com[^"]+"/, `"${newImg}"`);
  }
}

fs.writeFileSync('src/data/cars.js', lines.join('\n'));
console.log('Done rewriting images');
