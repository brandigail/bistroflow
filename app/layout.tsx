import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const DESCRIPTION =
  "A restaurant point-of-sale that connects the table, the kitchen and the stockroom: live kitchen tickets, a menu that knows its stock, and one-tap reordering.";

export const metadata: Metadata = {
  // Netlify exposes the deployed site's address as URL at build time.
  metadataBase: new URL(process.env.URL ?? "http://localhost:3000"),
  title: { default: "BistroFlow: restaurant POS with a live kitchen display and smart inventory", template: "%s | BistroFlow" },
  description: DESCRIPTION,
  openGraph: {
    title: "BistroFlow: the point of sale that knows your kitchen",
    description: DESCRIPTION,
    siteName: "BistroFlow",
    type: "website",
    images: [{ url: "/screens/kitchen.jpg", width: 1920, height: 1200, alt: "The BistroFlow kitchen display" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf5ec" },
    { media: "(prefers-color-scheme: dark)", color: "#15100d" },
  ],
};

// Resolves the theme before first paint so there is no flash and no hydration mismatch.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("bistroflow-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above sets data-theme on <html> before React hydrates.
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
