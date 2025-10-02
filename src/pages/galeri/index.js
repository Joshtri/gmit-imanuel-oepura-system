import Image from "next/image";
import { useEffect, useState } from "react";

import EmptyState from "@/components/common/EmptyState";
import Images from "@/components/gallery/images";
import PageTitle from "@/components/ui/PageTitle";
import axios from "@/lib/axios";

export default function Galeri() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGaleri() {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("/galeri");

        if (response.data.success && response.data.data.items.length > 0) {
          // Pass the gallery items directly without flattening
          setGalleryItems(response.data.data.items);
        } else {
          setGalleryItems([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat data galeri");
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGaleri();
  }, []);

  return (
    <div>
      <PageTitle
        description="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi. Bergabunglah bersama kami dalam ibadah, persekutuan, dan pelayanan."
        title="Galeri"
      />
      <div className="flex justify-center items-center h-screen relative">
        <Image
          fill
          priority
          alt="Galeri Head"
          sizes="100vw"
          src="/header/gallery.webp"
          style={{ objectFit: "cover" }}
        />
        <h1 className="absolute text-8xl font-bold mt-4 text-white">Galeri</h1>
      </div>
      <div className="bg-gray-500 min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="loading loading-xl text-neutral" />
          </div>
        ) : error ? (
          <EmptyState
            actionText="Coba Lagi"
            description={`Terjadi kesalahan: ${error}`}
            title="Gagal Memuat Galeri"
            type="error"
            onAction={() => window.location.reload()}
          />
        ) : (
          <Images galleryItems={galleryItems} />
        )}
      </div>
    </div>
  );
}
