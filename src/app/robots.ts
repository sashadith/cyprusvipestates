import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // allow: "/",
        // disallow: ["/admin", "/ru/success", "/en/success"],
        disallow: "/",
      },
    ],
    // sitemap: "https://cyprusvipestates.com/sitemap.xml",
  };
}
