import CardSliderProgram from "@/components/card/CardSliderProgram";

export default function ProgramUnggulan() {
  return (
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Program Unggulan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Program pembelajaran Al-Qur&#39;an terstruktur untuk berbagai usia
          dengan kurikulum berbasis Metode Yanbu&#39;a
        </p>
      </div>

      <CardSliderProgram />
    </div>
  );
}
