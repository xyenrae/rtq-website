/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [isIbuDisabled, setIsIbuDisabled] = useState(false);
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
  const router = useRouter();

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
        setSantriId(santri.id);
      }
    };

    fetchSantriId();
  }, []);

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
        console.log("Fetched Alamat Data:", alamat);
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

  const handleIbuSamaDenganAyah = (checked: boolean) => {
    if (checked) {
      setAlamatData((prevData) => ({
        ...prevData,
        ibu: { ...prevData.ayah },
      }));
    } else {
      setAlamatData((prevData) => ({
        ...prevData,
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

  // Handle form submission for new data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!santriId) {
        toast.error("Santri ID tidak ditemukan.");
        return;
      }

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
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Terjadi kesalahan saat mendaftar.");
    }
  };

  // Handle update datas
  const handleUpdate = async () => {
    try {
      if (!santriId) {
        toast.error("Santri ID tidak ditemukan.");
        return;
      }

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
    type: "ayah" | "ibu" | "santri"
  ) => {
    setAlamatData((prevData) => ({
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
    type: "ayah" | "ibu" | "santri"
  ) => {
    setAlamatData((prevData) => ({
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
        {/* Data Alamat Ayah */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Alamat Ayah
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Tinggal di Luar Negeri */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tinggal di Luar Negeri?
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                disabled={!isEditMode}
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
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Ya, tinggal di luar negeri
              </span>
            </div>
          </div>

          {/* Status Kepemilikan Rumah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Kepemilikan Rumah
            </label>
            <select
              required
              disabled={!isEditMode}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
            >
              <option value="">Pilih Status Kepemilikan</option>
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Sewa/Kontrak">Sewa/Kontrak</option>
              <option value="Numpang">Numpang</option>
            </select>
          </div>

          {/* Provinsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Provinsi
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan provinsi"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ayah.provinsi}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, provinsi: e.target.value },
                })
              }
            />
          </div>

          {/* Kabupaten */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kabupaten
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan kabupaten"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ayah.kabupaten}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, kabupaten: e.target.value },
                })
              }
            />
          </div>

          {/* Kecamatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kecamatan
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan kecamatan"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ayah.kecamatan}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, kecamatan: e.target.value },
                })
              }
            />
          </div>

          {/* Kelurahan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kelurahan
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan kelurahan"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ayah.kelurahan}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, kelurahan: e.target.value },
                })
              }
            />
          </div>

          {/* Kode Pos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kode Pos
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan kode pos"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ayah.kode_pos}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, kode_pos: e.target.value },
                })
              }
            />
          </div>

          {/* RT */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              RT
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan RT"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ayah.rt}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, rt: e.target.value },
                })
              }
            />
          </div>

          {/* RW */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              RW
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan RW"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ayah.rw}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, rw: e.target.value },
                })
              }
            />
          </div>

          {/* Alamat Lengkap */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Alamat Lengkap
            </label>
            <textarea
              required
              rows={3}
              disabled={!isEditMode}
              placeholder="Masukkan alamat lengkap"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ayah.alamat}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ayah: { ...alamatData.ayah, alamat: e.target.value },
                })
              }
            />
          </div>
        </div>

        {/* Data Alamat Ibu */}
        <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">
          Alamat Ibu
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Checkbox untuk Ibu sama dengan Ayah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alamat Ibu sama dengan Ayah?
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                onChange={(e) => handleIbuSamaDenganAyah(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Ya, alamat ibu sama dengan ayah
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tinggal di Luar Negeri?
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={alamatData.ibu.tinggal_luar_negeri}
                onChange={(e) =>
                  handleCheckboxChange(
                    "tinggal_luar_negeri",
                    e.target.checked,
                    "ibu"
                  )
                }
                disabled={isIbuDisabled || !isEditMode}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Ya, tinggal di luar negeri
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Status Kepemilikan Rumah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Kepemilikan Rumah
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ibu.status_kepemilikan}
              onChange={(e) =>
                handleInputChange("status_kepemilikan", e.target.value, "ibu")
              }
              disabled={isIbuDisabled || !isEditMode}
            >
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Sewa/Kontrak">Sewa/Kontrak</option>
              <option value="Numpang">Numpang</option>
            </select>
          </div>

          {/* Provinsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Provinsi
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan provinsi"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ibu.provinsi}
              onChange={(e) =>
                handleInputChange("provinsi", e.target.value, "ibu")
              }
              disabled={isIbuDisabled || !isEditMode}
            />
          </div>

          {/* Kabupaten */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kabupaten
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan kabupaten"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ibu.kabupaten}
              onChange={(e) =>
                handleInputChange("kabupaten", e.target.value, "ibu")
              }
              disabled={isIbuDisabled || !isEditMode}
            />
          </div>

          {/* Kecamatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kecamatan
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan kecamatan"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ibu.kelurahan}
              onChange={(e) =>
                handleInputChange("kelurahan", e.target.value, "ibu")
              }
              disabled={isIbuDisabled || !isEditMode}
            />
          </div>

          {/* Kelurahan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kelurahan
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan kelurahan"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ibu.kelurahan}
              onChange={(e) =>
                handleInputChange("kelurahan", e.target.value, "ibu")
              }
              disabled={isIbuDisabled || !isEditMode}
            />
          </div>

          {/* Kode Pos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kode Pos
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan kode pos"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ibu.kode_pos}
              onChange={(e) =>
                handleInputChange("kode_pos", e.target.value, "ibu")
              }
              disabled={isIbuDisabled || !isEditMode}
            />
          </div>

          {/* RT */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              RT
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan RT"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ibu.rt}
              onChange={(e) => handleInputChange("rt", e.target.value, "ibu")}
              disabled={isIbuDisabled || !isEditMode}
            />
          </div>

          {/* RW */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              RW
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan RW"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ibu.rw}
              onChange={(e) => handleInputChange("rw", e.target.value, "ibu")}
              disabled={isIbuDisabled || !isEditMode}
            />
          </div>

          {/* Alamat Lengkap */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Alamat Lengkap
            </label>
            <textarea
              required
              disabled={isIbuDisabled || !isEditMode}
              rows={3}
              placeholder="Masukkan alamat lengkap"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.ibu.alamat}
              onChange={(e) =>
                handleInputChange("alamat", e.target.value, "ibu")
              }
            />
          </div>
        </div>

        {/* Data Alamat Santri */}
        <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">
          Alamat Santri
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Status Mukim */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Mukim
            </label>
            <select
              required
              disabled={!isEditMode}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
            >
              <option value="Tidak Mukim">Tidak Mukim</option>
              <option value="Mukim">Mukim</option>
            </select>
          </div>

          {/* Status Tempat Tinggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Tempat Tinggal
            </label>
            <select
              required
              disabled={!isEditMode}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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

          {/* Jarak ke Lembaga */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jarak ke Lembaga
            </label>
            <select
              required
              disabled={!isEditMode}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
            >
              <option value="Kurang dari 5 km">Kurang dari 5 km</option>
              <option value="Antara 5 - 10 km">Antara 5 - 10 km</option>
              <option value="Antara 11 - 20 km">Antara 11 - 20 km</option>
              <option value="Antara 21 - 30 km">Antara 21 - 30 km</option>
              <option value="Lebih dari 30 km">Lebih dari 30 km</option>
            </select>
          </div>

          {/* Transportasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transportasi
            </label>
            <select
              required
              disabled={!isEditMode}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
                Andong/Bendi/Sado/Dokar/Delman /Becak
              </option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Waktu Tempuh */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Waktu Tempuh
            </label>
            <select
              required
              disabled={!isEditMode}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
            >
              <option value="1-10 menit">1-10 menit</option>
              <option value="11-30 menit">11-20 menit</option>
              <option value="11-30 menit">21-30 menit</option>
              <option value="11-30 menit">31-40 menit</option>
              <option value="31-60 menit">41-50 menit</option>
              <option value="31-60 menit">51-60 menit</option>
              <option value="Lebih dari 60 menit">Lebih dari 60 menit</option>
            </select>
          </div>

          {/* Koordinat */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Koordinat
            </label>
            <input
              type="text"
              disabled={!isEditMode}
              placeholder="Masukkan koordinat"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.santri.koordinat}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: { ...alamatData.santri, koordinat: e.target.value },
                })
              }
            />
          </div>

          {/* Provinsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Provinsi
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan provinsi"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.santri.provinsi}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: { ...alamatData.santri, provinsi: e.target.value },
                })
              }
            />
          </div>

          {/* Kabupaten */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kabupaten
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan kabupaten"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.santri.kabupaten}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: { ...alamatData.santri, kabupaten: e.target.value },
                })
              }
            />
          </div>

          {/* Kecamatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kecamatan
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan kecamatan"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.santri.kecamatan}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: { ...alamatData.santri, kecamatan: e.target.value },
                })
              }
            />
          </div>

          {/* Kelurahan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kelurahan
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan kelurahan"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.santri.kelurahan}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: { ...alamatData.santri, kelurahan: e.target.value },
                })
              }
            />
          </div>

          {/* Kode Pos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kode Pos
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan kode pos"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.santri.kode_pos}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: { ...alamatData.santri, kode_pos: e.target.value },
                })
              }
            />
          </div>

          {/* RT */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              RT
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan RT"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.santri.rt}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: { ...alamatData.santri, rt: e.target.value },
                })
              }
            />
          </div>

          {/* RW */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              RW
            </label>
            <input
              type="text"
              required
              disabled={!isEditMode}
              placeholder="Masukkan RW"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.santri.rw}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: { ...alamatData.santri, rw: e.target.value },
                })
              }
            />
          </div>

          {/* Alamat Lengkap */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Alamat Lengkap
            </label>
            <textarea
              required
              rows={3}
              disabled={!isEditMode}
              placeholder="Masukkan alamat lengkap"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
              value={alamatData.santri.alamat}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  santri: { ...alamatData.santri, alamat: e.target.value },
                })
              }
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end">
          {!hasData && (
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Daftar
            </button>
          )}

          {/* Tombol Edit */}
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
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
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
