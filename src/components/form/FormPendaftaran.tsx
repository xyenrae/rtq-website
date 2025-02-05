// components/RegistrationForm.tsx
import { useState } from "react";
import SantriForm from "./data/santri/SantriForm";
import OrangTuaForm from "./data/orangtua/OrangTuaForm";
import AlamatForm from "./data/alamat/AlamatForm";

export default function FormPendaftaran() {
  const [activeTab, setActiveTab] = useState(0);
  const [santriData, setSantriData] = useState({
    nama_lengkap: "", // Nama Lengkap Santri
    nik: "", // NIK Santri
    tempat_lahir: "", // Tempat Lahir Santri
    tanggal_lahir: null, // Tanggal Lahir Santri (gunakan Date object atau null)
    jenis_kelamin: "", // Jenis Kelamin Santri
    jumlah_saudara: 0, // Jumlah Saudara Kandung
    anak_ke: 0, // Anak Ke Berapa
    cita_cita: "", // Cita-cita Santri
    nomor_hp: "", // Nomor HP Santri
    has_no_hp: false, // Apakah Santri Tidak Memiliki Nomor HP
    email: "", // Email Santri
    hobi: [], // Hobi Santri (array string)
    sumber_pembiayaan: "", // Sumber Pembiayaan
    nomor_kip: "", // Nomor KIP (jika ada)
    kebutuhan_khusus: "", // Kebutuhan Khusus
    kebutuhan_disabilitas: "", // Kebutuhan Disabilitas
    nomor_kk: "", // Nomor Kartu Keluarga
    nama_kepala_keluarga: "", // Nama Kepala Keluarga
    unggah_kk: null, // File Unggahan KK
    unggah_kip: null, // File Unggahan KIP
  });
  const [orangTuaData, setOrangTuaData] = useState({
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
  const [alamatData, setAlamatData] = useState({
    ayah: {
      tinggal_luar_negeri: false, // Apakah Ayah Tinggal di Luar Negeri
      status_kepemilikan: "", // Status Kepemilikan Rumah Ayah
      provinsi: "", // Provinsi Ayah
      kabupaten: "", // Kabupaten Ayah
      kecamatan: "", // Kecamatan Ayah
      kelurahan: "", // Kelurahan Ayah
      kode_pos: "", // Kode Pos Ayah
      rt: "", // RT Ayah
      rw: "", // RW Ayah
      alamat: "", // Alamat Lengkap Ayah
    },
    ibu: {
      tinggal_luar_negeri: false, // Apakah Ibu Tinggal di Luar Negeri
      status_kepemilikan: "", // Status Kepemilikan Rumah Ibu
      provinsi: "", // Provinsi Ibu
      kabupaten: "", // Kabupaten Ibu
      kecamatan: "", // Kecamatan Ibu
      kelurahan: "", // Kelurahan Ibu
      kode_pos: "", // Kode Pos Ibu
      rt: "", // RT Ibu
      rw: "", // RW Ibu
      alamat: "", // Alamat Lengkap Ibu
    },
    santri: {
      status_mukim: "", // Status Mukim Santri
      status_tempat_tinggal: "", // Status Tempat Tinggal Santri
      jarak_lembaga: "", // Jarak ke Lembaga
      transportasi: "", // Transportasi Santri
      waktu_tempuh: "", // Waktu Tempuh ke Lembaga
      koordinat: "", // Koordinat Lokasi
      provinsi: "", // Provinsi Santri
      kabupaten: "", // Kabupaten Santri
      kecamatan: "", // Kecamatan Santri
      kelurahan: "", // Kelurahan Santri
      kode_pos: "", // Kode Pos Santri
      rt: "", // RT Santri
      rw: "", // RW Santri
      alamat: "", // Alamat Lengkap Santri
    },
    ibu_sama_dengan_ayah: false, // Apakah Alamat Ibu Sama dengan Ayah
  });
  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md font-noto-sans">
      {/* Tabs */}
      <div className="flex mb-8 border-b">
        {["Santri", "Orang Tua", "Alamat"].map((tab, index) => (
          <button
            key={index}
            className={`px-6 py-3 text-sm font-medium w-full bg-gray-200 ${
              activeTab === index
                ? "text-white !bg-green-500 rounded"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render Form Berdasarkan Tab Aktif */}
      {activeTab === 0 && (
        <SantriForm
          santriData={santriData}
          setSantriData={setSantriData}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === 1 && (
        <OrangTuaForm
          orangTuaData={orangTuaData}
          setOrangTuaData={setOrangTuaData}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === 2 && (
        <AlamatForm
          alamatData={alamatData}
          setAlamatData={setAlamatData}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}
