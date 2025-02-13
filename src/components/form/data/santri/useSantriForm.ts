// src/components/form/data/santri/useSantriForm.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { uploadFileToCloudinary } from "./santriService";

export interface SantriData {
  id?: string;
  nama_lengkap: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: Date | null;
  jenis_kelamin: string;
  jumlah_saudara: number | null;
  anak_ke: number | null;
  cita_cita: string;
  nomor_hp: string;
  has_no_hp: boolean;
  email: string;
  hobi: string;
  sumber_pembiayaan: string;
  nomor_kip: string;
  kebutuhan_khusus: string;
  kebutuhan_disabilitas: string;
  nomor_kk: string;
  nama_kepala_keluarga: string;
  kk_image_file: File | null;
  kip_image_file: File | null;
  profile_image_file: File | null;
  profile_image_url: string | null;
  kk_image_url: string | null;
  kip_image_url: string | null;
}

export const useSantriForm = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
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
    has_no_hp: true,
    email: "",
    hobi: "",
    sumber_pembiayaan: "Orang Tua",
    nomor_kip: "",
    kebutuhan_khusus: "Tidak Ada",
    kebutuhan_disabilitas: "Tidak Ada",
    nomor_kk: "",
    nama_kepala_keluarga: "",
    kk_image_file: null,
    kip_image_file: null,
    profile_image_file: null,
    profile_image_url: null,
    kk_image_url: null,
    kip_image_url: null,
  });

  // Ambil data santri dari Supabase (jika ada)
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
        setSantriData((prevData) => ({ ...prevData, ...updatedSantri }));
        setHasData(true);
      }
    };

    fetchSantriData();
  }, []);

  // Hitung progress pengisian formulir
  useEffect(() => {
    const calculateProgress = () => {
      const requiredFields = [
        santriData.profile_image_file || santriData.profile_image_url,
        santriData.kk_image_file || santriData.kk_image_url,
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
        santriData.nomor_kip,
        santriData.kebutuhan_khusus,
        santriData.kebutuhan_disabilitas,
        santriData.nomor_kk,
        santriData.nama_kepala_keluarga,
        !santriData.has_no_hp ? santriData.nomor_hp : true,
      ];
      const filled = requiredFields.filter(Boolean).length;
      const total = requiredFields.length;
      return (filled / total) * 100;
    };

    setProgress(calculateProgress());
  }, [santriData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsProcessing(true);
    setProcessingStep("Validasi data");
    setProcessingProgress(10);

    if (!santriData.has_no_hp && !santriData.nomor_hp.trim()) {
      alert(
        "Harap pilih salah satu: masukkan nomor HP atau centang 'Tidak memiliki nomor HP'"
      );
      return;
    }
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Anda harus login terlebih dahulu.");
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
          nomor_hp: santriData.has_no_hp ? null : santriData.nomor_hp,
          email: santriData.email,
          hobi: santriData.hobi,
          sumber_pembiayaan: santriData.sumber_pembiayaan,
          nomor_kip: santriData.nomor_kip,
          kebutuhan_khusus: santriData.kebutuhan_khusus,
          kebutuhan_disabilitas: santriData.kebutuhan_disabilitas,
          nomor_kk: santriData.nomor_kk,
          nama_kepala_keluarga: santriData.nama_kepala_keluarga,
          kk_image_url: null,
          kip_image_url: null,
          profile_image_url: null,
        })
        .select();

      if (error || !data || data.length === 0) {
        toast.error("Gagal menyimpan data santri.");
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
      if (santriData.kip_image_file) {
        uploadPromises.push(
          uploadFileToCloudinary(santriData.kip_image_file)
            .then((url) =>
              supabase
                .from("santri")
                .update({ kip_image_url: url })
                .eq("id", insertedRecordId)
            )
            .catch((err) => {
              console.error(err);
              toast.error("Terjadi kesalahan saat mengupload KIP.");
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

  // Fungsi untuk memperbarui data santri yang sudah ada
  const handleUpdate = async () => {
    setIsProcessing(true);
    setProcessingStep("Validasi data");
    setProcessingProgress(10);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user || !santriData.id) return;

      const formattedTanggalLahir = santriData.tanggal_lahir
        ? new Date(santriData.tanggal_lahir).toISOString()
        : null;

      let profileImageUrl = santriData.profile_image_url;
      let kkImageUrl = santriData.kk_image_url;
      let kipImageUrl = santriData.kip_image_url;

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
        santriData.kip_image_file
          ? uploadFileToCloudinary(santriData.kip_image_file).catch((err) => {
              console.error(err);
              toast.error("Terjadi kesalahan saat mengupload KIP.");
              return null;
            })
          : Promise.resolve(null),
      ]);

      if (uploads[0]) profileImageUrl = uploads[0];
      if (uploads[1]) kkImageUrl = uploads[1];
      if (uploads[2]) kipImageUrl = uploads[2];

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
          nomor_hp: santriData.has_no_hp ? null : santriData.nomor_hp,
          email: santriData.email,
          hobi: santriData.hobi,
          sumber_pembiayaan: santriData.sumber_pembiayaan,
          nomor_kip: santriData.nomor_kip,
          kebutuhan_khusus: santriData.kebutuhan_khusus,
          kebutuhan_disabilitas: santriData.kebutuhan_disabilitas,
          nomor_kk: santriData.nomor_kk,
          nama_kepala_keluarga: santriData.nama_kepala_keluarga,
          kk_image_url: kkImageUrl,
          kip_image_url: kipImageUrl,
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
  };
};
