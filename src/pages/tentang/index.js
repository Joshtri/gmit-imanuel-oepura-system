import Image from "next/image";
import { useEffect, useState } from "react";

import VisionAndMission from "@/components/about/visionAndMission";
import PageTitle from "@/components/ui/PageTitle";

export default function Tentang() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-50">
      <PageTitle
        description="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi. Bergabunglah bersama kami dalam ibadah, persekutuan, dan pelayanan."
        title="Tentang Kami"
      />
      {/* Hero Section with Parallax */}
      <div className="relative h-screen flex justify-center items-center overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <Image
            fill
            priority
            alt="GMIT Imanuel Oepura"
            className="w-full h-full object-cover"
            sizes="100vw"
            src="/header/190c3d1c.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">
              Tentang Kami
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-white to-indigo-400 mx-auto mb-8 rounded-full" />
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light">
              GMIT Imanuel Oepura - Gereja yang hidup, bertumbuh dalam iman,
              pengharapan dan kasih, melayani dengan budaya lokal yang kaya
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-800">
              Selamat Datang di GMIT Imanuel Oepura
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kami adalah komunitas iman yang berkomitmen untuk hidup bersama
              dalam kasih Kristus, melayani sesama, dan melestarikan budaya
              lokal Timor. Bergabunglah dengan keluarga besar kami dalam
              perjalanan iman yang bermakna.
            </p>
          </div>
        </div>
      </div>

      {/* Vision and Mission */}
      <VisionAndMission />

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  );
}
