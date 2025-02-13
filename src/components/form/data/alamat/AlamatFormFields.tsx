// src/components/form/data/alamat/AlamatFormFields.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { AlamatData } from "./useAlamatForm";

interface AlamatFormFieldsProps {
  alamatData: AlamatData;
  handleInputChange: (
    field: string,
    value: string | boolean,
    type: "ayah" | "ibu" | "santri"
  ) => void;
  handleCheckboxChange: (
    field: string,
    checked: boolean,
    type: "ayah" | "ibu" | "santri"
  ) => void;
  handleIbuSamaDenganAyah: (checked: boolean) => void;
  hasData: boolean;
  isEditMode: boolean;
  progress: number;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdate: () => void;
}

export default function AlamatFormFields({
  alamatData,
  handleInputChange,
  handleCheckboxChange,
  handleIbuSamaDenganAyah,
  hasData,
  isEditMode,
  progress,
  setIsEditMode,
  handleUpdate,
}: AlamatFormFieldsProps) {
  return (
    <>
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
                  handleCheckboxChange(
                    "tinggal_luar_negeri",
                    e.target.checked,
                    "ayah"
                  )
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
                handleInputChange("status_kepemilikan", e.target.value, "ayah")
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
                handleInputChange("provinsi", e.target.value, "ayah")
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
                handleInputChange("kabupaten", e.target.value, "ayah")
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
                handleInputChange("kecamatan", e.target.value, "ayah")
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
                handleInputChange("kelurahan", e.target.value, "ayah")
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
                handleInputChange("kode_pos", e.target.value, "ayah")
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
              onChange={(e) => handleInputChange("rt", e.target.value, "ayah")}
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
              onChange={(e) => handleInputChange("rw", e.target.value, "ayah")}
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
                handleInputChange("alamat", e.target.value, "ayah")
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
                handleInputChange("status_mukim", e.target.value, "santri")
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
                handleInputChange(
                  "status_tempat_tinggal",
                  e.target.value,
                  "santri"
                )
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
                handleInputChange("jarak_lembaga", e.target.value, "santri")
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
                handleInputChange("transportasi", e.target.value, "santri")
              }
              className="w-full"
            >
              <option value="">Pilih Transportasi</option>
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
                handleInputChange("waktu_tempuh", e.target.value, "santri")
              }
              className="w-full"
            >
              <option value="">Pilih Waktu Tempuh</option>
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
                handleInputChange("koordinat", e.target.value, "santri")
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
                handleInputChange("provinsi", e.target.value, "santri")
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
                handleInputChange("kabupaten", e.target.value, "santri")
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
                handleInputChange("kecamatan", e.target.value, "santri")
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
                handleInputChange("kelurahan", e.target.value, "santri")
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
                handleInputChange("kode_pos", e.target.value, "santri")
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
                handleInputChange("rt", e.target.value, "santri")
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
                handleInputChange("rw", e.target.value, "santri")
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
                handleInputChange("alamat", e.target.value, "santri")
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
    </>
  );
}
