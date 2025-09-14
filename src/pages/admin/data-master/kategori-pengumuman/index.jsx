import masterService from "@/services/masterService";
import MasterDataPage from "@/components/ui/MasterDataPage";

export default function KategoriPengumumanPage() {
  const columns = [
    {
      key: "nama",
      label: "Nama Kategori",
      type: "text",
    },
    {
      key: "deskripsi",
      label: "Deskripsi",
      type: "text",
      truncate: true,
    },
    {
      key: "_count.jenisPengumuman",
      label: "Jumlah Jenis",
      type: "custom",
      render: (item) =>
        item && item._count && typeof item._count.jenisPengumuman === "number"
          ? `${item._count.jenisPengumuman} jenis`
          : "0 jenis",
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
    { key: "nama", label: "Nama Kategori" },
    { key: "deskripsi", label: "Deskripsi" },
    {
      key: "_count.jenisPengumuman",
      label: "Jumlah Jenis Pengumuman",
      render: (item) =>
        item && item._count && typeof item._count.jenisPengumuman === "number"
          ? `${item._count.jenisPengumuman} jenis`
          : "0 jenis",
    },
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
      key: "nama",
      label: "Nama Kategori",
      type: "text",
      required: true,
      placeholder: "Contoh: Kategorial, Umum, Khusus",
      validation: {
        maxLength: {
          value: 100,
          message: "Nama kategori maksimal 100 karakter",
        },
        minLength: {
          value: 2,
          message: "Nama kategori minimal 2 karakter",
        },
      },
    },
    {
      key: "deskripsi",
      label: "Deskripsi",
      type: "textarea",
      placeholder: "Deskripsi kategori pengumuman (opsional)",
      rows: 3,
    },
    {
      key: "isActive",
      label: "Status Aktif",
      type: "switch",
      defaultValue: true,
      description: "Kategori aktif dapat digunakan untuk membuat pengumuman",
    },
  ];

  return (
    <MasterDataPage
      title="Kelola Kategori Pengumuman"
      description="Kelola data kategori pengumuman untuk pengelompokan jenis pengumuman"
      service={{
        get: (params) =>
          masterService.getKategoriPengumuman({
            ...params,
            includeCount: true,
          }),
        create: (data) => masterService.createKategoriPengumuman(data),
        update: (id, data) => masterService.updateKategoriPengumuman(id, data),
        delete: (id) => masterService.deleteKategoriPengumuman(id),
      }}
      queryKey="kategori-pengumuman"
      columns={columns}
      viewFields={viewFields}
      formFields={formFields}
      itemNameField="nama"
      searchFields={["nama", "deskripsi"]}
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Kategori Pengumuman" },
      ]}
      allowBulkDelete={true}
      exportable={true}
    />
  );
}
