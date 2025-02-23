import { Calendar, Eye, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
interface Berita {
  id: string;
  judul: string;
  created_at: string;
  konten: string;
  views: number;
  gambar?: string;
  kategori?: string;
  ringkasan?: string;
}

interface RelatedNewsCardProps {
  item: Berita;
  index: number;
}

const RelatedNewsCard = ({ item, index }: RelatedNewsCardProps) => {
  // Function to format the date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Function to estimate reading time
  const estimateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        {item.gambar ? (
          <Image
            src={item.gambar}
            alt={item.judul}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {item.kategori && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full shadow-sm">
              {item.kategori}
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-6">
        <Link href={`/berita/${item.id}`}>
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-3">
            {item.judul}
          </h3>
        </Link>

        {/* Summary */}
        {item.ringkasan && (
          <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
            {item.ringkasan}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(item.created_at)}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{item.views} views</span>
          </div>

          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{estimateReadTime(item.konten)} min read</span>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default RelatedNewsCard;
