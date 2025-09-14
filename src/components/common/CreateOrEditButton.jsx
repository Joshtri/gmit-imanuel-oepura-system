export default function CreateOrEditButton({
  label = "Simpan",
  isLoading = false,
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      style={{
        backgroundColor: "#0070f3",
        color: "#fff",
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "4px",
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? "Menyimpan..." : label}
    </button>
  );
}
