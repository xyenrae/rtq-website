"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { z } from "zod";

/* ==================== ZOD SCHEMA DEFINITIONS ==================== */

const AyahIbuAlamatSchema = z.object({
  status_kepemilikan: z
    .string()
    .min(1, { message: "Status kepemilikan wajib diisi" }),
  provinsi: z.string().min(1, { message: "Provinsi wajib diisi" }),
  kabupaten: z.string().min(1, { message: "Kabupaten wajib diisi" }),
  kecamatan: z.string().min(1, { message: "Kecamatan wajib diisi" }),
  kelurahan: z.string().min(1, { message: "Kelurahan wajib diisi" }),
  kode_pos: z.string().min(1, { message: "Kode pos wajib diisi" }),
  rt: z.string().min(1, { message: "RT wajib diisi" }),
  rw: z.string().min(1, { message: "RW wajib diisi" }),
  alamat: z.string().min(1, { message: "Alamat wajib diisi" }),
});

const SantriAlamatSchema = z.object({
  status_mukim: z.string().min(1, { message: "Status mukim wajib diisi" }),
  status_tempat_tinggal: z
    .string()
    .min(1, { message: "Status tempat tinggal wajib diisi" }),
  jarak_lembaga: z.string().min(1, { message: "Jarak lembaga wajib diisi" }),
  transportasi: z.string().min(1, { message: "Transportasi wajib diisi" }),
  waktu_tempuh: z.string().min(1, { message: "Waktu tempuh wajib diisi" }),
  provinsi: z.string().min(1, { message: "Provinsi wajib diisi" }),
  kabupaten: z.string().min(1, { message: "Kabupaten wajib diisi" }),
  kecamatan: z.string().min(1, { message: "Kecamatan wajib diisi" }),
  kelurahan: z.string().min(1, { message: "Kelurahan wajib diisi" }),
  kode_pos: z.string().min(1, { message: "Kode pos wajib diisi" }),
  rt: z.string().min(1, { message: "RT wajib diisi" }),
  rw: z.string().min(1, { message: "RW wajib diisi" }),
  alamat: z.string().min(1, { message: "Alamat wajib diisi" }),
});

const AlamatDataSchema = z.object({
  ayah: AyahIbuAlamatSchema,
  ibu: AyahIbuAlamatSchema,
  santri: SantriAlamatSchema,
});

export type AlamatData = z.infer<typeof AlamatDataSchema>;

/* ==================== HOOK: useAlamatForm ==================== */

