import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCopy, FiPrinter, FiX, FiChevronDown } from "react-icons/fi";
import {
  FaTwitter,
  FaShare,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
} from "react-icons/fa";
import Image from "next/image";

type ShareDropdownProps = {
  title: string;
  url: string;
};

const ShareDropdown: React.FC<ShareDropdownProps> = ({ title, url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Share handlers
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link berhasil disalin!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareToSocial = (platform: string) => {
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    } else {
      console.error("Platform tidak valid:", platform);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-green-600 bg-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300"
      >
        <FaShare className="w-5 h-5" />
        <span className="hidden sm:inline">Bagikan</span>
        <FiChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
          >
            <div className="p-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Bagikan ke
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial("twitter")}
                  className="flex items-center justify-center space-x-2 p-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                  <span className="text-sm">Twitter</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial("facebook")}
                  className="flex items-center justify-center space-x-2 p-2 bg-[#4267B2] text-white rounded-lg hover:bg-[#385899] transition-colors"
                >
                  <FaFacebook className="w-5 h-5" />
                  <span className="text-sm">Facebook</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial("whatsapp")}
                  className="flex items-center justify-center space-x-2 p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  <span className="text-sm">WhatsApp</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial("linkedin")}
                  className="flex items-center justify-center space-x-2 p-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                  <span className="text-sm">LinkedIn</span>
                </motion.button>
              </div>

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyLink}
                  className="w-full flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiCopy className="w-5 h-5" />
                  <span className="text-sm">Salin Link</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrint}
                  className="w-full flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiPrinter className="w-5 h-5" />
                  <span className="text-sm">Cetak PDF</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareDropdown;
