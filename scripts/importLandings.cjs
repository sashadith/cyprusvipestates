// scripts/importLandings.cjs
/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const { createClient } = require('@sanity/client');
const { parse } = require('csv-parse/sync');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-08-04',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const CSV_PATH = path.resolve(__dirname, 'landings.csv');
const LOCAL_IMG_DIR = path.resolve(__dirname, 'images');
const LANGS = ['de', 'pl', 'en', 'ru'];
const DEFAULT_LANG = 'de';

// ---------- utils ----------
const nonEmpty = (v) => v !== undefined && v !== null && String(v).trim() !== '';

function toPT(text = '') {
  return String(text)
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean)
    .map((t, i) => ({
      _key: `pt-${i}-${Date.now()}`,
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _key: `span-${i}-${Date.now()}`, _type: 'span', text: t, marks: [] }],
    }));
}

function truncate(str = '', n = 200) {
  const s = String(str).replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n).trim() : s;
}

async function preloadImages() {
  const map = {};
  if (!fs.existsSync(LOCAL_IMG_DIR)) return map;
  const files = fs.readdirSync(LOCAL_IMG_DIR).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  for (const file of files) {
    const full = path.join(LOCAL_IMG_DIR, file);
    try {
      const { _id } = await client.assets.upload('image', fs.createReadStream(full), { filename: file });
      map[file] = _id;
      console.log(`📦 Preloaded ${file} → ${_id}`);
    } catch (e) {
      console.error(`⚠️ preload ${file}: ${e.message}`);
    }
  }
  return map;
}

