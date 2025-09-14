import { useRouter } from "next/router"
import UppCardContainer from "@/components/upp/uppCardContainer"

export default function UppCategory(){
  const router = useRouter()
  const { category } = router.query
  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <img src="/header/anak.png" alt="Anak Head" className="object-cover w-full h-full" />
        <h1 className="absolute text-8xl text-white font-bold mt-4">UPP {category ? category.charAt(0).toUpperCase() + category.slice(1) : ''}</h1>
      </div>

      {/* upp cards */}
      <UppCardContainer />
    </div>
  )
}