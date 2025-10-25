import "@/styles/globals.css";
import { Inter_Tight, Inter } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { websiteJsonLd } from "@/lib/seo";

const interTight = Inter_Tight({ subsets: ["latin", "latin-ext"], variable: "--font-inter-tight", display: "swap" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://vexs.space"),
  title: {
    default: "vexs — Independent News, Analysis and Commentary",
    template: "%s — vexs"
  },
  description: "vexs — In-depth news, analysis and opinions on science, technology and current affairs.",
  applicationName: "vexs",
  keywords: ["news", "current affairs", "science", "technology", "analysis", "opinion"],
  creator: "vexs",
  publisher: "vexs",
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: {
    type: "website",
    url: "https://vexs.space/",
    title: "vexs — Independent News",
    description: "Science, technology and current affairs news.",
    locale: "en_US",
    siteName: "vexs",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "vexs" }]
  },
  twitter: {
    card: "summary_large_image",
    site: "@vexs",
    creator: "@vexs",
    title: "vexs — Independent News",
    description: "Science, technology and current affairs news.",
    images: ["/og-default.png"]
  },
  robots: { index: true, follow: true },
  themeColor: "#F8F8F8",
  colorScheme: "light",
  category: "news",
  other: { "news_keywords": "news, current affairs, science, technology" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${interTight.variable} ${inter.variable}`}>
      <body>
        {children}
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
