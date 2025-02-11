import ProgramMembaca from "@/components/section/home/ProgramMembaca";
import ProgramKami from "@/components/section/home/ProgramKami";
import KenaliKami from "@/components/section/home/KenaliKami";
import ProgramUnggulan from "@/components/section/home/ProgramUnggulan";
import VisiMisi from "@/components/section/home/VisiMisi";
import Guru from "@/components/section/home/Guru";
import Berita from "@/components/section/home/Berita";
import Hero from "@/components/section/home/Hero";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Hero />
      </section>

      {/* Program Unggulan Section */}
      <section
        id="program-section"
        className="container mt-32 !overflow-hidden"
      >
        <ProgramUnggulan />
      </section>

      {/* Program Kami Section */}
      <section className="mt-12">
        <ProgramKami />
      </section>

      {/* Program Membaca Section */}
      <section className="mt-32">
        <ProgramMembaca />
      </section>

      {/* Kenali Kami Section */}
      <section className="mt-12">
        <KenaliKami />
      </section>

      {/* Visi Misi Section */}
      <section>
        <VisiMisi />
      </section>

      {/* Guru Section */}
      <section className="mt-32">
        <Guru />
      </section>

      {/* Berita Section */}
      <section className="mt-12">
        <Berita />
      </section>
    </div>
  );
}
