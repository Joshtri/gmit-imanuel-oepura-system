import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel"
import UppCard from "@/components/upp/uppCard"

export default function NewsRow() {
  const [newsData, setNewsData] = useState([])

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch("/api/pengumuman?limit=6")
      const data = await res.json()
      if (data.success && data.data.items) {
        setNewsData(data.data.items)
      }
    }
    fetchNews()
  }, [])

  return (
    <div className="w-full px-4 md:px-8 py-8 bg-gray-300">
      <div className="max-w-full overflow-hidden">
        {newsData.length === 0 ? (
          <div className="text-center py-12 text-lg text-gray-600">
            Saat ini belum ada berita.
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {newsData.map((news) => (
                <CarouselItem key={news.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <UppCard
                    title={news.judul}
                    image={news.image || "/header/home.jpg"}
                    description={news.konten?.excerpt || ""}
                    date={news.tanggalPengumuman?.slice(0, 10)}
                    time={news.tanggalPengumuman?.slice(11, 16)}
                    link={`/news/${news.id}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center text-black gap-4 mt-8">
              <CarouselPrevious className="relative left-0 top-0" />
              <CarouselNext className="relative right-0 top-0" />
            </div>
          </Carousel>
        )}
      </div>
    </div>
  )
}