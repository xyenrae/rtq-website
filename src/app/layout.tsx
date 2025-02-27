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
  title: "RTQ Al-Hikmah",
  description: "Lembaga Pendidikan Al-Qur'an Terbaik",
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