async function uploadImage(src, localMap) {
  if (!nonEmpty(src)) return null;
  const b = path.basename(String(src).trim());
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

/**
 * ЯЗЫКОЗАВИСИМАЯ карта проектов:
 *  - bySlug:  Map<`${lang}:${slug}`, _id>
 *  - byTitle: Map<`${lang}:${lower(title)}`, _id>
 * ДОПОЛНИТЕЛЬНО:
 *  - anySlug: Map<lower(slug), _id> — кросс-языковой фолбэк, если slug заполнен только в одной локали.
 *
 * ВАЖНО: собираем по slug.de/en/pl/ru, НЕ используем поле document.language.
 */
async function buildProjectRefMap() {
  const all = await client.fetch(`*[_type=="project"]{
    _id,
    title,
    "slug_de": slug.de.current,
    "slug_en": slug.en.current,
    "slug_pl": slug.pl.current,
    "slug_ru": slug.ru.current
  }`);

  const bySlug = new Map();
  const byTitle = new Map();
  const anySlug = new Map();
  const lower = (s) => String(s || '').trim().toLowerCase();

  for (const p of all) {
    const mapSlug = (langKey, slugVal) => {
      if (!slugVal) return;
      const trimmed = String(slugVal).trim();
      bySlug.set(`${langKey}:${trimmed}`, p._id);
      anySlug.set(lower(trimmed), p._id);
    };
    mapSlug('de', p.slug_de);
    mapSlug('en', p.slug_en);
    mapSlug('pl', p.slug_pl);
    mapSlug('ru', p.slug_ru);

    if (p.title) {
      const t = lower(p.title);
      byTitle.set(`de:${t}`, p._id);
      byTitle.set(`en:${t}`, p._id);
      byTitle.set(`pl:${t}`, p._id);
      byTitle.set(`ru:${t}`, p._id);
    }
  }

  console.log(`🔎 Project index built: bySlug=${bySlug.size}, byTitle=${byTitle.size}, anySlug=${anySlug.size}`);
  return { bySlug, byTitle, anySlug };
}

async function findParentForLang(parentSlug, lang) {
  if (!nonEmpty(parentSlug)) return null;
  const doc = await client.fetch(
    `*[_type=="singlepage" && language==$lang && slug[$lang].current==$slug][0]{_id}`,
    { lang, slug: String(parentSlug).trim() }
  );
  if (!doc?._id) {
    console.warn(`⚠️ parent not found for lang=${lang}, slug="${parentSlug}"`);
  }
  return doc?._id || null;
}

// ---------- main ----------
async function run() {
  const localMap = await preloadImages();

  const { bySlug: projectBySlug, byTitle: projectByTitle, anySlug: projectAnySlug } = await buildProjectRefMap();
  const lower = (s) => String(s || '').trim().toLowerCase();

  const csv = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parse(csv, { columns: true, skip_empty_lines: true, from_line: 2 });

  for (const row of rows) {
    const baseId = `single-${row.id}`;
    const metaRefs = [];
    const tx = client.transaction();

    // Preview Image (общий ассет)
    let previewRef = null;
    if (nonEmpty(row.previewImage_path)) {
      try {
        previewRef = await uploadImage(row.previewImage_path, localMap);
      } catch (e) {
        console.warn(`⚠️ preview upload failed: ${e.message}`);
      }
    }

    for (const lang of LANGS) {
      const docId = lang === DEFAULT_LANG ? baseId : `${baseId}.${lang}`;

      // → Title из Intro Title
      const introTitle = row[`landingIntro_title_${lang}`] || '';
      const title = introTitle;

      // → Excerpt из Intro Description (обрезаем до 200)
      const introDesc = row[`landingIntro_desc_${lang}`] || '';
      const excerpt = nonEmpty(introDesc) ? truncate(introDesc, 200) : '';

      // Остальные поля
      const slug = row[`slug_${lang}`] || '';
      const seo_metaTitle = row[`seo_metaTitle_${lang}`] || '';
      const seo_metaDescription = row[`seo_metaDescription_${lang}`] || '';
      const introSubtitle = row[`landingIntro_subtitle_${lang}`] || '';
      const introBtn = row[`landingIntro_button_${lang}`] || '';

      // Preview per-language alt
      const previewAlt = row[`previewImage_alt_${lang}`] || '';
      const previewImage = previewRef
        ? { _type: 'image', asset: { _type: 'reference', _ref: previewRef }, ...(nonEmpty(previewAlt) && { alt: previewAlt }) }
        : null;

      // landingIntroBlock (картинка = previewImage)
      const introHasAny =
        nonEmpty(introSubtitle) ||
        nonEmpty(introTitle) ||
        nonEmpty(introDesc) ||
        nonEmpty(introBtn) ||
        previewRef;

      const introBlock = introHasAny
        ? {
          _key: `b-intro-${lang}-${Date.now()}`,
          _type: 'landingIntroBlock',
          ...(nonEmpty(introSubtitle) && { subtitle: introSubtitle }),
          ...(nonEmpty(introTitle) && { title: introTitle }),
          ...(nonEmpty(introDesc) && { description: introDesc }),
          ...(nonEmpty(introBtn) && { buttonLabel: introBtn }),
          ...(previewRef && {
            image: {
              _type: 'image',
              asset: { _type: 'reference', _ref: previewRef },
              ...(nonEmpty(previewAlt) && { alt: previewAlt }),
            },
          }),
        }
        : null;

      // landingProjectsBlock
      const lpTitle = row[`landingProjects_title_${lang}`] || row.landingProjects_title || '';
      const lpCity = row.landingProjects_city || '';
      const lpType = row.landingProjects_propertyType || '';

      // слаги из одной общей колонки, игнорируем '...'
      const rawKeys = String(row['landingProjects_projects_slugs'] || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .filter(s => s !== '...');

      let lpProjects = null;

      if (rawKeys.length) {
        const resolved = [];
        const seen = new Set();

        for (const keyRaw of rawKeys) {
          const key = String(keyRaw).trim();
          if (!key || key === '...') continue;
          const kLower = lower(key);
          if (seen.has(kLower)) continue;
          seen.add(kLower);

          // 1) строго по языку и слагу
          const idBySlug = projectBySlug.get(`${lang}:${key}`);
          if (idBySlug) { resolved.push(idBySlug); continue; }

          // 2) по title в этом же языке
          const idByTitle = projectByTitle.get(`${lang}:${kLower}`);
          if (idByTitle) { resolved.push(idByTitle); continue; }

          // 3) кросс-языковой фолбэк: этот слаг в любой локали
          const idAny = projectAnySlug.get(kLower);
          if (idAny) {
            resolved.push(idAny);
            console.warn(`ℹ️ using slug from another locale for key="${key}" (lang=${lang}) — заполните slug.${lang}.current в Sanity`);
            continue;
          }

          console.warn(`⚠️ project not found for lang=${lang}, key="${key}" (slug/title)`);
        }

        if (resolved.length) {
          const ts = Date.now();
          lpProjects = resolved.map((id, i) => ({
            _key: `pr-${i}-${ts}`,
            _type: 'reference',
            _ref: id,
          }));
        }
      }

      const projectsBlock =
        nonEmpty(lpTitle) || nonEmpty(lpCity) || nonEmpty(lpType) || lpProjects
          ? {
            _key: `b-proj-${lang}-${Date.now()}`,
            _type: 'landingProjectsBlock',
            ...(nonEmpty(lpTitle) && { title: lpTitle }),
            ...(nonEmpty(lpCity) && { filterCity: lpCity }),
            ...(nonEmpty(lpType) && { filterPropertyType: lpType }),
            ...(lpProjects && { projects: lpProjects }),
          }
          : null;

      // landingTextFirst
      const tfText = row[`textFirst_${lang}`] || '';
      const textFirstBlock = nonEmpty(tfText)
        ? { _key: `b-tf-${lang}-${Date.now()}`, _type: 'landingTextFirst', content: toPT(tfText) }
        : null;

      // landingFaqBlock
      const faqTitle = row[`faq_title_${lang}`] || '';
      const faqRaw = row[`faq_${lang}`] || '';
      const faqItems = String(faqRaw)
        .split('$')
        .map(s => s.trim())
        .filter(Boolean)
        .map((it, i) => {
          const [q, a] = it.split('::').map(t => t.trim());
          const item = {
            _key: `faq-${lang}-${i}-${Date.now()}`,
            ...(nonEmpty(q) && { question: q }),
            ...(nonEmpty(a) && { answer: toPT(a) }),
          };
          return item;
        })
        .filter(obj => obj.question || obj.answer);

      const faqBlock =
        nonEmpty(faqTitle) || faqItems.length
          ? {
            _key: `b-faq-${lang}-${Date.now()}`,
            _type: 'landingFaqBlock',
            ...(nonEmpty(faqTitle) && { title: faqTitle }),
            ...(faqItems.length && { faq: { _type: 'accordionBlock', items: faqItems } }),
          }
          : null;

      // landingTextSecond
      const tsText = row[`textSecond_${lang}`] || '';
      const textSecondBlock = nonEmpty(tsText)
        ? { _key: `b-ts-${lang}-${Date.now()}`, _type: 'landingTextSecond', content: toPT(tsText) }
        : null;

      // contentBlocks
      const contentBlocks = [
        introBlock,
        projectsBlock,
        textFirstBlock,
        faqBlock,
        textSecondBlock,
      ].filter(Boolean);

      // parentPage (опционально)
      const parentSlug = row[`parent_slug_${lang}`] || '';
      const parentId = await findParentForLang(parentSlug, lang).catch(() => null);
      const parentRef = parentId ? { _type: 'reference', _ref: parentId } : null;

      // собираем документ — пишем только непустые поля
      const doc = {
        _id: docId,
        _type: 'singlepage',
        __i18n_lang: lang,
        __i18n_base: baseId,

        ...(nonEmpty(title) && { title }),
        ...(nonEmpty(slug) && { slug: { _type: 'localizedSlug', [lang]: { _type: 'slug', current: slug } } }),
        ...(nonEmpty(excerpt) && { excerpt }),
        ...(nonEmpty(seo_metaTitle) || nonEmpty(seo_metaDescription)
          ? {
            seo: {
              ...(nonEmpty(seo_metaTitle) && { metaTitle: seo_metaTitle }),
              ...(nonEmpty(seo_metaDescription) && { metaDescription: seo_metaDescription }),
            },
          }
          : {}),

        ...(previewImage && { previewImage }),
        ...(contentBlocks.length && { contentBlocks }),
        ...(parentRef && { parentPage: parentRef }),
        language: lang,
      };

      tx.createOrReplace(doc);
      metaRefs.push({
        _key: lang,
        value: { _type: 'reference', _ref: docId },
      });
    }

    // translation.metadata — без лишних полей
    tx.createOrReplace({
      _id: `${baseId}.i18n`,
      _type: 'translation.metadata',
      translations: metaRefs,
    });

    try {
      await tx.commit();
      console.log(`✅ Imported ${baseId} (+i18n)`);
    } catch (e) {
      const msg = String(e?.message || e);
      // Если схема не принимает reference в списке — перезапишем документ, заменив ссылки на строки
      if (/items? of type reference not valid for this list/i.test(msg) || /type reference not valid/i.test(msg)) {
        console.warn(`↻ Fallback to slug strings for ${baseId} due to schema constraints...`);

        for (const lang of LANGS) {
          const docId = lang === DEFAULT_LANG ? baseId : `${baseId}.${lang}`;
          try {
            const doc = await client.getDocument(docId);
            if (!doc?.contentBlocks) continue;

            const patchedBlocks = doc.contentBlocks.map(block => {
              if (block?._type !== 'landingProjectsBlock') return block;

              const slugsCell = String(row['landingProjects_projects_slugs'] || '')
                .split(',')
                .map(s => String(s).trim())
                .filter(Boolean)
                .filter(s => s !== '...');

              return { ...block, projects: slugsCell };
            });

            await client.patch(docId).set({ contentBlocks: patchedBlocks }).commit();
            console.log(`✅ Fallback saved for ${docId}`);
          } catch (err2) {
            console.error(`❌ Fallback failed for ${docId}: ${err2.message}`);
          }
        }
      } else {
        console.error(`❌ ${baseId}: ${msg}`);
      }
    }
  }
}

run().catch(e => {
  console.error('💥 Fatal:', e);
  process.exit(1);
});
