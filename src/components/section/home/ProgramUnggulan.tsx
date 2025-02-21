"use client";

import CardSliderProgram from "@/components/card/CardSliderProgram";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProgramUnggulan() {
  return (
    <motion.div
      className="container"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="sm:text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Program Unggulan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Program pembelajaran Al-Qur&#39;an terstruktur untuk berbagai usia
          dengan kurikulum berbasis Metode Yanbu&#39;a
        </p>
      </div>

      <CardSliderProgram />
    </motion.div>
  );
}
