import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CreateModal from "@/components/ui/CreateModal";
import EditModal from "@/components/ui/EditModal";
import ListGrid from "@/components/ui/ListGrid";
import ViewModal from "@/components/ui/ViewModal";

export default function MasterDataPage({
  title,
  description,
  service,
  queryKey,
  columns,
  viewFields,
  formFields = [],
  itemNameField = "name",
  breadcrumb = [],
  exportable = false,
  allowBulkDelete = false,
  searchFields = [],
  filterFields = [],
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => service.get(),
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const result = await service.delete(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(result.message || `${title} berhasil dihapus`);
      setDeleteItem(null);
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal menghapus data");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const result = await service.update(id, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(result.message || `${title} berhasil diperbarui`);
      setEditItem(null);
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal memperbarui data");
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const result = await service.create(data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(result.message || `${title} berhasil ditambahkan`);
      setShowCreate(false);
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal menambahkan data");
    },
  });

  return (
    <>
      <ListGrid
        breadcrumb={breadcrumb}
        columns={columns}
        data={data?.data?.items || []}
        description={description}
        isLoading={isLoading}
        rowActionType="horizontal"
        rowActions={[
          {
            icon: Eye,
            onClick: (item) => setViewItem(item),
            variant: "outline",
            tooltip: "Lihat detail",
          },
          {
            icon: Edit,
            onClick: (item) => setEditItem(item),
            variant: "outline",
            tooltip: "Edit detail",
          },
          {
            icon: Trash2,
            onClick: (item) => setDeleteItem(item),
            variant: "outline",
            tooltip: "Hapus data",
          },
        ]}
        title={title}
        onAdd={() => setShowCreate(true)}
        exportable={exportable}
        exportFilename={title?.toLowerCase().replace(/\s+/g, '-')}
        filters={filterFields}
        searchFields={searchFields}
      />

      <ConfirmDialog
        isLoading={deleteMutation.isPending}
        isOpen={!!deleteItem}
        message={`Apakah Anda yakin ingin menghapus "${deleteItem?.[itemNameField]}"? Data yang sudah dihapus tidak dapat dikembalikan.`}
        title={`Hapus ${title}`}
        variant="danger"
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteMutation.mutate(deleteItem.id)}
      />

      <ViewModal
        data={
          viewItem && Array.isArray(viewFields)
            ? viewFields.map((field) => ({
                label: field.label,
                value: field.getValue
                  ? field.getValue(viewItem)
                  : viewItem?.[field.key],
              }))
            : []
        }
        isOpen={!!viewItem}
        title={`Detail ${title}`}
        onClose={() => setViewItem(null)}
      />

      <EditModal
        fields={formFields}
        initialData={editItem}
        isLoading={updateMutation.isPending}
        isOpen={!!editItem}
        title={`Edit ${title}`}
        onClose={() => setEditItem(null)}
        onSubmit={(formData) =>
          updateMutation.mutate({ id: editItem.id, data: formData })
        }
      />

      <CreateModal
        fields={formFields}
        isLoading={createMutation.isPending}
        isOpen={showCreate}
        title={`Tambah ${title}`}
        onClose={() => setShowCreate(false)}
        onSubmit={(formData) => createMutation.mutate(formData)}
      />
    </>
  );
}
