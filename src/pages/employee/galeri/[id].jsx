import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Share2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import EmployeeLayout from "@/components/layout/EmployeeLayout";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { showToast } from "@/utils/showToast";
import axios from "axios";

export default function GaleriDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: galeri, isLoading, error, refetch } = useQuery({
    queryKey: ["galeri", id],
    queryFn: async () => {
      const response = await axios.get(`/api/galeri/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/galeri/${id}`);
      showToast({
        title: "Berhasil",
        description: "Galeri berhasil dihapus",
        color: "success"
      });
      router.push("/employee/galeri");
    } catch (error) {
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal menghapus galeri",
        color: "error"
      });
    }
  };

  const handleTogglePublish = async () => {
    try {
      await axios.patch(`/api/galeri/${id}`, {
        isPublished: !galeri.isPublished
      });
      showToast({
        title: "Berhasil", 
        description: `Galeri berhasil ${galeri.isPublished ? 'disembunyikan' : 'dipublikasikan'}`,
        color: "success"
      });
      refetch();
    } catch (error) {
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal mengubah status publikasi",
        color: "error"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat detail galeri...</p>
        </div>
      </div>
    );
  }

  if (error || !galeri) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">Gagal memuat detail galeri</p>
          <Button onClick={() => router.back()}>Kembali</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Detail Galeri"
        description="Detail informasi galeri kegiatan"
        breadcrumb={[
          { label: "Employee", href: "/employee/dashboard" },
          { label: "Galeri", href: "/employee/galeri" },
          { label: galeri.namaKegiatan },
        ]}
      />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleTogglePublish}
              className="flex items-center"
            >
              {galeri.isPublished ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Sembunyikan
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publikasikan
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/employee/galeri/${id}/edit`)}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Foto Gallery */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Foto Kegiatan ({galeri.fotos?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {galeri.fotos && galeri.fotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galeri.fotos.map((foto, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer aspect-square bg-gray-100 rounded-lg overflow-hidden"
                        onClick={() => setSelectedImage(foto)}
                      >
                        <img
                          src={foto.url}
                          alt={foto.caption || `Foto ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {foto.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs">
                            {foto.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada foto untuk kegiatan ini</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {/* Info Kegiatan */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informasi Kegiatan</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={galeri.isActive ? "success" : "secondary"}>
                      {galeri.isActive ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                    <Badge variant={galeri.isPublished ? "default" : "outline"}>
                      {galeri.isPublished ? "Terpublikasi" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Kegiatan</label>
                  <p className="text-gray-900 font-medium">{galeri.namaKegiatan}</p>
                </div>

                {galeri.deskripsi && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                    <p className="text-gray-700">{galeri.deskripsi}</p>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tanggal Kegiatan</label>
                    <p className="text-gray-900">
                      {new Date(galeri.tanggalKegiatan).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric", 
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tempat</label>
                    <p className="text-gray-900">{galeri.tempat}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Dibuat: {new Date(galeri.createdAt).toLocaleDateString("id-ID")}</p>
                    <p>Diperbarui: {new Date(galeri.updatedAt).toLocaleDateString("id-ID")}</p>
                    {galeri.publishedAt && (
                      <p>Dipublikasi: {new Date(galeri.publishedAt).toLocaleDateString("id-ID")}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 z-10"
            >
              ✕
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || "Foto kegiatan"}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {selectedImage.caption && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded">
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Hapus Galeri"
        message={`Yakin ingin menghapus galeri "${galeri.namaKegiatan}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        type="danger"
      />
    </>
  );
}

GaleriDetailPage.getLayout = function getLayout(page) {
  return <EmployeeLayout>{page}</EmployeeLayout>;
};