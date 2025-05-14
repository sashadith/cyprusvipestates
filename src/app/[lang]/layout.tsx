import "@/app/globals.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { cookies } from "next/headers";
import { ModalProvider } from "../context/ModalContext";
import GoogleAnalyticsWrapper from "../components/GoogleAnalyticsWrapper/GoogleAnalyticsWrapper";
import MicrosoftClarity from "../components/MicrosoftClarity/MicrosoftClarity";
import CustomCookieConsent from "../components/CustomCookieConsent/CustomCookieConsent";
import GoogleAdsScript from "../components/GoogleAdsScript/GoogleAdsScript";

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
      <body className={rubik.className}>
        <ModalProvider>{children}</ModalProvider>

        {hasAnalytics && (
          <>
            <GoogleAnalyticsWrapper />
            <MicrosoftClarity />
          </>
        )}
        <GoogleAdsScript />

        <CustomCookieConsent lang={params.lang as "en" | "de" | "pl" | "ru"} />
      </body>
    </html>
  );
}
