import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import "./styles.css";

export const metadata: Metadata = {
  title: "Ìtàn — a clearer view of plant knowledge",
  description:
    "A research-led guide to herbal products, plants and public health in Nigeria.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};
export const viewport: Viewport = {
  themeColor: "#f4f3ec",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
