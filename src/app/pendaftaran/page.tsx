"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase/client";

// Schema validasi dengan TypeScript type
const formSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  alamat: z.string().min(10, "Alamat terlalu pendek"),
  tanggal_lahir: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal salah (YYYY-MM-DD)"),
  no_telepon: z.string().min(10, "No HP minimal 10 digit"),
});

type FormData = z.infer<typeof formSchema>;

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.from("pendaftaran").insert({
        nama: data.nama,
        alamat: data.alamat,
        tanggal_lahir: data.tanggal_lahir,
        no_telepon: data.no_telepon,
      });

      if (error) throw error;

      alert("Pendaftaran berhasil!");
      reset();
    } catch (error) {
      alert(
        `Gagal mendaftar: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Pendaftaran Santri</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Field Nama */}
        <div>
          <label className="block mb-1">Nama Lengkap</label>
          <input
            {...register("nama")}
            className="w-full p-2 border rounded"
            placeholder="Nama lengkap..."
          />
          {errors.nama && (
            <p className="text-red-500 text-sm mt-1">{errors.nama.message}</p>
          )}
        </div>

        {/* Field Alamat */}
        <div>
          <label className="block mb-1">Alamat</label>
          <textarea
            {...register("alamat")}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Alamat lengkap..."
          />
          {errors.alamat && (
            <p className="text-red-500 text-sm mt-1">{errors.alamat.message}</p>
          )}
        </div>

        {/* Field Tanggal Lahir */}
        <div>
          <label className="block mb-1">Tanggal Lahir</label>
          <input
            type="date"
            {...register("tanggal_lahir")}
            className="w-full p-2 border rounded"
          />
          {errors.tanggal_lahir && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tanggal_lahir.message}
            </p>
          )}
        </div>

        {/* Field No Telepon */}
        <div>
          <label className="block mb-1">Nomor Telepon/WhatsApp</label>
          <input
            type="tel"
            {...register("no_telepon")}
            className="w-full p-2 border rounded"
            placeholder="0812-3456-7890"
          />
          {errors.no_telepon && (
            <p className="text-red-500 text-sm mt-1">
              {errors.no_telepon.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>
      </form>
    </div>
  );
}
