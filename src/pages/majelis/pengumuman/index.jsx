import pengumumanService from "@/services/pengumumanService";
import { showToast } from "@/utils/showToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Calendar,
  Edit,
  Eye,
  Plus,
  Trash2,
  Search,
  Filter,
  Pin,
  Download,
  FileText,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import ButtonActions from "@/components/ui/ButtonActions";

// Page Header Component
function PageHeader({ title, description, breadcrumb, onAdd }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        {breadcrumb && (
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {breadcrumb.map((item, index) => (
                <li key={index} className="inline-flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex space-x-3 lg:mt-0 lg:ml-4">
            <Button onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Buat Pengumuman
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b">
          <td className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </td>
          <td className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </td>
          <td className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </td>
          <td className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </td>
          <td className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </td>
          <td className="p-4">
            <div className="animate-pulse flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    DRAFT: { color: "bg-gray-100 text-gray-800", label: "Draft" },
    PUBLISHED: { color: "bg-green-100 text-green-800", label: "Published" },
    ARCHIVED: { color: "bg-yellow-100 text-yellow-800", label: "Archived" },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

// Priority Badge Component
function PriorityBadge({ priority }) {
  const priorityConfig = {
    LOW: { color: "bg-blue-100 text-blue-800", label: "Low" },
    MEDIUM: { color: "bg-gray-100 text-gray-800", label: "Medium" },
    HIGH: { color: "bg-orange-100 text-orange-800", label: "High" },
    URGENT: { color: "bg-red-100 text-red-800", label: "Urgent" },
  };

  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

// Attachment Indicator Component - hanya show jumlah, tanpa load data
function AttachmentIndicator({ hasAttachments }) {
  if (!hasAttachments) return (
    <div className="text-sm text-gray-400">
      <FileText className="h-4 w-4 inline mr-1" />
      Tidak ada lampiran
    </div>
  );

  return (
    <div className="text-sm text-green-600 flex items-center gap-1">
      <FileText className="h-4 w-4" />
      Ada lampiran
    </div>
  );
}

export default function PengumumanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    kategoriId: "",
    status: "",
    prioritas: "",
  });

  // Fetch pengumuman data
  const {
    data: pengumumanData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pengumuman", pagination, searchTerm, filters],
    queryFn: () =>
      pengumumanService.getAll({ 
        ...pagination, 
        search: searchTerm,
        includeRelations: true,
        ...filters
      }),
    keepPreviousData: true,
  });

  // Fetch options for filters
  const { data: optionsData } = useQuery({
    queryKey: ["pengumuman-options"],
    queryFn: () => pengumumanService.getOptions(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: pengumumanService.delete,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Pengumuman berhasil dihapus",
        color: "success",
      });
      queryClient.invalidateQueries(["pengumuman"]);
    },
    onError: (error) => {
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal menghapus pengumuman",
        color: "danger",
      });
    },
  });

  const handleDelete = (id) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: idLocale });
    } catch (error) {
      return dateString;
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const actions = [
    {
      icon: Eye,
      label: "Detail",
      onClick: (item) => router.push(`/majelis/pengumuman/${item.id}`),
      variant: "outline",
    },
    {
      icon: Download,
      label: "Lampiran",
      onClick: (item) => router.push(`/majelis/pengumuman/${item.id}/attachments`),
      variant: "outline",
      show: (item) => true, // Selalu tampilkan, nanti di halaman attachments baru cek ada atau tidak
    },
    {
      icon: Edit,
      label: "Edit",
      onClick: (item) => router.push(`/majelis/pengumuman/${item.id}/edit`),
      variant: "outline",
    },
    {
      icon: Trash2,
      label: "Hapus",
      onClick: (item) => handleDelete(item.id),
      variant: "outline",
    },
  ];

  const items = pengumumanData?.data?.items || [];
  const paginationInfo = pengumumanData?.data?.pagination || {};
  const kategoriOptions = optionsData?.data?.kategori || [];
  const statusOptions = optionsData?.data?.enums?.status || [];
  const prioritasOptions = optionsData?.data?.enums?.prioritas || [];

  return (
    <div className="space-y-6 p-4">
      {/* Page Header */}
      <PageHeader
        title="Daftar Pengumuman"
        description="Kelola pengumuman untuk jemaat dan majelis gereja"
        breadcrumb={[
          { label: "Majelis", href: "/majelis/dashboard" },
          { label: "Pengumuman" },
        ]}
        onAdd={() => router.push("/majelis/pengumuman/create")}
      />

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-4 items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari pengumuman..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.kategoriId}
                  onChange={(e) => handleFilterChange("kategoriId", e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {kategoriOptions.map((kategori) => (
                    <option key={kategori.id} value={kategori.id}>
                      {kategori.nama}
                    </option>
                  ))}
                </select>

                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">Semua Status</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.prioritas}
                  onChange={(e) => handleFilterChange("prioritas", e.target.value)}
                >
                  <option value="">Semua Prioritas</option>
                  {prioritasOptions.map((prioritas) => (
                    <option key={prioritas.value} value={prioritas.value}>
                      {prioritas.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Pengumuman {!isLoading && `(${paginationInfo.total || 0})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-600">
                    Judul & Kategori
                  </th>
                  <th className="text-left p-4 font-medium text-gray-600">
                    Tanggal
                  </th>
                  <th className="text-left p-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-gray-600">
                    Prioritas
                  </th>
                  <th className="text-left p-4 font-medium text-gray-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton />
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      {/* Judul & Kategori */}
                      <td className="p-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-900">
                              {item.judul}
                            </div>
                            {item.isPinned && (
                              <Pin className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.kategori?.nama}
                            {item.jenis?.nama && ` • ${item.jenis.nama}`}
                          </div>
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {formatDate(item.tanggalPengumuman)}
                            </div>
                            {item.publishedAt && (
                              <div className="text-sm text-gray-500">
                                Dipublikasi: {formatDate(item.publishedAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Prioritas */}
                      <td className="p-4">
                        <PriorityBadge priority={item.prioritas} />
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <ButtonActions
                          actions={actions}
                          item={item}
                          type="horizontal"
                          maxVisible={3}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Bell className="h-12 w-12 text-gray-300" />
                        <span>Belum ada pengumuman</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && paginationInfo.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Menampilkan{" "}
                {(paginationInfo.page - 1) * paginationInfo.limit + 1} hingga{" "}
                {Math.min(
                  paginationInfo.page * paginationInfo.limit,
                  paginationInfo.total
                )}{" "}
                dari {paginationInfo.total} data
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(paginationInfo.page - 1)}
                  disabled={!paginationInfo.hasPrev}
                >
                  Sebelumnya
                </Button>

                {/* Page Numbers */}
                {Array.from(
                  { length: paginationInfo.totalPages },
                  (_, i) => i + 1
                )
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === paginationInfo.totalPages ||
                      Math.abs(page - paginationInfo.page) <= 2
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 py-1 text-gray-500">...</span>
                      )}
                      <Button
                        variant={
                          paginationInfo.page === page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(paginationInfo.page + 1)}
                  disabled={!paginationInfo.hasNext}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
