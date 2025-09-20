import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import keluargaService from "@/services/keluargaService";
import masterService from "@/services/masterService";
import { showToast } from "@/utils/showToast";
import Stepper, {
  StepContent,
  StepperNavigation,
} from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

const steps = [
  {
    id: 1,
    title: "Data Keluarga",
    description: "Informasi dasar keluarga",
  },
  {
    id: 2,
    title: "Alamat",
    description: "Alamat keluarga",
  },
];

export default function CreateKeluarga() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    defaultValues: {
      idStatusKeluarga: "",
      idStatusKepemilikanRumah: "",
      idKeadaanRumah: "",
      idRayon: "",
      noBagungan: "",
      idKelurahan: "",
      rt: "",
      rw: "",
      jalan: "",
    },
  });

  // Fetch master data
  const { data: statusKeluarga } = useQuery({
    queryKey: ["status-keluarga"],
    queryFn: () => masterService.getStatusKeluarga(),
  });

  const { data: statusKepemilikanRumah } = useQuery({
    queryKey: ["status-kepemilikan-rumah"],
    queryFn: () => masterService.getStatusKepemilikanRumah(),
  });

  const { data: keadaanRumah } = useQuery({
    queryKey: ["keadaan-rumah"],
    queryFn: () => masterService.getKeadaanRumah(),
  });

  const { data: rayon } = useQuery({
    queryKey: ["rayon"],
    queryFn: () => masterService.getRayon(),
  });

  const { data: kelurahan } = useQuery({
    queryKey: ["kelurahan"],
    queryFn: () => masterService.getKelurahan(),
  });

  const createKeluargaMutation = useMutation({
    mutationFn: keluargaService.create,
    onSuccess: (data) => {
      showToast({
        title: "Berhasil",
        description: "Keluarga berhasil dibuat! Sekarang tambahkan jemaat sebagai kepala keluarga.",
        color: "success",
      });
      // Redirect ke halaman create jemaat dengan pre-filled keluarga ID
      router.push(`/admin/jemaat/create?keluargaId=${data.data.id}&isKepalaKeluarga=true`);
    },
    onError: (error) => {
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal membuat keluarga",
        color: "error",
      });
    },
  });

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate keluarga data
      const values = form.getValues();
      if (!values.idStatusKeluarga || !values.idStatusKepemilikanRumah ||
          !values.idKeadaanRumah || !values.idRayon || !values.noBagungan) {
        showToast({
          title: "Error",
          description: "Semua field wajib harus diisi",
          color: "error",
        });
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Watch form values untuk real-time validation
  const watchedValues = form.watch([
    "idStatusKeluarga",
    "idStatusKepemilikanRumah",
    "idKeadaanRumah",
    "idRayon",
    "noBagungan",
    "idKelurahan",
    "rt",
    "rw",
    "jalan"
  ]);

  const canGoNext = () => {
    const values = form.getValues();

    console.log("Current step:", currentStep);
    console.log("Form values:", values);

    if (currentStep === 1) {
      const canProceed = !!(
        values.idStatusKeluarga &&
        values.idStatusKepemilikanRumah &&
        values.idKeadaanRumah &&
        values.idRayon &&
        values.noBagungan &&
        values.noBagungan.toString().trim() !== ""
      );
      console.log("Step 1 field checks:");
      console.log("idStatusKeluarga:", values.idStatusKeluarga);
      console.log("idStatusKepemilikanRumah:", values.idStatusKepemilikanRumah);
      console.log("idKeadaanRumah:", values.idKeadaanRumah);
      console.log("idRayon:", values.idRayon);
      console.log("noBagungan:", values.noBagungan);
      console.log("Can proceed step 1:", canProceed);
      return canProceed;
    }

    if (currentStep === 2) {
      const canProceed = !!(
        values.idKelurahan &&
        values.rt &&
        values.rw &&
        values.jalan &&
        values.rt.toString().trim() !== "" &&
        values.rw.toString().trim() !== "" &&
        values.jalan.trim() !== ""
      );
      console.log("Can proceed step 2:", canProceed);
      return canProceed;
    }

    return true;
  };

  const handleSubmit = async () => {
    const values = form.getValues();

    // Validate all required fields
    if (!values.idStatusKeluarga || !values.idStatusKepemilikanRumah ||
        !values.idKeadaanRumah || !values.idRayon || !values.noBagungan ||
        !values.idKelurahan || !values.rt || !values.rw || !values.jalan) {
      showToast({
        title: "Error",
        description: "Semua field wajib harus diisi",
        color: "error",
      });
      return;
    }

    // Create alamat first
    const alamatData = {
      idKelurahan: values.idKelurahan,
      rt: parseInt(values.rt),
      rw: parseInt(values.rw),
      jalan: values.jalan,
    };

    // Create keluarga with alamat
    const submitData = {
      idStatusKeluarga: values.idStatusKeluarga,
      idStatusKepemilikanRumah: values.idStatusKepemilikanRumah,
      idKeadaanRumah: values.idKeadaanRumah,
      idRayon: values.idRayon,
      noBagungan: parseInt(values.noBagungan),
      alamat: alamatData,
    };

    createKeluargaMutation.mutate(submitData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        title="Tambah Keluarga Baru"
        breadcrumb={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Keluarga", href: "/admin/keluarga" },
          { label: "Tambah Keluarga" },
        ]}
        description="Lengkapi data keluarga dengan mengikuti langkah-langkah berikut"
      />

      <Card className="p-6 mt-4">
        <Stepper currentStep={currentStep} steps={steps} />

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Debug info */}
          {/* <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
            <strong>Debug Info:</strong><br />
            Current Step: {currentStep}<br />
            Can Go Next: {canGoNext().toString()}<br />
            Form Values: {JSON.stringify(form.getValues())}<br />
            Status Keluarga loaded: {statusKeluarga?.data?.items?.length || 0} items<br />
            Rayon loaded: {rayon?.data?.items?.length || 0} items
          </div> */}

          {/* Step 1: Data Keluarga */}
          {currentStep === 1 && (
            <StepContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Keluarga *
                  </label>
                  <select
                    {...form.register("idStatusKeluarga", {
                      required: "Status keluarga wajib dipilih"
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih status keluarga</option>
                    {statusKeluarga?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.status}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.idStatusKeluarga && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.idStatusKeluarga.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Kepemilikan Rumah *
                  </label>
                  <select
                    {...form.register("idStatusKepemilikanRumah", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih status kepemilikan</option>
                    {statusKepemilikanRumah?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keadaan Rumah *
                  </label>
                  <select
                    {...form.register("idKeadaanRumah", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih keadaan rumah</option>
                    {keadaanRumah?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.keadaan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rayon *
                  </label>
                  <select
                    {...form.register("idRayon", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih rayon</option>
                    {rayon?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.namaRayon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Bagungan *
                  </label>
                  <input
                    type="number"
                    {...form.register("noBagungan", {
                      required: "No. Bagungan wajib diisi",
                      min: { value: 1, message: "No. Bagungan harus lebih dari 0" }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nomor bagungan"
                  />
                  {form.formState.errors.noBagungan && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.noBagungan.message}
                    </p>
                  )}
                </div>
              </div>
            </StepContent>
          )}

          {/* Step 2: Alamat */}
          {currentStep === 2 && (
            <StepContent>
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700">
                    Lengkapi alamat untuk keluarga baru ini.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kelurahan *
                  </label>
                  <select
                    {...form.register("idKelurahan", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih kelurahan</option>
                    {kelurahan?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama} - {item.kodepos}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jalan *
                  </label>
                  <input
                    type="text"
                    {...form.register("jalan", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama jalan / kampung"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RT *
                  </label>
                  <input
                    type="number"
                    {...form.register("rt", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RW *
                  </label>
                  <input
                    type="number"
                    {...form.register("rw", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="001"
                  />
                </div>
              </div>
            </StepContent>
          )}

          <StepperNavigation
            canGoNext={canGoNext()}
            currentStep={currentStep}
            isLoading={createKeluargaMutation.isPending}
            nextButtonText="Lanjut"
            submitButtonText="Simpan Keluarga"
            totalSteps={steps.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
          />
        </form>
      </Card>
    </div>
  );
}