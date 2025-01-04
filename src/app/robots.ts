import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/_next", "/_assets", "/_static"],
      },
    ],
    // sitemap: "https://cyprusvipestates.com/sitemap.xml",
  };
}
