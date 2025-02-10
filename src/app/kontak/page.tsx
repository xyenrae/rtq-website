export default function KontakPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Hubungi Kami</h1>
      <p className="mt-4">
        Kami siap membantu Anda. Silakan hubungi kami melalui form di bawah ini
        atau kunjungi lokasi kami.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Form Kontak</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1">Nama Lengkap</label>
              <input
                type="text"
                className="w-full p-2 outline-none rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400 focus:ring-gray-400"
                placeholder="Masukkan Nama Lengkap"
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 outline-none rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400 focus:ring-gray-400"
                placeholder="Masukkan E-mail"
              />
            </div>
            <div>
              <label className="block mb-1">Pesan</label>
              <textarea
                className="w-full p-2 outline-none rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-400 focus:ring-gray-400"
                rows={4}
                placeholder="Masukkan pesan"
              />
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
              Kirim Pesan
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
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
