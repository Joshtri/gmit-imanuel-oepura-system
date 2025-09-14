import ListGrid from "@/components/ui/ListGrid";
import pernikahanService from "@/services/pernikahanService";
import { showToast } from "@/utils/showToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Plus, Trash2, Heart, Users } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PernikahanManagement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Fetch pernikahan data from API
  const {
    data: pernikahanData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pernikahan", pagination],
    queryFn: () => pernikahanService.getAll(pagination),
    keepPreviousData: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: pernikahanService.delete,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data pernikahan berhasil dihapus",
        color: "success",
      });
      queryClient.invalidateQueries(["pernikahan"]);
    },
    onError: (error) => {
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal menghapus data",
        color: "error",
      });
    },
  });

  // Handle delete with confirmation
  const handleDelete = (id, displayName) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pernikahan ${displayName}?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Format data for ListGrid
  const formattedData = pernikahanData?.data?.items?.map((item) => ({
    id: item.id,
    tanggal: new Date(item.tanggal).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    klasis: item.klasis?.nama || '-',
    pasangan: item.jemaats?.map(j => j.nama).join(' & ') || 'Belum ada pasangan',
    jumlahJemaat: `${item.jemaats?.length || 0} orang`,
    displayName: item.jemaats?.map(j => j.nama).join(' & ') || `Pernikahan ${new Date(item.tanggal).getFullYear()}`,
  })) || [];

  // Define columns for the table
  const columns = [
    {
      key: "tanggal",
      title: "Tanggal Nikah",
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: "klasis",
      title: "Klasis",
      sortable: true,
      render: (value) => (
        <div className="text-gray-700">{value}</div>
      ),
    },
    {
      key: "pasangan", 
      title: "Pasangan",
      sortable: false,
      render: (value, item) => (
        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-gray-900 font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "jumlahJemaat",
      title: "Jumlah Jemaat",
      sortable: false,
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">{value}</span>
        </div>
      ),
    },
  ];

  // Define actions
  const actions = [
    {
      icon: Eye,
      label: "Lihat Detail",
      onClick: (item) => router.push(`/employee/lainnya/pernikahan/${item.id}`),
      className: "text-blue-600 hover:text-blue-800",
    },
    {
      icon: Edit,
      label: "Edit",
      onClick: (item) => router.push(`/employee/lainnya/pernikahan/edit/${item.id}`),
      className: "text-green-600 hover:text-green-800",
    },
    {
      icon: Trash2,
      label: "Hapus",
      onClick: (item) => handleDelete(item.id, item.displayName),
      className: "text-red-600 hover:text-red-800",
      loading: deleteMutation.isLoading,
    },
  ];

  return (
    <ListGrid
      title="Data Pernikahan"
      description="Kelola data pernikahan jemaat"
      icon={Heart}
      data={formattedData}
      columns={columns}
      actions={actions}
      pagination={{
        ...pagination,
        total: pernikahanData?.data?.pagination?.total || 0,
        totalPages: pernikahanData?.data?.pagination?.totalPages || 0,
      }}
      onPaginationChange={setPagination}
      isLoading={isLoading}
      error={error}
      searchable={true}
      searchPlaceholder="Cari berdasarkan klasis atau nama jemaat..."
      emptyState={{
        title: "Belum ada data pernikahan",
        description: "Mulai tambahkan data pernikahan jemaat di sini.",
        action: {
          label: "Tambah Data Pernikahan",
          onClick: () => router.push("/employee/lainnya/pernikahan/create"),
          icon: Plus,
        },
      }}
      headerActions={[
        {
          label: "Tambah Pernikahan",
          onClick: () => router.push("/employee/lainnya/pernikahan/create"),
          icon: Plus,
          primary: true,
        },
      ]}
      breadcrumb={[
        { label: "Dashboard", href: "/employee/dashboard" },
        { label: "Lainnya", href: "/employee/lainnya" },
        { label: "Data Pernikahan" },
      ]}
    />
  );
}