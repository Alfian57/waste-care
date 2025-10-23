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
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#16a34a",
      },
    ],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "WasteCare",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#16a34a",
    "msapplication-config": "/browserconfig.xml",
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
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
