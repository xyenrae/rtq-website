"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State untuk konfirmasi password
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle visibility password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk toggle visibility konfirmasi password
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok.");
      toast.error("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    console.log("Registering user with:", { email, password, fullName });

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: "user_santri" },
      },
    });

    if (signUpError) {
      console.error("Error during registration:", signUpError.message);
      setError(signUpError.message);
      toast.error("Registrasi gagal. Silakan coba lagi.");
    } else {
      console.log("Registration successful. Data:", data);
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-4/12"
      >
        <h2 className="text-2xl font-bold ">Register</h2>
        <p className="mb-4 mt-2 text-gray-600 text-sm">
          Silahkan Isi Nama Lengkap, E-mail, Password, dan Konfirmasi Password
          untuk membuat akun
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Nama Lengkap</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            required
            placeholder="Masukkan nama lengkap"
          />
        </div>
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
                  alt=""
                  width={25}
                  height={25}
                />
              ) : (
                <Image
                  src={"/images/eye-closed.svg"}
                  alt=""
                  width={25}
                  height={25}
                />
              )}
            </button>
          </div>
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700">Konfirmasi Password</label>
          <div className="flex justify-between rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400">
            <input
              type={showConfirmPassword ? "text" : "password"} // Toggle visibility konfirmasi password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full outline-none"
              required
              placeholder="Masukkan ulang password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <Image
                  src={"/images/eye-open.svg"}
                  alt=""
                  width={25}
                  height={25}
                />
              ) : (
                <Image
                  src={"/images/eye-closed.svg"}
                  alt=""
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
          Register
        </button>
        <p className="mt-4 text-center">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-green-500 underline hover:text-green-600"
          >
            Login akun disini
          </Link>
        </p>
      </form>
    </div>
  );
}
