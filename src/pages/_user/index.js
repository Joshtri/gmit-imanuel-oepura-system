import React from "react";
import { SquarePen } from "lucide-react";

export default function UserPage() {
  // Dummy data for demonstration
  const user = {
    profilePic: "https://placehold.co/150x150?text=Profile",
    idJemaat: "1234567890123456",
    idKeluarga: "6543210987654321",
    statusDalamKel: "Anak",
    idSuku: "TIM01",
    idPendidikan: "S1",
    idPekerjaan: "SWENG",
    idPendapatan: "PEND01",
    idJaminan: "BPJS01",
    idAtestasi: "ATEST01",
    idPernikahan: "PRNK01",
    nama: "Imanuel Oepura",
    jenisKelamin: true, // true = Laki-laki, false = Perempuan
    tanggalLahir: "1990-01-01",
    golDarah: "O"
  };

  return (
    <div className="flex bg-stone-950 min-h-screen items-center justify-center text-white">
      <div className="flex flex-col md:flex-row p-8 pt-24 md:p-8 lg:p-4 gap-8 w-full max-w-6xl items-stretch">
        {/* Column 1 */}
        <div className="flex flex-col items-center md:w-1/3 w-full h-full">
          <img
            src={user.profilePic}
            alt="Profile"
            className="rounded-lg w-full h-full max-w-md object-contain mb-6 border-4 border-primary"
          />
          <button className="btn btn-success w-full mt-2 text-white"><SquarePen className="mr-2" />Edit Profile</button>
        </div>
        {/* Column 2 */}
        <div className="flex flex-col md:w-1/3 w-full gap-6">
          <div>
            <div className="text-gray-300 font-normal">ID Jemaat</div>
            <div className="text-white font-bold">{user.idJemaat}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">ID Keluarga</div>
            <div className="text-white font-bold">{user.idKeluarga}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">Nama</div>
            <div className="text-white font-bold">{user.nama}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">Jenis Kelamin</div>
            <div className="text-white font-bold">{user.jenisKelamin ? "Laki-laki" : "Perempuan"}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">Tanggal Lahir</div>
            <div className="text-white font-bold">{user.tanggalLahir}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">Golongan Darah</div>
            <div className="text-white font-bold">{user.golDarah}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">ID Pernikahan</div>
            <div className="text-white font-bold">{user.idPernikahan}</div>
          </div>
        </div>
        {/* Column 3 */}
        <div className="flex flex-col md:w-1/3 w-full gap-6">
          <div>
            <div className="text-gray-300 font-normal">Status dalam keluarga</div>
            <div className="text-white font-bold">{user.statusDalamKel}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">ID Suku</div>
            <div className="text-white font-bold">{user.idSuku}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">ID Pendidikan</div>
            <div className="text-white font-bold">{user.idPendidikan}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">ID Pekerjaan</div>
            <div className="text-white font-bold">{user.idPekerjaan}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">ID Pendapatan</div>
            <div className="text-white font-bold">{user.idPendapatan}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">ID Jaminan</div>
            <div className="text-white font-bold">{user.idJaminan}</div>
          </div>
          <div>
            <div className="text-gray-300 font-normal">ID Atestasi</div>
            <div className="text-white font-bold">{user.idAtestasi}</div>
          </div>
        </div>
      </div>
    </div>
  );
}