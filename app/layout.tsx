import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          <GlobalContextProvider>{children}</GlobalContextProvider>
        </Layout>
      </body>
    </html>
  );
}