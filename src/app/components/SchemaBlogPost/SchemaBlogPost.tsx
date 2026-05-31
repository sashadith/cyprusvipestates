// app/components/SchemaBlogPost.tsx
import Script from "next/script";
import { urlFor } from "@/sanity/sanity.client";
import { defaultLocale } from "@/i18n.config";
import { Blog } from "@/types/blog";

interface SchemaBlogPostProps {
  blog: Blog;
  lang: string;
}

const siteUrl = "https://cyprusvipestates.com";

const SchemaBlogPost = ({ blog, lang }: SchemaBlogPostProps) => {
  const slug = blog.slug?.[lang]?.current;

  if (!slug) return null;

  const url =
    lang === defaultLocale
      ? `${siteUrl}/blog/${slug}`
      : `${siteUrl}/${lang}/blog/${slug}`;

  const imageUrl = blog.previewImage
    ? urlFor(blog.previewImage).width(1200).height(630).url()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#blogposting`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: blog.title,
    description: blog.seo?.metaDescription,
    image: imageUrl
      ? {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        }
      : undefined,
    articleSection: blog.category?.title,
    author: {
      "@type": "RealEstateAgent",
      name: "Cyprus VIP Estates",
      url: siteUrl,
    },
    publisher: {
      "@type": "RealEstateAgent",
      name: "Cyprus VIP Estates",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.sanity.io/files/88gk88s2/production/a4760263e2ce6e46536dbc5ea7dcb55a7b5516c7.png",
      },
    },
    datePublished: blog.publishedAt,
    dateModified: blog._updatedAt || blog.publishedAt,
    inLanguage: lang,
    isAccessibleForFree: true,
  };

  return (
    <Script
      id={`schema-blogpost-${lang}-${slug}`}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
};

export default SchemaBlogPost;
