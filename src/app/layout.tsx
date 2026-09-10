import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: { icon: "/meso-icon.svg" },
  title: "Meso Manufacturing — Launching soon",
  description: "Large-scale composite manufacturing. Meso Manufacturing. Launching soon.",
};

export const viewport: Viewport = { themeColor: "#090c10" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
