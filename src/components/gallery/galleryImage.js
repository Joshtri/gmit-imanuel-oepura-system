import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryImage({ galleryItem }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Parse fotos if it's a string
  let fotos;
  if (typeof galleryItem.fotos === 'string') {
    try {
      fotos = JSON.parse(galleryItem.fotos);
    } catch (e) {
      console.error("Failed to parse galleryItem.fotos:", e);
      fotos = [];
    }
  } else {
    fotos = galleryItem.fotos;
  }

  // Format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % fotos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (!fotos || fotos.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Container */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <img 
          src={fotos[currentImageIndex].url} 
          alt={fotos[currentImageIndex].originalName || 'gallery image'} 
          className="object-cover w-full h-full"
        />
        
        {/* Navigation Arrows */}
        {fotos.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {fotos.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {fotos.length}
          </div>
        )}
      </div>

      {/* Dots Indicator */}
      {fotos.length > 1 && (
        <div className="flex justify-center space-x-2 py-3 bg-gray-100">
          {fotos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Event Information */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{galleryItem.namaKegiatan}</h2>
        <p className="text-sm text-gray-600 mb-2">{galleryItem.deskripsi}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{galleryItem.tempat}</span>
          <span>{formatDate(galleryItem.tanggalKegiatan)}</span>
        </div>
      </div>
    </div>
  );
}
