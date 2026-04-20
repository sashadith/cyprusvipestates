"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

type Props = {
  title: string;
  projectId: string;
  price?: number | null;
  city?: string;
  propertyType?: string;
};

const MetaViewContentTracker = ({
  title,
  projectId,
  price,
  city,
  propertyType,
}: Props) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.fbq) return;

    window.fbq("track", "ViewContent", {
      content_name: title,
      content_ids: [projectId],
      content_type: "product",
      content_category: "property",
      value: typeof price === "number" ? price : 0,
      currency: "EUR",
      city: city || "",
      property_type: propertyType || "",
    });
  }, [title, projectId, price, city, propertyType]);

  return null;
};

export default MetaViewContentTracker;
