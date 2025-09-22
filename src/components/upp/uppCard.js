import { AlertCircle, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Helper function to extract text content from JSON konten
const extractTextFromKonten = (konten) => {
  if (!konten) return "No content available";

  try {
    // If konten is string, return it
    if (typeof konten === "string") return konten;

    // If konten is object, try to extract text
    if (typeof konten === "object") {
      // Handle different JSON structures that might be used for content
      if (konten.text) return konten.text;
      if (konten.content) return konten.content;
      if (konten.description) return konten.description;
      if (konten.body) return konten.body;

      // If it's an array, join the text
      if (Array.isArray(konten)) {
        return konten
          .map((item) => {
            if (typeof item === "string") return item;
            if (item.text || item.content) return item.text || item.content;
            return "";
          })
          .filter(Boolean)
          .join(" ");
      }

      // Fallback: stringify the object
      return JSON.stringify(konten).substring(0, 200) + "...";
    }

    return String(konten);
  } catch (error) {
    console.error("Error extracting text from konten:", error);
    return "Content unavailable";
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Date unavailable";
  }
};

// Helper function to get priority badge color
const getPriorityColor = (prioritas) => {
  switch (prioritas) {
    case "HIGH":
      return "badge-error";
    case "MEDIUM":
      return "badge-warning";
    case "LOW":
      return "badge-success";
    default:
      return "badge-neutral";
  }
};

export default function UppCard({ pengumuman }) {
  if (!pengumuman) {
    return (
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10 text-gray-950">
        <div className="p-6 text-center">
          <AlertCircle
            className="mx-auto mb-4 text-gray-400"
            size={48}
          />
          <p className="text-gray-900">Belum Ada Pengumuman</p>
        </div>
      </div>
    );
  }

  const { id, judul, konten, tanggalPengumuman, prioritas, isPinned, jenis, kategori } = pengumuman;

  const description = extractTextFromKonten(konten);
  const formattedDate = formatDate(tanggalPengumuman);
  const truncatedDescription = description.length > 150 ? description.substring(0, 150) + "..." : description;

  // Default image based on jenis or kategori
  const getDefaultImage = () => {
    if (jenis?.nama) {
      const jenisName = jenis.nama.toLowerCase();
      if (jenisName.includes("anak")) return "/header/anak.png";
      if (jenisName.includes("pemuda")) return "/header/anak.png"; // You can change this to pemuda-specific image
    }
    return "/header/anak.png"; // Default fallback
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10 text-gray-950 relative">
      {/* Priority Badge */}
      {(isPinned || prioritas === "HIGH") && (
        <div className="absolute top-2 right-2 z-10">
          {isPinned && <div className="badge badge-secondary mb-1">📌 Pinned</div>}
          {prioritas === "HIGH" && <div className={`badge ${getPriorityColor(prioritas)}`}>{prioritas}</div>}
        </div>
      )}

      {/* Event Image */}
      <div className="relative h-64">
        <Image
          src={getDefaultImage()}
          alt={judul || "Announcement Image"}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Event Info */}
      <div className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-sm flex items-center">
            <Calendar
              className="inline-block mr-1"
              size={16}
            />
            {formattedDate}
          </p>
          {jenis && <span className="badge badge-outline text-xs">{jenis.nama}</span>}
        </div>

        <h2 className="text-xl font-bold mt-2 h-16 overflow-y-auto flex-shrink-0 leading-tight">
          {judul || "No Title"}
        </h2>

        <p className="text-gray-700 mt-4 h-20 overflow-y-auto flex-shrink-0 text-sm leading-relaxed">
          {truncatedDescription}
        </p>

        <div className="mt-4 flex justify-between items-center flex-shrink-0">
          <Link href={`/pengumuman/${id}`}>
            <button className="btn btn-outline btn-sm">Read More</button>
          </Link>

          {prioritas && prioritas !== "MEDIUM" && (
            <div className={`badge ${getPriorityColor(prioritas)} badge-sm`}>{prioritas}</div>
          )}
        </div>
      </div>
    </div>
  );
}
