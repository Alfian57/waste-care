import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WasteCare - Smart Waste Management",
  description: "Smart waste management application for reporting and tracking waste issues in your community",
  keywords: ["waste management", "environment", "community", "reporting", "sustainability"],
  authors: [{ name: "WasteCare Team" }],
  creator: "WasteCare Team",
  publisher: "WasteCare Team",
  applicationName: "WasteCare",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WasteCare",
    startupImage: "/icons/apple-touch-startup-image.png",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    title: "WasteCare - Smart Waste Management",
    description: "Smart waste management application for reporting and tracking waste issues in your community",
    siteName: "WasteCare",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "WasteCare - Smart Waste Management",
    description: "Smart waste management application for reporting and tracking waste issues in your community",
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WasteCare" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#16a34a" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
