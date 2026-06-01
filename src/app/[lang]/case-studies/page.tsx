// src/app/[lang]/case-studies/page.tsx

import { getCaseStudiesByLang } from "@/sanity/sanity.utils";

type Props = {
  params: {
    lang: string;
  };
};

export default async function CaseStudiesPage({ params }: Props) {
  const caseStudies = await getCaseStudiesByLang(params.lang);

  return (
    <main>
      <h1>Case Studies</h1>

      {caseStudies.map((caseStudy) => (
        <article key={caseStudy._id}>
          <h2>{caseStudy.title}</h2>
          <p>{caseStudy.excerpt}</p>
        </article>
      ))}
    </main>
  );
}
