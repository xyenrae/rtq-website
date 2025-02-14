"use client";

import { usePathname } from "next/navigation";
import Banner from "@/components/layout/Banner";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Banner />}
      {!isAdmin && <Navigation />}
      <main className="min-h-[calc(100vh-160px)]">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
