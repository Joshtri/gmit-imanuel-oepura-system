import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import TextInput from "@/components/ui/inputs/TextInput";
import DatePicker from "@/components/ui/inputs/DatePicker";
import TextAreaInput from "@/components/ui/inputs/TextAreaInput";
import SwitchInput from "@/components/ui/inputs/SwitchInput";
import PageHeader from "@/components/ui/PageHeader";
import EmployeeLayout from "@/components/layout/EmployeeLayout";
import { showToast } from "@/utils/showToast";
import axios from "axios";

const galeriSchema = z.object({
  namaKegiatan: z.string().min(1, "Nama kegiatan harus diisi").max(255, "Nama kegiatan maksimal 255 karakter"),
  deskripsi: z.string().optional(),
  tempat: z.string().min(1, "Tempat harus diisi").max(255, "Tempat maksimal 255 karakter"),
  tanggalKegiatan: z.string().min(1, "Tanggal kegiatan harus diisi"),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
});

export default function EditGaleriPage() {
  const router = useRouter();
  const { id } = router.query;
  const [fotos, setFotos] = useState([]);
  const [fotosToDelete, setFotosToDelete] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: galeri, isLoading: loadingGaleri } = useQuery({
    queryKey: ["galeri", id],
    queryFn: async () => {
      const response = await axios.get(`/api/galeri/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    onSuccess: (data) => {
      setFotos(data.fotos || []);
      methods.reset({
        namaKegiatan: data.namaKegiatan,
        deskripsi: data.deskripsi || "",
        tempat: data.tempat,
        tanggalKegiatan: new Date(data.tanggalKegiatan).toISOString().split('T')[0],
        isActive: data.isActive,
        isPublished: data.isPublished,
      });
    },
  });

  const methods = useForm({
    resolver: zodResolver(galeriSchema),
    defaultValues: {
      namaKegiatan: "",
      deskripsi: "",
      tempat: "",
      tanggalKegiatan: "",
      isActive: true,
      isPublished: false,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const finalFotos = fotos.filter((_, index) => !fotosToDelete.includes(index));
      
      const response = await axios.patch(`/api/galeri/${id}`, {
        ...data,
        fotos: finalFotos,
      });
      return response.data;
    },
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Galeri berhasil diperbarui",
        color: "success"
      });
      router.push(`/employee/galeri/${id}`);
    },
    onError: (error) => {
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal memperbarui galeri",
        color: "error"
      });
    },
  });

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/api/galeri/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return {
          url: response.data.data.url,
          caption: "",
          uploadedAt: new Date().toISOString(),
        };
      });

      const uploadedFotos = await Promise.all(uploadPromises);
      setFotos(prev => [...prev, ...uploadedFotos]);

      showToast({
        title: "Berhasil",
        description: `${files.length} foto berhasil diunggah`,
        color: "success"
      });
    } catch (error) {
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal mengunggah foto",
        color: "error"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFoto = (index) => {
    setFotosToDelete(prev => [...prev, index]);
  };

  const handleRestoreFoto = (index) => {
    setFotosToDelete(prev => prev.filter(i => i !== index));
  };

  const handleUpdateCaption = (index, caption) => {
    setFotos(prev => prev.map((foto, i) => 
      i === index ? { ...foto, caption } : foto
    ));
  };

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (loadingGaleri) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat data galeri...</p>
        </div>
      </div>
    );
  }

  if (!galeri) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">Galeri tidak ditemukan</p>
          <Button onClick={() => router.back()}>Kembali</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Galeri"
        description="Edit informasi dan foto galeri kegiatan"
        breadcrumb={[
          { label: "Employee", href: "/employee/dashboard" },
          { label: "Galeri", href: "/employee/galeri" },
          { label: galeri.namaKegiatan, href: `/employee/galeri/${id}` },
          { label: "Edit" },
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
          
          <Button
            onClick={methods.handleSubmit(onSubmit)}
            disabled={updateMutation.isLoading}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kegiatan</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput
                    name="namaKegiatan"
                    label="Nama Kegiatan"
                    placeholder="Masukkan nama kegiatan"
                    required
                  />
                </div>
                
                <DatePicker
                  name="tanggalKegiatan"
                  label="Tanggal Kegiatan"
                  required
                />
                
                <TextInput
                  name="tempat"
                  label="Tempat"
                  placeholder="Masukkan lokasi kegiatan"
                  required
                />

                <div className="md:col-span-2">
                  <TextAreaInput
                    name="deskripsi"
                    label="Deskripsi"
                    placeholder="Deskripsi kegiatan (opsional)"
                    rows={3}
                  />
                </div>

                <SwitchInput
                  name="isActive"
                  label="Status Aktif"
                  description="Galeri aktif dapat dilihat oleh staff"
                />

                <SwitchInput
                  name="isPublished"
                  label="Publikasikan"
                  description="Galeri terpublikasi dapat dilihat oleh publik"
                />
              </CardContent>
            </Card>

            {/* Foto Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Foto Kegiatan ({fotos.length - fotosToDelete.length})
                  </CardTitle>
                  <div className="relative">
                    <input
                      type="file"
                      id="foto-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('foto-upload').click()}
                      disabled={uploading}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {uploading ? "Mengunggah..." : "Tambah Foto"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {fotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {fotos.map((foto, index) => (
                      <div
                        key={index}
                        className={`relative group ${
                          fotosToDelete.includes(index) 
                            ? 'opacity-50 bg-red-50 border-2 border-red-200' 
                            : 'bg-gray-100'
                        } rounded-lg overflow-hidden`}
                      >
                        <div className="aspect-square">
                          <img
                            src={foto.url}
                            alt={foto.caption || `Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                            {fotosToDelete.includes(index) ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleRestoreFoto(index)}
                                className="bg-white text-gray-700"
                              >
                                Restore
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteFoto(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Caption Input */}
                        <div className="p-2">
                          <input
                            type="text"
                            value={foto.caption || ""}
                            onChange={(e) => handleUpdateCaption(index, e.target.value)}
                            placeholder="Keterangan foto..."
                            className="w-full text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={fotosToDelete.includes(index)}
                          />
                        </div>

                        {/* Delete Indicator */}
                        {fotosToDelete.includes(index) && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            Akan Dihapus
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="mb-4">Belum ada foto untuk kegiatan ini</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('foto-upload').click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Mengunggah..." : "Unggah Foto"}
                    </Button>
                  </div>
                )}

                {fotosToDelete.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      {fotosToDelete.length} foto akan dihapus. Klik "Simpan" untuk mengkonfirmasi perubahan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </FormProvider>
      </div>
    </>
  );
}

EditGaleriPage.getLayout = function getLayout(page) {
  return <EmployeeLayout>{page}</EmployeeLayout>;
};