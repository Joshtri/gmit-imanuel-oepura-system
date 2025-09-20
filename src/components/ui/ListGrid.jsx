import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import ButtonActions from "@/components/ui/ButtonActions";
import { TableSkeleton } from "./skeletons/SkeletonTable";
import { GridSkeleton } from "./skeletons/SkeletonGrid";

// Skeleton Components

// Integrated PageHeader Component
function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  stats,
  className = "",
}) {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-2 px-6 py-6">
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
          {actions && actions.length > 0 && (
            <div className="mt-4 flex space-x-3 lg:mt-0 lg:ml-4">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  size={action.size || "default"}
                  className={action.className}
                  onClick={action.onClick}
                  href={action.href}
                >
                  {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    {stat.icon && (
                      <div
                        className={`flex-shrink-0 p-2 rounded-lg ${
                          stat.iconBg || "bg-blue-100"
                        }`}
                      >
                        <stat.icon
                          className={`w-5 h-5 ${
                            stat.iconColor || "text-blue-600"
                          }`}
                        />
                      </div>
                    )}
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        {stat.label}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </p>
                      {stat.change && (
                        <p
                          className={`text-sm ${
                            stat.changeType === "positive"
                              ? "text-green-600"
                              : stat.changeType === "negative"
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          {stat.change}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main ListGrid Component
export default function ListGrid({
  // Page Header Props
  title,
  description,
  breadcrumb,
  stats,
  headerActions = [],

  // Data Props
  data = [],
  columns = [],

  // Row Actions Props - Using ButtonActions component
  rowActions = [],
  rowActionType = "vertical", // "vertical" | "horizontal"
  maxVisibleActions = 3,

  // Filter & Search Props
  filters = [],
  searchable = true,
  searchPlaceholder = "Cari data...",

  // Legacy action handlers (for backward compatibility)
  onAdd,
  onView,
  onEdit,
  onDelete,
  onExport,

  // Pagination Props
  itemsPerPage = 10,

  // Loading State
  isLoading = false,

  // Style Props
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [viewMode, setViewMode] = useState("table"); // table or grid

  // Merge legacy actions with new rowActions array for backward compatibility
  const allRowActions = [
    ...rowActions,
    ...(onView
      ? [{ label: "Lihat", icon: Eye, onClick: onView, variant: "outline" }]
      : []),
    ...(onEdit
      ? [{ label: "Edit", icon: Edit, onClick: onEdit, variant: "outline" }]
      : []),
    ...(onDelete
      ? [
          {
            label: "Hapus",
            icon: Trash2,
            onClick: onDelete,
            variant: "destructive",
          },
        ]
      : []),
  ];

  // Merge header actions with legacy actions
  const allHeaderActions = [
    ...headerActions,
    ...(onExport
      ? [
          {
            label: "Export",
            icon: Download,
            onClick: onExport,
            variant: "outline",
          },
        ]
      : []),
    ...(onAdd ? [{ label: "Tambah", icon: Plus, onClick: onAdd }] : []),
  ];

  // Filter and search data
  const filteredData = data.filter((item) => {
    // Search filter
    const matchesSearch =
      !searchable ||
      !searchTerm ||
      columns.some((col) =>
        String(item[col.key] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    // Additional filters
    const matchesFilters = Object.entries(selectedFilters).every(
      ([filterKey, filterValue]) => {
        if (!filterValue || filterValue === "all") return true;
        return item[filterKey] === filterValue;
      }
    );

    return matchesSearch && matchesFilters;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setCurrentPage(1);
  };

  const renderCellContent = (item, column) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    if (column.type === "badge") {
      const variant = column.badgeVariant
        ? column.badgeVariant(value)
        : "default";
      return <Badge variant={variant}>{value}</Badge>;
    }

    if (column.type === "boolean") {
      // return value ? "Aktif" : "Tidak Aktif";
      return (
        <Badge variant={value === true ? "success" : "danger"}>
          {value === true ? "Aktif" : "Tidak Aktif"}
        </Badge>
      );
    }

    if (column.type === "date") {
      return new Date(value).toLocaleDateString("id-ID");
    }

    if (column.type === "currency") {
      return `Rp ${Number(value).toLocaleString("id-ID")}`;
    }

    return value;
  };

  return (
    <div className={`space-y-6 p-4 ${className}`}>
      {/* Integrated Page Header */}
      {(title ||
        description ||
        breadcrumb ||
        stats ||
        allHeaderActions.length > 0) && (
        <PageHeader
          title={title}
          description={description}
          breadcrumb={breadcrumb}
          stats={stats}
          actions={allHeaderActions}
        />
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-4 items-center flex-1">
              {/* Search */}
              {searchable && (
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}

              {/* Filters */}
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedFilters[filter.key] || "all"}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                  >
                    <option value="all">{filter.label}</option>
                    {filter.options.map((option, optIndex) => (
                      <option key={optIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === "table"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Tabel
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === "grid"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            {title} {!isLoading && `(${filteredData.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Loading Skeleton
            viewMode === "table" ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      {columns.map((column, index) => (
                        <th
                          key={index}
                          className="text-left p-4 font-medium text-gray-600"
                        >
                          {column.label}
                        </th>
                      ))}
                      {allRowActions.length > 0 && (
                        <th className="text-left p-4 font-medium text-gray-600">
                          Aksi
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <TableSkeleton
                      columns={columns}
                      hasActions={allRowActions.length > 0}
                    />
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <GridSkeleton columns={columns} />
              </div>
            )
          ) : viewMode === "table" ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="text-left p-4 font-medium text-gray-600"
                      >
                        {column.label}
                      </th>
                    ))}
                    {allRowActions.length > 0 && (
                      <th className="text-left p-4 font-medium text-gray-600">
                        Aksi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="p-4">
                          {renderCellContent(item, column)}
                        </td>
                      ))}
                      {allRowActions.length > 0 && (
                        <td className="p-4">
                          <ButtonActions
                            actions={allRowActions}
                            item={item}
                            type={rowActionType}
                            maxVisible={maxVisibleActions}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedData.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {columns.slice(0, 4).map((column, colIndex) => (
                      <div key={colIndex} className="mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          {column.label}:
                        </span>
                        <div className="text-sm">
                          {renderCellContent(item, column)}
                        </div>
                      </div>
                    ))}
                    {allRowActions.length > 0 && (
                      <div className="mt-4">
                        <ButtonActions
                          actions={allRowActions}
                          item={item}
                          type={rowActionType}
                          maxVisible={maxVisibleActions}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && paginatedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data yang ditemukan
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Menampilkan {startIndex + 1} hingga{" "}
                {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
                {filteredData.length} data
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 2
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 py-1 text-gray-500">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
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
