// src/components/form/data/orangtua/OrangTuaFormFields.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { OrangTuaData } from "./useOrangTuaForm";
import dayjs from "dayjs";

interface OrangTuaFormFieldsProps {
  orangTuaData: OrangTuaData;
  handleInputChange: (
    field: string,
    value: string | number | boolean | Date | null,
    type: "ayah" | "ibu" | "wali"
  ) => void;
  handleCheckboxChange: (
    field: string,
    checked: boolean,
    type: "ayah" | "ibu" | "wali"
  ) => void;
  hasData: boolean;
  isEditMode: boolean;
  progress: number;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdate: () => void;
  enterEditMode: () => void;
  cancelEditMode: () => void;
}

export default function OrangTuaFormFields({
  orangTuaData,
  handleInputChange,
  handleCheckboxChange,
  hasData,
  isEditMode,
  progress,
  handleUpdate,
  enterEditMode,
  cancelEditMode,
}: OrangTuaFormFieldsProps) {
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
            <input
              type="date"
              required
              className="w-full p-2 border rounded-lg"
              value={
                orangTuaData.ayah.tanggal_lahir
                  ? dayjs(orangTuaData.ayah.tanggal_lahir).format("YYYY-MM-DD")
                  : ""
              }
              disabled={hasData ? !isEditMode : false}
              onChange={(e) =>
                handleInputChange(
                  "tanggal_lahir",
                  e.target.value ? dayjs(e.target.value).toDate() : null,
                  "ayah"
                )
              }
              placeholder="Pilih tanggal lahir ayah"
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
              <option value="">Pilih Penghasilan</option>
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
              type="number"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan nomor HP ayah"
              value={orangTuaData.ayah.nomor_hp}
              onChange={(e) =>
                handleInputChange("nomor_hp", e.target.value, "ayah")
              }
            />
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
            <input
              type="date"
              required
              className="w-full p-2 border rounded-lg"
              value={
                orangTuaData.ibu.tanggal_lahir
                  ? dayjs(orangTuaData.ibu.tanggal_lahir).format("YYYY-MM-DD")
                  : ""
              }
              disabled={hasData ? !isEditMode : false}
              onChange={(e) =>
                handleInputChange(
                  "tanggal_lahir",
                  e.target.value ? dayjs(e.target.value).toDate() : null,
                  "ibu"
                )
              }
              placeholder="Pilih tanggal lahir ibu"
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
              <option value="">Pilih Penghasilan</option>
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
              type="number"
              required
              disabled={hasData ? !isEditMode : false}
              placeholder="Masukkan nomor HP ibu"
              value={orangTuaData.ibu.nomor_hp}
              onChange={(e) =>
                handleInputChange("nomor_hp", e.target.value, "ibu")
              }
            />
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

        {/* Navigasi */}
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
            <button
              type="button"
              onClick={enterEditMode}
              className="bg-green-500 rounded w-full sm:w-7/12 py-3 font-semibold mx-auto text-white hover:bg-green-600"
            >
              Edit Data
            </button>
          )}
          {hasData && isEditMode && (
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={cancelEditMode}
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
      </div>
    </>
  );
}
