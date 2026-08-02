import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { RouteTransition } from "@/components/layout/RouteTransition";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Carries every micro-label, stat, and meta readout on the site.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const siteUrl = "https://proeduvate.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ProEduvate — AI-Powered Products for EdTech & Enterprise",
    template: "%s | ProEduvate",
  },
  description:
    "ProEduvate builds AI-powered software products across EdTech and IT/enterprise, and partners with clients who need the same craft applied to their own software.",
  openGraph: {
    title: "ProEduvate — AI-Powered Products for EdTech & Enterprise",
    description:
      "ProEduvate builds AI-powered software products across EdTech and IT/enterprise, and partners with clients who need the same craft applied to their own software.",
    url: siteUrl,
    siteName: "ProEduvate",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProEduvate — AI-Powered Products for EdTech & Enterprise",
    description:
      "ProEduvate builds AI-powered software products across EdTech and IT/enterprise.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ProEduvate",
  url: siteUrl,
  description:
    "ProEduvate builds AI-powered software products across EdTech and IT/enterprise, and partners with clients who need the same craft applied to their own software.",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface text-chalk">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteLoader />
        <RouteTransition />
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
