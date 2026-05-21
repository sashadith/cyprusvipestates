// app/[lang]/not-found.tsx

import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import NotFoundPageComponent from "@/app/components/NotFoundPageComponent/NotFoundPageComponent";
import { getNotFoundPageByLang } from "@/sanity/sanity.utils";

export default async function NotFound() {
  const lang = "en"; // Здесь можно динамически определить язык, например, из URL или контекста

  const notFoundPage = await getNotFoundPageByLang(lang);

  return (
    <>
      <Header params={{ lang }} translations={[]} />
      <NotFoundPageComponent notFoundPage={notFoundPage} lang={lang} />
      <Footer params={{ lang }} />
    </>
  );
}
