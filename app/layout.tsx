import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monara Auto Studio | Imports, Sales, Wraps, PPF & Tinting",
  description:
    "Your Car. Your Style. Your Legacy. Car imports, sales, styling, customization, wraps, PPF, tinting, accessories and spare parts in Nairobi.",
};

// The ROOT layout: only the page shell. It is shared by the public site AND the admin area,
// so it must NOT contain the NavBar or Footer.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}