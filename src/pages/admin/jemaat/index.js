import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit,
  Eye,
  Plus,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

import ListGrid from "@/components/ui/ListGrid";
import jemaatService from "@/services/jemaatService";
import { showToast } from "@/utils/showToast";

export default function MembersManagement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Fetch jemaat data from API
  const {
    data: jemaatData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jemaat", pagination],
    queryFn: () => jemaatService.getAll(pagination),
    keepPreviousData: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: jemaatService.delete,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data jemaat berhasil dihapus",
        color: "success",
      });
      queryClient.invalidateQueries(["jemaat"]);
    },
    onError: (error) => {
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal menghapus data",
        color: "error",
      });
    },
  });

  // Extract members from API response
  const members = jemaatData?.data?.items || [];

  const columns = [
    {
      key: "id",
      label: "ID Jemaat",
      type: "text",
    },
    {
      key: "nama",
      label: "Nama",
      type: "text",
    },
    {
      key: "jenisKelamin",
      label: "Gender",
      render: (value) => (value ? "Laki-laki" : "Perempuan"),
    },
    {
      key: "tanggalLahir",
      label: "Tanggal Lahir",
      type: "date",
    },
    {
      key: "keluarga",
      label: "No. Bagungan",
      render: (value) => value?.noBagungan || "-",
    },
    {
      key: "statusDalamKeluarga",
      label: "Status Keluarga",
      render: (value) => value?.status || "-",
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      badgeVariant: (value) => {
        switch (value) {
          case "active":
            return "success";
          case "inactive":
            return "secondary";
          case "pending":
            return "warning";
          default:
            return "outline";
        }
      },
      render: (value) => {
        const labels = {
          active: "Aktif",
          inactive: "Tidak Aktif",
          pending: "Menunggu",
        };

        return labels[value] || value;
      },
    },
  ];

  // Reusable row actions using ButtonActions
  const rowActions = [
    {
      label: "Lihat Detail",
      icon: Eye,
      onClick: (item) => router.push(`/admin/jemaat/${item.id}`),
      variant: "outline",
      tooltip: "Lihat detail lengkap jemaat",
    },
    {
      label: "Edit Data",
      icon: Edit,
      onClick: (item) => router.push(`/admin/jemaat/${item.id}/edit`),
      variant: "outline",
      tooltip: "Edit informasi jemaat",
    },
    {
      label: "Aktivasi",
      icon: UserCheck,
      onClick: (item) => console.log("Activate:", item),
      variant: "default",
      condition: (item) => item.User === null, // Only show if no user account
      tooltip: "Aktivasi akun jemaat",
    },
    {
      label: "Hapus",
      icon: Trash2,
      onClick: (item) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${item.nama}?`)) {
          deleteMutation.mutate(item.id);
        }
      },
      variant: "destructive",
      tooltip: "Hapus data jemaat",
    },
  ];

  // Filters configuration
  const filters = [
    {
      key: "status",
      label: "Semua Status",
      options: [
        { value: "active", label: "Aktif" },
        { value: "inactive", label: "Tidak Aktif" },
        { value: "pending", label: "Menunggu" },
      ],
    },
    {
      key: "jenisKelamin",
      label: "Jenis Kelamin",
      options: [
        { value: true, label: "Laki-laki" },
        { value: false, label: "Perempuan" },
      ],
    },
    {
      key: "statusDalamKeluarga.status",
      label: "Status Keluarga",
      options: [
        { value: "Ayah", label: "Ayah" },
        { value: "Ibu", label: "Ibu" },
        { value: "Anak", label: "Anak" },
      ],
    },
  ];

  // Stats configuration - dynamic from API data
  const stats = [
    {
      label: "Total Jemaat",
      value: jemaatData?.data?.pagination?.total?.toString() || "0",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Jemaat Aktif",
      value: members.filter((member) => member.User !== null).length.toString(),
      icon: UserCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Laki-laki",
      value: members
        .filter((member) => member.jenisKelamin === true)
        .length.toString(),
      icon: UserPlus,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Perempuan",
      value: members
        .filter((member) => member.jenisKelamin === false)
        .length.toString(),
      icon: UserPlus,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  // Header actions
  const headerActions = [
    {
      label: "Tambah Jemaat",
      icon: Plus,
      onClick: () => router.push("/admin/jemaat/create"),
      variant: "default",
    },
  ];

  // Breadcrumb
  const breadcrumb = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Jemaat", href: "/admin/members" },
    { label: "Daftar Jemaat" },
  ];

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Memuat data jemaat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">
            Terjadi kesalahan saat memuat data jemaat
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => queryClient.invalidateQueries(["jemaat"])}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gray-50">
    <>
      <ListGrid
        // Page Header Props
        breadcrumb={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Jemaat", href: "/admin/members" },
          { label: "Daftar Jemaat" },
        ]}
        description="Kelola data anggota jemaat GMIT Imanuel Oepura dengan mudah dan efisien"
        headerActions={headerActions}
        rowActionType="horizontal" // "vertical" | "horizontal"
        searchable={true}
        stats={stats}
        title="Manajemen Jemaat"
        columns={columns}
        // Row Actions Props - Now using ButtonActions
        rowActions={rowActions}
        exportFilename="jemaat"
        // Pagination Props
        itemsPerPage={10}
        isLoading={isLoading}
        // Data Props
        data={members}
        maxVisibleActions={2} // Show 2 actions, rest in dropdown
        // Filter & Search Props
        filters={filters}
        searchPlaceholder="Cari nama, email, atau ID jemaat..."
        // Export Props
        exportable={true}
      />
    </>
  );
}
