/* eslint-disable @typescript-eslint/no-explicit-any */

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface OrangTuaFormProps {
  orangTuaData: any;
  setOrangTuaData: (data: any) => void;
  setActiveTab: (tab: number) => void;
}

export default function OrangTuaForm({
  orangTuaData,
  setOrangTuaData,
  setActiveTab,
}: OrangTuaFormProps) {
  return (
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={orangTuaData.ayah.nama}
            onChange={(e) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: { ...orangTuaData.ayah, nama: e.target.value },
              })
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={orangTuaData.ayah.nik}
            onChange={(e) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: { ...orangTuaData.ayah, nik: e.target.value },
              })
            }
          />
        </div>

        {/* Kewarganegaraan Ayah */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kewarganegaraan Ayah
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={orangTuaData.ayah.kewarganegaraan}
            onChange={(e) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: { ...orangTuaData.ayah, kewarganegaraan: e.target.value },
              })
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={orangTuaData.ayah.tempat_lahir}
            onChange={(e) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: { ...orangTuaData.ayah, tempat_lahir: e.target.value },
              })
            }
          />
        </div>

        {/* Tanggal Lahir Ayah */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Lahir Ayah
          </label>
          <DatePicker
            selected={orangTuaData.ayah.tanggal_lahir}
            onChange={(date) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: { ...orangTuaData.ayah, tanggal_lahir: date! },
              })
            }
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={orangTuaData.ayah.status}
            onChange={(e) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: { ...orangTuaData.ayah, status: e.target.value },
              })
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={orangTuaData.ayah.pendidikan_terakhir}
            onChange={(e) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: {
                  ...orangTuaData.ayah,
                  pendidikan_terakhir: e.target.value,
                },
              })
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={orangTuaData.ayah.penghasilan}
            onChange={(e) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: { ...orangTuaData.ayah, penghasilan: e.target.value },
              })
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={orangTuaData.ayah.pekerjaan}
            onChange={(e) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: { ...orangTuaData.ayah, pekerjaan: e.target.value },
              })
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={orangTuaData.ayah.nomor_hp}
            onChange={(e) =>
              setOrangTuaData({
                ...orangTuaData,
                ayah: { ...orangTuaData.ayah, nomor_hp: e.target.value },
              })
            }
          />
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={orangTuaData.ayah.has_no_hp}
              onChange={(e) =>
                setOrangTuaData({
                  ...orangTuaData,
                  ayah: { ...orangTuaData.ayah, has_no_hp: e.target.checked },
                })
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
        {/* Field-field untuk Ibu mirip dengan Ayah */}
        {/* Anda dapat mengulangi field-field di atas untuk Ibu */}
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
              checked={orangTuaData.wali.sama_dengan_ayah}
              onChange={(e) =>
                setOrangTuaData({
                  ...orangTuaData,
                  wali: {
                    ...orangTuaData.wali,
                    sama_dengan_ayah: e.target.checked,
                  },
                })
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
              checked={orangTuaData.wali.kartu_keluarga_sama}
              onChange={(e) =>
                setOrangTuaData({
                  ...orangTuaData,
                  wali: {
                    ...orangTuaData.wali,
                    kartu_keluarga_sama: e.target.checked,
                  },
                })
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
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setActiveTab(0)} // SANTRI
          className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Kembali
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(2)} // ALAMAT
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
