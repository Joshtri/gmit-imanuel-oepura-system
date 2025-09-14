import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pen, PlusIcon, Trash } from "lucide-react";

import masterService from "@/services/masterService";
import {
  kecamatanSchema,
  kelurahanDesaSchema,
} from "@/validations/masterSchema";
import useModalForm from "@/hooks/useModalForm";
import CreateOrEditModal from "@/components/common/CreateOrEditModal";
import ListGrid from "@/components/ui/ListGrid";
import useDrawer from "@/hooks/useDrawer";
import Drawer from "@/components/ui/Drawer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import useConfirm from "@/hooks/useConfirm";

const kecamatanFields = [
  {
    type: "text",
    name: "nama",
    label: "Nama Kecamatan",
    placeholder: "Masukkan nama kecamatan",
    required: true,
  },
  {
    type: "select",
    name: "idKotaKab",
    label: "Kota / Kabupaten",
    placeholder: "Pilih kota/kabupaten",
    required: true,
    options: [],
  },
];

const kelurahanDesaFields = [
  {
    type: "text",
    name: "nama",
    label: "Nama Kelurahan / Desa",
    placeholder: "Masukkan nama kelurahan/desa",
    required: true,
  },
  {
    type: "number",
    name: "kodePos",
    label: "Kode Pos",
    placeholder: "Masukkan kode pos",
    required: false,
  },
];

export default function KecamatanPage() {
  const modal = useModalForm();
  const drawer = useDrawer();
  const kelurahanDesaModal = useModalForm();
  const confirm = useConfirm();
  const [viewData, setViewData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["kecamatan"],
    queryFn: () => masterService.getKecamatan(),
  });

  const { data: kotaKabupatenData } = useQuery({
    queryKey: ["kota-kabupaten-options"],
    queryFn: () => masterService.getKotaKabupaten(),
  });

  const { data: kelurahanDesaData, isLoading: isLoadingKelurahanDesa } =
    useQuery({
      enabled: !!drawer.data?.id && drawer.isOpen,
      queryKey: ["kelurahan-desa", drawer.data?.id],
      queryFn: () => masterService.getKelurahanDesaByKecamatan(drawer.data.id),
    });

  const fieldsWithOptions = kecamatanFields.map((field) => {
    if (field.name === "idKotaKab" && kotaKabupatenData?.data?.items) {
      return {
        ...field,
        options: kotaKabupatenData.data.items.map((item) => ({
          value: item.id,
          label: item.nama,
        })),
      };
    }
    return field;
  });

  const columns = [
    { key: "id", label: "ID", type: "text" },
    { key: "nama", label: "Nama Kecamatan", type: "text" },
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
      return await masterService.updateKecamatan(modal.editData.id, formData);
    }
    return await masterService.createKecamatan(formData);
  };

  const handleDelete = (item) => {
    confirm.showConfirm({
      title: "Hapus Kecamatan",
      message: `Apakah Anda yakin ingin menghapus "${item.nama}"? Data yang sudah dihapus tidak dapat dikembalikan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: async () => {
        try {
          await masterService.deleteKecamatan(item.id);
          refetch();
        } catch (error) {
          console.error("Error deleting kecamatan:", error);
        }
      },
    });
  };

  const handleView = (item) => {
    setViewData(item);
    setIsViewModalOpen(true);
  };

  const handleKelurahanDesaSuccess = () => {
    kelurahanDesaModal.close();
  };

  const handleKelurahanDesaSubmit = async (formData, isEdit) => {
    const dataWithKecamatan = {
      ...formData,
      idKecamatan: kelurahanDesaModal.editData?.id || "",
    };
    return await masterService.createKelurahanDesa(dataWithKecamatan);
  };

  return (
    <>
      <ListGrid
        data={data?.data?.items || []}
        columns={columns}
        isLoading={isLoading}
        title={"Daftar Kecamatan"}
        searchPlaceholder="Cari kecamatan..."
        description={"Kelola data kecamatan"}
        rowActionType="horizontal"
        rowActions={[
          {
            label: "Edit",
            icon: Pen,
            onClick: (item) => modal.open(item),
            variant: "outline",
            tooltip: "Edit kecamatan",
          },
          {
            label: "View",
            icon: Eye,
            onClick: handleView,
            variant: "outline",
            tooltip: "Lihat detail kecamatan",
          },
          {
            label: "Delete",
            icon: Trash,
            onClick: handleDelete,
            variant: "outline",
            tooltip: "Hapus kecamatan",
          },
          {
            label: "Tambah Kelurahan/Desa",
            icon: PlusIcon,
            onClick: (item) => kelurahanDesaModal.open(item),
            variant: "outline",
            tooltip: "Tambah kelurahan/desa baru",
          },
          {
            label: "Lihat Kelurahan/Desa",
            icon: Eye,
            onClick: (item) => drawer.open(item),
            variant: "outline",
            tooltip: "Lihat kelurahan/desa yang ada",
          },
        ]}
        breadcrumb={[
          {
            label: "Wilayah Administratif",
            href: "/admin/data-master/wilayah-administratif",
          },
          {
            label: "Kecamatan",
          },
        ]}
        onAdd={() => modal.open()}
      />

      <CreateOrEditModal
        defaultValues={{ nama: "", idKotaKab: "" }}
        editData={modal.editData}
        fields={fieldsWithOptions}
        isOpen={modal.isOpen}
        schema={kecamatanSchema}
        title="Kecamatan"
        onClose={modal.close}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
      />

      <CreateOrEditModal
        defaultValues={{
          nama: "",
          idKecamatan: kelurahanDesaModal.editData?.id || "",
          kodePos: "",
        }}
        editData={null}
        fields={kelurahanDesaFields}
        isOpen={kelurahanDesaModal.isOpen}
        schema={kelurahanDesaSchema}
        title={`Tambah Kelurahan/Desa untuk ${kelurahanDesaModal.editData?.nama || ""}`}
        onClose={kelurahanDesaModal.close}
        onSubmit={handleKelurahanDesaSubmit}
        onSuccess={handleKelurahanDesaSuccess}
      />

      <Drawer
        isOpen={drawer.isOpen}
        onClose={drawer.close}
        title={`Kelurahan/Desa - ${drawer.data?.nama || ""}`}
        width="w-96"
        position="right"
      >
        <div className="space-y-4">
          {isLoadingKelurahanDesa ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2">
              {kelurahanDesaData?.data?.length > 0 ? (
                kelurahanDesaData.data.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{item.nama}</div>
                    <div className="text-sm text-gray-500">ID: {item.id}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  Belum ada kelurahan/desa
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
                  Detail Kecamatan
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      ID
                    </label>
                    <p className="text-sm text-gray-900">{viewData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Nama
                    </label>
                    <p className="text-sm text-gray-900">{viewData.nama}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        viewData.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {viewData.isActive ? "Aktif" : "Tidak Aktif"}
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
