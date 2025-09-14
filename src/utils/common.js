import { Moon, Sun, Sunrise, Sunset } from "lucide-react";

export function formatDate(d, locale = "id-ID") {
  return d.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(d, locale = "id-ID") {
  return d.toLocaleTimeString(locale, { hour12: false });
}

export function getGreeting(hour) {
  if (hour >= 4 && hour < 10) return { text: "Pagi", Icon: Sunrise };
  if (hour >= 10 && hour < 15) return { text: "Siang", Icon: Sun };
  if (hour >= 15 && hour < 18) return { text: "Sore", Icon: Sunset };
  return { text: "Malam", Icon: Moon };
}

export function getIndonesianTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Map timezone ke label Indonesia
  const timezoneMap = {
    // WIB (UTC+7)
    "Asia/Jakarta": "WIB",
    "Asia/Pontianak": "WIB",
    "Asia/Palembang": "WIB",
    "Asia/Bandung": "WIB",
    "Asia/Medan": "WIB",
    "Asia/Yogyakarta": "WIB",

    // WITA (UTC+8)
    "Asia/Makassar": "WITA",
    "Asia/Denpasar": "WITA",
    "Asia/Balikpapan": "WITA",
    "Asia/Banjarmasin": "WITA",
    "Asia/Manado": "WITA",

    // WIT (UTC+9)
    "Asia/Jayapura": "WIT",
    "Asia/Sorong": "WIT",
    "Asia/Ambon": "WIT",
  };

  // Jika timezone ada di map, return labelnya
  if (timezoneMap[timezone]) {
    return timezoneMap[timezone];
  }

  // Fallback: deteksi berdasarkan UTC offset
  const now = new Date();
  const utcOffset = -now.getTimezoneOffset() / 60; // dalam jam

  if (utcOffset === 7) return "WIB";
  if (utcOffset === 8) return "WITA";
  if (utcOffset === 9) return "WIT";

  // Jika bukan timezone Indonesia, tampilkan singkatan generik
  const shortTimezone = timezone.split("/").pop() || "LOCAL";
  return shortTimezone.length > 4 ? "LOCAL" : shortTimezone;
}
