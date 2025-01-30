import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Selamat Datang di RTQ Al-Ikhlas
        </h1>
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
          <Image
            src="/images/hero.jpg"
            alt="Kegiatan Belajar"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Menu CTA */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <CTACard
          title="Pendaftaran Santri"
          href="/pendaftaran"
          image="/images/cta-register.jpg"
        />
        <CTACard
          title="Berita Terkini"
          href="/berita"
          image="/images/cta-news.jpg"
        />
        <CTACard
          title="Galeri Kegiatan"
          href="/galeri"
          image="/images/cta-gallery.jpg"
        />
      </div>
    </div>
  );
}

function CTACard({
  title,
  href,
  image,
}: {
  title: string;
  href: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold group-hover:text-blue-300 transition-colors">
          {title}
        </h2>
      </div>
    </Link>
  );
}
