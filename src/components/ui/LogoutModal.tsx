// components/ui/LogoutModal.tsx
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: "-50%" },
  visible: { opacity: 1, y: "0%" },
};

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-96"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <h3 className="text-xl font-bold mb-4">Konfirmasi Logout</h3>
            <p className="mb-6">Apakah Anda yakin ingin logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={onConfirm}
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