export const useAlamatForm = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [backupAlamatData, setBackupAlamatData] = useState<AlamatData | null>(
    null
  );
  const [alamatData, setAlamatData] = useState<AlamatData>({
    ayah: {
      status_kepemilikan: "Milik Sendiri",
      provinsi: "",
      kabupaten: "",
      kecamatan: "",
      kelurahan: "",
      kode_pos: "",
      rt: "",
      rw: "",
      alamat: "",
    },
    ibu: {
      status_kepemilikan: "Milik Sendiri",
      provinsi: "",
      kabupaten: "",
      kecamatan: "",
      kelurahan: "",
      kode_pos: "",
      rt: "",
      rw: "",
      alamat: "",
    },
    santri: {
      status_mukim: "Tidak Mukim",
      status_tempat_tinggal: "Tinggal dengan Ayah Kandung",
      jarak_lembaga: "Kurang dari 5 km",
      transportasi: "",
      waktu_tempuh: "",
      provinsi: "",
      kabupaten: "",
      kecamatan: "",
      kelurahan: "",
      kode_pos: "",
      rt: "",
      rw: "",
      alamat: "",
    },
  });
  const [santriId, setSantriId] = useState<number | null>(null);

  // Ambil ID santri dari supabase
  useEffect(() => {
    const fetchSantriId = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data: santri, error } = await supabase
        .from("santri")
        .select("id")
        .eq("user_id", userData.user.id)
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("Error fetching santri ID:", error.message);
      } else if (santri) {
        setSantriId(santri.id);
      }
    };
    fetchSantriId();
  }, []);

  // Ambil data alamat dari supabase
  useEffect(() => {
    const fetchAlamatData = async () => {
      if (!santriId) return;
      const { data: alamat, error } = await supabase
        .from("alamat")
        .select("*")
        .eq("santri_id", santriId)
        .maybeSingle();
      if (error) {
        console.error("Error fetching alamat data:", error.message);
        setHasData(false);
      } else if (alamat) {
        setAlamatData({
          ayah: {
            status_kepemilikan: alamat.ayah_status_kepemilikan ?? "",
            provinsi: alamat.ayah_provinsi ?? "",
            kabupaten: alamat.ayah_kabupaten ?? "",
            kecamatan: alamat.ayah_kecamatan ?? "",
            kelurahan: alamat.ayah_kelurahan ?? "",
            kode_pos: alamat.ayah_kode_pos ?? "",
            rt: alamat.ayah_rt ?? "",
            rw: alamat.ayah_rw ?? "",
            alamat: alamat.ayah_alamat ?? "",
          },
          ibu: {
            status_kepemilikan: alamat.ibu_status_kepemilikan ?? "",
            provinsi: alamat.ibu_provinsi ?? "",
            kabupaten: alamat.ibu_kabupaten ?? "",
            kecamatan: alamat.ibu_kecamatan ?? "",
            kelurahan: alamat.ibu_kelurahan ?? "",
            kode_pos: alamat.ibu_kode_pos ?? "",
            rt: alamat.ibu_rt ?? "",
            rw: alamat.ibu_rw ?? "",
            alamat: alamat.ibu_alamat ?? "",
          },
          santri: {
            status_mukim: alamat.santri_status_mukim ?? "",
            status_tempat_tinggal: alamat.santri_status_tempat_tinggal ?? "",
            jarak_lembaga: alamat.santri_jarak_lembaga ?? "",
            transportasi: alamat.santri_transportasi ?? "",
            waktu_tempuh: alamat.santri_waktu_tempuh ?? "",
            provinsi: alamat.santri_provinsi ?? "",
            kabupaten: alamat.santri_kabupaten ?? "",
            kecamatan: alamat.santri_kecamatan ?? "",
            kelurahan: alamat.santri_kelurahan ?? "",
            kode_pos: alamat.santri_kode_pos ?? "",
            rt: alamat.santri_rt ?? "",
            rw: alamat.santri_rw ?? "",
            alamat: alamat.santri_alamat ?? "",
          },
        });
        setHasData(true);
      } else {
        setHasData(false);
      }
    };
    fetchAlamatData();
  }, [santriId]);

  // Hitung progress berdasarkan jumlah field yang terisi
  useEffect(() => {
    const calculateProgress = (): number => {
      const ayahFields = [
        alamatData.ayah.status_kepemilikan,
        alamatData.ayah.provinsi,
        alamatData.ayah.kabupaten,
        alamatData.ayah.kecamatan,
        alamatData.ayah.kelurahan,
        alamatData.ayah.kode_pos,
        alamatData.ayah.rt,
        alamatData.ayah.rw,
        alamatData.ayah.alamat,
      ];
      const ibuFields = [
        alamatData.ibu.status_kepemilikan,
        alamatData.ibu.provinsi,
        alamatData.ibu.kabupaten,
        alamatData.ibu.kecamatan,
        alamatData.ibu.kelurahan,
        alamatData.ibu.kode_pos,
        alamatData.ibu.rt,
        alamatData.ibu.rw,
        alamatData.ibu.alamat,
      ];
      const santriFields = [
        alamatData.santri.status_mukim,
        alamatData.santri.status_tempat_tinggal,
        alamatData.santri.jarak_lembaga,
        alamatData.santri.transportasi,
        alamatData.santri.waktu_tempuh,
        alamatData.santri.provinsi,
        alamatData.santri.kabupaten,
        alamatData.santri.kecamatan,
        alamatData.santri.kelurahan,
        alamatData.santri.kode_pos,
        alamatData.santri.rt,
        alamatData.santri.rw,
        alamatData.santri.alamat,
      ];

      const allFields = [...ayahFields, ...ibuFields, ...santriFields];
      const filledCount = allFields.filter((field) => Boolean(field)).length;
      const total = allFields.length;
      return (filledCount / total) * 100;
    };

    setProgress(calculateProgress());
  }, [alamatData]);

  /* ==================== HANDLER FUNCTIONS ==================== */

  const handleInputChange = (
    field: string,
    value: string | boolean,
    type: "ayah" | "ibu" | "santri"
  ): void => {
    setAlamatData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (
    field: string,
    checked: boolean,
    type: "ayah" | "ibu" | "santri"
  ): void => {
    setAlamatData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: checked,
      },
    }));
  };

  const handleIbuSamaDenganAyah = (checked: boolean): void => {
    if (checked) {
      setAlamatData((prev) => ({
        ...prev,
        ibu: { ...prev.ayah },
      }));
    } else {
      setAlamatData((prev) => ({
        ...prev,
        ibu: {
          status_kepemilikan: "",
          provinsi: "",
          kabupaten: "",
          kecamatan: "",
          kelurahan: "",
          kode_pos: "",
          rt: "",
          rw: "",
          alamat: "",
        },
      }));
    }
  };

  // Fungsi validasi menggunakan Zod
  const validateAlamatData = (): boolean => {
    const parsed = AlamatDataSchema.safeParse(alamatData);
    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.format());
      toast.error("Data alamat tidak valid. Periksa kembali isian Anda.");
      return false;
    }
    return true;
  };

  // Fungsi untuk submit data baru
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep("Validasi data");
    setProcessingProgress(10);

    if (!santriId) {
      toast.error("Santri ID tidak ditemukan.");
      setIsProcessing(false);
      return;
    }

    if (!validateAlamatData()) {
      setIsProcessing(false);
      return;
    }

    try {
      setProcessingStep("Menyimpan data utama");
      setProcessingProgress(50);

      const { error } = await supabase.from("alamat").insert({
        santri_id: santriId,
        ayah_status_kepemilikan: alamatData.ayah.status_kepemilikan,
        ayah_provinsi: alamatData.ayah.provinsi,
        ayah_kabupaten: alamatData.ayah.kabupaten,
        ayah_kecamatan: alamatData.ayah.kecamatan,
        ayah_kelurahan: alamatData.ayah.kelurahan,
        ayah_kode_pos: alamatData.ayah.kode_pos,
        ayah_rt: alamatData.ayah.rt,
        ayah_rw: alamatData.ayah.rw,
        ayah_alamat: alamatData.ayah.alamat,
        ibu_status_kepemilikan: alamatData.ibu.status_kepemilikan,
        ibu_provinsi: alamatData.ibu.provinsi,
        ibu_kabupaten: alamatData.ibu.kabupaten,
        ibu_kecamatan: alamatData.ibu.kecamatan,
        ibu_kelurahan: alamatData.ibu.kelurahan,
        ibu_kode_pos: alamatData.ibu.kode_pos,
        ibu_rt: alamatData.ibu.rt,
        ibu_rw: alamatData.ibu.rw,
        ibu_alamat: alamatData.ibu.alamat,
        santri_status_mukim: alamatData.santri.status_mukim,
        santri_status_tempat_tinggal: alamatData.santri.status_tempat_tinggal,
        santri_jarak_lembaga: alamatData.santri.jarak_lembaga,
        santri_transportasi: alamatData.santri.transportasi,
        santri_waktu_tempuh: alamatData.santri.waktu_tempuh,
        santri_provinsi: alamatData.santri.provinsi,
        santri_kabupaten: alamatData.santri.kabupaten,
        santri_kecamatan: alamatData.santri.kecamatan,
        santri_kelurahan: alamatData.santri.kelurahan,
        santri_kode_pos: alamatData.santri.kode_pos,
        santri_rt: alamatData.santri.rt,
        santri_rw: alamatData.santri.rw,
        santri_alamat: alamatData.santri.alamat,
      });
      if (error) {
        console.error("Error inserting data:", error.message);
        toast.error("Gagal menyimpan data alamat.");
      } else {
        setProcessingProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Data alamat berhasil disimpan!");
      }
    } catch (err) {
      console.error("Error during submission:", err);
      toast.error("Terjadi kesalahan saat mendaftar.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Fungsi untuk update data yang sudah ada
  const handleUpdate = async (): Promise<void> => {
    setIsProcessing(true);
    setProcessingStep("Validasi data");
    setProcessingProgress(10);

    if (!santriId) {
      toast.error("Santri ID tidak ditemukan.");
      setIsProcessing(false);
      return;
    }

    try {
      setProcessingStep("Menyimpan data utama");
      setProcessingProgress(50);
      const { error } = await supabase
        .from("alamat")
        .update({
          ayah_status_kepemilikan: alamatData.ayah.status_kepemilikan,
          ayah_provinsi: alamatData.ayah.provinsi,
          ayah_kabupaten: alamatData.ayah.kabupaten,
          ayah_kecamatan: alamatData.ayah.kecamatan,
          ayah_kelurahan: alamatData.ayah.kelurahan,
          ayah_kode_pos: alamatData.ayah.kode_pos,
          ayah_rt: alamatData.ayah.rt,
          ayah_rw: alamatData.ayah.rw,
          ayah_alamat: alamatData.ayah.alamat,
          ibu_status_kepemilikan: alamatData.ibu.status_kepemilikan,
          ibu_provinsi: alamatData.ibu.provinsi,
          ibu_kabupaten: alamatData.ibu.kabupaten,
          ibu_kecamatan: alamatData.ibu.kecamatan,
          ibu_kelurahan: alamatData.ibu.kelurahan,
          ibu_kode_pos: alamatData.ibu.kode_pos,
          ibu_rt: alamatData.ibu.rt,
          ibu_rw: alamatData.ibu.rw,
          ibu_alamat: alamatData.ibu.alamat,
          santri_status_mukim: alamatData.santri.status_mukim,
          santri_status_tempat_tinggal: alamatData.santri.status_tempat_tinggal,
          santri_jarak_lembaga: alamatData.santri.jarak_lembaga,
          santri_transportasi: alamatData.santri.transportasi,
          santri_waktu_tempuh: alamatData.santri.waktu_tempuh,
          santri_provinsi: alamatData.santri.provinsi,
          santri_kabupaten: alamatData.santri.kabupaten,
          santri_kecamatan: alamatData.santri.kecamatan,
          santri_kelurahan: alamatData.santri.kelurahan,
          santri_kode_pos: alamatData.santri.kode_pos,
          santri_rt: alamatData.santri.rt,
          santri_rw: alamatData.santri.rw,
          santri_alamat: alamatData.santri.alamat,
        })
        .eq("santri_id", santriId);
      if (error) {
        toast.error("Gagal menyimpan perubahan.");
      } else {
        setIsEditMode(false);
        setProcessingProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Perubahan berhasil disimpan!");
      }
    } catch (err) {
      console.error("Error during update:", err);
      toast.error("Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const enterEditMode = () => {
    setBackupAlamatData(alamatData);
    setIsEditMode(true);
  };

  const cancelEditMode = () => {
    if (backupAlamatData) {
      setAlamatData(backupAlamatData);
    }
    setIsEditMode(false);
  };

  return {
    isEditMode,
    setIsEditMode,
    hasData,
    progress,
    alamatData,
    setAlamatData,
    santriId,
    handleInputChange,
    handleCheckboxChange,
    handleIbuSamaDenganAyah,
    handleSubmit,
    handleUpdate,
    isProcessing,
    processingStep,
    processingProgress,
    enterEditMode,
    cancelEditMode,
  };
};
