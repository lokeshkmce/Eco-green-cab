import fs from 'fs';
import path from 'path';

const carModels = [
  "Tata Tiago EV",
  "Tata Punch EV",
  "Tata Nexon EV",
  "Tata Tigor EV",
  "MG Comet EV",
  "MG Windsor EV",
  "Hyundai Creta",
  "Mahindra XUV400",
  "Maruti Suzuki eVX",
  "Tata Curvv",
  "Tata Harrier",
  "Tata Sierra",
  "Mahindra BE",
  "Mahindra XEV",
  "Hyundai Ioniq 5",
  "Kia EV6",
  "BYD Atto 3",
  "BYD Sealion 7",
  "Kia EV9",
  "BYD eMax 7",
  "Mercedes-Benz EQB",
  "BMW iX",
  "Volvo EX40"
];

async function getWikipediaImage(query) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=1`;
    const searchRes = await fetch(searchUrl).then(res => res.json());
    if (searchRes.query.search.length > 0) {
      const title = searchRes.query.search[0].title;
      const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`;
      const pageRes = await fetch(pageUrl).then(res => res.json());
      const pages = pageRes.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pages[pageId].thumbnail) {
        return pages[pageId].thumbnail.source;
      }
    }
  } catch (e) {
    console.error("Error fetching for", query, e.message);
  }
  return null;
}

async function run() {
  const images = {};
  for (const car of carModels) {
    const img = await getWikipediaImage(car);
    console.log(`Car: ${car} -> Img: ${img}`);
    images[car] = img;
  }
  fs.writeFileSync('images_map.json', JSON.stringify(images, null, 2));
}

run();
