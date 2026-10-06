import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  metadataBase: new URL("https://joywedsjoshua.amdigital.ng"),
  title: "Joy & Joshua — November 28, 2026",
  description: "Join us as we celebrate our wedding in Warri, Nigeria.",
  openGraph: {
    title: "Joy & Joshua are getting married",
    description: "November 28, 2026 · Warri, Nigeria",
    siteName: "Joy & Joshua's Wedding",
    url: "https://joywedsjoshua.amdigital.ng",
    type: "website",
    images: [
      {
        url: "/images/couple-og.jpg",
        width: 1200,
        height: 630,
        alt: "Joy & Joshua",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joy & Joshua are getting married",
    description: "November 28, 2026 · Warri, Nigeria",
    images: ["/images/couple-og.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
