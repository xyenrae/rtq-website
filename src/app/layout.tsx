import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="id">
      <body className={`${inter.className} bg-gray-50`}>
        <Navigation />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
