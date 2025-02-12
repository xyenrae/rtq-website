"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

interface AyahIbu {
  nama: string;
  nik: string;
  kewarganegaraan: string;
  tempat_lahir: string;
  tanggal_lahir: Date | null;
  status: string;
  pendidikan_terakhir: string;
  penghasilan: string;
  pekerjaan: string;
  nomor_hp: string;
  has_no_hp: boolean;
}

interface Wali {
  sama_dengan_ayah: boolean;
  kartu_keluarga_sama: boolean;
}

interface OrangTuaData {
  ayah: AyahIbu;
  ibu: AyahIbu;
  wali: Wali;
}

export default function OrangTuaForm() {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [orangTuaData, setOrangTuaData] = useState<OrangTuaData>({
    ayah: {
      nama: "",
      nik: "",
      kewarganegaraan: "",
      tempat_lahir: "",
      tanggal_lahir: null,
      status: "",
      pendidikan_terakhir: "",
      penghasilan: "",
      pekerjaan: "",
      nomor_hp: "",
      has_no_hp: false,
    },
    ibu: {
      nama: "",
      nik: "",
      kewarganegaraan: "",
      tempat_lahir: "",
      tanggal_lahir: null,
      status: "",
      pendidikan_terakhir: "",
      penghasilan: "",
      pekerjaan: "",
      nomor_hp: "",
      has_no_hp: false,
    },
    wali: {
      sama_dengan_ayah: false,
      kartu_keluarga_sama: false,
    },
  });
  const [santriId, setSantriId] = useState<number | null>(null);

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
            kewarganegaraan: ot.ayah_kewarganegaraan || "",
            tempat_lahir: ot.ayah_tempat_lahir || "",
            tanggal_lahir: ot.ayah_tanggal_lahir
              ? new Date(ot.ayah_tanggal_lahir)
              : null,
            status: ot.ayah_status || "",
            pendidikan_terakhir: ot.ayah_pendidikan_terakhir || "",
            penghasilan: ot.ayah_penghasilan || "",
            pekerjaan: ot.ayah_pekerjaan || "",
            nomor_hp: ot.ayah_nomor_hp || "",
            has_no_hp: ot.ayah_has_no_hp || false,
          },
          ibu: {
            nama: ot.ibu_nama || "",
            nik: ot.ibu_nik || "",
            kewarganegaraan: ot.ibu_kewarganegaraan || "",
            tempat_lahir: ot.ibu_tempat_lahir || "",
            tanggal_lahir: ot.ibu_tanggal_lahir
              ? new Date(ot.ibu_tanggal_lahir)
              : null,
            status: ot.ibu_status || "",
            pendidikan_terakhir: ot.ibu_pendidikan_terakhir || "",
            penghasilan: ot.ibu_penghasilan || "",
            pekerjaan: ot.ibu_pekerjaan || "",
            nomor_hp: ot.ibu_nomor_hp || "",
            has_no_hp: ot.ibu_has_no_hp || false,
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

  // Handle perubahan input (untuk ayah, ibu, atau wali)
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

  // Handle perubahan checkbox
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

  // Handle submit data baru
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!santriId) {
      toast.error("Santri ID tidak ditemukan.");
      return;
    }
    try {
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
        ayah_nomor_hp: orangTuaData.ayah.has_no_hp
          ? null
          : orangTuaData.ayah.nomor_hp,
        ayah_has_no_hp: orangTuaData.ayah.has_no_hp,
        ibu_nama: orangTuaData.ibu.nama,
        ibu_nik: orangTuaData.ibu.nik,
        ibu_kewarganegaraan: orangTuaData.ibu.kewarganegaraan,
        ibu_tempat_lahir: orangTuaData.ibu.tempat_lahir,
        ibu_tanggal_lahir: orangTuaData.ibu.tanggal_lahir?.toISOString(),
        ibu_status: orangTuaData.ibu.status,
        ibu_pendidikan_terakhir: orangTuaData.ibu.pendidikan_terakhir,
        ibu_penghasilan: orangTuaData.ibu.penghasilan,
        ibu_pekerjaan: orangTuaData.ibu.pekerjaan,
        ibu_nomor_hp: orangTuaData.ibu.has_no_hp
          ? null
          : orangTuaData.ibu.nomor_hp,
        ibu_has_no_hp: orangTuaData.ibu.has_no_hp,
        wali_sama_dengan_ayah: orangTuaData.wali.sama_dengan_ayah,
        wali_kartu_keluarga_sama: orangTuaData.wali.kartu_keluarga_sama,
      });
      if (error) {
        console.error("Error inserting data:", error.message);
        toast.error("Gagal menyimpan data orang tua.");
      } else {
        toast.success("Data orang tua berhasil disimpan!");
      }
    } catch (err) {
      console.error("Error during submission:", err);
      toast.error("Terjadi kesalahan saat mendaftar.");
    }
  };

  // Handle update data
  const handleUpdate = async () => {
    if (!santriId) {
      toast.error("Santri ID tidak ditemukan.");
      return;
    }
    try {
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
          ayah_nomor_hp: orangTuaData.ayah.has_no_hp
            ? null
            : orangTuaData.ayah.nomor_hp,
          ayah_has_no_hp: orangTuaData.ayah.has_no_hp,
          ibu_nama: orangTuaData.ibu.nama,
          ibu_nik: orangTuaData.ibu.nik,
          ibu_kewarganegaraan: orangTuaData.ibu.kewarganegaraan,
          ibu_tempat_lahir: orangTuaData.ibu.tempat_lahir,
          ibu_tanggal_lahir: orangTuaData.ibu.tanggal_lahir?.toISOString(),
          ibu_status: orangTuaData.ibu.status,
          ibu_pendidikan_terakhir: orangTuaData.ibu.pendidikan_terakhir,
          ibu_penghasilan: orangTuaData.ibu.penghasilan,
          ibu_pekerjaan: orangTuaData.ibu.pekerjaan,
          ibu_nomor_hp: orangTuaData.ibu.has_no_hp
            ? null
            : orangTuaData.ibu.nomor_hp,
          ibu_has_no_hp: orangTuaData.ibu.has_no_hp,
          wali_sama_dengan_ayah: orangTuaData.wali.sama_dengan_ayah,
          wali_kartu_keluarga_sama: orangTuaData.wali.kartu_keluarga_sama,
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

  useEffect(() => {
    const calculateProgress = () => {
      // Daftar field yang diperlukan untuk ayah, ibu, dan wali
      const requiredFields = [
        orangTuaData.ayah.nama,
        orangTuaData.ayah.nik,
        orangTuaData.ayah.kewarganegaraan,
        orangTuaData.ayah.tempat_lahir,
        orangTuaData.ayah.tanggal_lahir,
        orangTuaData.ayah.status,
        orangTuaData.ayah.pendidikan_terakhir,
        orangTuaData.ayah.penghasilan,
        orangTuaData.ayah.pekerjaan,
        orangTuaData.ayah.has_no_hp ? true : orangTuaData.ayah.nomor_hp,

        orangTuaData.ibu.nama,
        orangTuaData.ibu.nik,
        orangTuaData.ibu.kewarganegaraan,
        orangTuaData.ibu.tempat_lahir,
        orangTuaData.ibu.tanggal_lahir,
        orangTuaData.ibu.status,
        orangTuaData.ibu.pendidikan_terakhir,
        orangTuaData.ibu.penghasilan,
        orangTuaData.ibu.pekerjaan,
        orangTuaData.ibu.has_no_hp ? true : orangTuaData.ibu.nomor_hp,

        orangTuaData.wali.sama_dengan_ayah !== undefined,
        orangTuaData.wali.kartu_keluarga_sama !== undefined,
      ];

      // Hitung jumlah field yang telah diisi
      const filled = requiredFields.filter(Boolean).length;
      const total = requiredFields.length;

      // Hitung persentase progress
      return (filled / total) * 100;
    };

    // Update state progress
    setProgress(calculateProgress());
  }, [orangTuaData]);

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        className="mb-2 sticky top-20 sm:top-24 z-30 bg-white pb-4 border-2 border-gray-300 p-2 rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between mb-2 text-sm font-medium">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-bold">Progress Pengisian Formulir</span>
            <FiCheckCircle
              className={`${
                progress === 100 ? "text-green-500" : "text-gray-600"
              }`}
            />
          </div>
          <span className="text-green-600 font-bold">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="absolute right-0 -top-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
              animate={{ scale: progress === 100 ? 1 : 0.7 }}
            >
              <FiCheckCircle className="inline-block" />
              {progress === 100 && "Lengkap!"}
            </motion.div>
          </motion.div>
        </div>

        {progress === 100 && (
          <motion.div
            className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 Selamat! Semua data telah terisi lengkap
          </motion.div>
        )}
      </motion.div>
      <p className="bg-yellow-400 text-gray-800 p-2 rounded text-sm mb-4 font-semibold">
        Tanda * pada formulir menunjukkan bahwa kolom tersebut wajib diisi
        sebelum Anda dapat melanjutkan ke langkah berikutnya.
      </p>
      <div className="space-y-6">
        {/* Data Ayah */}
        <h2 className="text-lg font-semibold mb-4">Data Ayah</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label>Nama Ayah</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan nama ayah"
              value={orangTuaData.ayah.nama}
              onChange={(e) =>
                handleInputChange("nama", e.target.value, "ayah")
              }
            />
          </div>
          <div>
            <label>NIK Ayah</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan NIK ayah"
              value={orangTuaData.ayah.nik}
              onChange={(e) => handleInputChange("nik", e.target.value, "ayah")}
            />
          </div>
          <div>
            <label>Kewarganegaraan Ayah</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={orangTuaData.ayah.kewarganegaraan}
              onChange={(e) =>
                handleInputChange("kewarganegaraan", e.target.value, "ayah")
              }
            >
              <option value="">Pilih Kewarganegaraan</option>
              <option value="WNI">Warga Negara Indonesia (WNI)</option>
              <option value="WNA">Warga Negara Asing (WNA)</option>
            </select>
          </div>
          <div>
            <label>Tempat Lahir Ayah</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan tempat lahir ayah"
              value={orangTuaData.ayah.tempat_lahir}
              onChange={(e) =>
                handleInputChange("tempat_lahir", e.target.value, "ayah")
              }
            />
          </div>
          <div className="flex flex-col">
            <label>Tanggal Lahir Ayah</label>
            <DatePicker
              selected={orangTuaData.ayah.tanggal_lahir}
              disabled={hasData ? !isEditMode : false}
              onChange={(date) =>
                handleInputChange("tanggal_lahir", date, "ayah")
              }
              placeholderText="Pilih tanggal lahir ayah"
            />
          </div>
          <div>
            <label>Status Ayah</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={orangTuaData.ayah.status}
              onChange={(e) =>
                handleInputChange("status", e.target.value, "ayah")
              }
            >
              <option value="Hidup">Hidup</option>
              <option value="Meninggal">Meninggal</option>
            </select>
          </div>
          <div>
            <label>Pendidikan Terakhir Ayah</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={orangTuaData.ayah.pendidikan_terakhir}
              onChange={(e) =>
                handleInputChange("pendidikan_terakhir", e.target.value, "ayah")
              }
            >
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="Diploma">Diploma</option>
              <option value="Sarjana">Sarjana</option>
              <option value="Magister">Magister</option>
              <option value="Doktor">Doktor</option>
            </select>
          </div>
          <div>
            <label>Penghasilan Ayah</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={orangTuaData.ayah.penghasilan}
              onChange={(e) =>
                handleInputChange("penghasilan", e.target.value, "ayah")
              }
            >
              <option value="< 1 Juta">&lt; 1 Juta</option>
              <option value="1 - 3 Juta">1 - 3 Juta</option>
              <option value="3 - 5 Juta">3 - 5 Juta</option>
              <option value="> 5 Juta">&gt; 5 Juta</option>
            </select>
          </div>
          <div>
            <label>Pekerjaan Ayah</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan pekerjaan ayah"
              value={orangTuaData.ayah.pekerjaan}
              onChange={(e) =>
                handleInputChange("pekerjaan", e.target.value, "ayah")
              }
            />
          </div>
          <div>
            <label>Nomor HP Ayah</label>
            <input
              type="text"
              required={!orangTuaData.ayah.has_no_hp}
              disabled={
                orangTuaData.ayah.has_no_hp || (hasData ? !isEditMode : false)
              }
              placeholder="Masukkan nomor HP ayah"
              value={orangTuaData.ayah.nomor_hp}
              onChange={(e) =>
                handleInputChange("nomor_hp", e.target.value, "ayah")
              }
            />
            <div className="flex gap-2 mt-1">
              <input
                type="checkbox"
                className="w-4 h-4"
                disabled={hasData ? !isEditMode : false}
                checked={orangTuaData.ayah.has_no_hp}
                onChange={(e) =>
                  handleCheckboxChange("has_no_hp", e.target.checked, "ayah")
                }
              />
              <span>Tidak memiliki nomor HP</span>
            </div>
          </div>
        </div>

        {/* Data Ibu */}
        <h2 className="text-lg font-semibold mt-8 mb-4">Data Ibu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label>Nama Ibu</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan nama ibu"
              value={orangTuaData.ibu.nama}
              onChange={(e) => handleInputChange("nama", e.target.value, "ibu")}
            />
          </div>
          <div>
            <label>NIK Ibu</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan NIK ibu"
              value={orangTuaData.ibu.nik}
              onChange={(e) => handleInputChange("nik", e.target.value, "ibu")}
            />
          </div>
          <div>
            <label>Kewarganegaraan Ibu</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={orangTuaData.ibu.kewarganegaraan}
              onChange={(e) =>
                handleInputChange("kewarganegaraan", e.target.value, "ibu")
              }
            >
              <option value="WNI">Warga Negara Indonesia (WNI)</option>
              <option value="WNA">Warga Negara Asing (WNA)</option>
            </select>
          </div>
          <div>
            <label>Tempat Lahir Ibu</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan tempat lahir ibu"
              value={orangTuaData.ibu.tempat_lahir}
              onChange={(e) =>
                handleInputChange("tempat_lahir", e.target.value, "ibu")
              }
            />
          </div>
          <div className="flex flex-col">
            <label>Tanggal Lahir Ibu</label>
            <DatePicker
              selected={orangTuaData.ibu.tanggal_lahir}
              disabled={hasData ? !isEditMode : false}
              onChange={(date) =>
                handleInputChange("tanggal_lahir", date, "ibu")
              }
              placeholderText="Pilih tanggal lahir ibu"
            />
          </div>
          <div>
            <label>Status Ibu</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={orangTuaData.ibu.status}
              onChange={(e) =>
                handleInputChange("status", e.target.value, "ibu")
              }
            >
              <option value="Hidup">Hidup</option>
              <option value="Meninggal">Meninggal</option>
            </select>
          </div>
          <div>
            <label>Pendidikan Terakhir Ibu</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={orangTuaData.ibu.pendidikan_terakhir}
              onChange={(e) =>
                handleInputChange("pendidikan_terakhir", e.target.value, "ibu")
              }
            >
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="Diploma">Diploma</option>
              <option value="Sarjana">Sarjana</option>
              <option value="Magister">Magister</option>
              <option value="Doktor">Doktor</option>
            </select>
          </div>
          <div>
            <label>Penghasilan Ibu</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={orangTuaData.ibu.penghasilan}
              onChange={(e) =>
                handleInputChange("penghasilan", e.target.value, "ibu")
              }
            >
              <option value="< 1 Juta">&lt; 1 Juta</option>
              <option value="1 - 3 Juta">1 - 3 Juta</option>
              <option value="3 - 5 Juta">3 - 5 Juta</option>
              <option value="> 5 Juta">&gt; 5 Juta</option>
            </select>
          </div>
          <div>
            <label>Pekerjaan Ibu</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan pekerjaan ibu"
              value={orangTuaData.ibu.pekerjaan}
              onChange={(e) =>
                handleInputChange("pekerjaan", e.target.value, "ibu")
              }
            />
          </div>
          <div>
            <label>Nomor HP Ibu</label>
            <input
              type="text"
              required={!orangTuaData.ibu.has_no_hp}
              disabled={
                orangTuaData.ibu.has_no_hp || (hasData ? !isEditMode : false)
              }
              placeholder="Masukkan nomor HP ibu"
              value={orangTuaData.ibu.nomor_hp}
              onChange={(e) =>
                handleInputChange("nomor_hp", e.target.value, "ibu")
              }
            />
            <div className="flex gap-2 mt-1">
              <input
                type="checkbox"
                className="w-4 h-4"
                disabled={hasData ? !isEditMode : false}
                checked={orangTuaData.ibu.has_no_hp}
                onChange={(e) =>
                  handleCheckboxChange("has_no_hp", e.target.checked, "ibu")
                }
              />
              <span>Tidak memiliki nomor HP</span>
            </div>
          </div>
        </div>

        {/* Data Wali */}
        <h2 className="text-lg font-semibold mt-8 mb-4">Data Wali</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label>Wali sama dengan Ayah?</label>
            <div className="flex gap-2 mt-1">
              <input
                className="w-4 h-4"
                type="checkbox"
                disabled={hasData ? !isEditMode : false}
                checked={orangTuaData.wali.sama_dengan_ayah}
                onChange={(e) =>
                  handleCheckboxChange(
                    "sama_dengan_ayah",
                    e.target.checked,
                    "wali"
                  )
                }
              />
              <span>Ya, wali sama dengan ayah</span>
            </div>
          </div>
          <div>
            <label>Kartu Keluarga sama dengan Ayah?</label>
            <div className="flex gap-2 mt-1">
              <input
                className="w-4 h-4"
                type="checkbox"
                disabled={hasData ? !isEditMode : false}
                checked={orangTuaData.wali.kartu_keluarga_sama}
                onChange={(e) =>
                  handleCheckboxChange(
                    "kartu_keluarga_sama",
                    e.target.checked,
                    "wali"
                  )
                }
              />
              <span>Ya, kartu keluarga sama dengan ayah</span>
            </div>
          </div>
        </div>

        {/* Tombol Navigasi */}
        <div className="flex justify-end">
          {!hasData && (
            <button
              type="submit"
              className="bg-green-500 rounded w-full sm:w-7/12 py-3 font-semibold mx-auto text-white hover:bg-green-600"
            >
              Kirim Data
            </button>
          )}
          {hasData && !isEditMode && (
            <button type="button" onClick={() => setIsEditMode(true)}>
              Edit Data
            </button>
          )}
          {hasData && isEditMode && (
            <>
              <button type="button" onClick={() => setIsEditMode(false)}>
                Batal
              </button>
              <button type="button" onClick={handleUpdate}>
                Simpan Perubahan
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
