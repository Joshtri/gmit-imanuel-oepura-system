import PageHeader from "@/components/ui/PageHeader";
import jemaatService from "@/services/jemaatService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import {
  User,
  MapPin,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  Calendar,
  Phone,
} from "lucide-react";

export default function JemaatDetail() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: jemaatData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jemaat", id],
    queryFn: () => jemaatService.getById(id),
    enabled: !!id,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (min, max) => {
    const formatRupiah = (amount) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    };
    return `${formatRupiah(min)} - ${formatRupiah(max)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <h3 className="font-semibold">Error</h3>
        <p>Gagal memuat data jemaat. Silakan coba lagi.</p>
      </div>
    );
  }

  const jemaat = jemaatData?.data;

  if (!jemaat) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700">
        <h3 className="font-semibold">Data Tidak Ditemukan</h3>
        <p>Data jemaat dengan ID {id} tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Detail Jemaat"
        description="Detail informasi jemaat"
        breadcrumb={[
          { label: "Jemaat", href: "/admin/jemaat" },
          { label: jemaat.nama, href: `/admin/jemaat/${id}` },
        ]}
      />

      <div className="space-y-6 p-4">
        {/* Header Card with Photo and Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {jemaat.nama}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">
                    Jenis Kelamin:
                  </span>
                  <p className="text-gray-900">
                    {jemaat.jenisKelamin ? "Laki-laki" : "Perempuan"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Tanggal Lahir:
                  </span>
                  <p className="text-gray-900">
                    {formatDate(jemaat.tanggalLahir)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Golongan Darah:
                  </span>
                  <p className="text-gray-900">{jemaat.golonganDarah || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informasi Pribadi
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status dalam Keluarga
                </label>
                <p className="text-gray-900">
                  {jemaat.statusDalamKeluarga?.status || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Suku
                </label>
                <p className="text-gray-900">{jemaat.suku?.namaSuku || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status Pernikahan
                </label>
                <p className="text-gray-900">
                  {jemaat.idPernikahan ? "Menikah" : "Belum Menikah"}
                </p>
              </div>
            </div>
          </div>

          {/* Education & Career */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                Pendidikan & Pekerjaan
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Pendidikan Terakhir
                </label>
                <p className="text-gray-900 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                  {jemaat.pendidikan?.jenjang || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Pekerjaan
                </label>
                <p className="text-gray-900">
                  {jemaat.pekerjaan?.namaPekerjaan || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Pendapatan
                </label>
                <p className="text-gray-900">
                  {jemaat.pendapatan
                    ? formatCurrency(
                        jemaat.pendapatan.min,
                        jemaat.pendapatan.max
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Jaminan Kesehatan
                </label>
                <p className="text-gray-900 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  {jemaat.jaminanKesehatan?.jenisJaminan || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Alamat & Lokasi
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Alamat Lengkap
                  </label>
                  <p className="text-gray-900">
                    {jemaat.keluarga?.alamat?.jalan}, RT{" "}
                    {jemaat.keluarga?.alamat?.rt}/RW{" "}
                    {jemaat.keluarga?.alamat?.rw}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Kelurahan
                  </label>
                  <p className="text-gray-900">
                    {jemaat.keluarga?.alamat?.kelurahan?.nama}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Kecamatan
                  </label>
                  <p className="text-gray-900">
                    {jemaat.keluarga?.alamat?.kelurahan?.kecamatan?.nama}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Kota/Kabupaten
                  </label>
                  <p className="text-gray-900">
                    {
                      jemaat.keluarga?.alamat?.kelurahan?.kecamatan?.kotaKab
                        ?.nama
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Provinsi
                  </label>
                  <p className="text-gray-900">
                    {
                      jemaat.keluarga?.alamat?.kelurahan?.kecamatan?.kotaKab
                        ?.provinsi?.nama
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Kode Pos
                  </label>
                  <p className="text-gray-900">
                    {jemaat.keluarga?.alamat?.kelurahan?.kodePos}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Home className="w-5 h-5 mr-2 text-purple-600" />
              Informasi Keluarga
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status Keluarga
                </label>
                <p className="text-gray-900 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  {jemaat.keluarga?.statusKeluarga?.status || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Kepemilikan Rumah
                </label>
                <p className="text-gray-900">
                  {jemaat.keluarga?.statusKepemilikanRumah?.status || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Keadaan Rumah
                </label>
                <p className="text-gray-900">
                  {jemaat.keluarga?.keadaanRumah?.keadaan || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  No. Bangunan
                </label>
                <p className="text-gray-900">
                  {jemaat.keluarga?.noBagungan || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Rayon
                </label>
                <p className="text-gray-900">
                  {jemaat.keluarga?.rayon?.namaRayon || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => router.push("/admin/jemaat")}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Kembali
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Edit Data
          </button>
        </div>
      </div>
    </>
  );
}
