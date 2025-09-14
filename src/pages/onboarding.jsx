import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { showToast } from "@/utils/showToast";
import PageTitle from "@/components/ui/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import TextInput from "@/components/ui/inputs/TextInput";
import SelectInput from "@/components/ui/inputs/SelectInput";
import DatePicker from "@/components/ui/inputs/DatePicker";
import AutoCompleteInput from "@/components/ui/inputs/AutoCompleteInput";
import {
  User,
  Calendar,
  Users,
  MapPin,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const validationSchema = z.object({
  nama: z.string().min(1, "Nama lengkap harus diisi"),
  jenisKelamin: z.union([z.boolean(), z.string()]).transform((val) => {
    if (typeof val === "string") {
      return val === "true";
    }
    return val;
  }),
  tanggalLahir: z
    .string()
    .min(1, "Tanggal lahir harus diisi")
    .transform((str) => new Date(str)),
  idStatusDalamKeluarga: z
    .string()
    .min(1, "Status dalam keluarga harus dipilih"),
  idSuku: z.string().min(1, "Suku harus dipilih"),
  idPendidikan: z.string().min(1, "Pendidikan harus dipilih"),
  idPekerjaan: z.string().min(1, "Pekerjaan harus dipilih"),
  idPendapatan: z.string().min(1, "Pendapatan harus dipilih"),
  idJaminanKesehatan: z.string().min(1, "Jaminan kesehatan harus dipilih"),
  idKeluarga: z.string().min(1, "Kepala keluarga harus dipilih"),
  golonganDarah: z.string().optional(),
  idPernikahan: z.string().optional(),
});

const jenisKelaminOptions = [
  { value: "true", label: "Laki-laki" },
  { value: "false", label: "Perempuan" },
];

const golonganDarahOptions = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "AB", label: "AB" },
  { value: "O", label: "O" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { token } = router.query;
  const [tokenData, setTokenData] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = methods;

  // Validate token on mount and when token changes
  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (invitationToken) => {
    try {
      setIsValidating(true);

      const response = await axios.post("/api/auth/validate-invitation", {
        token: invitationToken,
      });

      if (response.data.success) {
        setTokenData(response.data.data);
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
        showToast({
          title: "Token Tidak Valid",
          description:
            response.data.message ||
            "Token undangan tidak valid atau telah kedaluwarsa",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setIsTokenValid(false);
      showToast({
        title: "Gagal Validasi Token",
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat validasi token",
        color: "danger",
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Submit onboarding data
  const onboardingMutation = useMutation({
    mutationFn: async (data) => {
      // Prepare clean data with direct field mapping
      const jemaatData = {
        nama: data.nama,
        jenisKelamin: data.jenisKelamin,
        tanggalLahir: data.tanggalLahir,
        golonganDarah: data.golonganDarah,
        idKeluarga: data.idKeluarga,
        idStatusDalamKeluarga: data.idStatusDalamKeluarga,
        idSuku: data.idSuku,
        idPendidikan: data.idPendidikan,
        idPekerjaan: data.idPekerjaan,
        idPendapatan: data.idPendapatan,
        idJaminanKesehatan: data.idJaminanKesehatan,
        idPernikahan: data.idPernikahan,
      };

      const response = await axios.post("/api/auth/onboarding", {
        token,
        jemaatData: jemaatData,
      });
      return response.data;
    },
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description:
          "Profil berhasil dilengkapi! Silakan login untuk melanjutkan",
        color: "success",
      });
      router.push("/login");
    },
    onError: (error) => {
      console.error("Error onboarding:", error);
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal melengkapi profil",
        color: "danger",
      });
    },
  });

  const onSubmit = (data) => {
    onboardingMutation.mutate(data);
  };

  if (!token) {
    return (
      <>
        <PageTitle title="Token Tidak Ditemukan - Onboarding" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Token Tidak Ditemukan
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Link undangan tidak lengkap atau tidak valid.
              </p>
              <Button onClick={() => router.push("/login")}>
                Kembali ke Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (isValidating) {
    return (
      <>
        <PageTitle title="Validasi Token - Onboarding" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Memvalidasi Token
              </h3>
              <p className="text-sm text-gray-500">Mohon tunggu sebentar...</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!isTokenValid || !tokenData) {
    return (
      <>
        <PageTitle title="Token Tidak Valid - Onboarding" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Token Tidak Valid
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Link undangan tidak valid, telah kedaluwarsa, atau sudah
                digunakan.
              </p>
              <Button onClick={() => router.push("/login")}>
                Kembali ke Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title="Lengkapi Profil - GMIT Imanuel Oepura"
        description="Lengkapi profil jemaat GMIT Imanuel Oepura"
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  GMIT Imanuel Oepura
                </h1>
                <p className="text-sm text-gray-600">Lengkapi Profil Jemaat</p>
              </div>
            </div>
          </div>

          {/* User & Family Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Informasi Undangan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Nama User</label>
                  <p className="text-gray-900">{tokenData.user.username}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{tokenData.user.email}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Keluarga</label>
                  <p className="text-gray-900">
                    Bangunan {tokenData.keluarga.noBagungan}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Rayon</label>
                  <p className="text-gray-900">
                    {tokenData.keluarga.rayon.namaRayon}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Data Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <TextInput
                        name="nama"
                        label="Nama Lengkap"
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>

                    <SelectInput
                      name="jenisKelamin"
                      label="Jenis Kelamin"
                      options={jenisKelaminOptions}
                      placeholder="Pilih jenis kelamin"
                      required
                    />

                    <DatePicker
                      name="tanggalLahir"
                      label="Tanggal Lahir"
                      placeholder="Pilih tanggal lahir"
                      required
                    />

                    <AutoCompleteInput
                      name="idStatusDalamKeluarga"
                      label="Status dalam Keluarga"
                      apiEndpoint="/api/status-dalam-keluarga/options"
                      placeholder="Pilih status dalam keluarga"
                      required
                    />

                    <AutoCompleteInput
                      name="idSuku"
                      label="Suku"
                      apiEndpoint="/api/suku/options"
                      placeholder="Pilih suku"
                      required
                    />

                    <AutoCompleteInput
                      name="idPendidikan"
                      label="Pendidikan"
                      apiEndpoint="/api/pendidikan/options"
                      placeholder="Pilih pendidikan terakhir"
                      required
                    />

                    <AutoCompleteInput
                      name="idPekerjaan"
                      label="Pekerjaan"
                      apiEndpoint="/api/pekerjaan/options"
                      placeholder="Pilih pekerjaan"
                      required
                    />

                    <AutoCompleteInput
                      name="idPendapatan"
                      label="Kategori Pendapatan"
                      apiEndpoint="/api/pendapatan/options"
                      placeholder="Pilih kategori pendapatan"
                      required
                    />

                    <AutoCompleteInput
                      name="idJaminanKesehatan"
                      label="Jaminan Kesehatan"
                      apiEndpoint="/api/jaminan-kesehatan/options"
                      placeholder="Pilih jaminan kesehatan"
                      required
                    />

                    <div className="md:col-span-2">
                      <AutoCompleteInput
                        name="idKeluarga"
                        label="Kepala Keluarga"
                        apiEndpoint="/api/keluarga/options"
                        placeholder="Pilih kepala keluarga Anda"
                        required
                      />
                    </div>

                    <SelectInput
                      name="golonganDarah"
                      label="Golongan Darah"
                      options={golonganDarahOptions}
                      placeholder="Pilih golongan darah (opsional)"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/login")}
                    >
                      Batal
                    </Button>

                    <Button
                      type="submit"
                      disabled={!isValid || onboardingMutation.isLoading}
                      className="min-w-[120px]"
                    >
                      {onboardingMutation.isLoading ? (
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {onboardingMutation.isLoading
                        ? "Menyimpan..."
                        : "Simpan Profil"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
