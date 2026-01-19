// src/app/api/sitemap/route.ts
import {
  getHomePageByLang,
  getAllProjectsByLang,
  getProjectsPageByLang,
  getAllDevelopersByLang,
  getAllPathsForLang,
  getBlogPostsByLang,
} from "@/sanity/sanity.utils";

const websiteUrl = "https://cyprusvipestates.com";
const langs = ["de", "pl", "en", "ru"];

type SitemapPage = {
  route: string;
  url: string;
  changefreq: string;
  priority: number;
};

async function generateSitemap(): Promise<SitemapPage[]> {
  const pages: SitemapPage[] = [];

  for (const lang of langs) {
    const isDefault = lang === "de";
    const prefix = isDefault ? "" : `/${lang}`;

    // — Главная страница —
    pages.push({
      route: isDefault ? `/` : `/${lang}`,
      url: `${websiteUrl}${isDefault ? `/` : `/${lang}`}`,
      changefreq: "weekly",
      priority: 1.0,
    });

    // — Страницы проектов —
    pages.push({
      route: `${prefix}/projects`,
      url: `${websiteUrl}${prefix}/projects`,
      changefreq: "weekly",
      priority: 0.9,
    });
    const projects = await getAllProjectsByLang(lang);
    pages.push(
      ...projects
        .map((proj) => {
          const slug = proj.slug?.[lang]?.current;
          if (!slug) return null;
          const route = `${prefix}/projects/${slug}`;
          return {
            route,
            url: `${websiteUrl}${route}`,
            changefreq: "weekly",
            priority: 0.8,
          };
        })
        .filter((x): x is SitemapPage => Boolean(x)),
    );

    // — Страницы разработчиков —
    pages.push({
      route: `${prefix}/developers`,
      url: `${websiteUrl}${prefix}/developers`,
      changefreq: "weekly",
      priority: 0.9,
    });
    const developers = await getAllDevelopersByLang(lang);
    pages.push(
      ...developers
        .map((dev) => {
          const slug = dev.slug?.[lang]?.current;
          if (!slug) return null;
          const route = `${prefix}/developers/${slug}`;
          return {
            route,
            url: `${websiteUrl}${route}`,
            changefreq: "weekly",
            priority: 0.8,
          };
        })
        .filter((x): x is SitemapPage => Boolean(x)),
    );

    // — Обычные «одноуровневые» страницы (singlepage) любой вложенности —
    const allPaths = await getAllPathsForLang(lang);
    pages.push(
      ...allPaths.map((segments) => {
        const route = isDefault
          ? `/${segments.join("/")}`
          : `/${lang}/${segments.join("/")}`;
        return {
          route,
          url: `${websiteUrl}${route}`,
          changefreq: "weekly",
          priority: segments.length === 1 ? 0.9 : 0.8,
        };
      }),
    );

    // — Список статей блога —
    pages.push({
      route: `${prefix}/blog`,
      url: `${websiteUrl}${prefix}/blog`,
      changefreq: "weekly",
      priority: 0.9,
    });

    // — Отдельные статьи блога —
    const blogPosts = await getBlogPostsByLang(lang);
    pages.push(
      ...blogPosts
        // фильтруем те записи, у которых нет slug для этого языка
        .filter((post) => !!post.slug?.[lang]?.current)
        .map((post) => {
          const slug = post.slug[lang]!.current;
          const route = `${prefix}/blog/${slug}`;
          return {
            route,
            url: `${websiteUrl}${route}`,
            changefreq: "weekly",
            priority: 0.8,
          };
        }),
    );
  }

  return pages;
}

export async function GET() {
  const pages = await generateSitemap();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ({ url, changefreq, priority }) => `
  <url>
    <loc>${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`,
  )
  .join("")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
