import {
  getProjectsPageByLang,
  getAllProjectsByLang,
  getHomePageByLang,
} from "@/sanity/sanity.utils";

const generateSlug = (slug: any, language: string) => {
  if (!slug || !slug[language]?.current) return "#";

  // Если язык "en", не добавляем /en/
  return language === "de"
    ? `/projects/${slug[language].current}`
    : `/${language}/projects/${slug[language].current}`;
};

async function generateSitemap() {
  const langs = ["de", "pl", "en", "ru"]; // Получите список поддерживаемых языков из вашего i18n конфигурации или другого источника
  const websiteUrl = "https://cyprusvipestates.com";

  const pages = [];

  for (const lang of langs) {
    const projects = await getAllProjectsByLang(lang);
    const mainPage = await getHomePageByLang(lang);
    const projectsPage = await getProjectsPageByLang(lang);

    pages.push(
      {
        route: "/",
        // Если язык "de", не добавляем /de/
        url: lang === "de" ? `${websiteUrl}/` : `${websiteUrl}/${lang}`,
        changefreq: "weekly",
        priority: 1,
      },
      {
        route: "/projects",
        url:
          lang === "de"
            ? `${websiteUrl}/projects`
            : `${websiteUrl}/${lang}/projects`,
        changefreq: "weekly",
        priority: 0.9,
      },
      ...projects.map((post) => ({
        route: generateSlug(post.slug, lang),
        url: `${websiteUrl}${generateSlug(post.slug, lang)}`,
        changefreq: "weekly",
        priority: 0.8,
      }))
    );
  }

  return pages;
}

export async function GET() {
  const pages = await generateSitemap();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          return `
            <url>
              <loc>${page.url}</loc>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
