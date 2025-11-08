import "@/app/globals.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { cookies } from "next/headers";
import { GoogleTagManager } from "@next/third-parties/google";
import { ModalProvider } from "../context/ModalContext";
import GoogleAnalyticsWrapper from "../components/GoogleAnalyticsWrapper/GoogleAnalyticsWrapper";
import MicrosoftClarity from "../components/MicrosoftClarity/MicrosoftClarity";
import CustomCookieConsent from "../components/CustomCookieConsent/CustomCookieConsent";
import GoogleAdsScript from "../components/GoogleAdsScript/GoogleAdsScript";
import FacebookPixel from "../components/FacebookPixel/FacebookPixel";
import LenisProvider from "../components/LenisProvider/LenisProvider";

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
  const cookieStore = cookies();
  const consentCookie = cookieStore.get("cookieConsent");
  let hasAnalytics = false;

  try {
    const consent = consentCookie?.value
      ? JSON.parse(consentCookie.value)
      : null;
    hasAnalytics = consent?.analytics === true;
  } catch {
    // ignore error
  }

  return (
    <html lang={params.lang}>
      <LenisProvider />
      <body className={rubik.className}>
        <ModalProvider>{children}</ModalProvider>

        {hasAnalytics && (
          <>
            <MicrosoftClarity hasConsent={true} />
            <GoogleTagManager gtmId="GTM-MQNF6L9V" />
            <GoogleAdsScript />
            <FacebookPixel />
          </>
        )}

        {!hasAnalytics && (
          <>
            {/* ВАЖНО: даже если нет согласия, мы можем проинициализировать Clarity в "no consent" режиме */}
            <MicrosoftClarity hasConsent={false} />
          </>
        )}

        <GoogleAnalyticsWrapper />

        <CustomCookieConsent lang={params.lang as "en" | "de" | "pl" | "ru"} />
      </body>
    </html>
  );
}
