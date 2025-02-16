"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { uploadFileToCloudinary } from "./santriService";
import { z } from "zod";

/* ==================== ZOD SCHEMA DEFINITIONS ==================== */

const SantriDataSchema = z.object({
  id: z.string().optional(),
  nama_lengkap: z.string().min(1, { message: "Nama lengkap wajib diisi" }),
  nik: z.string().min(1, { message: "NIK wajib diisi" }),
  tempat_lahir: z.string().min(1, { message: "Tempat lahir wajib diisi" }),
  tanggal_lahir: z.preprocess(
    (arg) => (arg ? new Date(arg as string | Date) : null),
    z.date().nullable()
  ),
  jenis_kelamin: z.string().min(1, { message: "Jenis kelamin wajib diisi" }),
  jumlah_saudara: z.number().nullable(),
  anak_ke: z.number().nullable(),
  cita_cita: z.string().min(1, { message: "Cita-cita wajib diisi" }),
  nomor_hp: z.string().min(1, { message: "Nomor HP wajib diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  hobi: z.string().min(1, { message: "Hobi wajib diisi" }),
  sumber_pembiayaan: z
    .string()
    .min(1, { message: "Sumber pembiayaan wajib diisi" }),
  kebutuhan_khusus: z
    .string()
    .min(1, { message: "Kebutuhan khusus wajib diisi" }),
  kebutuhan_disabilitas: z
    .string()
    .min(1, { message: "Kebutuhan disabilitas wajib diisi" }),
  nomor_kk: z.string().min(1, { message: "Nomor KK wajib diisi" }),
  nama_kepala_keluarga: z
    .string()
    .min(1, { message: "Nama kepala keluarga wajib diisi" }),
  kk_image_file: z.instanceof(File).nullable(),
  profile_image_file: z.instanceof(File).nullable(),
  profile_image_url: z.string().nullable(),
  kk_image_url: z.string().nullable(),
});

export type SantriData = z.infer<typeof SantriDataSchema>;

/* ==================== HOOK: useSantriForm ==================== */

export const useSantriForm = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [santriData, setSantriData] = useState<SantriData>({
    nama_lengkap: "",
    nik: "",
    tempat_lahir: "",
    tanggal_lahir: null,
    jenis_kelamin: "",
    jumlah_saudara: null,
    anak_ke: null,
    cita_cita: "",
    nomor_hp: "",
    email: "",
    hobi: "",
    sumber_pembiayaan: "Orang Tua",
    kebutuhan_khusus: "Tidak Ada",
    kebutuhan_disabilitas: "Tidak Ada",
    nomor_kk: "",
    nama_kepala_keluarga: "",
    kk_image_file: null,
    profile_image_file: null,
    profile_image_url: null,
    kk_image_url: null,
  });

  /* -------------------- FETCH DATA -------------------- */

  // Fetch data santri berdasarkan user_id
  useEffect(() => {
    const fetchSantriData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: santri } = await supabase
        .from("santri")
        .select("*")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (santri) {
        const updatedSantri: SantriData = {
          ...santri,
          tanggal_lahir: santri.tanggal_lahir
            ? new Date(santri.tanggal_lahir)
            : null,
        };
        setSantriData((prev) => ({ ...prev, ...updatedSantri }));
        setHasData(true);
      }
    };

    fetchSantriData();
  }, []);

  /* -------------------- PROGRESS CALCULATION -------------------- */

  useEffect(() => {
    const calculateProgress = (): number => {
      const requiredFields = [
        // Cek gambar profil: file atau URL
        santriData.profile_image_file || santriData.profile_image_url,
        santriData.kk_image_file || santriData.kk_image_url,
        // Field teks
        santriData.nama_lengkap,
        santriData.nik,
        santriData.tempat_lahir,
        santriData.tanggal_lahir,
        santriData.jenis_kelamin,
        santriData.jumlah_saudara,
        santriData.anak_ke,
        santriData.cita_cita,
        santriData.email,
        santriData.hobi,
        santriData.sumber_pembiayaan,
        santriData.kebutuhan_khusus,
        santriData.kebutuhan_disabilitas,
        santriData.nomor_kk,
        santriData.nama_kepala_keluarga,
        santriData.nomor_hp,
      ];

      const filledCount = requiredFields.filter(Boolean).length;
      return (filledCount / requiredFields.length) * 100;
    };

    setProgress(calculateProgress());
  }, [santriData]);

  /* -------------------- VALIDATION FUNCTION -------------------- */

  const validateSantriData = (): boolean => {
    const parsed = SantriDataSchema.safeParse(santriData);
    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.format());
      toast.error("Data santri tidak valid. Periksa kembali isian Anda.");
      return false;
    }
    return true;
  };

  /* -------------------- HANDLER FUNCTIONS -------------------- */

  // Handle perubahan input untuk santri
  const handleInputChange = (
    field: string,
    value: string | number | boolean | Date | null
  ) => {
    setSantriData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* -------------------- SUBMIT & UPDATE HANDLERS -------------------- */

  // Handle submit data baru
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep("Validasi data");
    setProcessingProgress(10);

    // Validasi data menggunakan Zod
    if (!validateSantriData()) {
      setIsProcessing(false);
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Anda harus login terlebih dahulu.");
        setIsProcessing(false);
        return;
      }

      const formattedTanggalLahir = santriData.tanggal_lahir
        ? new Date(santriData.tanggal_lahir).toISOString()
        : null;

      setProcessingStep("Menyimpan data utama");
      setProcessingProgress(30);

      const { data, error } = await supabase
        .from("santri")
        .insert({
          user_id: userData.user.id,
          nama_lengkap: santriData.nama_lengkap,
          nik: santriData.nik,
          tempat_lahir: santriData.tempat_lahir,
          tanggal_lahir: formattedTanggalLahir,
          jenis_kelamin: santriData.jenis_kelamin,
          jumlah_saudara: santriData.jumlah_saudara,
          anak_ke: santriData.anak_ke,
          cita_cita: santriData.cita_cita,
          nomor_hp: santriData.nomor_hp,
          email: santriData.email,
          hobi: santriData.hobi,
          sumber_pembiayaan: santriData.sumber_pembiayaan,
          kebutuhan_khusus: santriData.kebutuhan_khusus,
          kebutuhan_disabilitas: santriData.kebutuhan_disabilitas,
          nomor_kk: santriData.nomor_kk,
          nama_kepala_keluarga: santriData.nama_kepala_keluarga,
          kk_image_url: null,
          profile_image_url: null,
        })
        .select();

      if (error || !data || data.length === 0) {
        toast.error("Gagal menyimpan data santri.");
        setIsProcessing(false);
        return;
      }

      const insertedRecordId = data[0].id;

      setProcessingStep("Mengunggah dokumen");
      setProcessingProgress(50);

      const uploadPromises = [];
      if (santriData.profile_image_file) {
        uploadPromises.push(
          uploadFileToCloudinary(santriData.profile_image_file)
            .then((url) =>
              supabase
                .from("santri")
                .update({ profile_image_url: url })
                .eq("id", insertedRecordId)
            )
            .catch((err) => {
              console.error(err);
              toast.error("Terjadi kesalahan saat mengupload gambar profil.");
            })
        );
      }
      if (santriData.kk_image_file) {
        uploadPromises.push(
          uploadFileToCloudinary(santriData.kk_image_file)
            .then((url) =>
              supabase
                .from("santri")
                .update({ kk_image_url: url })
                .eq("id", insertedRecordId)
            )
            .catch((err) => {
              console.error(err);
              toast.error("Terjadi kesalahan saat mengupload KK.");
            })
        );
      }

      await Promise.all(uploadPromises);

      toast.success("Data santri berhasil disimpan!");
      setHasData(true);
      setProcessingProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat mendaftar.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle update data yang sudah ada
  const handleUpdate = async () => {
    setIsProcessing(true);
    setProcessingStep("Validasi data");
    setProcessingProgress(10);

    if (!santriData.id) {
      toast.error("Data santri tidak ditemukan untuk diperbarui.");
      setIsProcessing(false);
      return;
    }

    if (!validateSantriData()) {
      setIsProcessing(false);
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const formattedTanggalLahir = santriData.tanggal_lahir
        ? new Date(santriData.tanggal_lahir).toISOString()
        : null;

      let profileImageUrl = santriData.profile_image_url;
      let kkImageUrl = santriData.kk_image_url;

      setProcessingStep("Mengunggah dokumen");
      setProcessingProgress(30);

      const uploads = await Promise.all([
        santriData.profile_image_file
          ? uploadFileToCloudinary(santriData.profile_image_file).catch(
              (err) => {
                console.error(err);
                toast.error("Terjadi kesalahan saat mengupload gambar profil.");
                return null;
              }
            )
          : Promise.resolve(null),
        santriData.kk_image_file
          ? uploadFileToCloudinary(santriData.kk_image_file).catch((err) => {
              console.error(err);
              toast.error("Terjadi kesalahan saat mengupload KK.");
              return null;
            })
          : Promise.resolve(null),
      ]);

      if (uploads[0]) profileImageUrl = uploads[0];
      if (uploads[1]) kkImageUrl = uploads[1];

      setProcessingStep("Menyimpan data utama");
      setProcessingProgress(50);

      const { error, count } = await supabase
        .from("santri")
        .update({
          user_id: userData.user.id,
          nama_lengkap: santriData.nama_lengkap,
          nik: santriData.nik,
          tempat_lahir: santriData.tempat_lahir,
          tanggal_lahir: formattedTanggalLahir,
          jenis_kelamin: santriData.jenis_kelamin,
          jumlah_saudara: santriData.jumlah_saudara,
          anak_ke: santriData.anak_ke,
          cita_cita: santriData.cita_cita,
          nomor_hp: santriData.nomor_hp,
          email: santriData.email,
          hobi: santriData.hobi,
          sumber_pembiayaan: santriData.sumber_pembiayaan,
          kebutuhan_khusus: santriData.kebutuhan_khusus,
          kebutuhan_disabilitas: santriData.kebutuhan_disabilitas,
          nomor_kk: santriData.nomor_kk,
          nama_kepala_keluarga: santriData.nama_kepala_keluarga,
          kk_image_url: kkImageUrl,
          profile_image_url: profileImageUrl,
        })
        .eq("id", santriData.id)
        .eq("user_id", userData.user.id)
        .select();

      if (error) {
        toast.error("Gagal menyimpan perubahan.");
      } else if (count === 0) {
        toast.error("Tidak ada data yang diperbarui.");
      } else {
        toast.success("Perubahan berhasil disimpan!");
        setIsEditMode(false);
        // Refresh data setelah update
        const { data: updatedSantri } = await supabase
          .from("santri")
          .select("*")
          .eq("id", santriData.id)
          .single();
        if (updatedSantri) {
          setSantriData({
            ...updatedSantri,
            tanggal_lahir: updatedSantri.tanggal_lahir
              ? new Date(updatedSantri.tanggal_lahir)
              : null,
          });
        }
        setHasData(true);
        setProcessingProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (err) {
      console.error("Error during update:", err);
      toast.error("Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isEditMode,
    setIsEditMode,
    hasData,
    progress,
    santriData,
    setSantriData,
    handleSubmit,
    handleUpdate,
    isProcessing,
    processingStep,
    processingProgress,
    handleInputChange,
  };
};
