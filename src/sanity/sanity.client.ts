import { createClient } from "next-sanity";
import ImageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET as string;
export const apiVersion = "2023-10-16";
export const useCdn = process.env.NODE_ENV === "production";
export const token = process.env.SANITY_API_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token,
});

const builder = ImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Экспорт настроек для Node.js
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Лучше отключить кеш для скриптов
  token,
};
