import { Calendar, Clock, MapPin, Mic, BookOpen, Users } from "lucide-react";

export default function ScheduleCard({ 
  title, 
  date, 
  time, 
  location, 
  speaker, 
  tema, 
  firman, 
  jenisIbadah,
  rayon 
}) {
  return (
    <div className="card bg-neutral text-neutral-content w-full h-full">
      <div className="card-body p-4">
        <h2 className="card-title text-lg mb-3 line-clamp-2">{title}</h2>
        <div className="flex flex-col gap-3 w-full text-sm">
          <div className="flex gap-3 items-center">
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{date || 'Tanggal belum ditentukan'}</span>
          </div>
          <div className="flex gap-3 items-center">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{time || 'Waktu belum ditentukan'}</span>
          </div>
          <div className="flex gap-3 items-center">
            <MapPin className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{location || 'Lokasi belum ditentukan'}</span>
          </div>
          <div className="flex gap-3 items-center">
            <Mic className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{speaker || 'Pemimpin belum ditentukan'}</span>
          </div>
          {rayon && (
            <div className="flex gap-3 items-center">
              <Users className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{rayon}</span>
            </div>
          )}
          {firman && (
            <div className="flex gap-3 items-center">
              <BookOpen className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{firman}</span>
            </div>
          )}
        </div>
        {tema && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-300 italic line-clamp-2">"{tema}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
