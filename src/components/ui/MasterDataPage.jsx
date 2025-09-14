import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import ListGrid from "@/components/ui/ListGrid";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ViewModal from "@/components/ui/ViewModal";
import EditModal from "@/components/ui/EditModal";
import CreateModal from "@/components/ui/CreateModal";

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
    mutationFn: (id) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(`${title} berhasil dihapus`);
      setDeleteItem(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Gagal menghapus data");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(`${title} berhasil diperbarui`);
      setEditItem(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Gagal memperbarui data");
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(`${title} berhasil ditambahkan`);
      setShowCreate(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Gagal menambahkan data");
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
        onExport={() => {}}
      />

      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteMutation.mutate(deleteItem.id)}
        title={`Hapus ${title}`}
        message={`Apakah Anda yakin ingin menghapus "${deleteItem?.[itemNameField]}"? Data yang sudah dihapus tidak dapat dikembalikan.`}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />

      <ViewModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title={`Detail ${title}`}
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
      />

      <EditModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        onSubmit={(formData) =>
          updateMutation.mutate({ id: editItem.id, data: formData })
        }
        title={`Edit ${title}`}
        fields={formFields}
        initialData={editItem}
        isLoading={updateMutation.isPending}
      />

      <CreateModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={(formData) => createMutation.mutate(formData)}
        title={`Tambah ${title}`}
        fields={formFields}
        isLoading={createMutation.isPending}
      />
    </>
  );
}
