import type { Metadata } from "next";
import { Geist_Mono, Merriweather, Merriweather_Sans } from "next/font/google";
import "./globals.css";

const body = Merriweather_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const display = Merriweather({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Llama Eterna",
  description:
    "Un cuestionario confidencial sobre la ruptura, el contacto y lo que conviene hacer esta semana.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${body.variable} ${display.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-950 text-foreground">{children}</body>
    </html>
  );
}
