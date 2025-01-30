export default function BeritaPage() {
  const berita = [
    { id: 1, judul: "Penerimaan Santri Baru 2024", tanggal: "15 Maret 2024" },
    {
      id: 2,
      judul: "Kegiatan Pesantren Kilat Ramadan",
      tanggal: "10 Maret 2024",
    },
    { id: 3, judul: "Lomba Tahfiz Anak Usia Dini", tanggal: "5 Maret 2024" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Berita Terkini</h1>

      <div className="grid gap-6">
        {berita.map((item) => (
          <article
            key={item.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{item.judul}</h2>
            <p className="text-gray-500 text-sm mb-3">{item.tanggal}</p>
            <p className="text-gray-600 line-clamp-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptates, quod, quia, voluptatibus quae...
            </p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              Baca Selengkapnya →
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
