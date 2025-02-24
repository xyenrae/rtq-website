"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

interface FooterLinkProps {
  href: string;
  label: string;
}

interface SocialIconProps {
  href: string;
  children: React.ReactNode;
  label: string;
}

// Menggunakan motion.a agar ikon dapat dianimasikan dan berfungsi sebagai link
const SocialIcon: React.FC<SocialIconProps> = ({ href, children, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -2 }}
    className="text-gray-600 hover:text-green-600"
    aria-label={label}
  >
    {children}
  </motion.a>
);

const FooterLink: React.FC<FooterLinkProps> = ({ href, label }) => {
  return (
    <Link href={href} className="relative overflow-hidden group block py-1">
      <span className="inline-block transition-transform duration-300">
        {label}
      </span>
      <span className="inline-block absolute top-full left-0 transition-transform duration-300 text-green-500">
        {label}
      </span>
    </Link>
  );
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alamat, setAlamat] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  // Mengambil data settings dari Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select(
          "email, phone_number, alamat, link_facebook, link_instagram, link_youtube"
        )
        .limit(1);
      if (error) {
        console.error("Error fetching settings:", error);
      } else if (data && data.length > 0) {
        const settings = data[0];
        setEmail(settings.email || "");
        setPhoneNumber(settings.phone_number || "");
        setAlamat(settings.alamat || "");
        setFacebookLink(settings.link_facebook || "");
        setInstagramLink(settings.link_instagram || "");
        setYoutubeLink(settings.link_youtube || "");
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-12 lg:gap-16">
          {/* Logo & Deskripsi */}
          <div className="flex flex-col items-start space-y-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/images/logo-rtq.png"
                  alt="Logo RTQ"
                  width={80}
                  height={80}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-3xl text-green-500">
                  Al-Hikmah
                </span>
                <span className="text-green-500 text-sm font-medium">
                  Cinta Al-Qur&apos;an, Cinta Ilmu
                </span>
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Kami berkomitmen untuk memberikan kesempatan belajar yang sesuai
              dengan usia bagi setiap anak yang terdaftar di RTQ Al-Hikmah.
            </p>

            {/* Ikon Media Sosial dengan motion */}
            <div className="flex gap-4 mt-6">
              <SocialIcon href={facebookLink || "#"} label="Facebook">
                <FaFacebookF className="w-5 h-5" />
              </SocialIcon>
              <SocialIcon href={instagramLink || "#"} label="Instagram">
                <FaInstagram className="w-5 h-5" />
              </SocialIcon>
              <SocialIcon href={youtubeLink || "#"} label="YouTube">
                <FaYoutube className="w-5 h-5" />
              </SocialIcon>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div className="flex flex-col sm:items-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-700 relative group">
              Navigasi Cepat
            </h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 w-full max-w-xs">
              <div className="space-y-2 text-gray-600">
                <FooterLink href="/" label="Beranda" />
                <FooterLink href="/berita" label="Berita" />
                <FooterLink href="/pendaftaran" label="Pendaftaran" />
              </div>
              <div className="space-y-2 text-gray-600 flex sm:justify-end">
                <div className="space-y-2">
                  <FooterLink href="/galeri" label="Galeri" />
                  <FooterLink href="/kontak" label="Kontak" />
                  <FooterLink href="/login" label="Admin" />
                </div>
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div className="flex flex-col sm:items-end">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 relative group">
              <span className="text-gray-700">Kontak Kami</span>
            </h3>
            <div className="space-y-4 text-gray-600 text-center sm:text-right">
              <p className="flex items-center gap-2 sm:justify-end">
                <MdLocationOn className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{alamat || "Alamat belum diatur"}</span>
              </p>
              <p className="flex items-center gap-2 sm:justify-end">
                <MdPhone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{phoneNumber || "Nomor belum diatur"}</span>
              </p>
              <p className="flex items-center gap-2 sm:justify-end">
                <MdEmail className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{email || "Email belum diatur"}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} RTQ Al-Hikmah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
