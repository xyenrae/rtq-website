import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SantriFormProps {
  setActiveTab: (tab: number) => void;
}

interface SantriData {
  nama_lengkap: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: Date | null;
  jenis_kelamin: string;
  jumlah_saudara: number;
  anak_ke: number;
  cita_cita: string;
  nomor_hp: string;
  has_no_hp: boolean;
  email: string;
  hobi: string;
  sumber_pembiayaan: string;
  nomor_kip: string;
  kebutuhan_khusus: string;
  kebutuhan_disabilitas: string;
  nomor_kk: string;
  nama_kepala_keluarga: string;
  unggah_kk: File | null;
  unggah_kip: File | null;
}

export default function SantriForm({ setActiveTab }: SantriFormProps) {
  const [santriData, setSantriData] = useState<SantriData>({
    nama_lengkap: "",
    nik: "",
    tempat_lahir: "",
    tanggal_lahir: null,
    jenis_kelamin: "",
    jumlah_saudara: 0,
    anak_ke: 0,
    cita_cita: "",
    nomor_hp: "",
    has_no_hp: false,
    email: "",
    hobi: "",
    sumber_pembiayaan: "",
    nomor_kip: "",
    kebutuhan_khusus: "",
    kebutuhan_disabilitas: "",
    nomor_kk: "",
    nama_kepala_keluarga: "",
    unggah_kk: null,
    unggah_kip: null,
  });

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
            className="p-2 mt-1 block w-full outline-none rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400 focus:ring-gray-400"
            value={santriData.nama_lengkap}
            onChange={(e) =>
              setSantriData({ ...santriData, nama_lengkap: e.target.value })
            }
          />
        </div>

        {/* NIK */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            NIK*
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan NIK"
            className="mt-1 outline-none p-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400 focus:ring-gray-400"
            value={santriData.nik}
            onChange={(e) =>
              setSantriData({ ...santriData, nik: e.target.value })
            }
          />
        </div>

        {/* Tempat Lahir */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tempat Lahir*
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan tempat lahir"
            className="mt-1 p-2 outline-none block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400 focus:ring-gray-400"
            value={santriData.tempat_lahir}
            onChange={(e) =>
              setSantriData({ ...santriData, tempat_lahir: e.target.value })
            }
          />
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Lahir*
          </label>
          <DatePicker
            selected={santriData.tanggal_lahir}
            onChange={(date) =>
              setSantriData({ ...santriData, tanggal_lahir: date! })
            }
            className="mt-1 outline-none p-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400 focus:ring-gray-400"
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            value={santriData.jenis_kelamin}
            onChange={(e) =>
              setSantriData({ ...santriData, jenis_kelamin: e.target.value })
            }
          >
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        {/* Jumlah Saudara */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jumlah Saudara*
          </label>
          <input
            type="number"
            required
            placeholder="Masukkan jumlah saudara"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
            Anak Ke*
          </label>
          <input
            type="number"
            required
            placeholder="Masukkan urutan anak"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
          <select
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            value={santriData.cita_cita}
            onChange={(e) =>
              setSantriData({ ...santriData, cita_cita: e.target.value })
            }
          >
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            value={santriData.hobi}
            onChange={(e) =>
              setSantriData({ ...santriData, hobi: e.target.value })
            }
          >
            <option value="Olahraga">Olahraga</option>
            <option value="Kesenian">Kesenian</option>
            <option value="Membaca">Membaca</option>
            <option value="Menulis">Menulis</option>
            <option value="Jalan-jalan">Jalan-jalan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Sumber Pembiayaan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sumber Pembiayaan
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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

        {/* Nomor KIP */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nomor KIP
          </label>
          <input
            type="text"
            placeholder="Masukkan nomor KIP"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
          <select
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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

        {/* Kebutuhan Disabilitas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kebutuhan Disabilitas
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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

        {/* Nomor KK */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nomor KK*
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan nomor KK"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
            value={santriData.nomor_kk}
            onChange={(e) =>
              setSantriData({ ...santriData, nomor_kk: e.target.value })
            }
          />
        </div>

        {/* Nama Kepala Keluarga */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Kepala Keluarga*
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan nama kepala keluarga"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm outline-none p-2 focus:border-gray-400 focus:ring-gray-400"
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
