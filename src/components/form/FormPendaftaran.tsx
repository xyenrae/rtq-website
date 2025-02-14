// components/RegistrationForm.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { MdPerson, MdFamilyRestroom, MdHome } from "react-icons/md";
import SantriForm from "./data/santri/SantriForm";
import OrangTuaForm from "./data/orangtua/OrangTuaForm";
import AlamatForm from "./data/alamat/AlamatForm";

const tabs = [
  {
    label: "Santri",
    icon: <MdPerson className="text-lg" />,
    content: <SantriForm />,
  },
  {
    label: "Orang Tua",
    icon: <MdFamilyRestroom className="text-lg" />,
    content: <OrangTuaForm />,
  },
  {
    label: "Alamat",
    icon: <MdHome className="text-lg" />,
    content: <AlamatForm />,
  },
];

export default function FormPendaftaran() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-lg font-noto-sans">
      {/* Tabs Container */}
      <div className="relative mb-8">
        <div className="flex relative bg-gray-300 rounded-lg p-1">
          {/* Animated Background */}
          <motion.span
            className="absolute h-full bg-green-500 rounded-md shadow-sm top-0 left-0"
            animate={{
              x: `${activeTab * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              width: `${100 / tabs.length}%`,
            }}
          />

          {/* Tabs */}
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === index
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {tabs[activeTab].content}
      </motion.div>
    </div>
  );
}
