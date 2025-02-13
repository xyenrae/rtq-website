"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`, // URL redirect setelah reset
      });
      if (error) throw error;
      toast.success("Cek email Anda untuk link reset password.");
      router.push("/login");
    } catch (err: unknown) {
      let message = "Gagal mengirim link reset password.";
      if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan email Anda untuk mendapatkan link reset password.
          </p>
        </div>

        {/* Form Reset Password */}
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              required
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>

        {/* Link Navigasi */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Ingat password?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-600 hover:text-emerald-800 underline underline-offset-4"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
