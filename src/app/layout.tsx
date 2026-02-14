import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Axuora Learn – Speed Up Your Exam Preparation",
  description:
    "Built by teens for teens. Generate AI predictive exam questions and use an advanced full-marks analyzer to prepare with confidence.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
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
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-archivo antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <CTASection />
        <Footer />
      </body>
    </html>
  );
}
