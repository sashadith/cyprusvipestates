// scripts/importProjects.cjs

const path = require('path');
const fs = require('fs');
const { createClient } = require('@sanity/client');
const { parse } = require('csv-parse/sync');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// — Sanity клиент
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-08-04',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const CSV_PATH = path.resolve(__dirname, 'projects.csv');
const LOCAL_IMG_DIR = path.resolve(__dirname, 'images');
const LANGS = ['de', 'pl', 'en', 'ru'];
const DEFAULT_LANG = 'de';

// Приводим к ISO "YYYY-MM-01". Принимает "YYYY-MM", "MM-YYYY", "YYYY-MM-DD", "YYYY.MM", "MM.YYYY".
function normalizeMonthYear(input) {
  if (!input) return null;
  const s = String(input).trim();

  // 1) "YYYY-MM" или "YYYY/MM"
  let m = s.match(/^(\d{4})[-\/](\d{1,2})$/);
  if (m) {
    const year = m[1];
    const month = String(Math.min(Math.max(parseInt(m[2], 10), 1), 12)).padStart(2, '0');
    return `${year}-${month}-01`;
  }

  // 2) "MM-YYYY" или "MM/YYYY"
  m = s.match(/^(\d{1,2})[-\/](\d{4})$/);
  if (m) {
    const month = String(Math.min(Math.max(parseInt(m[1], 10), 1), 12)).padStart(2, '0');
    const year = m[2];
    return `${year}-${month}-01`;
  }

  // 3) Уже "YYYY-MM-DD" — оставим как есть
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // 4) "YYYY.MM" или "MM.YYYY"
  m = s.match(/^(\d{4})\.(\d{1,2})$/) || s.match(/^(\d{1,2})\.(\d{4})$/);
  if (m) {
    const a = m[1], b = m[2];
    const year = a.length === 4 ? a : b;
    const monthNum = a.length === 4 ? b : a;
    const month = String(Math.min(Math.max(parseInt(monthNum, 10), 1), 12)).padStart(2, '0');
    return `${year}-${month}-01`;
  }

  // 5) Иначе — не пишем мусор
  return null;
}

// текст → PortableText блоки
function textToPortableText(text = '') {
  return text
    .split(/\r?\n/)
    .map(l => l.trim()).filter(Boolean)
    .map((l, i) => ({
      _key: `pt-${i}-${Date.now()}`,
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _key: `span-${i}-${Date.now()}`, _type: 'span', text: l, marks: [] }]
    }));
}

// предзагрузка локальных картинок
async function preloadImages() {
  const map = {};
  if (!fs.existsSync(LOCAL_IMG_DIR)) return map;
  for (const file of fs.readdirSync(LOCAL_IMG_DIR).filter(f => /\.(jpe?g|png|webp)$/i.test(f))) {
    const full = path.join(LOCAL_IMG_DIR, file);
    try {
      const { _id } = await client.assets.upload('image', fs.createReadStream(full), { filename: file });
      map[file] = _id;
      console.log(`📦 Preloaded ${file} → ${_id}`);
    } catch (e) {
      console.error(`⚠️ ${file}: ${e.message}`);
    }
  }
  return map;
}

// загрузка картинки (URL или локальный через map)
async function uploadImage(src, localMap) {
  if (!src) return null;
  const b = path.basename(src.trim());
  if (localMap[b]) return localMap[b];
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(res.statusText);
    const buf = Buffer.from(await res.arrayBuffer());
    const fn = path.basename(new URL(src).pathname);
    const { _id } = await client.assets.upload('image', buf, { filename: fn });
    return _id;
  }
  const abs = path.resolve(__dirname, src);
  if (!fs.existsSync(abs)) throw new Error(`Not found: ${abs}`);
  const { _id } = await client.assets.upload('image', fs.createReadStream(abs), { filename: path.basename(abs) });
  return _id;
}

