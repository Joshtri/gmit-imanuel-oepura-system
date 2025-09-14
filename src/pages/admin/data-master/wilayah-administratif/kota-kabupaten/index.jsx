import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, PlusIcon, Trash, Pen } from "lucide-react";

import masterService from "@/services/masterService";
import { kotaKabupatenSchema, kecamatanSchema } from "@/validations/masterSchema";
import useModalForm from "@/hooks/useModalForm";
import CreateOrEditModal from "@/components/common/CreateOrEditModal";
import ListGrid from "@/components/ui/ListGrid";
import useDrawer from "@/hooks/useDrawer";
import Drawer from "@/components/ui/Drawer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import useConfirm from "@/hooks/useConfirm";

const kotaKabupatenFields = [
  {
    type: "text",
    name: "nama",
    label: "Nama Kota / Kabupaten",
    placeholder: "Masukkan nama kota/kabupaten",
    required: true,
  },
  {
    type: "select",
    name: "idProvinsi",
    label: "Provinsi",
    placeholder: "Pilih provinsi",
    required: true,
    options: [],
  },
];

const kecamatanFields = [
  {
    type: "text",
    name: "nama",
    label: "Nama Kecamatan",
    placeholder: "Masukkan nama kecamatan",
    required: true,
  },
];

export default function KotaKabupatenPage() {
  const modal = useModalForm();
  const drawer = useDrawer();
  const kecamatanModal = useModalForm();
  const confirm = useConfirm();
  const [viewData, setViewData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["kotaKabupaten"],
    queryFn: () => masterService.getKotaKabupaten(),
  });

  const { data: provinsiData } = useQuery({
    queryKey: ["provinsi-options"],
    queryFn: () => masterService.getProvinsi(),
  });

  const { data: kecamatanData, isLoading: isLoadingKecamatan } = useQuery({
    enabled: !!drawer.data?.id && drawer.isOpen,
    queryKey: ["kecamatan", drawer.data?.id],
    queryFn: () => masterService.getKecamatanByKotaKab(drawer.data.id),
  });

  const fieldsWithOptions = kotaKabupatenFields.map(field => {
    if (field.name === "idProvinsi" && provinsiData?.data?.items) {
      return {
        ...field,
        options: provinsiData.data.items.map(item => ({
          value: item.id,
          label: item.nama
        }))
      };
    }
    return field;
  });

  const columns = [
    { key: "id", label: "ID", type: "text" },
    { key: "nama", label: "Nama Kota / Kabupaten", type: "text" },
    {
      key: "isActive",
      label: "Status",
      type: "boolean",
      badgeVariant: (value) => (value === true ? "success" : "danger"),
    },
  ];

  const handleSuccess = () => {
    refetch();
    modal.close();
  };

  const handleSubmit = async (formData, isEdit) => {
    if (isEdit) {
      return await masterService.updateKotaKabupaten(modal.editData.id, formData);
    }
    return await masterService.createKotaKabupaten(formData);
  };

  const handleDelete = (item) => {
    confirm.showConfirm({
      title: "Hapus Kota/Kabupaten",
      message: `Apakah Anda yakin ingin menghapus "${item.nama}"? Data yang sudah dihapus tidak dapat dikembalikan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: async () => {
        try {
          await masterService.deleteKotaKabupaten(item.id);
          refetch();
        } catch (error) {
          console.error("Error deleting kota/kabupaten:", error);
        }
      },
    });
  };

  const handleView = (item) => {
    setViewData(item);
    setIsViewModalOpen(true);
  };

  const handleKecamatanSuccess = () => {
    kecamatanModal.close();
    // Refetch kecamatan data if drawer is open
    if (drawer.isOpen) {
      // The query will refetch automatically based on the key
    }
  };

  const handleKecamatanSubmit = async (formData, isEdit) => {
    const dataWithKotaKab = {
      ...formData,
      idKotaKab: kecamatanModal.editData?.id || ""
    };
    return await masterService.createKecamatan(dataWithKotaKab);
  };

  return (
    <>
      <ListGrid
        data={data?.data?.items || []}
        columns={columns}
        isLoading={isLoading}
        title={"Daftar Kota / Kabupaten"}
        searchPlaceholder="Cari kota kabupaten..."
        description={"Kelola data kota kabupaten"}
        rowActionType="horizontal"
        rowActions={[
          {
            label: "Edit",
            icon: Pen,
            onClick: (item) => modal.open(item),
            variant: "outline",
            tooltip: "Edit kota/kabupaten",
          },
          {
            label: "View",
            icon: Eye,
            onClick: handleView,
            variant: "outline",
            tooltip: "Lihat detail kota/kabupaten",
          },
          {
            label: "Delete",
            icon: Trash,
            onClick: handleDelete,
            variant: "outline",
            tooltip: "Hapus kota/kabupaten",
          },
          {
            label: "Tambah Kecamatan",
            icon: PlusIcon,
            onClick: (item) => kecamatanModal.open(item),
            variant: "outline",
            tooltip: "Tambah kecamatan baru",
          },
          {
            label: "Lihat Kecamatan",
            icon: Eye,
            onClick: (item) => drawer.open(item),
            variant: "outline",
            tooltip: "Lihat kecamatan yang ada",
          },
        ]}
        breadcrumb={[
          {
            label: "Wilayah Administratif",
            href: "/admin/data-master/wilayah-administratif",
          },
          {
            label: "Kota / Kabupaten",
          },
        ]}
        onAdd={() => modal.open()}
      />

      <CreateOrEditModal
        defaultValues={{ nama: "", idProvinsi: "" }}
        editData={modal.editData}
        fields={fieldsWithOptions}
        isOpen={modal.isOpen}
        schema={kotaKabupatenSchema}
        title="Kota / Kabupaten"
        onClose={modal.close}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
      />

      <CreateOrEditModal
        defaultValues={{
          nama: "",
          idKotaKab: kecamatanModal.editData?.id || "",
        }}
        editData={null}
        fields={kecamatanFields}
        isOpen={kecamatanModal.isOpen}
        schema={kecamatanSchema}
        title={`Tambah Kecamatan untuk ${kecamatanModal.editData?.nama || ""}`}
        onClose={kecamatanModal.close}
        onSubmit={handleKecamatanSubmit}
        onSuccess={handleKecamatanSuccess}
      />

      <Drawer
        isOpen={drawer.isOpen}
        onClose={drawer.close}
        title={`Kecamatan - ${drawer.data?.nama || ""}`}
        width="w-96"
        position="right"
      >
        <div className="space-y-4">
          {isLoadingKecamatan ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2">
              {kecamatanData?.data?.length > 0 ? (
                kecamatanData.data.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{item.nama}</div>
                    <div className="text-sm text-gray-500">ID: {item.id}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  Belum ada kecamatan
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>

      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={confirm.hideConfirm}
        onConfirm={confirm.handleConfirm}
        title={confirm.config.title}
        message={confirm.config.message}
        confirmText={confirm.config.confirmText}
        cancelText={confirm.config.cancelText}
        variant={confirm.config.variant}
      />

      {/* View Modal */}
      {isViewModalOpen && viewData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm transition-opacity"></div>
          
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Detail Kota/Kabupaten
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">ID</label>
                    <p className="text-sm text-gray-900">{viewData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nama</label>
                    <p className="text-sm text-gray-900">{viewData.nama}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      viewData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {viewData.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
