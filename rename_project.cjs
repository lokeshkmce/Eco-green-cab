const fs = require('fs');
const path = require('path');

const dir = 'd:\\New folder\\eco-green-cab';
const exts = ['.jsx', '.html', '.css', '.json'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      if (exts.includes(path.extname(file))) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/ieco Green Cab/g, 'I Eco Green Cab');
  content = content.replace(/ieco Green Support Reply/g, 'I Eco Green Support Reply');
  content = content.replace(/ieco%20Green%20Cab/g, 'I%20Eco%20Green%20Cab');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
