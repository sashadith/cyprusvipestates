"use client";

import Link from "next/link";
import Image from "next/image";
import { Contact } from "@/types/footer";
import styles from "../Footer/Footer.module.scss";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  contact: Contact;
};

export default function ContactLink({ contact }: Props) {
  const cleanLink = (link: string) => {
    return link.replace(/[^a-zA-Z0-9@+]/g, "");
  };

  const getContactHref = (contact: Contact) => {
    const cleanedLabel = cleanLink(contact.label);

    switch (contact.type) {
      case "Email":
        return `mailto:${cleanedLabel}`;
      case "Phone":
        return `tel:${cleanedLabel}`;
      case "Link":
        if (cleanedLabel.match(/^\+?\d+$/)) {
          const whatsappNumber = cleanedLabel.replace("+", "");
          return `https://wa.me/${whatsappNumber}`;
        }
        return cleanedLabel.startsWith("http://") ||
          cleanedLabel.startsWith("https://")
          ? cleanedLabel
          : `https://${cleanedLabel}`;
      default:
        return "#";
    }
  };

  const handleClick = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      const type =
        contact.type === "Link" && contact.label.match(/^\+?\d+$/)
          ? "WhatsApp"
          : contact.type;

      window.dataLayer.push({
        event: "contact_click",
        contact_type: type,
        contact_label: contact.label,
        page_url: window.location.href,
      });
    }
  };

  return (
    <Link
      href={getContactHref(contact)}
      className={styles.contact}
      onClick={handleClick}
      target={contact.type === "Link" ? "_blank" : undefined}
      rel={contact.type === "Link" ? "noopener" : undefined}
    >
      <Image
        alt={contact.label}
        src={urlFor(contact.icon).url()}
        width={30}
        height={30}
      />
      <p className={styles.contactLabel}>{contact.label}</p>
    </Link>
  );
}
