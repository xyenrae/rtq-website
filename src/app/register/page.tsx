// app/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Format email tidak valid";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    if (formData.fullName.length < 3) {
      newErrors.fullName = "Nama lengkap minimal 3 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "user_santri",
          },
        },
      });

      if (error) throw error;

      toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi");
      router.push("/login");
    } catch (error: any) {
      toast.error(`Registrasi gagal: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50">
      <div className="container relative h-screen flex items-center justify-center p-4">
        {/* Form Section */}
        <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={40}
              priority
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Buat Akun Baru
          </h1>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all`}
                placeholder="Masukkan nama lengkap"
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all`}
                placeholder="email@contoh.com"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all pr-12`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all pr-12`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                isLoading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-600 hover:text-emerald-800 underline underline-offset-4"
            >
              Masuk disini
            </Link>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="hidden md:flex flex-1 h-full items-center justify-center">
          <div className="max-w-xl w-full">
            <Image
              src="/images/auth-register.svg"
              alt="Register Illustration"
              width={500}
              height={500}
              className="animate-float"
              priority
            />
            <h2 className="text-3xl font-bold text-center mt-8 text-gray-800">
              Bergabunglah Bersama Kami
            </h2>
            <p className="text-center mt-2 text-gray-600">
              Mulai perjalanan Anda dengan platform kami
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
