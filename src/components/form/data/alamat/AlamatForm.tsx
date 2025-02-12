import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

interface AyahIbuAlamat {
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

interface SantriAlamat {
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

interface AlamatData {
  ayah: AyahIbuAlamat;
  ibu: AyahIbuAlamat;
  santri: SantriAlamat;
}

export default function AlamatForm() {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
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

  // Ambil santriId berdasarkan user_id (menggunakan .limit(1).single() untuk memastikan satu baris)
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

  // Fungsi untuk menyamakan data ibu dengan ayah (jika diperlukan)
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

  useEffect(() => {
    const calculateProgress = () => {
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

      // Field Ibu
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

      // Hitung jumlah field yang telah diisi
      const filled = requiredFields.filter(Boolean).length;
      const total = requiredFields.length;

      // Hitung persentase progress
      return (filled / total) * 100;
    };

    // Update state progress
    setProgress(calculateProgress());
  }, [alamatData]);

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        className="mb-8 sticky top-20 sm:top-24 z-30 bg-white pb-4 border-2 border-gray-300 p-2 rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between mb-2 text-sm font-medium">
          <div className="flex items-center gap-2 text-gray-600">
            <span>Progress Pengisian Formulir</span>
            <FiCheckCircle
              className={`${
                progress === 100 ? "text-green-500" : "text-gray-300"
              }`}
            />
          </div>
          <span className="text-green-600">{Math.round(progress)}%</span>
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
      <div className="space-y-6">
        {/* Data Alamat Ayah */}
        <h2 className="text-lg font-semibold mb-4">Alamat Ayah</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Tinggal di Luar Negeri */}
          <div>
            <label className="block">Tinggal di Luar Negeri?</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                className="w-4 h-4"
                disabled={hasData ? !isEditMode : false}
                checked={alamatData.ayah.tinggal_luar_negeri}
                onChange={(e) =>
                  setAlamatData({
                    ...alamatData,
                    ayah: {
                      ...alamatData.ayah,
                      tinggal_luar_negeri: e.target.checked,
                    },
                  })
                }
              />
              <span>Ya, tinggal di luar negeri</span>
            </div>
          </div>
          {/* Status Kepemilikan Rumah */}
          <div>
            <label className="block">Status Kepemilikan Rumah</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={alamatData.ayah.status_kepemilikan}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: {
                    ...alamatData.ayah,
                    status_kepemilikan: e.target.value,
                  },
                })
              }
              className="w-full"
            >
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Sewa/Kontrak">Sewa/Kontrak</option>
              <option value="Numpang">Numpang</option>
            </select>
          </div>
          {/* Provinsi */}
          <div>
            <label className="block">Provinsi</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan provinsi"
              value={alamatData.ayah.provinsi}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, provinsi: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
          {/* Kabupaten */}
          <div>
            <label className="block">Kabupaten</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kabupaten"
              value={alamatData.ayah.kabupaten}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, kabupaten: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
          {/* Kecamatan */}
          <div>
            <label className="block">Kecamatan</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kecamatan"
              value={alamatData.ayah.kecamatan}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, kecamatan: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
          {/* Kelurahan */}
          <div>
            <label className="block">Kelurahan</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kelurahan"
              value={alamatData.ayah.kelurahan}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, kelurahan: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
          {/* Kode Pos */}
          <div>
            <label className="block">Kode Pos</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kode pos"
              value={alamatData.ayah.kode_pos}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, kode_pos: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
          {/* RT */}
          <div>
            <label className="block">RT</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan RT"
              value={alamatData.ayah.rt}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, rt: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
          {/* RW */}
          <div>
            <label className="block">RW</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan RW"
              value={alamatData.ayah.rw}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, rw: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
          {/* Alamat Lengkap */}
          <div className="sm:col-span-2">
            <label className="block">Alamat Lengkap</label>
            <textarea
              required
              rows={3}
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan alamat lengkap"
              value={alamatData.ayah.alamat}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, alamat: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Data Alamat Ibu */}
        <h2 className="text-lg font-semibold mb-4">Alamat Ibu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block">Alamat Ibu sama dengan Ayah?</label>
            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                disabled={hasData ? !isEditMode : false}
                onChange={(e) => handleIbuSamaDenganAyah(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="ml-2">Ya, alamat ibu sama dengan ayah</span>
            </div>
          </div>
          <div>
            <label className="block">Tinggal di Luar Negeri?</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                disabled={hasData ? !isEditMode : false}
                checked={alamatData.ibu.tinggal_luar_negeri}
                onChange={(e) =>
                  handleCheckboxChange(
                    "tinggal_luar_negeri",
                    e.target.checked,
                    "ibu"
                  )
                }
                className="w-4 h-4"
              />
              <span>Ya, tinggal di luar negeri</span>
            </div>
          </div>
          <div>
            <label className="block">Status Kepemilikan Rumah</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={alamatData.ibu.status_kepemilikan}
              onChange={(e) =>
                handleInputChange("status_kepemilikan", e.target.value, "ibu")
              }
              className="w-full"
            >
              <option value="">Pilih Status Kepemilikan</option>
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Sewa/Kontrak">Sewa/Kontrak</option>
              <option value="Numpang">Numpang</option>
            </select>
          </div>
          <div>
            <label className="block">Provinsi</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan provinsi"
              value={alamatData.ibu.provinsi}
              onChange={(e) =>
                handleInputChange("provinsi", e.target.value, "ibu")
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Kabupaten</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kabupaten"
              value={alamatData.ibu.kabupaten}
              onChange={(e) =>
                handleInputChange("kabupaten", e.target.value, "ibu")
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Kecamatan</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kecamatan"
              value={alamatData.ibu.kecamatan}
              onChange={(e) =>
                handleInputChange("kecamatan", e.target.value, "ibu")
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Kelurahan</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kelurahan"
              value={alamatData.ibu.kelurahan}
              onChange={(e) =>
                handleInputChange("kelurahan", e.target.value, "ibu")
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Kode Pos</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kode pos"
              value={alamatData.ibu.kode_pos}
              onChange={(e) =>
                handleInputChange("kode_pos", e.target.value, "ibu")
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">RT</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan RT"
              value={alamatData.ibu.rt}
              onChange={(e) => handleInputChange("rt", e.target.value, "ibu")}
              className="w-full"
            />
          </div>
          <div>
            <label className="block">RW</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan RW"
              value={alamatData.ibu.rw}
              onChange={(e) => handleInputChange("rw", e.target.value, "ibu")}
              className="w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block">Alamat Lengkap</label>
            <textarea
              required
              rows={3}
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan alamat lengkap"
              value={alamatData.ibu.alamat}
              onChange={(e) =>
                handleInputChange("alamat", e.target.value, "ibu")
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Data Alamat Santri */}
        <h2 className="text-lg font-semibold mb-4">Alamat Santri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block">Status Mukim</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={alamatData.santri.status_mukim}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    status_mukim: e.target.value,
                  },
                })
              }
              className="w-full"
            >
              <option value="Tidak Mukim">Tidak Mukim</option>
              <option value="Mukim">Mukim</option>
            </select>
          </div>
          <div>
            <label className="block">Status Tempat Tinggal</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={alamatData.santri.status_tempat_tinggal}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    status_tempat_tinggal: e.target.value,
                  },
                })
              }
              className="w-full"
            >
              <option value="Tinggal dengan Ayah Kandung">
                Tinggal dengan Ayah Kandung
              </option>
              <option value="Tinggal dengan Ibu Kandung">
                Tinggal dengan Ibu Kandung
              </option>
              <option value="Tinggal dengan Wali">Tinggal dengan Wali</option>
              <option value="Ikut Saudara / Kerabat">
                Ikut Saudara / Kerabat
              </option>
              <option value="Kontrak / Kost">Kontrak / Kost</option>
              <option value="Tinggal di Asrama Bukan Milik Pesantren">
                Tinggal di Asrama Bukan Milik Pesantren
              </option>
              <option value="Panti Asuhan">Panti Asuhan</option>
              <option value="Rumah Singgah">Rumah Singgah</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block">Jarak ke Lembaga</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={alamatData.santri.jarak_lembaga}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    jarak_lembaga: e.target.value,
                  },
                })
              }
              className="w-full"
            >
              <option value="Kurang dari 5 km">Kurang dari 5 km</option>
              <option value="Antara 5 - 10 km">Antara 5 - 10 km</option>
              <option value="Antara 11 - 20 km">Antara 11 - 20 km</option>
              <option value="Antara 21 - 30 km">Antara 21 - 30 km</option>
              <option value="Lebih dari 30 km">Lebih dari 30 km</option>
            </select>
          </div>
          <div>
            <label className="block">Transportasi</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={alamatData.santri.transportasi}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    transportasi: e.target.value,
                  },
                })
              }
              className="w-full"
            >
              <option value="Jalan Kaki">Jalan Kaki</option>
              <option value="Sepeda">Sepeda</option>
              <option value="Sepeda Motor">Sepeda Motor</option>
              <option value="Mobil Pribadi">Mobil Pribadi</option>
              <option value="Antar Jemput Sekolah">Antar Jemput Sekolah</option>
              <option value="Angkutan Umum">Angkutan Umum</option>
              <option value="Perahu / Sampan">Perahu / Sampan</option>
              <option value="Kendaraan Pribadi">Kendaraan Pribadi</option>
              <option value="Kereta Api">Kereta Api</option>
              <option value="Ojek">Ojek</option>
              <option value="Andong/Bendi/Sado/Dokar/Delman/Becak">
                Andong/Bendi/Sado/Dokar/Delman/Becak
              </option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block">Waktu Tempuh</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={alamatData.santri.waktu_tempuh}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    waktu_tempuh: e.target.value,
                  },
                })
              }
              className="w-full"
            >
              <option value="1-10 menit">1-10 menit</option>
              <option value="11-20 menit">11-20 menit</option>
              <option value="21-30 menit">21-30 menit</option>
              <option value="31-40 menit">31-40 menit</option>
              <option value="41-50 menit">41-50 menit</option>
              <option value="51-60 menit">51-60 menit</option>
              <option value="Lebih dari 60 menit">Lebih dari 60 menit</option>
            </select>
          </div>
          <div>
            <label className="block">Koordinat</label>
            <input
              type="text"
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan koordinat"
              value={alamatData.santri.koordinat}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    koordinat: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Provinsi</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan provinsi"
              value={alamatData.santri.provinsi}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    provinsi: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Kabupaten</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kabupaten"
              value={alamatData.santri.kabupaten}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    kabupaten: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Kecamatan</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kecamatan"
              value={alamatData.santri.kecamatan}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    kecamatan: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Kelurahan</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kelurahan"
              value={alamatData.santri.kelurahan}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    kelurahan: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Kode Pos</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan kode pos"
              value={alamatData.santri.kode_pos}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    kode_pos: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">RT</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan RT"
              value={alamatData.santri.rt}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    rt: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block">RW</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan RW"
              value={alamatData.santri.rw}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    rw: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block">Alamat Lengkap</label>
            <textarea
              required
              rows={3}
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan alamat lengkap"
              value={alamatData.santri.alamat}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: {
                    ...alamatData.santri,
                    alamat: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4">
          {!hasData && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Daftar
            </button>
          )}
          {hasData && !isEditMode && (
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Edit Data
            </button>
          )}
          {hasData && isEditMode && (
            <>
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
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
