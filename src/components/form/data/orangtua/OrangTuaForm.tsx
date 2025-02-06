/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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

export default function OrangTuaForm({
  setActiveTab,
}: {
  setActiveTab: (tab: number) => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasData, setHasData] = useState(false);
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

  const [santriId, setSantriId] = useState<number | null>(null); // State untuk menyimpan santri_id

  const router = useRouter();

  // Fetch santri_id based on user_id
  useEffect(() => {
    const fetchSantriId = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: santri, error } = await supabase
        .from("santri")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

      if (error) {
        console.error("Error fetching santri ID:", error.message);
      } else {
        setSantriId(santri.id); // Simpan santri_id ke state
      }
    };

    fetchSantriId();
  }, []);

  useEffect(() => {
    const fetchOrangTuaData = async () => {
      if (!santriId) return;

      const { data: orangTua, error } = await supabase
        .from("orang_tua")
        .select("*")
        .eq("santri_id", santriId)
        .maybeSingle();

      if (error) {
        setHasData(false);
      } else if (orangTua) {
        setOrangTuaData({
          ayah: {
            nama: orangTua.ayah_nama || "",
            nik: orangTua.ayah_nik || "",
            kewarganegaraan: orangTua.ayah_kewarganegaraan || "",
            tempat_lahir: orangTua.ayah_tempat_lahir || "",
            tanggal_lahir: orangTua.ayah_tanggal_lahir
              ? new Date(orangTua.ayah_tanggal_lahir)
              : null,
            status: orangTua.ayah_status || "",
            pendidikan_terakhir: orangTua.ayah_pendidikan_terakhir || "",
            penghasilan: orangTua.ayah_penghasilan || "",
            pekerjaan: orangTua.ayah_pekerjaan || "",
            nomor_hp: orangTua.ayah_nomor_hp || "",
            has_no_hp: orangTua.ayah_has_no_hp || false,
          },
          ibu: {
            nama: orangTua.ibu_nama || "",
            nik: orangTua.ibu_nik || "",
            kewarganegaraan: orangTua.ibu_kewarganegaraan || "",
            tempat_lahir: orangTua.ibu_tempat_lahir || "",
            tanggal_lahir: orangTua.ibu_tanggal_lahir
              ? new Date(orangTua.ibu_tanggal_lahir)
              : null,
            status: orangTua.ibu_status || "",
            pendidikan_terakhir: orangTua.ibu_pendidikan_terakhir || "",
            penghasilan: orangTua.ibu_penghasilan || "",
            pekerjaan: orangTua.ibu_pekerjaan || "",
            nomor_hp: orangTua.ibu_nomor_hp || "",
            has_no_hp: orangTua.ibu_has_no_hp || false,
          },
          wali: {
            sama_dengan_ayah: orangTua.wali_sama_dengan_ayah || false,
            kartu_keluarga_sama: orangTua.wali_kartu_keluarga_sama || false,
          },
        });
        setHasData(true);
      } else {
        setHasData(false); // Tidak ada data
      }
    };

    fetchOrangTuaData();
  }, [santriId]);

  // Handle form submission for new data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!santriId) {
        toast.error("Santri ID tidak ditemukan.");
        return;
      }

      const { error } = await supabase.from("orang_tua").insert({
        santri_id: santriId,
        ayah_nama: orangTuaData.ayah.nama,
        ayah_nik: orangTuaData.ayah.nik,
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
        setActiveTab(2); // Pindah ke tab berikutnya (misalnya Data Alamat)
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Terjadi kesalahan saat mendaftar.");
    }
  };

  // Handle update data
  const handleUpdate = async () => {
    try {
      if (!santriId) {
        toast.error("Santri ID tidak ditemukan.");
        return;
      }

      const { error } = await supabase
        .from("orang_tua")
        .update({
          ayah_nama: orangTuaData.ayah.nama,
          ayah_nik: orangTuaData.ayah.nik,
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
        setIsEditMode(false); // Kembali ke mode read-only
      }
    } catch (error) {
      console.error("Error during update:", error);
      toast.error("Terjadi kesalahan saat menyimpan perubahan.");
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: string,
    value: any,
    type: "ayah" | "ibu" | "wali"
  ) => {
    setOrangTuaData((prevData) => ({
      ...prevData,
      [type]: {
        ...prevData[type],
        [field]: value,
      },
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (
    field: string,
    checked: boolean,
    type: "ayah" | "ibu" | "wali"
  ) => {
    setOrangTuaData((prevData) => ({
      ...prevData,
      [type]: {
        ...prevData[type],
        [field]: checked,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Data Ayah */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Ayah</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Nama Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Ayah
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan nama ayah"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ayah.nama || ""}
              onChange={(e) =>
                handleInputChange("nama", e.target.value, "ayah")
              }
            />
          </div>

          {/* NIK Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NIK Ayah
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan NIK ayah"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ayah.nik || ""}
              onChange={(e) => handleInputChange("nik", e.target.value, "ayah")}
            />
          </div>

          {/* Kewarganegaraan Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kewarganegaraan Ayah
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ayah.kewarganegaraan || ""}
              onChange={(e) =>
                handleInputChange("kewarganegaraan", e.target.value, "ayah")
              }
            >
              <option value="">Pilih Kewarganegaraan</option>
              <option value="WNI">Warga Negara Indonesia (WNI)</option>
              <option value="WNA">Warga Negara Asing (WNA)</option>
            </select>
          </div>

          {/* Tempat Lahir Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tempat Lahir Ayah
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan tempat lahir ayah"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ayah.tempat_lahir || ""}
              onChange={(e) =>
                handleInputChange("tempat_lahir", e.target.value, "ayah")
              }
            />
          </div>

          {/* Tanggal Lahir Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Lahir Ayah
            </label>
            <DatePicker
              selected={orangTuaData.ayah.tanggal_lahir || null}
              onChange={(date) =>
                handleInputChange("tanggal_lahir", date, "ayah")
              }
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              placeholderText="Pilih tanggal lahir ayah"
            />
          </div>

          {/* Status Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Ayah
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ayah.status || ""}
              onChange={(e) =>
                handleInputChange("status", e.target.value, "ayah")
              }
            >
              <option value="">Pilih Status</option>
              <option value="Hidup">Hidup</option>
              <option value="Meninggal">Meninggal</option>
            </select>
          </div>

          {/* Pendidikan Terakhir Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pendidikan Terakhir Ayah
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ayah.pendidikan_terakhir || ""}
              onChange={(e) =>
                handleInputChange("pendidikan_terakhir", e.target.value, "ayah")
              }
            >
              <option value="">Pilih Pendidikan Terakhir</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="Diploma">Diploma</option>
              <option value="Sarjana">Sarjana</option>
              <option value="Magister">Magister</option>
              <option value="Doktor">Doktor</option>
            </select>
          </div>

          {/* Penghasilan Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Penghasilan Ayah
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ayah.penghasilan || ""}
              onChange={(e) =>
                handleInputChange("penghasilan", e.target.value, "ayah")
              }
            >
              <option value="">Pilih Penghasilan</option>
              <option value="< 1 Juta">&lt; 1 Juta</option>
              <option value="1 - 3 Juta">1 - 3 Juta</option>
              <option value="3 - 5 Juta">3 - 5 Juta</option>
              <option value="> 5 Juta">&gt; 5 Juta</option>
            </select>
          </div>

          {/* Pekerjaan Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pekerjaan Ayah
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan pekerjaan ayah"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ayah.pekerjaan || ""}
              onChange={(e) =>
                handleInputChange("pekerjaan", e.target.value, "ayah")
              }
            />
          </div>

          {/* Nomor HP Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nomor HP Ayah
            </label>
            <input
              type="text"
              required={!orangTuaData.ayah.has_no_hp}
              disabled={orangTuaData.ayah.has_no_hp}
              placeholder="Masukkan nomor HP ayah"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ayah.nomor_hp || ""}
              onChange={(e) =>
                handleInputChange("nomor_hp", e.target.value, "ayah")
              }
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={orangTuaData.ayah.has_no_hp || false}
                onChange={(e) =>
                  handleCheckboxChange("has_no_hp", e.target.checked, "ayah")
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Tidak memiliki nomor HP
              </span>
            </div>
          </div>
        </div>

        {/* Data Ibu */}
        <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">
          Data Ibu
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Nama Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Ibu
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan nama ibu"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ibu.nama || ""}
              onChange={(e) => handleInputChange("nama", e.target.value, "ibu")}
            />
          </div>

          {/* NIK Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NIK Ibu
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan NIK ibu"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ibu.nik || ""}
              onChange={(e) => handleInputChange("nik", e.target.value, "ibu")}
            />
          </div>

          {/* Kewarganegaraan Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kewarganegaraan Ibu
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ibu.kewarganegaraan || ""}
              onChange={(e) =>
                handleInputChange("kewarganegaraan", e.target.value, "ibu")
              }
            >
              <option value="">Pilih Kewarganegaraan</option>
              <option value="WNI">Warga Negara Indonesia (WNI)</option>
              <option value="WNA">Warga Negara Asing (WNA)</option>
            </select>
          </div>

          {/* Tempat Lahir Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tempat Lahir Ibu
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan tempat lahir ibu"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ibu.tempat_lahir || ""}
              onChange={(e) =>
                handleInputChange("tempat_lahir", e.target.value, "ibu")
              }
            />
          </div>

          {/* Tanggal Lahir Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Lahir Ibu
            </label>
            <DatePicker
              selected={orangTuaData.ibu.tanggal_lahir || null}
              onChange={(date) =>
                handleInputChange("tanggal_lahir", date, "ibu")
              }
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              placeholderText="Pilih tanggal lahir ibu"
            />
          </div>

          {/* Status Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Ibu
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ibu.status || ""}
              onChange={(e) =>
                handleInputChange("status", e.target.value, "ibu")
              }
            >
              <option value="">Pilih Status</option>
              <option value="Hidup">Hidup</option>
              <option value="Meninggal">Meninggal</option>
            </select>
          </div>

          {/* Pendidikan Terakhir Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pendidikan Terakhir Ibu
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ibu.pendidikan_terakhir || ""}
              onChange={(e) =>
                handleInputChange("pendidikan_terakhir", e.target.value, "ibu")
              }
            >
              <option value="">Pilih Pendidikan Terakhir</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="Diploma">Diploma</option>
              <option value="Sarjana">Sarjana</option>
              <option value="Magister">Magister</option>
              <option value="Doktor">Doktor</option>
            </select>
          </div>

          {/* Penghasilan Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Penghasilan Ibu
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ibu.penghasilan || ""}
              onChange={(e) =>
                handleInputChange("penghasilan", e.target.value, "ibu")
              }
            >
              <option value="">Pilih Penghasilan</option>
              <option value="< 1 Juta">&lt; 1 Juta</option>
              <option value="1 - 3 Juta">1 - 3 Juta</option>
              <option value="3 - 5 Juta">3 - 5 Juta</option>
              <option value="> 5 Juta">&gt; 5 Juta</option>
            </select>
          </div>

          {/* Pekerjaan Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pekerjaan Ibu
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan pekerjaan ibu"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ibu.pekerjaan || ""}
              onChange={(e) =>
                handleInputChange("pekerjaan", e.target.value, "ibu")
              }
            />
          </div>

          {/* Nomor HP Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nomor HP Ibu
            </label>
            <input
              type="text"
              required={!orangTuaData.ibu.has_no_hp}
              disabled={orangTuaData.ibu.has_no_hp}
              placeholder="Masukkan nomor HP ibu"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={orangTuaData.ibu.nomor_hp || ""}
              onChange={(e) =>
                handleInputChange("nomor_hp", e.target.value, "ibu")
              }
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={orangTuaData.ibu.has_no_hp || false}
                onChange={(e) =>
                  handleCheckboxChange("has_no_hp", e.target.checked, "ibu")
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Tidak memiliki nomor HP
              </span>
            </div>
          </div>
        </div>

        {/* Data Wali */}
        <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">
          Data Wali
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Checkbox untuk Wali sama dengan Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wali sama dengan Ayah?
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={orangTuaData.wali.sama_dengan_ayah || false}
                onChange={(e) =>
                  handleCheckboxChange(
                    "sama_dengan_ayah",
                    e.target.checked,
                    "wali"
                  )
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Ya, wali sama dengan ayah
              </span>
            </div>
          </div>

          {/* Kartu Keluarga Sama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kartu Keluarga Sama dengan Ayah?
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={orangTuaData.wali.kartu_keluarga_sama || false}
                onChange={(e) =>
                  handleCheckboxChange(
                    "kartu_keluarga_sama",
                    e.target.checked,
                    "wali"
                  )
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Ya, kartu keluarga sama dengan ayah
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end">
          {/* Tombol Daftar */}
          {!hasData && (
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Kirim Data
            </button>
          )}

          {/* Tombol Edit Data */}
          {hasData && !isEditMode && (
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              Edit Data
            </button>
          )}

          {/* Tombol Simpan Perubahan */}
          {hasData && isEditMode && (
            <>
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Simpan Perubahan
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
