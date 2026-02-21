import type { Metadata } from "next";
import "./globals.css";
import { ShellLayout } from "@/components/ShellLayout";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://axuoralearn.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Axuora Learn – Speed Up Your Exam Preparation",
    template: "%s | Axuora Learn",
  },
  description:
    "Built by teens for teens. Generate AI predictive exam questions and use an advanced full-marks analyzer to prepare with confidence.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    title: "Axuora Learn – Speed Up Your Exam Preparation",
    description:
      "Built by teens for teens. Generate AI predictive exam questions and use an advanced full-marks analyzer to prepare with confidence.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Axuora Learn" }],
  },
  twitter: {
    card: "summary",
    title: "Axuora Learn – Speed Up Your Exam Preparation",
    description:
      "Built by teens for teens. Generate AI predictive exam questions and use an advanced full-marks analyzer to prepare with confidence.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-archivo antialiased min-h-screen flex flex-col">
        <ShellLayout>{children}</ShellLayout>
        <Analytics />
      </body>
    </html>
  );
}
