import { groq } from "next-sanity";
import { client } from "./sanity.client";
import { Homepage } from "@/types/homepage";

export async function getHomePageByLang(lang: string): Promise<Homepage> {
  const homepageQuery = groq`*[_type == 'homepage' && language == $lang][0] {
    _id,
    title,
    seo,
    homepageTitle,
    homepageDescription,
    language,
    slug,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const homepage = await client.fetch(
    homepageQuery,
    { lang },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return homepage;
}
