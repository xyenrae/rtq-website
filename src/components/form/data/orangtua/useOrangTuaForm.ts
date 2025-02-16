"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { z } from "zod";

/* ==================== ZOD SCHEMA DEFINITIONS ==================== */

// Schema untuk data ayah/ibu
const AyahIbuSchema = z.object({
  nama: z.string().min(1, { message: "Nama wajib diisi" }),
  nik: z.string().min(1, { message: "NIK wajib diisi" }),
  kewarganegaraan: z
    .string()
    .min(1, { message: "Kewarganegaraan wajib diisi" }),
  tempat_lahir: z.string().min(1, { message: "Tempat lahir wajib diisi" }),
  // Menggunakan preprocess untuk mengubah input menjadi Date jika memungkinkan
  tanggal_lahir: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg);
    }
    return null;
  }, z.date().nullable()),
  status: z.string().min(1, { message: "Status wajib diisi" }),
  pendidikan_terakhir: z
    .string()
    .min(1, { message: "Pendidikan terakhir wajib diisi" }),
  penghasilan: z.string().min(1, { message: "Penghasilan wajib diisi" }),
  pekerjaan: z.string().min(1, { message: "Pekerjaan wajib diisi" }),
  nomor_hp: z.string().min(1, { message: "Nomor HP wajib diisi" }),
});

// Schema untuk data wali
const WaliSchema = z.object({
  sama_dengan_ayah: z.boolean(),
  kartu_keluarga_sama: z.boolean(),
});

// Schema untuk keseluruhan data orang tua
const OrangTuaDataSchema = z.object({
  ayah: AyahIbuSchema,
  ibu: AyahIbuSchema,
  wali: WaliSchema,
});

export type OrangTuaData = z.infer<typeof OrangTuaDataSchema>;

/* ==================== HOOK: useOrangTuaForm ==================== */