async function run() {
  // 1) Словарь developers
  const devs = await client.fetch(`*[_type=="developer"]{_id,language,slug,title}`);
  const devMap = {};
  devs.forEach(d => {
    const lang = d.language, slug = d.slug?.[lang]?.current;
    if (slug) devMap[`${lang}:${slug}`] = d._id;
    if (d.title) devMap[`${lang}:${d.title}`] = d._id;
  });

  // 2) Предзагрузка картинок
  const localMap = await preloadImages();

  // 3) Чтение CSV
  const csv = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    from_line: 2
  });

  for (const row of rows) {
    const baseId = `project-${row.id}`;
    const metaRefs = [];

    for (const lang of LANGS) {
      const docId = lang === DEFAULT_LANG ? baseId : `${baseId}.${lang}`;

      // — SEO
      const seo = {
        metaTitle: row[`seo_metaTitle_${lang}`] || '',
        metaDescription: row[`seo_metaDescription_${lang}`] || ''
      };

      // — локализованные строки
      const title = row[`title_${lang}`] || '';
      const excerpt = row[`excerpt_${lang}`] || '';
      const slug = row[`slug_${lang}`] || '';

      // — previewImage + alt
      let previewRef = null;
      if (row.previewImage_path) {
        try { previewRef = await uploadImage(row.previewImage_path, localMap); }
        catch (e) { console.error(`⚠️ preview upload failed: ${e.message}`); }
      }

      // — videoPreview + alt
      const videoId = row.videoId || '';
      let videoPreviewRef = null;
      if (row.videoPreview_path) {
        try { videoPreviewRef = await uploadImage(row.videoPreview_path, localMap); }
        catch (e) { console.error(`⚠️ videoPreview upload failed: ${e.message}`); }
      }

      // — галерея + alt для каждого языка
      const imgFiles = (row.images_paths || '').split(',').map(s => s.trim()).filter(Boolean);
      const alts = (row[`images_alts_${lang}`] || '').split('/').map(s => s.trim());
      const images = await Promise.all(imgFiles.map(async (fn, i) => {
        const ref = await uploadImage(fn, localMap);
        return {
          _key: `img-${lang}-${i}-${Date.now()}`,
          _type: 'image',
          asset: { _ref: ref },
          alt: alts[i] || ''
        };
      }));

      // — description и fullDescription как единый массив блоков
      const description = textToPortableText(row[`description_${lang}`] || '');
      const fullDescription = textToPortableText(row[`fullDescription_${lang}`] || '');

      // — location
      const lat = parseFloat(row.location_lat) || 0;
      const lng = parseFloat(row.location_lng) || 0;

      // — developer по slug/title/UUID
      const rawDev = (row[`developer_${lang}`] || '').trim();
      let devRef = /^[0-9a-fA-F-]{36}$/.test(rawDev)
        ? rawDev
        : devMap[`${lang}:${rawDev}`];
      if (!devRef && rawDev) console.warn(`⚠️ Developer not found "${rawDev}" for ${lang}`);

      // — keyFeatures (не локализованы)
      const completionRaw = row.keyFeatures_completionDate || row.completionDate || '';
      const completionDate = normalizeMonthYear(completionRaw);

      const keyFeatures = {
        city: row.keyFeatures_city || '',
        propertyType: row.keyFeatures_propertyType || '',
        bedrooms: row.keyFeatures_bedrooms || '',
        coveredArea: row.keyFeatures_coveredArea || '',
        plotSize: row.keyFeatures_plotSize || '',
        ...(completionDate && { completionDate }), // пишем только валидное
        price: parseFloat(row.keyFeatures_price) || 0
      };

      if (completionRaw && !completionDate) {
        console.warn(`⚠️ Invalid completionDate "${completionRaw}" for row id=${row.id}`);
      }

      // — distances
      const distances = {
        beach: row.distances_beach || '',
        restaurants: row.distances_restaurants || '',
        shops: row.distances_shops || '',
        airport: row.distances_airport || '',
        hospital: row.distances_hospital || '',
        school: row.distances_school || '',
        cityCenter: row.distances_cityCenter || '',
        golfCourt: row.distances_golfCourt || ''
      };

      // — FAQ (Q::A) по '$'
      const faqParts = (row[`faq_${lang}`] || '')
        .split('$')
        .map(s => s.trim())
        .filter(Boolean);
      const faqItems = faqParts.map((item, i) => {
        const [q, a] = item.split('::').map(s => s.trim());
        return {
          _key: `faq-${lang}-${i}-${Date.now()}`,
          question: q || '',
          answer: textToPortableText(a || '')
        };
      });

      // — собираем документ
      const doc = {
        _id: docId,
        _type: 'project',
        __i18n_lang: lang,
        __i18n_base: baseId,

        seo,
        title,
        excerpt,

        ...(previewRef && {
          previewImage: {
            _type: 'image',
            asset: { _ref: previewRef },
            alt: row[`previewImage_alt_${lang}`] || ''
          }
        }),

        slug: { _type: 'localizedSlug', [lang]: { _type: 'slug', current: slug } },

        videoId,
        ...(videoPreviewRef && {
          videoPreview: {
            _type: 'image',
            asset: { _ref: videoPreviewRef },
            alt: row[`videoPreview_alt_${lang}`] || ''
          }
        }),

        images,
        ...(description.length > 0 && { description }),
        ...(fullDescription.length > 0 && { fullDescription }),
        location: { lat, lng },
        ...(devRef && { developer: { _type: 'reference', _ref: devRef } }),

        keyFeatures,
        distances,
        ...(faqItems.length > 0 && {
          faq: { _type: 'accordionBlock', items: faqItems }
        }),

        publishedAt: row.publishedAt,
        language: lang
      };

      try {
        await client.createOrReplace(doc);
        console.log(`✅ Imported ${docId}`);
      } catch (err) {
        console.error(`❌ ${docId}:`, err.message);
      }
      metaRefs.push({ _key: lang, value: { _type: 'reference', _ref: docId } });
    }

    // — translation.metadata
    const metaDoc = {
      _id: `${baseId}.i18n`,
      _type: 'translation.metadata',
      documentId: baseId,
      translations: metaRefs
    };
    try {
      await client.createOrReplace(metaDoc);
      console.log(`🔗 Meta: ${metaDoc._id}`);
    } catch (err) {
      console.error(`❌ Meta ${metaDoc._id}:`, err.message);
    }
  }
}

run().catch(e => {
  console.error('💥 Fatal:', e.message);
  process.exit(1);
});
