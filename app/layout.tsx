import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/Providers";
import "./globals.css";

// Meta Pixel — dispara PageView no carregamento e deixa `fbq` global para
// eventos (Lead, InitiateCheckout, etc.). Em App Router "afterInteractive" é o
// equivalente correto de colocar no <head>.
const META_PIXEL_ID = "913969341396001";

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

        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
