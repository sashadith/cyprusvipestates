"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DevelopersPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/"); // Redirect to the home page
  }, [router]);

  return null; // This page won't render because of the redirect
};

export default DevelopersPage;
