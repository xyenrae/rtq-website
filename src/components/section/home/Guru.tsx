import CardSliderGuru from "@/components/card/CardSliderGuru";

export default function Guru() {
  return (
    <div className="container overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Guru Terbaik Kami</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Guru-guru kami di TPQ Al-Hikmah selalu memberikan yang terbaik dengan
          pendekatan penuh kasih dan perhatian. Mereka membimbing anak-anak
          untuk memahami Al-Qur&#39;aan dengan cara yang menyenangkan dan penuh
          makna, sehingga belajar menjadi pengalaman yang positif dan berkesan.
        </p>
      </div>

      <CardSliderGuru />
    </div>
  );
}
