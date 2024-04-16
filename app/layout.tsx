import type { Metadata, Viewport } from "next";
import { Inter, Onest, Exo } from "next/font/google";
import "./globals.css"
import Layout from "./components/layout";
import { GlobalContextProvider } from './context/store';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tes",
  description: "tes",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover'
}

const onest_init = Onest ({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-onest'
})


const exo_init = Exo ({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-exo'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest_init.variable} ${exo_init.variable}`}>
          <GlobalContextProvider>{children}</GlobalContextProvider>
        
      </body>
    </html>
  );
}