// app/layout.tsx
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cyprus VIP Estates",
  description: "Cyprus VIP Estates - Luxury Real Estate in Cyprus",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  );
};

export default Layout;
