"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, FormEvent } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function KontakPage() {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    fullName: "",
    message: "",
  });
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Mengambil data nomor WhatsApp dari tabel settings saat komponen dimount
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("phone_number")
        .limit(1);

      if (error) {
        console.error(error);
      } else {
        const number = data[0]?.phone_number;
        setWhatsappNumber(number);
      }
    };

    fetchSettings();
  }, [supabase]);

  const generateWhatsAppMessage = (name: string, message: string) => {
    const template = `Assalamu'alaikum Warahmatullahi Wabarakatuh,

Saya ${name} ingin berkonsultasi/bertanya:

${message}

Jazakumullah khairan katsiran.`;

    return encodeURIComponent(template);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { fullName, message } = formData;
    if (!fullName || !message) {
      alert("Mohon lengkapi semua field");
      return;
    }

    const finalMessage = generateWhatsAppMessage(fullName, message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${finalMessage}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Hubungi Kami</h1>
      <p className="mt-4">
        Silakan sampaikan pertanyaan atau konsultasi Anda melalui WhatsApp kami.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Form Kontak */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Form Konsultasi</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1">Nama Lengkap</label>
              <input
                type="text"
                className="w-full p-2 outline-none rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400 focus:ring-gray-400"
                placeholder="Masukkan Nama Lengkap"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Pesan</label>
              <textarea
                className="w-full p-2 outline-none rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400 focus:ring-gray-400"
                rows={4}
                placeholder="Masukkan pertanyaan atau pesan Anda"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <FaWhatsapp size={24} />
              Kirim via WhatsApp
            </button>
          </form>
        </div>

        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.585855355361!2d111.08164387475487!3d-6.698103893297417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70d5a33a27fecf%3A0x8d549f17bc450140!2sTPQ%20Alhikmah%20Ngurensiti!5e0!3m2!1sen!2sid!4v1739173001291!5m2!1sen!2sid"
            width="100%"
            height="100%"
            className="min-h-[400px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
