import { Button } from "@/components/ui/Button";

export default function CreateOrEditButton({
  label = "Simpan",
  isLoading = false,
  ...props
}) {
  return (
    <Button
      type="submit"
      isLoading={isLoading}
      loadingText="Menyimpan..."
      {...props}
    >
      {label}
    </Button>
  );
}
