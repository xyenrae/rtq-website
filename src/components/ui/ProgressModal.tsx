"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";

interface ProgressModalProps {
  isOpen: boolean;
  progress: number;
  status: "submit" | "update" | "idle";
  currentStep?: string;
}

const ProgressModal = ({
  isOpen,
  progress,
  status,
  currentStep,
}: ProgressModalProps) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [localProgress, setLocalProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setLocalProgress(0);
      const baseSteps = [
        "Validasi data",
        "Menyimpan data utama",
        "Mengunggah dokumen",
        "Finalisasi data",
      ];
      setSteps(baseSteps);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && localProgress < progress) {
      const timer = setInterval(() => {
        setLocalProgress((prev) => Math.min(prev + 1, progress));
      }, 20);
      return () => clearInterval(timer);
    }
  }, [isOpen, progress, localProgress]);

  const getStatusLabel = () => {
    if (status === "submit") return "Pendaftaran Santri Baru";
    if (status === "update") return "Pembaruan Data Santri";
    return "Proses Data Santri";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[999]"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {status === "submit" ? (
                  <FaCloudUploadAlt className="animate-bounce" />
                ) : (
                  <FaSpinner className="animate-spin" />
                )}
                {getStatusLabel()}
              </h3>
            </div>

            <div className="p-6">
              <div className="relative h-3 bg-gray-100 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${localProgress}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${localProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        (localProgress ?? 0) >= (index + 1) * 25
                          ? "bg-green-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {(localProgress ?? 0) >= (index + 1) * 25 ? (
                        <FaCheckCircle className="text-sm" />
                      ) : (
                        <span className="text-xs">
                          {((index + 1) * 25).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <span
                      className={`${
                        (localProgress ?? 0) >= (index + 1) * 25
                          ? "text-gray-800 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {currentStep && (
                <div className="mt-4 text-center text-sm text-blue-600 font-medium">
                  Sedang memproses: {currentStep}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgressModal;
