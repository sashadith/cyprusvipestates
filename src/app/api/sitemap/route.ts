import {
  getProjectsPageByLang,
  getAllProjectsByLang,
  getHomePageByLang,
  getAllDevelopersByLang, // <-- Импорт новой функции
} from "@/sanity/sanity.utils";

const generateSlug = (slug: any, language: string) => {
  if (!slug || !slug[language]?.current) return "#";

  // Если язык "de", не добавляем /de/
  return language === "de"
    ? `/projects/${slug[language].current}`
    : `/${language}/projects/${slug[language].current}`;
};

const generateDeveloperSlug = (slug: any, language: string) => {
  if (!slug || !slug[language]?.current) return "#";

  // Если язык "de", не добавляем префикс языка
  return language === "de"
    ? `/developers/${slug[language].current}`
    : `/${language}/developers/${slug[language].current}`;
};

async function generateSitemap() {
  const langs = ["de", "pl", "en", "ru"]; // Список поддерживаемых языков
  const websiteUrl = "https://cyprusvipestates.com";

  const pages = [];

  for (const lang of langs) {
    // Получаем страницы для проектов
    const projects = await getAllProjectsByLang(lang);
    const mainPage = await getHomePageByLang(lang);
    const projectsPage = await getProjectsPageByLang(lang);

    // Добавляем главную страницу и раздел проектов
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

    // Получаем раздел разработчиков
    const developers = await getAllDevelopersByLang(lang);

    // Добавляем главную страницу для разработчиков и их отдельные страницы
    pages.push(
      {
        route: "/developers",
        url:
          lang === "de"
            ? `${websiteUrl}/developers`
            : `${websiteUrl}/${lang}/developers`,
        changefreq: "weekly",
        priority: 0.9,
      },
      ...developers.map((dev) => ({
        route: generateDeveloperSlug(dev.slug, lang),
        url: `${websiteUrl}${generateDeveloperSlug(dev.slug, lang)}`,
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
