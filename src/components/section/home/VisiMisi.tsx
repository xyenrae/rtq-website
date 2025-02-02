import Image from "next/image";

export default function VisiMisi() {
  return (
    <section className="relative w-screen h-fit py-32">
      <div className="absolute inset-0">
        <Image
          src="/images/visimisi.png"
          alt="Visi Misi Background"
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 container grid place-content-center">
        <div>
          <h2 className="text-4xl font-bold text-white mb-6">Visi & Misi</h2>
          <p className="text-lg text-white mt-2">
            Menciptakan generasi yang mencintai Al-Qur&#39;an dan menerapkan
            ajaran Islam dalam kehidupan sehari-hari.
          </p>
          <ul className="list-disc pl-5 text-lg text-white mt-2 w-fit ml-4">
            <li>
              Menumbuhkan kecintaan terhadap Al-Qur&#39;an di kalangan santri
              sejak dini.
            </li>
            <li>
              Memberikan pendidikan agama Islam yang berkualitas dan menyeluruh.
            </li>
            <li>
              Membangun karakter yang baik melalui kegiatan dakwah dan sosial.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
