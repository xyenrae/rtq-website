import { useState } from "react";

interface AlamatFormProps {
  setActiveTab: (tab: number) => void;
}

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
  ibu_sama_dengan_ayah: boolean;
}

export default function AlamatForm({ setActiveTab }: AlamatFormProps) {
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
    ibu_sama_dengan_ayah: false,
  });

  return (
    <div className="space-y-6">
      {/* Data Alamat Ayah */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Alamat Ayah</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Tinggal di Luar Negeri */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tinggal di Luar Negeri?
          </label>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
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
          <label className="block text-sm font-medium text-gray-700">RT</label>
          <input
            type="text"
            required
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
          <label className="block text-sm font-medium text-gray-700">RW</label>
          <input
            type="text"
            required
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
              checked={alamatData.ibu_sama_dengan_ayah}
              onChange={(e) =>
                setAlamatData({
                  ...alamatData,
                  ibu_sama_dengan_ayah: e.target.checked,
                })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              Ya, alamat ibu sama dengan ayah
            </span>
          </div>
        </div>
        {!alamatData.ibu_sama_dengan_ayah && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tinggal di Luar Negeri?
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
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
        )}
      </div>

      {!alamatData.ibu_sama_dengan_ayah && (
        <div className="grid grid-cols-2 gap-6">
          {/* Status Kepemilikan Rumah */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Kepemilikan Rumah
            </label>
            <select
              required
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
      )}

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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            value={alamatData.santri.status_mukim}
            onChange={(e) =>
              setAlamatData({
                ...alamatData,
                santri: { ...alamatData.santri, status_mukim: e.target.value },
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            value={alamatData.santri.jarak_lembaga}
            onChange={(e) =>
              setAlamatData({
                ...alamatData,
                santri: { ...alamatData.santri, jarak_lembaga: e.target.value },
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            value={alamatData.santri.transportasi}
            onChange={(e) =>
              setAlamatData({
                ...alamatData,
                santri: { ...alamatData.santri, transportasi: e.target.value },
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            value={alamatData.santri.waktu_tempuh}
            onChange={(e) =>
              setAlamatData({
                ...alamatData,
                santri: { ...alamatData.santri, waktu_tempuh: e.target.value },
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
          <label className="block text-sm font-medium text-gray-700">RT</label>
          <input
            type="text"
            required
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
          <label className="block text-sm font-medium text-gray-700">RW</label>
          <input
            type="text"
            required
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
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setActiveTab(1)} // ORANG_TUA
          className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Daftar Sekarang
        </button>
      </div>
    </div>
  );
}
