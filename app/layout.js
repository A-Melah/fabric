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

// Set NEXT_PUBLIC_SITE_URL in your hosting dashboard (e.g. https://francaandabanum.com).
// It is used for link previews (WhatsApp, Facebook, X) so they point at the live domain.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:300";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Franca & Abanum — December 12, 2026",
  description: "Join us as we celebrate our wedding on December 12, 2026.",
  openGraph: {
    title: "Franca & Abanum are getting married",
    description: "December 12, 2026 · You are invited",
    siteName: "Franca & Abanum's Wedding",
    url: SITE_URL,
    type: "website",
    // The preview image comes from app/opengraph-image.js automatically.
  },
  twitter: {
    card: "summary_large_image",
    title: "Franca & Abanum are getting married",
    description: "December 12, 2026 · You are invited",
    // X falls back to the Open Graph image above.
  },
};

export const viewport = {
  themeColor: "#fffdf8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
