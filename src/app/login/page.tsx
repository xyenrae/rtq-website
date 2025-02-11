// app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const userRole = data.user?.user_metadata.role;
      router.push(userRole === "admin" ? "/admin/dashboard" : "/");
      toast.success("Selamat datang kembali!");
    } catch (error: any) {
      setError(error.message);
      toast.error("Login gagal. Periksa kredensial Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50">
      <div className="container relative h-screen flex items-center justify-center p-4">
        {/* Illustration Section */}
        <div className="hidden md:flex flex-1 h-full items-center justify-center">
          <div className="max-w-xl w-full">
            <Image
              src="/images/auth-login.svg"
              alt="Login Illustration"
              width={500}
              height={500}
              className="animate-float"
              priority
            />
            <h2 className="text-3xl font-bold text-center mt-8 text-gray-800">
              Selamat Datang Kembali
            </h2>
            <p className="text-center mt-2 text-gray-600">
              Kelola aktivitas Anda dengan mudah melalui platform kami
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 lg:w-1/3 bg-white rounded-2xl shadow-xl p-8 md:p-10">
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
            Masuk ke Akun Anda
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                placeholder="email@contoh.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all pr-12"
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
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center animate-shake">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                isLoading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Lupa Password?
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-emerald-600 hover:text-emerald-800 underline underline-offset-4"
            >
              Daftar disini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
