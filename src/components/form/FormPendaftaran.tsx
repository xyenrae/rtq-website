// components/RegistrationForm.tsx
import { useState } from "react";
import SantriForm from "./data/santri/SantriForm";
import OrangTuaForm from "./data/orangtua/OrangTuaForm";
import AlamatForm from "./data/alamat/AlamatForm";

export default function FormPendaftaran() {
  const [activeTab, setActiveTab] = useState(0);
  const [santriData, setSantriData] = useState({});
  const [orangTuaData, setOrangTuaData] = useState({});
  const [alamatData, setAlamatData] = useState({});

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md font-noto-sans">
      {/* Tabs */}
      <div className="flex mb-8 border-b">
        {["Santri", "Orang Tua", "Alamat"].map((tab, index) => (
          <button
            key={index}
            className={`px-6 py-3 text-sm font-medium w-full bg-gray-200 ${
              activeTab === index
                ? "text-white !bg-green-500 rounded"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render Form Berdasarkan Tab Aktif */}
      {activeTab === 0 && (
        <SantriForm
          santriData={santriData}
          setSantriData={setSantriData}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === 1 && (
        <OrangTuaForm
          orangTuaData={orangTuaData}
          setOrangTuaData={setOrangTuaData}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === 2 && (
        <AlamatForm
          alamatData={alamatData}
          setAlamatData={setAlamatData}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}
