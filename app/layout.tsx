import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const fonteSerif = Fraunces({
  variable: "--fonte-serif",
  subsets: ["latin"],
  display: "swap",
});

const fonteSans = Inter({
  variable: "--fonte-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Volta por Cima — Diagnóstico do seu relacionamento",
  description:
    "Responda algumas perguntas sobre a sua situação e receba um diagnóstico personalizado com um plano prático para os próximos dias.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fonteSerif.variable} ${fonteSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
