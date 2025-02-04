/* eslint-disable @typescript-eslint/no-explicit-any */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SantriFormProps {
  santriData: any;
  setSantriData: (data: any) => void;
  setActiveTab: (tab: number) => void;
}

export default function SantriForm({
  santriData,
  setSantriData,
  setActiveTab,
}: SantriFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Lengkap*
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan nama lengkap"
            className="p-2 mt-1 block w-full outline-none rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400"
            value={santriData.nama_lengkap}
            onChange={(e) =>
              setSantriData({ ...santriData, nama_lengkap: e.target.value })
            }
          />
        </div>

        {/* NIK */}
        <div>
          <label className="block text-sm font-medium text-gray-700">NIK</label>
          <input
            type="text"
            required
            placeholder="Masukkan NIK"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.nik}
            onChange={(e) =>
              setSantriData({ ...santriData, nik: e.target.value })
            }
          />
        </div>

        {/* Tempat Lahir */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tempat Lahir
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan tempat lahir"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.tempat_lahir}
            onChange={(e) =>
              setSantriData({ ...santriData, tempat_lahir: e.target.value })
            }
          />
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Lahir
          </label>
          <DatePicker
            selected={santriData.tanggal_lahir}
            onChange={(date) =>
              setSantriData({ ...santriData, tanggal_lahir: date! })
            }
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholderText="Pilih tanggal lahir"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jenis Kelamin
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.jenis_kelamin}
            onChange={(e) =>
              setSantriData({ ...santriData, jenis_kelamin: e.target.value })
            }
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        {/* Jumlah Saudara */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jumlah Saudara
          </label>
          <input
            type="number"
            required
            placeholder="Masukkan jumlah saudara"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.jumlah_saudara}
            onChange={(e) =>
              setSantriData({
                ...santriData,
                jumlah_saudara: parseInt(e.target.value),
              })
            }
          />
        </div>

        {/* Anak Ke */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Anak Ke
          </label>
          <input
            type="number"
            required
            placeholder="Masukkan urutan anak"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.anak_ke}
            onChange={(e) =>
              setSantriData({
                ...santriData,
                anak_ke: parseInt(e.target.value),
              })
            }
          />
        </div>

        {/* Cita-cita */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cita-cita
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan cita-cita"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.cita_cita}
            onChange={(e) =>
              setSantriData({ ...santriData, cita_cita: e.target.value })
            }
          />
        </div>

        {/* Nomor HP */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nomor HP
          </label>
          <input
            type="text"
            required={!santriData.has_no_hp}
            disabled={santriData.has_no_hp}
            placeholder="Masukkan nomor HP"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.nomor_hp}
            onChange={(e) =>
              setSantriData({ ...santriData, nomor_hp: e.target.value })
            }
          />
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={santriData.has_no_hp}
              onChange={(e) =>
                setSantriData({ ...santriData, has_no_hp: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              Tidak memiliki nomor HP
            </span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="Masukkan email"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.email}
            onChange={(e) =>
              setSantriData({ ...santriData, email: e.target.value })
            }
          />
        </div>

        {/* Hobi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hobi
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.hobi}
            onChange={(e) =>
              setSantriData({ ...santriData, hobi: e.target.value })
            }
          >
            <option value=""></option>
            <option value="Olahraga">Olahraga</option>
            <option value="Kesenian">Kesenian</option>
            <option value="Membaca">Membaca</option>
            <option value="Menulis">Menulis</option>
            <option value="Jalan-jalan">Jalan-jalan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          {/* <input
            type="text"
            required
            placeholder="Masukkan hobi (pisahkan dengan koma)"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.hobi.join(", ")}
            onChange={(e) =>
              setSantriData({
                ...santriData,
                hobi: e.target.value.split(",").map((h) => h.trim()),
              })
            }
          /> */}
        </div>

        {/* Sumber Pembiayaan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sumber Pembiayaan
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.sumber_pembiayaan}
            onChange={(e) =>
              setSantriData({
                ...santriData,
                sumber_pembiayaan: e.target.value,
              })
            }
          >
            <option value="">Pilih Sumber Pembiayaan</option>
            <option value="Orang Tua">Orang Tua</option>
            <option value="Beasiswa">Beasiswa</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Nomor KIP */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nomor KIP
          </label>
          <input
            type="text"
            placeholder="Masukkan nomor KIP"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.nomor_kip}
            onChange={(e) =>
              setSantriData({ ...santriData, nomor_kip: e.target.value })
            }
          />
        </div>

        {/* Kebutuhan Khusus */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kebutuhan Khusus
          </label>
          <input
            type="text"
            placeholder="Masukkan kebutuhan khusus"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.kebutuhan_khusus}
            onChange={(e) =>
              setSantriData({ ...santriData, kebutuhan_khusus: e.target.value })
            }
          />
        </div>

        {/* Kebutuhan Disabilitas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kebutuhan Disabilitas
          </label>
          <input
            type="text"
            placeholder="Masukkan kebutuhan disabilitas"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.kebutuhan_disabilitas}
            onChange={(e) =>
              setSantriData({
                ...santriData,
                kebutuhan_disabilitas: e.target.value,
              })
            }
          />
        </div>

        {/* Nomor KK */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nomor KK
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan nomor KK"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.nomor_kk}
            onChange={(e) =>
              setSantriData({ ...santriData, nomor_kk: e.target.value })
            }
          />
        </div>

        {/* Nama Kepala Keluarga */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Kepala Keluarga
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan nama kepala keluarga"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={santriData.nama_kepala_keluarga}
            onChange={(e) =>
              setSantriData({
                ...santriData,
                nama_kepala_keluarga: e.target.value,
              })
            }
          />
        </div>

        {/* Unggah KK */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unggah KK
          </label>
          <input
            type="file"
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) =>
              setSantriData({
                ...santriData,
                unggah_kk: e.target.files ? e.target.files[0] : null,
              })
            }
          />
        </div>

        {/* Unggah KIP */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unggah KIP
          </label>
          <input
            type="file"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) =>
              setSantriData({
                ...santriData,
                unggah_kip: e.target.files ? e.target.files[0] : null,
              })
            }
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setActiveTab(1)} // ORANG_TUA
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
