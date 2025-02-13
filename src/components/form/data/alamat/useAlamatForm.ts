// src/components/form/data/alamat/useAlamatForm.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";

export interface AyahIbuAlamat {
  tinggal_luar_negeri: boolean;
  status_kepemilikan: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  kode_pos: string;
  rt: string;
  rw: string;
  alamat: string;
}

export interface SantriAlamat {
  status_mukim: string;
  status_tempat_tinggal: string;
  jarak_lembaga: string;
  transportasi: string;
  waktu_tempuh: string;
  koordinat: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  kode_pos: string;
  rt: string;
  rw: string;
  alamat: string;
}

export interface AlamatData {
  ayah: AyahIbuAlamat;
  ibu: AyahIbuAlamat;
  santri: SantriAlamat;
}

export const useAlamatForm = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [alamatData, setAlamatData] = useState<AlamatData>({
    ayah: {
      tinggal_luar_negeri: false,
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
    ibu: {
      tinggal_luar_negeri: false,
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
    santri: {
      status_mukim: "",
      status_tempat_tinggal: "",
      jarak_lembaga: "",
      transportasi: "",
      waktu_tempuh: "",
      koordinat: "",
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

  // Ambil santriId berdasarkan user_id
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

  // Ambil data alamat berdasarkan santriId
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
            tinggal_luar_negeri: alamat.ayah_tinggal_luar_negeri || false,
            status_kepemilikan: alamat.ayah_status_kepemilikan || "",
            provinsi: alamat.ayah_provinsi || "",
            kabupaten: alamat.ayah_kabupaten || "",
            kecamatan: alamat.ayah_kecamatan || "",
            kelurahan: alamat.ayah_kelurahan || "",
            kode_pos: alamat.ayah_kode_pos || "",
            rt: alamat.ayah_rt || "",
            rw: alamat.ayah_rw || "",
            alamat: alamat.ayah_alamat || "",
          },
          ibu: {
            tinggal_luar_negeri: alamat.ibu_tinggal_luar_negeri || false,
            status_kepemilikan: alamat.ibu_status_kepemilikan || "",
            provinsi: alamat.ibu_provinsi || "",
            kabupaten: alamat.ibu_kabupaten || "",
            kecamatan: alamat.ibu_kecamatan || "",
            kelurahan: alamat.ibu_kelurahan || "",
            kode_pos: alamat.ibu_kode_pos || "",
            rt: alamat.ibu_rt || "",
            rw: alamat.ibu_rw || "",
            alamat: alamat.ibu_alamat || "",
          },
          santri: {
            status_mukim: alamat.santri_status_mukim || "",
            status_tempat_tinggal: alamat.santri_status_tempat_tinggal || "",
            jarak_lembaga: alamat.santri_jarak_lembaga || "",
            transportasi: alamat.santri_transportasi || "",
            waktu_tempuh: alamat.santri_waktu_tempuh || "",
            koordinat: alamat.santri_koordinat || "",
            provinsi: alamat.santri_provinsi || "",
            kabupaten: alamat.santri_kabupaten || "",
            kecamatan: alamat.santri_kecamatan || "",
            kelurahan: alamat.santri_kelurahan || "",
            kode_pos: alamat.santri_kode_pos || "",
            rt: alamat.santri_rt || "",
            rw: alamat.santri_rw || "",
            alamat: alamat.santri_alamat || "",
          },
        });
        setHasData(true);
      } else {
        setHasData(false);
      }
    };
    fetchAlamatData();
  }, [santriId]);

  // Contoh fungsi untuk menyamakan data ibu dengan ayah jika diperlukan
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
          tinggal_luar_negeri: false,
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

  // Fungsi untuk menangani perubahan input
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

  // Fungsi untuk menangani perubahan checkbox
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

  // Fungsi untuk submit data baru
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!santriId) {
      toast.error("Santri ID tidak ditemukan.");
      return;
    }
    try {
      const { error } = await supabase.from("alamat").insert({
        santri_id: santriId,
        ayah_tinggal_luar_negeri: alamatData.ayah.tinggal_luar_negeri,
        ayah_status_kepemilikan: alamatData.ayah.status_kepemilikan,
        ayah_provinsi: alamatData.ayah.provinsi,
        ayah_kabupaten: alamatData.ayah.kabupaten,
        ayah_kecamatan: alamatData.ayah.kecamatan,
        ayah_kelurahan: alamatData.ayah.kelurahan,
        ayah_kode_pos: alamatData.ayah.kode_pos,
        ayah_rt: alamatData.ayah.rt,
        ayah_rw: alamatData.ayah.rw,
        ayah_alamat: alamatData.ayah.alamat,
        ibu_tinggal_luar_negeri: alamatData.ibu.tinggal_luar_negeri,
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
        santri_koordinat: alamatData.santri.koordinat,
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
        toast.success("Data alamat berhasil disimpan!");
      }
    } catch (err) {
      console.error("Error during submission:", err);
      toast.error("Terjadi kesalahan saat mendaftar.");
    }
  };

  // Fungsi untuk mengupdate data
  const handleUpdate = async (): Promise<void> => {
    if (!santriId) {
      toast.error("Santri ID tidak ditemukan.");
      return;
    }
    try {
      const { error } = await supabase
        .from("alamat")
        .update({
          ayah_tinggal_luar_negeri: alamatData.ayah.tinggal_luar_negeri,
          ayah_status_kepemilikan: alamatData.ayah.status_kepemilikan,
          ayah_provinsi: alamatData.ayah.provinsi,
          ayah_kabupaten: alamatData.ayah.kabupaten,
          ayah_kecamatan: alamatData.ayah.kecamatan,
          ayah_kelurahan: alamatData.ayah.kelurahan,
          ayah_kode_pos: alamatData.ayah.kode_pos,
          ayah_rt: alamatData.ayah.rt,
          ayah_rw: alamatData.ayah.rw,
          ayah_alamat: alamatData.ayah.alamat,
          ibu_tinggal_luar_negeri: alamatData.ibu.tinggal_luar_negeri,
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
          santri_koordinat: alamatData.santri.koordinat,
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
        toast.success("Perubahan berhasil disimpan!");
        setIsEditMode(false);
      }
    } catch (err) {
      console.error("Error during update:", err);
      toast.error("Terjadi kesalahan saat menyimpan perubahan.");
    }
  };

  // Hitung progress pengisian formulir
  useEffect(() => {
    const calculateProgress = (): number => {
      const requiredFields: Array<string | number | boolean | undefined> = [];

      // Field Ayah
      requiredFields.push(
        alamatData.ayah.tinggal_luar_negeri !== undefined,
        alamatData.ayah.status_kepemilikan,
        alamatData.ayah.provinsi,
        alamatData.ayah.kabupaten,
        alamatData.ayah.kecamatan,
        alamatData.ayah.kelurahan,
        alamatData.ayah.kode_pos,
        alamatData.ayah.rt,
        alamatData.ayah.rw,
        alamatData.ayah.alamat
      );

      // Field Ibu (misal: hanya jika tidak tinggal di luar negeri)
      if (!alamatData.ibu.tinggal_luar_negeri) {
        requiredFields.push(
          alamatData.ibu.status_kepemilikan,
          alamatData.ibu.provinsi,
          alamatData.ibu.kabupaten,
          alamatData.ibu.kecamatan,
          alamatData.ibu.kelurahan,
          alamatData.ibu.kode_pos,
          alamatData.ibu.rt,
          alamatData.ibu.rw,
          alamatData.ibu.alamat
        );
      }

      // Field Santri
      requiredFields.push(
        alamatData.santri.status_mukim,
        alamatData.santri.status_tempat_tinggal,
        alamatData.santri.jarak_lembaga,
        alamatData.santri.transportasi,
        alamatData.santri.waktu_tempuh,
        alamatData.santri.koordinat,
        alamatData.santri.provinsi,
        alamatData.santri.kabupaten,
        alamatData.santri.kecamatan,
        alamatData.santri.kelurahan,
        alamatData.santri.kode_pos,
        alamatData.santri.rt,
        alamatData.santri.rw,
        alamatData.santri.alamat
      );

      const filled = requiredFields.filter(Boolean).length;
      const total = requiredFields.length;
      return (filled / total) * 100;
    };

    setProgress(calculateProgress());
  }, [alamatData]);

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
  };
};
