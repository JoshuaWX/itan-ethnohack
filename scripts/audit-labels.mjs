import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('outputs/audit',{recursive:true});
const svg = `<svg width="1000" height="420"><rect width="100%" height="100%" fill="white"/><g font-size="38" font-family="Arial" fill="black"><text x="40" y="70">INGREDIENTS:</text><text x="40" y="135">Zingiber officinale;</text><text x="40" y="200">Psidium guajava;</text><text x="40" y="265">cinnamon</text><text x="40" y="350">Storage: keep dry</text></g></svg>`;
await sharp(Buffer.from(svg)).png().toFile('outputs/audit/label-multiline.png');
await sharp('tests/fixtures/label-0.png').rotate(15,{background:'white'}).png().toFile('outputs/audit/label-rotated.png');
await sharp('tests/fixtures/label-1.png').linear(.12,215).png().toFile('outputs/audit/label-lowcontrast.png');
await sharp({create:{width:400,height:200,channels:3,background:'white'}}).png().toFile('outputs/audit/label-blank.png');
await writeFile('outputs/audit/label-transcripts.json',JSON.stringify({
  'label-multiline.png':'INGREDIENTS:\nZingiber officinale;\nPsidium guajava;\ncinnamon\nStorage: keep dry',
  'label-rotated.png':'INGREDIENTS: hibiscus, ginger',
  'label-lowcontrast.png':'INGREDIENTS: roselle, guava',
  'label-blank.png':''
},null,2));
console.log('Four synthetic labels and known transcripts prepared; they are not real product photos.');
