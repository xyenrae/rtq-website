import type { Metadata } from "next";
import "./globals.css";
import { Fredoka, Noto_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@/context/UserContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import Tracker from "@/components/Tracker";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "RTQ Al-Hikmah Ngurensiti | Pendidikan Al-Qur'an Metode Yanbu'a di Pati",
  description:
    "Lembaga pendidikan Al-Qur'an berbasis metode Yanbu'a di Desa Ngurensiti, Kecamatan Wedarijaksa, Kabupaten Pati. Didukung program Imtihan resmi dari Lajnah Muroqobah Yanbu'a (LMY) Kabupaten Pati dan fasilitas lengkap untuk santri usia dini.",
  keywords: [
    "RTQ Al-Hikmah Ngurensiti",
    "Pendidikan Al-Qur'an Pati",
    "Metode Yanbu'a",
    "Baca Jilid Ngurensiti",
    "Lajnah Muroqobah Yanbu'a",
    "Imtihan Resmi",
    "Kabupaten Pati",
    "Wisuda Santri",
  ],
  authors: [{ name: "RTQ Al-Hikmah", url: "https://rtq-website.vercel.app/" }],
  openGraph: {
    title:
      "RTQ Al-Hikmah Ngurensiti | Pendidikan Al-Qur'an Metode Yanbu'a di Pati",
    description:
      "Program belajar Al-Qur'an dengan kurikulum terstruktur dan metode Yanbu'a. Evaluasi Imtihan resmi dari LMY Kabupaten Pati dan wisuda sebagai tanda kelulusan santri.",
    url: "[URL Halaman Pendaftaran]",
    siteName: "RTQ Al-Hikmah Ngurensiti",
    images: [
      {
        url: "/images/logo-rtq.png",
        width: 1200,
        height: 630,
        alt: "RTQ Al-Hikmah Ngurensiti - Pendidikan Al-Qur'an di Pati",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RTQ Al-Hikmah Ngurensiti | Lembaga Al-Qur'an di Ngurensiti, Pati",
    description:
      "Fasilitas 2 lantai dengan 5 ruang belajar, tempat wudhu, dan kantin. Program diselenggarakan atas pengawasan Lajnah Muroqobah Yanbu'a (LMY) Kabupaten Pati.",
    images: "/images/logo-rtq.png",
    site: "@rtqalhikmahngurensiti",
    creator: "@rtqalhikmahngurensiti",
  },
  alternates: {
    canonical: "https://rtq-website.vercel.app/pendaftaran",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "facebook-domain-verification": "[ID Verifikasi Facebook]",
    "twitter:site": "@rtqalhikmahngurensiti",
    "twitter:creator": "@rtqalhikmahngurensiti",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fredoka.variable} ${notoSans.variable}`}>
      <body className="bg-gray-50 !w-screen !overflow-x-hidden">
        <Tracker />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <UserProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </UserProvider>
      </body>
    </html>
  );
}
