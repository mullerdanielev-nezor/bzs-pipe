const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'images', 'site', 'referencia', 'manifest.json'), 'utf8'));

function catSection(cat) {
  let items = '';
  for (let i = 1; i <= cat.count; i++) {
    const n = String(i).padStart(2, '0');
    const file = `${cat.key}-${n}.jpg`;
    const fileWebp = `${cat.key}-${n}.webp`;
    items += `        <a href="#" class="ref-item" data-cat="${cat.key}" data-index="${i - 1}" data-full="images/site/referencia/full/${fileWebp}" data-title="${cat.title}">
          <picture>
            <source srcset="images/site/referencia/thumb/${fileWebp}" type="image/webp">
            <img src="images/site/referencia/thumb/${file}" alt="${cat.title} — ${n}. munka" loading="lazy">
          </picture>
        </a>\n`;
  }
  return `  <section class="ref-cat" id="${cat.key}">
    <div class="ref-cat-head">
      <h2>${cat.title}</h2>
      <p>${cat.desc}</p>
      <span class="ref-count">${cat.count} kép</span>
    </div>
    <div class="ref-grid">
${items}    </div>
  </section>
`;
}

const sections = manifest.map(catSection).join('\n');

const navLinks = manifest.map((c) => `      <a href="#${c.key}">${c.title}</a>`).join('\n');

const jumpNav = manifest.map((c) => `    <a href="#${c.key}">${c.title} <span>${c.count}</span></a>`).join('\n');
const footerCats = manifest.map((c) => `          <li><a href="#${c.key}">${c.title}</a></li>`).join('\n');

const catsJson = JSON.stringify(manifest.map((c) => ({ key: c.key, title: c.title, count: c.count })));

let template = fs.readFileSync(path.join(__dirname, 'referenciak.template.html'), 'utf8')
  .replace('{{SECTIONS}}', sections)
  .replace('{{JUMPNAV}}', jumpNav)
  .replace('{{FOOTERCATS}}', footerCats)
  .replace('{{CATS_JSON}}', catsJson);

// a coverflow kártyák statikus <img> tagjeit is <picture>+webp-re cseréljük
template = template.replace(
  /<img src="(images\/site\/referencia\/thumb\/([\w-]+)\.jpg)">/g,
  '<picture><source srcset="images/site/referencia/thumb/$2.webp" type="image/webp"><img src="$1" loading="lazy" alt=""></picture>'
);

fs.writeFileSync(path.join(__dirname, '..', 'referenciak.html'), template);
console.log('referenciak.html written.');
