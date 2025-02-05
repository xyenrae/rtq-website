"use client"; // Tambahkan ini di bagian atas file

import { useState } from "react";
import { useRouter } from "next/navigation"; // Perubahan di sini
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Menggunakan useRouter dari next/navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Dont have an account?{" "}
          <Link href="/register" className="text-blue-500">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
