import "@/app/globals.css";
import type { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Inter, Outfit, Rubik } from "next/font/google";
// import { ModalProvider } from "../context/ModalContext";
import { Suspense } from "react";
import { ModalProvider } from "../context/ModalContext";
import MicrosoftClarity from "../components/MicrosoftClarity/MicrosoftClarity";
// import { FacebookPixelEvents } from "../components/pixel-events";
const inter = Inter({ subsets: ["latin", "cyrillic"] });
const rubik = Rubik({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Cyprus VIP Estates",
  description: "Cyprus VIP Estates - Luxury Real Estate in Cyprus",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body className={rubik.className}>
        <ModalProvider>{children}</ModalProvider>
        <GoogleAnalytics gaId="G-WLD3B6GN9P" />
        <MicrosoftClarity />
        {/* <GoogleTagManager gtmId="G-XTMLVRC9RR" /> */}
        {/* <Suspense fallback={null}>
          <FacebookPixelEvents />
        </Suspense> */}
      </body>
    </html>
  );
}
