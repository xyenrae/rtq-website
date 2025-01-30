import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

import { Fredoka, Noto_Sans } from "next/font/google";
import Banner from "@/components/layout/Banner";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"], // sesuaikan dengan kebutuhan
});

export const metadata: Metadata = {
  title: "RTQ Al-Ikhlas",
  description: "Lembaga Pendidikan Al-Qur'an Terbaik",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fredoka.variable} ${notoSans.variable}`}>
      <body className={`bg-gray-50`}>
        <Banner />
        <Navigation />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
