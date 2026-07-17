const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'images', 'referenciamunkak - bzs pipe work');
const OUT = path.join(__dirname, '..', 'images', 'site', 'referencia');
const FULL = path.join(OUT, 'full');
const THUMB = path.join(OUT, 'thumb');

fs.mkdirSync(FULL, { recursive: true });
fs.mkdirSync(THUMB, { recursive: true });

// kategória, cím, leírás + a hozzá tartozó eredeti fájlnevek (UUID rész elég az azonosításhoz)
const categories = [
  {
    slug: 'lapostето',
    key: 'lapostetos',
    title: 'Lapostető szigetelés',
    desc: 'Bitumenes és PVC membrános lapostető-szigetelés, társasházaktól az ipari épületekig.',
    files: [
      '000AE229-B49B-4899-B87E-605EEACDD982',
      '010C8B88-35A3-47EB-AAF6-5C0A88304C58',
      '11964B60-96CD-4BB4-8451-BDDCF2F8D95E',
      '1E9A1355-049F-4E9B-AC8C-D773A1F9BB3B',
      '2511B42B-C2DB-4047-914F-8F5E8EEC4876',
      '25FF3EBA-827E-4100-842C-45EBB3554465',
      '4536046C-7A1B-4C12-B556-006BF481952E',
      '6134AEF2-37B3-40DC-A45D-01CAB906E29E',
      '8FCD5342-9220-46B7-955F-73A7A9623C52',
      '969A07EC-D22F-4320-A2BF-22E0C6819960',
      'A94A7FD3-2DC2-44B1-8BBE-29383ACA0F5C',
      'AADA2A4F-13FD-4EB0-8ACE-FFBFB73CE0F2',
      'C2D0A7CC-C71B-4F64-8B0A-201C9E3972A1',
      'DC03AF54-7129-49B1-81E8-80BA0697E83F',
      'DCB5CF4E-ABD2-4ACC-8E5F-76B826A48E3E',
      'F1A4B90A-B9A1-41C0-B0B3-8892C61FFB30',
      'FB00EC38-D43C-4C3D-BBF3-E7F6B0CBA971',
      'E331D461-3AEF-4F2E-A840-CDC6416F1A2B',
      'C466AEB3-96DA-4ED1-8DE7-F58244449F07',
      '52B1BD13-1E6D-4AE7-9E7E-98D4A08ABA25',
      'A1647A08-0C6D-4A96-82E1-E7867C502415',
      'AB1EA95B-DCE8-4CA3-A3F9-4A8230326DE5',
      'B73F9F82-70BF-4173-BEAE-0F5F99FFC39F',
      'EAE8EB03-5BC5-4482-B9DB-A9FC18A3C0EF',
    ],
  },
  {
    slug: 'badogozas',
    key: 'badogozas',
    title: 'Bádogozás és szegélyezés',
    desc: 'Szegélylemezek, kéményszegélyek, ereszcsatornák — a részletek, amiken a tartósság múlik.',
    files: [
      'E6CB6B36-A9BB-407A-A59A-096B49CBC359',
      '37CC70F7-6205-425F-8235-B0BF24FD11F6',
      '5B5F5EFA-D959-43F0-BF16-6A33BF7A175C',
      '4F78A962-22DA-4422-BBCC-29546DAB29E2',
      '6814DEE8-A5BF-45D0-9F92-544DFBD0E22E',
      '18C9B5EA-7BA8-42DC-AABD-05359E866F43',
      '13F08E55-E809-4EC8-AEB0-AC551926DE3C',
      'BF9AA058-D6FA-4553-AA77-78BB277C4FE0',
      '26D4EAFC-1779-4E2E-A62E-772EE6D5DF02',
      '1855AB4F-7583-468B-B256-37D1B5FBBE2B',
    ],
  },
  {
    slug: 'erkely',
    key: 'erkely',
    title: 'Erkély és terasz szigetelés',
    desc: 'Lakóépület erkélyek és teraszok vízszigetelése, csúszásmentes bevonattal.',
    files: [
      '683D5E0F-72D2-4858-B2FA-BDE586F6B31C',
      '6A9ECDBA-DC5A-409D-A97C-4F9182F1889D',
      '4793D420-48B1-4DA2-ACA5-5DAEB12511DA',
    ],
  },
  {
    slug: 'ipari',
    key: 'ipari',
    title: 'Ipari fémlemez tetőfedés',
    desc: 'Trapézlemez tetőfedés és varratszigetelés ipari csarnokokon.',
    files: [
      'B1929B72-EAF2-4D54-A9B2-A87B7C82D56A',
    ],
  },
  {
    slug: 'alapozas',
    key: 'alapozas',
    title: 'Alapozás és pinceszigetelés',
    desc: 'Láthatatlan, de a legfontosabb munka: az épület alapjainak vízszigetelése.',
    files: [
      'FB503FDC-5A06-4F2B-B470-650C92154116',
    ],
  },
];

async function run() {
  const manifest = [];
  for (const cat of categories) {
    let i = 0;
    for (const uuid of cat.files) {
      i++;
      const srcFile = fs.readdirSync(SRC).find((f) => f.includes(uuid));
      if (!srcFile) {
        console.warn('MISSING', uuid);
        continue;
      }
      const srcPath = path.join(SRC, srcFile);
      const outName = `${cat.key}-${String(i).padStart(2, '0')}.jpg`;
      const outNameWebp = `${cat.key}-${String(i).padStart(2, '0')}.webp`;
      const fullPath = path.join(FULL, outName);
      const thumbPath = path.join(THUMB, outName);
      const fullPathWebp = path.join(FULL, outNameWebp);
      const thumbPathWebp = path.join(THUMB, outNameWebp);

      await sharp(srcPath).rotate().resize({ width: 1500, withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true }).toFile(fullPath);
      await sharp(srcPath).rotate().resize({ width: 560, height: 420, fit: 'cover', withoutEnlargement: true }).jpeg({ quality: 70, mozjpeg: true }).toFile(thumbPath);
      await sharp(srcPath).rotate().resize({ width: 1500, withoutEnlargement: true }).webp({ quality: 72 }).toFile(fullPathWebp);
      await sharp(srcPath).rotate().resize({ width: 560, height: 420, fit: 'cover', withoutEnlargement: true }).webp({ quality: 68 }).toFile(thumbPathWebp);

      manifest.push({ category: cat.key, title: cat.title, file: outName });
      process.stdout.write('.');
    }
  }
  fs.writeFileSync(
    path.join(OUT, 'manifest.json'),
    JSON.stringify(categories.map((c) => ({ key: c.key, title: c.title, desc: c.desc, count: c.files.length })), null, 2)
  );
  console.log('\nDone.', manifest.length, 'images processed.');
}

run().catch((e) => { console.error(e); process.exit(1); });
