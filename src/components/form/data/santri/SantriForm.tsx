"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";

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

export default function SantriForm() {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchSantriData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: santri, error } = await supabase
        .from("santri")
        .select("*")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (error) {
        setHasData(false);
      } else if (santri) {
        setSantriData(santri);
        setHasData(true);
      } else {
        setHasData(false);
      }
    };

    fetchSantriData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Anda harus login terlebih dahulu.");
        return;
      }

      let kkUrl: string | null = null;
      let kipUrl: string | null = null;

      if (santriData.unggah_kk) {
        const { error: kkError } = await supabase.storage
          .from("files")
          .upload(`kk/${santriData.unggah_kk.name}`, santriData.unggah_kk);
        if (kkError) throw kkError;
        kkUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/kk/${santriData.unggah_kk.name}`;
      }

      if (santriData.unggah_kip) {
        const { error: kipError } = await supabase.storage
          .from("files")
          .upload(`kip/${santriData.unggah_kip.name}`, santriData.unggah_kip);
        if (kipError) throw kipError;
        kipUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/kip/${santriData.unggah_kip.name}`;
      }

      const { error } = await supabase.from("santri").insert({
        user_id: userData.user.id,
        nama_lengkap: santriData.nama_lengkap,
        nik: santriData.nik,
        tempat_lahir: santriData.tempat_lahir,
        tanggal_lahir: santriData.tanggal_lahir?.toISOString(),
        jenis_kelamin: santriData.jenis_kelamin,
        jumlah_saudara: santriData.jumlah_saudara,
        anak_ke: santriData.anak_ke,
        cita_cita: santriData.cita_cita,
        nomor_hp: santriData.has_no_hp ? null : santriData.nomor_hp,
        email: santriData.email,
        hobi: santriData.hobi,
        sumber_pembiayaan: santriData.sumber_pembiayaan,
        nomor_kip: santriData.nomor_kip,
        kebutuhan_khusus: santriData.kebutuhan_khusus,
        kebutuhan_disabilitas: santriData.kebutuhan_disabilitas,
        nomor_kk: santriData.nomor_kk,
        nama_kepala_keluarga: santriData.nama_kepala_keluarga,
        unggah_kk: kkUrl,
        unggah_kip: kipUrl,
      });

      if (error) {
        toast.error("Gagal menyimpan data santri.");
      } else {
        toast.success("Data santri berhasil disimpan!");
        setHasData(true);
      }
    } catch {
      toast.error("Terjadi kesalahan saat mendaftar.");
    }
  };

  const handleUpdate = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { error } = await supabase
        .from("santri")
        .update({
          nama_lengkap: santriData.nama_lengkap,
          nik: santriData.nik,
          tempat_lahir: santriData.tempat_lahir,
          tanggal_lahir: santriData.tanggal_lahir?.toISOString(),
          jenis_kelamin: santriData.jenis_kelamin,
          jumlah_saudara: santriData.jumlah_saudara,
          anak_ke: santriData.anak_ke,
          cita_cita: santriData.cita_cita,
          nomor_hp: santriData.has_no_hp ? null : santriData.nomor_hp,
          email: santriData.email,
          hobi: santriData.hobi,
          sumber_pembiayaan: santriData.sumber_pembiayaan,
          nomor_kip: santriData.nomor_kip,
          kebutuhan_khusus: santriData.kebutuhan_khusus,
          kebutuhan_disabilitas: santriData.kebutuhan_disabilitas,
          nomor_kk: santriData.nomor_kk,
          nama_kepala_keluarga: santriData.nama_kepala_keluarga,
        })
        .eq("user_id", userData.user.id);

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

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label>Nama Lengkap*</label>
            <input
              type="text"
              required
              disabled={hasData && !isEditMode}
              placeholder="Masukkan nama lengkap"
              value={santriData.nama_lengkap}
              onChange={(e) =>
                setSantriData({ ...santriData, nama_lengkap: e.target.value })
              }
            />
          </div>
          <div>
            <label>NIK*</label>
            <input
              type="text"
              required
              disabled={hasData && !isEditMode}
              placeholder="Masukkan NIK"
              value={santriData.nik}
              onChange={(e) =>
                setSantriData({ ...santriData, nik: e.target.value })
              }
            />
          </div>
          <div>
            <label>Tempat Lahir*</label>
            <input
              type="text"
              required
              disabled={hasData && !isEditMode}
              placeholder="Masukkan tempat lahir"
              value={santriData.tempat_lahir}
              onChange={(e) =>
                setSantriData({ ...santriData, tempat_lahir: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label>Tanggal Lahir*</label>
            <DatePicker
              selected={santriData.tanggal_lahir}
              disabled={hasData && !isEditMode}
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
              disabled={hasData && !isEditMode}
              value={santriData.jenis_kelamin}
              onChange={(e) =>
                setSantriData({ ...santriData, jenis_kelamin: e.target.value })
              }
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div>
            <label>Jumlah Saudara*</label>
            <input
              type="number"
              required
              disabled={hasData && !isEditMode}
              placeholder="Masukkan jumlah saudara"
              value={santriData.jumlah_saudara}
              onChange={(e) =>
                setSantriData({
                  ...santriData,
                  jumlah_saudara: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>Anak Ke*</label>
            <input
              type="number"
              required
              disabled={hasData && !isEditMode}
              placeholder="Masukkan urutan anak"
              value={santriData.anak_ke}
              onChange={(e) =>
                setSantriData({
                  ...santriData,
                  anak_ke: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>Cita-cita</label>
            <select
              required
              disabled={hasData && !isEditMode}
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
          <div className="flex flex-col items-start">
            <label>Nomor HP</label>
            <input
              type="text"
              required={!santriData.has_no_hp}
              disabled={(!isEditMode && hasData) || santriData.has_no_hp}
              placeholder="Masukkan nomor HP"
              value={santriData.nomor_hp}
              onChange={(e) =>
                setSantriData({ ...santriData, nomor_hp: e.target.value })
              }
            />
            <div className="flex gap-2 mt-1">
              <input
                type="checkbox"
                className="w-4 h-4"
                disabled={hasData && !isEditMode}
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
              required
              disabled={hasData && !isEditMode}
              placeholder="Masukkan email"
              value={santriData.email}
              onChange={(e) =>
                setSantriData({ ...santriData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label>Hobi</label>
            <select
              required
              disabled={hasData && !isEditMode}
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
          <div>
            <label>Sumber Pembiayaan</label>
            <select
              required
              disabled={hasData && !isEditMode}
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
            <label>Nomor KIP</label>
            <input
              type="text"
              disabled={hasData && !isEditMode}
              placeholder="Masukkan nomor KIP"
              value={santriData.nomor_kip}
              onChange={(e) =>
                setSantriData({ ...santriData, nomor_kip: e.target.value })
              }
            />
          </div>
          <div>
            <label>Kebutuhan Khusus</label>
            <select
              required
              disabled={hasData && !isEditMode}
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
              disabled={hasData && !isEditMode}
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
            <label>Nomor KK*</label>
            <input
              type="text"
              required
              disabled={hasData && !isEditMode}
              placeholder="Masukkan nomor KK"
              value={santriData.nomor_kk}
              onChange={(e) =>
                setSantriData({ ...santriData, nomor_kk: e.target.value })
              }
            />
          </div>
          <div>
            <label>Nama Kepala Keluarga*</label>
            <input
              type="text"
              required
              disabled={hasData && !isEditMode}
              placeholder="Masukkan nama kepala keluarga"
              value={santriData.nama_kepala_keluarga}
              onChange={(e) =>
                setSantriData({
                  ...santriData,
                  nama_kepala_keluarga: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Unggah KK</label>
            <input
              type="file"
              disabled={hasData && !isEditMode}
              onChange={(e) =>
                setSantriData({
                  ...santriData,
                  unggah_kk: e.target.files ? e.target.files[0] : null,
                })
              }
            />
          </div>
          <div>
            <label>Unggah KIP</label>
            <input
              type="file"
              disabled={hasData && !isEditMode}
              onChange={(e) =>
                setSantriData({
                  ...santriData,
                  unggah_kip: e.target.files ? e.target.files[0] : null,
                })
              }
            />
          </div>
        </div>

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
            <button type="button" onClick={() => setIsEditMode(true)}>
              Edit Data
            </button>
          )}
          {hasData && isEditMode && (
            <div className="flex gap-3">
              <button type="button" onClick={() => setIsEditMode(false)}>
                Batal
              </button>
              <button type="button" onClick={handleUpdate}>
                Simpan Perubahan
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
