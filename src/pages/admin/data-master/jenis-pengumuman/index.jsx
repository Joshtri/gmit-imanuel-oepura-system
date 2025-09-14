import { useState, useEffect } from "react";
import masterService from "@/services/masterService";
import MasterDataPage from "@/components/ui/MasterDataPage";

export default function JenisPengumumanPage() {
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKategoriOptions = async () => {
      try {
        const response = await masterService.getKategoriPengumuman({
          limit: -1,
          isActive: true,
        });
        const options = response.data.items.map((kategori) => ({
          value: kategori.id,
          label: kategori.nama,
          data: kategori,
        }));
        setKategoriOptions(options);
      } catch (error) {
        console.error("Error fetching kategori options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKategoriOptions();
  }, []);

  const columns = [
    {
      key: "kategori.nama",
      label: "Kategori",
      type: "text",
    },
    {
      key: "nama",
      label: "Nama Jenis",
      type: "text",
    },
    {
      key: "deskripsi",
      label: "Deskripsi",
      type: "text",
      truncate: true,
    },
    {
      key: "_count.pengumuman",
      label: "Jumlah Pengumuman",
      type: "custom",
      render: (item) =>
        item && item._count && typeof item._count.pengumuman === "number"
          ? `${item._count.pengumuman} pengumuman`
          : "0 pengumuman",
    },
    {
      key: "isActive",
      label: "Status",
      type: "badge",
      render: (item) => item.isActive ? "Aktif" : "Tidak Aktif",
      variant: (item) => item.isActive ? "success" : "secondary",
    },
  ];

  const viewFields = [
    {
      key: "kategori.nama",
      label: "Nama Kategori",
    },
    { key: "nama", label: "Nama Jenis" },
    { key: "deskripsi", label: "Deskripsi" },
    {
      key: "_count.pengumuman",
      label: "Jumlah Pengumuman",
      render: (item) =>
        item && item._count && typeof item._count.pengumuman === "number"
          ? `${item._count.pengumuman} pengumuman`
          : "0 pengumuman",
    },
    {
      key: "isActive",
      label: "Status",
      render: (item) => (item.isActive ? "Aktif" : "Tidak Aktif"),
    },
    { key: "createdAt", label: "Dibuat Pada", type: "datetime" },
    { key: "updatedAt", label: "Diperbarui Pada", type: "datetime" },
  ];

  const formFields = [
    {
      key: "kategoriId",
      label: "Kategori Pengumuman",
      type: "select",
      required: true,
      options: kategoriOptions,
      placeholder: "Pilih kategori pengumuman",
      loading: loading,
    },
    {
      key: "nama",
      label: "Nama Jenis",
      type: "text",
      required: true,
      placeholder: "Contoh: Anak-anak, Dewasa, Remaja",
      validation: {
        maxLength: {
          value: 150,
          message: "Nama jenis maksimal 150 karakter",
        },
        minLength: {
          value: 2,
          message: "Nama jenis minimal 2 karakter",
        },
      },
    },
    {
      key: "deskripsi",
      label: "Deskripsi",
      type: "textarea",
      placeholder: "Deskripsi jenis pengumuman (opsional)",
      rows: 3,
    },
    {
      key: "isActive",
      label: "Status Aktif",
      type: "switch",
      defaultValue: true,
      description: "Jenis aktif dapat digunakan untuk membuat pengumuman",
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MasterDataPage
      title="Kelola Jenis Pengumuman"
      description="Kelola data jenis pengumuman berdasarkan kategori yang tersedia"
      service={{
        get: (params) =>
          masterService.getJenisPengumuman({ ...params, includeCount: true }),
        create: (data) => masterService.createJenisPengumuman(data),
        update: (id, data) => masterService.updateJenisPengumuman(id, data),
        delete: (id) => masterService.deleteJenisPengumuman(id),
      }}
      queryKey="jenis-pengumuman"
      columns={columns}
      viewFields={viewFields}
      formFields={formFields}
      itemNameField="nama"
      searchFields={["nama", "deskripsi", "kategori.nama"]}
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Jenis Pengumuman" },
      ]}
      allowBulkDelete={true}
      exportable={true}
      filterFields={[
        {
          key: "kategoriId",
          label: "Filter by Kategori",
          type: "select",
          options: [{ value: "", label: "Semua Kategori" }, ...kategoriOptions],
        },
      ]}
    />
  );
}
