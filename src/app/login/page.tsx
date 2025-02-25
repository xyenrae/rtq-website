"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Mengecek apakah user sudah login sebelumnya
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkSession();
  }, [router, supabase]);

  // Fungsi login yang sudah dioptimalkan
  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Cek apakah user berhasil login
        if (data.session) {
          toast.success("Selamat datang kembali!");
          router.push("/admin");
        } else {
          throw new Error("Login gagal, coba lagi.");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan saat login.";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, router, supabase]
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Masuk ke Akun Anda
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Silahkan login untuk mengakses halaman Admin.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-colors"
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
            <p className="text-center text-sm text-red-600 animate-shake">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
