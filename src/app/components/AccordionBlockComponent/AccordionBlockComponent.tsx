import React from "react";
import { AccordionBlock } from "@/types/blog";
import Accordion from "../Accordion/Accordion";
import AccordionItem from "../AccordionItem/AccordionItem";

type AccordionBlockComponentProps = {
  block: AccordionBlock;
  expandedIndex: number | null;
  setExpandedIndex: (index: number | null) => void;
};

const portableTextToPlainText = (blocks: any[] = []) => {
  return blocks
    .map((block) => {
      if (!block.children) return "";

      return block.children.map((child: any) => child.text || "").join("");
    })
    .join(" ")
    .trim();
};

export const AccordionBlockComponent: React.FC<
  AccordionBlockComponentProps
> = ({ block, expandedIndex, setExpandedIndex }) => {
  const faqItems = block.items
    .filter((item) => item.question && item.answer)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: portableTextToPlainText(item.answer),
      },
    }))
    .filter(
      (item) =>
        item.name &&
        item.acceptedAnswer.text &&
        item.acceptedAnswer.text.length > 0,
    );

  return (
    <>
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems,
            }),
          }}
        />
      )}

      <Accordion>
        {block.items.map((item, index) => (
          <AccordionItem
            key={item._key}
            title={item.question}
            content={item.answer}
            expanded={index === expandedIndex}
            onClick={() =>
              setExpandedIndex(index === expandedIndex ? null : index)
            }
          />
        ))}
      </Accordion>
    </>
  );
};
