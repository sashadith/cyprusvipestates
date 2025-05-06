// api/sitemap/route.ts
import {
  getProjectsPageByLang,
  getAllProjectsByLang,
  getHomePageByLang,
  getAllDevelopersByLang,
  // вместо старого импорта:
  // getAllSinglePagesByLang,
  // подключаем новую функцию
  getAllPathsForLang,
} from "@/sanity/sanity.utils";

const websiteUrl = "https://cyprusvipestates.com";
const langs = ["de", "pl", "en", "ru"];

async function generateSitemap() {
  const pages: Array<{
    route: string;
    url: string;
    changefreq: string;
    priority: number;
  }> = [];

  for (const lang of langs) {
    // — проекты и главная (без изменений) —
    const projects = await getAllProjectsByLang(lang);
    await getHomePageByLang(lang); // вы, видимо, используете его где-то ещё
    await getProjectsPageByLang(lang);

    pages.push(
      {
        route: lang === "de" ? `/` : `/${lang}`,
        url: lang === "de" ? `${websiteUrl}/` : `${websiteUrl}/${lang}`,
        changefreq: "weekly",
        priority: 1,
      },
      {
        route: lang === "de" ? `/projects` : `/${lang}/projects`,
        url: `${websiteUrl}${lang === "de" ? `/projects` : `/${lang}/projects`}`,
        changefreq: "weekly",
        priority: 0.9,
      },
      ...projects.map((post) => {
        const slug = post.slug[lang].current;
        const route =
          lang === "de" ? `/projects/${slug}` : `/${lang}/projects/${slug}`;
        return {
          route,
          url: `${websiteUrl}${route}`,
          changefreq: "weekly",
          priority: 0.8,
        };
      })
    );

    // — разработчики (без изменений) —
    const developers = await getAllDevelopersByLang(lang);
    pages.push(
      {
        route: lang === "de" ? `/developers` : `/${lang}/developers`,
        url: `${websiteUrl}${lang === "de" ? `/developers` : `/${lang}/developers`}`,
        changefreq: "weekly",
        priority: 0.9,
      },
      ...developers.map((dev) => {
        const slug = dev.slug[lang].current;
        const route =
          lang === "de" ? `/developers/${slug}` : `/${lang}/developers/${slug}`;
        return {
          route,
          url: `${websiteUrl}${route}`,
          changefreq: "weekly",
          priority: 0.8,
        };
      })
    );

    // — обычные страницы любой вложенности —
    // вместо getAllSinglePagesByLang(lang):
    const allPaths = await getAllPathsForLang(lang);
    pages.push(
      ...allPaths.map((segments) => {
        const route =
          lang === "de"
            ? `/${segments.join("/")}`
            : `/${lang}/${segments.join("/")}`;
        return {
          route,
          url: `${websiteUrl}${route}`,
          changefreq: "weekly",
          // можно делать более глубокие чуть менее приоритетными
          priority: segments.length === 1 ? 0.9 : 0.8,
        };
      })
    );
  }

  return pages;
}

export async function GET() {
  const pages = await generateSitemap();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ({ url, changefreq, priority }) => `
  <url>
    <loc>${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;
  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
