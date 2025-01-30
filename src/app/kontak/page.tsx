export default function KontakPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hubungi Kami</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Form Kontak</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1">Nama Lengkap</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input type="email" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">Pesan</label>
              <textarea className="w-full p-2 border rounded" rows={4} />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Kirim Pesan
            </button>
          </form>
        </div>

        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.524635575603!2d106.8221263152947!3d-6.194743662425004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f42b40e7c203%3A0x7d9f2347a1df4e9d!2sMonas!5e0!3m2!1sen!2sid!4v1647427347725!5m2!1sen!2sid"
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
