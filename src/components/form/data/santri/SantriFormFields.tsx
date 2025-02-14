// src/components/form/data/santri/SantriFormFields.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { SantriData } from "./useSantriForm";

interface SantriFormFieldsProps {
  santriData: SantriData;
  setSantriData: React.Dispatch<React.SetStateAction<SantriData>>;
  hasData: boolean;
  isEditMode: boolean;
  progress: number;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdate: () => void;
}

export default function SantriFormFields({
  santriData,
  setSantriData,
  hasData,
  isEditMode,
  progress,
  setIsEditMode,
  handleUpdate,
}: SantriFormFieldsProps) {
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
      <div className="space-y-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-8 gap-6">
          <div className="col-span-2">
            <div className="relative group">
              <label>Foto Santri</label>
              <label
                className={`
                  block aspect-square w-full rounded-2xl border-4 border-dashed cursor-pointer mt-2
                  ${
                    hasData && !isEditMode
                      ? "cursor-not-allowed opacity-75"
                      : "hover:border-primary-500 border-gray-200"
                  }
                  transition-colors duration-200 overflow-hidden
                `}
                htmlFor="avatarInput"
              >
                {santriData.profile_image_url ||
                santriData.profile_image_file ? (
                  <Image
                    width={50}
                    height={50}
                    src={
                      santriData.profile_image_file
                        ? URL.createObjectURL(santriData.profile_image_file)
                        : santriData.profile_image_url ?? ""
                    }
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FaUser className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">Upload Foto</span>
                  </div>
                )}
              </label>

              {(!hasData || isEditMode) && (
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/"
                  className="sr-only"
                  required
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setSantriData({
                        ...santriData,
                        profile_image_file: e.target.files[0],
                      });
                    }
                  }}
                />
              )}
            </div>

            {(!hasData || isEditMode) && (
              <p className="text-sm text-gray-500 text-center w-1/2">
                Format: JPG, PNG (Maks. 5MB)
              </p>
            )}
          </div>
          <div className="col-span-6">
            <div>
              <label>Nama Lengkap</label>
              <input
                type="text"
                required
                disabled={hasData ? !isEditMode : false}
                placeholder="Masukkan nama lengkap"
                value={santriData.nama_lengkap ?? ""}
                onChange={(e) =>
                  setSantriData({ ...santriData, nama_lengkap: e.target.value })
                }
              />
            </div>
            <div className="mt-6">
              <label>NIK</label>
              <input
                type="text"
                required
                disabled={hasData ? !isEditMode : false}
                placeholder="Masukkan NIK"
                value={santriData.nik ?? ""}
                onChange={(e) =>
                  setSantriData({ ...santriData, nik: e.target.value })
                }
              />
            </div>
            <div className="mt-6">
              <label>Tempat Lahir</label>
              <input
                type="text"
                required
                disabled={hasData ? !isEditMode : false}
                placeholder="Masukkan tempat lahir"
                value={santriData.tempat_lahir ?? ""}
                onChange={(e) =>
                  setSantriData({ ...santriData, tempat_lahir: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label>Tanggal Lahir</label>
            <DatePicker
              required
              selected={santriData.tanggal_lahir}
              disabled={hasData ? !isEditMode : false}
              onChange={(date) =>
                setSantriData({ ...santriData, tanggal_lahir: date })
              }
              placeholderText="Pilih tanggal lahir"
            />
          </div>
          <div>
            <label>Jenis Kelamin</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={santriData.jenis_kelamin ?? ""}
              onChange={(e) =>
                setSantriData({ ...santriData, jenis_kelamin: e.target.value })
              }
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div>
            <label>Jumlah Saudara</label>
            <input
              type="number"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan jumlah saudara"
              value={santriData.jumlah_saudara || ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : Number(e.target.value);
                setSantriData({
                  ...santriData,
                  jumlah_saudara: value,
                });
              }}
            />
          </div>
          <div>
            <label>Anak Ke</label>
            <input
              type="number"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan urutan anak"
              value={santriData.anak_ke || ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : Number(e.target.value);
                setSantriData({
                  ...santriData,
                  anak_ke: value,
                });
              }}
            />
          </div>
          <div>
            <label>Cita-cita</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={santriData.cita_cita}
              onChange={(e) =>
                setSantriData({ ...santriData, cita_cita: e.target.value })
              }
            >
              <option value="">Pilih cita cita</option>
              <option value="Dokter">Dokter</option>
              <option value="PNS">PNS</option>
              <option value="TNI/POLRI">TNI/POLRI</option>
              <option value="Guru/Dosen">Guru/Dosen</option>
              <option value="Politikus">Politikus</option>
              <option value="Wiraswasta">Wiraswasta</option>
              <option value="Seniman/Artis">Seniman/Artis</option>
              <option value="Ilmuwan">Ilmuwan</option>
              <option value="Agamawan">Agamawan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div className="flex flex-col items-start">
            <label>Nomor HP</label>
            <input
              type="number"
              required={!santriData.has_no_hp}
              disabled={(!isEditMode && hasData) || santriData.has_no_hp}
              placeholder="Masukkan nomor HP"
              value={santriData.nomor_hp ?? ""}
              onChange={(e) =>
                setSantriData({ ...santriData, nomor_hp: e.target.value })
              }
            />
            <div className="flex gap-2 mt-1">
              <input
                type="checkbox"
                className="w-4 h-4"
                disabled={hasData ? !isEditMode : false}
                checked={santriData.has_no_hp}
                onChange={(e) =>
                  setSantriData({ ...santriData, has_no_hp: e.target.checked })
                }
              />
              <span>Tidak memiliki nomor HP</span>
            </div>
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan email"
              value={santriData.email ?? ""}
              onChange={(e) =>
                setSantriData({ ...santriData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label>Hobi</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={santriData.hobi ?? ""}
              onChange={(e) =>
                setSantriData({ ...santriData, hobi: e.target.value })
              }
            >
              <option value="">Pilih Hobi</option>
              <option value="Olahraga">Olahraga</option>
              <option value="Kesenian">Kesenian</option>
              <option value="Membaca">Membaca</option>
              <option value="Menulis">Menulis</option>
              <option value="Jalan-jalan">Jalan-jalan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label>Sumber Pembiayaan</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={santriData.sumber_pembiayaan}
              onChange={(e) =>
                setSantriData({
                  ...santriData,
                  sumber_pembiayaan: e.target.value,
                })
              }
            >
              <option value="Orang Tua">Orang Tua</option>
              <option value="Beasiswa">Beasiswa</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label>Kebutuhan Khusus</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={santriData.kebutuhan_khusus}
              onChange={(e) =>
                setSantriData({
                  ...santriData,
                  kebutuhan_khusus: e.target.value,
                })
              }
            >
              <option value="Tidak Ada">Tidak Ada</option>
              <option value="Lamban Belajar">Lamban Belajar</option>
              <option value="Kesulitan Belajar Spesifik">
                Kesulitan Belajar Spesifik
              </option>
              <option value="Gangguan Komunikasi">Gangguan Komunikasi</option>
              <option value="Berbakat / Memiliki Kecerdasan Luar Biasa">
                Berbakat / Memiliki Kecerdasan Luar Biasa
              </option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label>Kebutuhan Disabilitas</label>
            <select
              required
              disabled={hasData ? !isEditMode : false}
              value={santriData.kebutuhan_disabilitas}
              onChange={(e) =>
                setSantriData({
                  ...santriData,
                  kebutuhan_disabilitas: e.target.value,
                })
              }
            >
              <option value="Tidak Ada">Tidak Ada</option>
              <option value="Tuna Netra">Tuna Netra</option>
              <option value="Tuna Rungu">Tuna Rungu</option>
              <option value="Tuna Daksa">Tuna Daksa</option>
              <option value="Tuna Grahita">Tuna Grahita</option>
              <option value="Tuna Laras">Tuna Laras</option>
              <option value="Tuna Wicara">Tuna Wicara</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label>Nomor KK</label>
            <input
              type="number"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan nomor KK"
              value={santriData.nomor_kk ?? ""}
              onChange={(e) =>
                setSantriData({ ...santriData, nomor_kk: e.target.value })
              }
            />
          </div>
          <div>
            <label>Nama Kepala Keluarga</label>
            <input
              type="text"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan nama kepala keluarga"
              value={santriData.nama_kepala_keluarga ?? ""}
              onChange={(e) =>
                setSantriData({
                  ...santriData,
                  nama_kepala_keluarga: e.target.value,
                })
              }
            />
          </div>

          <div>
            <div className="relative group">
              <p>Unggah KK</p>
              <label
                className={`
                  block aspect-square w-1/2 rounded-2xl border-4 border-dashed cursor-pointer mt-2
                  ${
                    hasData && !isEditMode
                      ? "cursor-not-allowed opacity-75"
                      : "hover:border-primary-500 border-gray-200"
                  }
                  transition-colors duration-200 overflow-hidden
                `}
                htmlFor="kkInput"
              >
                {santriData.kk_image_url || santriData.kk_image_file ? (
                  <Image
                    width={50}
                    height={50}
                    src={
                      santriData.kk_image_file
                        ? URL.createObjectURL(santriData.kk_image_file)
                        : santriData.kk_image_url ?? ""
                    }
                    alt="KK Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FaUser className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">Upload Foto</span>
                  </div>
                )}
              </label>

              {(!hasData || isEditMode) && (
                <input
                  id="kkInput"
                  type="file"
                  required
                  accept="image/"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setSantriData({
                        ...santriData,
                        kk_image_file: e.target.files[0],
                      });
                    }
                  }}
                />
              )}
            </div>

            {(!hasData || isEditMode) && (
              <p className="text-sm text-gray-500 text-center w-1/2">
                Format: JPG, PNG (Maks. 5MB)
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-16">
        {!hasData && (
          <button
            type="submit"
            className="bg-green-500 rounded w-full sm:w-7/12 py-3 font-semibold mx-auto text-white hover:bg-green-600"
          >
            Kirim Data
          </button>
        )}
        {hasData && !isEditMode && (
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="bg-green-500 rounded w-full sm:w-7/12 py-3 font-semibold mx-auto text-white hover:bg-green-600"
          >
            Edit Data
          </button>
        )}
        {hasData && isEditMode && (
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className="bg-red-500 rounded w-full sm:w-7/12 py-3 font-semibold mx-auto text-white hover:bg-red-600"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-green-500 rounded w-full sm:w-7/12 py-3 font-semibold mx-auto text-white hover:bg-green-600"
            >
              Simpan Perubahan
            </button>
          </div>
        )}
      </div>
    </>
  );
}
