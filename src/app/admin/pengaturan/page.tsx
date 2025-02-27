"use client";
import { usePengaturan } from "@/hooks/admin/pengaturan/usePengaturan";
import {
  Loader2,
  Save,
  Mail,
  Home,
  Phone,
  Facebook,
  Youtube,
  Instagram,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PengaturanPage = () => {
  const { settings, isLoading, updateSettings } = usePengaturan();
  const [formData, setFormData] = useState({
    email: "",
    alamat: "",
    phone_number: "",
    link_facebook: "",
    link_youtube: "",
    link_instagram: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        email: settings.email || "",
        alamat: settings.alamat || "",
        phone_number: settings.phone_number || "",
        link_facebook: settings.link_facebook || "",
        link_youtube: settings.link_youtube || "",
        link_instagram: settings.link_instagram || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-8 mx-auto">
      <ToastContainer />
      <div className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <Settings className="w-8 h-8" />
        Pengaturan Website
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline-block mr-2 h-5 w-5" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Phone Number */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline-block mr-2 h-5 w-5" />
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 "
            />
          </div>

          {/* Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="inline-block mr-2 h-5 w-5" />
              Alamat
            </label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="mt-1 "
            />
          </div>

          {/* Social Media Links */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Media Sosial
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Facebook className="inline-block mr-2 h-5 w-5" />
                  Facebook
                </label>
                <input
                  type="url"
                  name="link_facebook"
                  value={formData.link_facebook}
                  onChange={handleChange}
                  className="mt-1 "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Youtube className="inline-block mr-2 h-5 w-5" />
                  YouTube
                </label>
                <input
                  type="url"
                  name="link_youtube"
                  value={formData.link_youtube}
                  onChange={handleChange}
                  className="mt-1 "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Instagram className="inline-block mr-2 h-5 w-5" />
                  Instagram
                </label>
                <input
                  type="url"
                  name="link_instagram"
                  value={formData.link_instagram}
                  onChange={handleChange}
                  className="mt-1 "
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default PengaturanPage;
