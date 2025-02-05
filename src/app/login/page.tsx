"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle visibility password
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error("Login gagal. Periksa email dan password Anda.");
    } else {
      const userRole = data.user?.user_metadata.role;
      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
      toast.success("Login berhasil!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-4/12"
      >
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="mb-4 mt-2 text-gray-600 text-sm">
          Silahkan Masukkan E-mail dan Password untuk melanjutkan ke dalam
          aplikasi
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            required
            placeholder="Masukkan email"
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <div className="flex justify-between rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400">
            <input
              type={showPassword ? "text" : "password"} // Toggle visibility password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full outline-none"
              required
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <Image
                  src={"/images/eye-open.svg"}
                  alt="Show Password"
                  width={25}
                  height={25}
                />
              ) : (
                <Image
                  src={"/images/eye-closed.svg"}
                  alt="Hide Password"
                  width={25}
                  height={25}
                />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Tidak punya akun?{" "}
          <Link
            href="/register"
            className="text-green-500 underline hover:text-green-600"
          >
            Daftar akun disini
          </Link>
        </p>
      </form>
    </div>
  );
}
