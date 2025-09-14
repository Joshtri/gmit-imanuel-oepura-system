import { toast } from "sonner";

/**
 * Tipe warna notifikasi yang didukung: success, error, warning, info
 * Sonner: success, error, warning, info, default
 */
export function showToast({
  title = "Notifikasi",
  description = "",
  color = "success", // success | error | warning | info
  timeout = 3000,
} = {}) {
  // Mapping warna custom ke varian sonner
  const toastTypeMap = {
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
  };

  const show = toastTypeMap[color] || toast;

  show(description || title, {
    description: description && title !== description ? description : undefined,
    duration: timeout,
  });
}
