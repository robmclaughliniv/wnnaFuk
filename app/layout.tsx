import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "./sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "wnnaFuk",
  description: "Invite-only date scheduling",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "wnnaFuk",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#E63946",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