export const useOrangTuaForm = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [backupOrangTuaData, setBackupOrangTuaData] =
    useState<OrangTuaData | null>(null);
  const [orangTuaData, setOrangTuaData] = useState<OrangTuaData>({
    ayah: {
      nama: "",
      nik: "",
      kewarganegaraan: "WNI",
      tempat_lahir: "",
      tanggal_lahir: null,
      status: "Hidup",
      pendidikan_terakhir: "",
      penghasilan: "",
      pekerjaan: "",
      nomor_hp: "",
    },
    ibu: {
      nama: "",
      nik: "",
      kewarganegaraan: "WNI",
      tempat_lahir: "",
      tanggal_lahir: null,
      status: "Hidup",
      pendidikan_terakhir: "",
      penghasilan: "",
      pekerjaan: "",
      nomor_hp: "",
    },
    wali: {
      sama_dengan_ayah: false,
      kartu_keluarga_sama: false,
    },
  });
  const [santriId, setSantriId] = useState<number | null>(null);

  /* -------------------- FETCH DATA -------------------- */

  // Fetch santri_id berdasarkan user_id
  useEffect(() => {
    const fetchSantriId = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data, error } = await supabase
        .from("santri")
        .select("id")
        .eq("user_id", userData.user.id);
      if (error) {
        console.error("Error fetching santri ID:", error.message);
      } else if (data && data.length > 0) {
        setSantriId(data[0].id);
      }
    };
    fetchSantriId();
  }, []);

  // Fetch data orang tua berdasarkan santri_id
  useEffect(() => {
    const fetchOrangTuaData = async () => {
      if (!santriId) return;
      const { data, error } = await supabase
        .from("orang_tua")
        .select("*")
        .eq("santri_id", santriId);
      if (error) {
        console.error("Error fetching orang tua data:", error.message);
        setHasData(false);
      } else if (data && Array.isArray(data) && data.length > 0) {
        const ot = data[0];
        setOrangTuaData({
          ayah: {
            nama: ot.ayah_nama || "",
            nik: ot.ayah_nik || "",
            kewarganegaraan: ot.ayah_kewarganegaraan || "WNI",
            tempat_lahir: ot.ayah_tempat_lahir || "",
            tanggal_lahir: ot.ayah_tanggal_lahir
              ? new Date(ot.ayah_tanggal_lahir)
              : null,
            status: ot.ayah_status || "Hidup",
            pendidikan_terakhir: ot.ayah_pendidikan_terakhir || "",
            penghasilan: ot.ayah_penghasilan || "",
            pekerjaan: ot.ayah_pekerjaan || "",
            nomor_hp: ot.ayah_nomor_hp || "",
          },
          ibu: {
            nama: ot.ibu_nama || "",
            nik: ot.ibu_nik || "",
            kewarganegaraan: ot.ibu_kewarganegaraan || "WNI",
            tempat_lahir: ot.ibu_tempat_lahir || "",
            tanggal_lahir: ot.ibu_tanggal_lahir
              ? new Date(ot.ibu_tanggal_lahir)
              : null,
            status: ot.ibu_status || "Hidup",
            pendidikan_terakhir: ot.ibu_pendidikan_terakhir || "",
            penghasilan: ot.ibu_penghasilan || "",
            pekerjaan: ot.ibu_pekerjaan || "",
            nomor_hp: ot.ibu_nomor_hp || "",
          },
          wali: {
            sama_dengan_ayah: ot.wali_sama_dengan_ayah || false,
            kartu_keluarga_sama: ot.wali_kartu_keluarga_sama || false,
          },
        });
        setHasData(true);
      } else {
        setHasData(false);
      }
    };
    fetchOrangTuaData();
  }, [santriId]);

  /* -------------------- PROGRESS CALCULATION -------------------- */

  // Hitung progress pengisian formulir berdasarkan jumlah field yang terisi
  useEffect(() => {
    const calculateProgress = (): number => {
      const ayahFields = [
        orangTuaData.ayah.nama,
        orangTuaData.ayah.nik,
        orangTuaData.ayah.kewarganegaraan,
        orangTuaData.ayah.tempat_lahir,
        orangTuaData.ayah.tanggal_lahir,
        orangTuaData.ayah.status,
        orangTuaData.ayah.pendidikan_terakhir,
        orangTuaData.ayah.penghasilan,
        orangTuaData.ayah.pekerjaan,
        orangTuaData.ayah.nomor_hp,
      ];

      const ibuFields = [
        orangTuaData.ibu.nama,
        orangTuaData.ibu.nik,
        orangTuaData.ibu.kewarganegaraan,
        orangTuaData.ibu.tempat_lahir,
        orangTuaData.ibu.tanggal_lahir,
        orangTuaData.ibu.status,
        orangTuaData.ibu.pendidikan_terakhir,
        orangTuaData.ibu.penghasilan,
        orangTuaData.ibu.pekerjaan,
        orangTuaData.ibu.nomor_hp,
      ];

      const waliFields = [
        typeof orangTuaData.wali.sama_dengan_ayah === "boolean",
        typeof orangTuaData.wali.kartu_keluarga_sama === "boolean",
      ];

      const allFields = [...ayahFields, ...ibuFields, ...waliFields];
      const filledCount = allFields.filter((field) => Boolean(field)).length;
      return (filledCount / allFields.length) * 100;
    };

    setProgress(calculateProgress());
  }, [orangTuaData]);

  /* -------------------- HANDLER FUNCTIONS -------------------- */

  // Handle perubahan input untuk ayah, ibu, atau wali
  const handleInputChange = (
    field: string,
    value: string | number | boolean | Date | null,
    type: "ayah" | "ibu" | "wali"
  ) => {
    setOrangTuaData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  // Handle perubahan checkbox untuk ayah, ibu, atau wali
  const handleCheckboxChange = (
    field: string,
    checked: boolean,
    type: "ayah" | "ibu" | "wali"
  ) => {
    setOrangTuaData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: checked,
      },
    }));
  };

  /* -------------------- VALIDATION FUNCTION -------------------- */

  // Validasi data menggunakan Zod
  const validateOrangTuaData = (): boolean => {
    const result = OrangTuaDataSchema.safeParse(orangTuaData);
    if (!result.success) {
      console.error("Validation errors:", result.error.format());
      toast.error("Data orang tua tidak valid. Periksa kembali isian Anda.");
      return false;
    }
    return true;
  };

  /* -------------------- SUBMIT & UPDATE HANDLERS -------------------- */

  // Handle submit data baru
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep("Validasi data");
    setProcessingProgress(10);

    if (!santriId) {
      toast.error("Santri ID tidak ditemukan.");
      setIsProcessing(false);
      return;
    }

    if (!validateOrangTuaData()) {
      setIsProcessing(false);
      return;
    }

    try {
      setProcessingStep("Menyimpan data utama");
      setProcessingProgress(50);

      const { error } = await supabase.from("orang_tua").insert({
        santri_id: santriId,
        ayah_nama: orangTuaData.ayah.nama,
        ayah_nik: orangTuaData.ayah.nik,
        ayah_kewarganegaraan: orangTuaData.ayah.kewarganegaraan,
        ayah_tempat_lahir: orangTuaData.ayah.tempat_lahir,
        ayah_tanggal_lahir: orangTuaData.ayah.tanggal_lahir?.toISOString(),
        ayah_status: orangTuaData.ayah.status,
        ayah_pendidikan_terakhir: orangTuaData.ayah.pendidikan_terakhir,
        ayah_penghasilan: orangTuaData.ayah.penghasilan,
        ayah_pekerjaan: orangTuaData.ayah.pekerjaan,
        ayah_nomor_hp: orangTuaData.ayah.nomor_hp,
        ibu_nama: orangTuaData.ibu.nama,
        ibu_nik: orangTuaData.ibu.nik,
        ibu_kewarganegaraan: orangTuaData.ibu.kewarganegaraan,
        ibu_tempat_lahir: orangTuaData.ibu.tempat_lahir,
        ibu_tanggal_lahir: orangTuaData.ibu.tanggal_lahir?.toISOString(),
        ibu_status: orangTuaData.ibu.status,
        ibu_pendidikan_terakhir: orangTuaData.ibu.pendidikan_terakhir,
        ibu_penghasilan: orangTuaData.ibu.penghasilan,
        ibu_pekerjaan: orangTuaData.ibu.pekerjaan,
        ibu_nomor_hp: orangTuaData.ibu.nomor_hp,
        wali_sama_dengan_ayah: orangTuaData.wali.sama_dengan_ayah,
        wali_kartu_keluarga_sama: orangTuaData.wali.kartu_keluarga_sama,
      });

      if (error) {
        console.error("Error inserting data:", error.message);
        toast.error("Gagal menyimpan data orang tua.");
      } else {
        setHasData(true);
        setProcessingProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Data orang tua berhasil disimpan!");
      }
    } catch (err) {
      console.error("Error during submission:", err);
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

    if (!santriId) {
      toast.error("Santri ID tidak ditemukan.");
      setIsProcessing(false);
      return;
    }

    try {
      setProcessingStep("Menyimpan data utama");
      setProcessingProgress(50);

      const { error } = await supabase
        .from("orang_tua")
        .update({
          ayah_nama: orangTuaData.ayah.nama,
          ayah_nik: orangTuaData.ayah.nik,
          ayah_kewarganegaraan: orangTuaData.ayah.kewarganegaraan,
          ayah_tempat_lahir: orangTuaData.ayah.tempat_lahir,
          ayah_tanggal_lahir: orangTuaData.ayah.tanggal_lahir?.toISOString(),
          ayah_status: orangTuaData.ayah.status,
          ayah_pendidikan_terakhir: orangTuaData.ayah.pendidikan_terakhir,
          ayah_penghasilan: orangTuaData.ayah.penghasilan,
          ayah_pekerjaan: orangTuaData.ayah.pekerjaan,
          ayah_nomor_hp: orangTuaData.ayah.nomor_hp,
          ibu_nama: orangTuaData.ibu.nama,
          ibu_nik: orangTuaData.ibu.nik,
          ibu_kewarganegaraan: orangTuaData.ibu.kewarganegaraan,
          ibu_tempat_lahir: orangTuaData.ibu.tempat_lahir,
          ibu_tanggal_lahir: orangTuaData.ibu.tanggal_lahir?.toISOString(),
          ibu_status: orangTuaData.ibu.status,
          ibu_pendidikan_terakhir: orangTuaData.ibu.pendidikan_terakhir,
          ibu_penghasilan: orangTuaData.ibu.penghasilan,
          ibu_pekerjaan: orangTuaData.ibu.pekerjaan,
          ibu_nomor_hp: orangTuaData.ibu.nomor_hp,
          wali_sama_dengan_ayah: orangTuaData.wali.sama_dengan_ayah,
          wali_kartu_keluarga_sama: orangTuaData.wali.kartu_keluarga_sama,
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
    setBackupOrangTuaData(orangTuaData);
    setIsEditMode(true);
  };

  const cancelEditMode = () => {
    if (backupOrangTuaData) {
      setOrangTuaData(backupOrangTuaData);
    }
    setIsEditMode(false);
  };

  return {
    isEditMode,
    setIsEditMode,
    hasData,
    progress,
    orangTuaData,
    setOrangTuaData,
    santriId,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleUpdate,
    isProcessing,
    processingStep,
    processingProgress,
    enterEditMode,
    cancelEditMode,
  };
};
