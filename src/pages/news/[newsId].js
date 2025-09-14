import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function News() {
  const router = useRouter();
  const { newsId } = router.query;
  const [news, setNews] = useState(null);

  useEffect(() => {
    if (!newsId) return;
    async function fetchNewsDetail() {
      const res = await fetch(`/api/pengumuman/${newsId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setNews(data.data);
      }
    }
    fetchNewsDetail();
  }, [newsId]);

  if (!news) {
    return <div className="min-h-screen py-24 px-24 bg-gray-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-24 px-24 bg-gray-100">
      {/* image header */}
      <div className="relative w-full h-96">
        <Image
          src={news.image || "/header/home.jpg"}
          alt={news.judul}
          fill={true}
          className="rounded-3xl object-cover"
        />
      </div>
      {/* content */}
      <div className="mt-8 text-black w-full text-justify">
        <h1 className="text-3xl font-bold">{news.judul}</h1>
        <p className="mt-4">{news.konten?.body || ""}</p>
      </div>
    </div>
  );
}
