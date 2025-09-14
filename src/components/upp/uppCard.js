import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

export default function UppCard( { title, image, description, date, time, link } ) {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10 text-gray-950">
      {/* Event Image */}
      <div className="relative h-64">
        <Image
          src={image}
          alt="Event Image"
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      {/* Event Info */}
      <div className="p-6 flex flex-col">
        <p className="text-gray-500 text-sm flex-shrink-0">
          <Calendar className="inline-block mr-1" /> {date}
          <span className="mx-2">—</span>
          <Clock className="inline-block mr-1" /> {time}
        </p>
        <h2 className="text-2xl font-bold mt-2 h-16 overflow-y-auto flex-shrink-0">
          {title}
        </h2>
        <p className="text-gray-700 mt-4 h-20 overflow-y-auto flex-shrink-0">
          {description}
        </p>
        <div className="mt-4 flex-shrink-0">
          <Link href={link}>
            <button className="btn btn-outline">
              See More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}