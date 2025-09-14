// components/ui/inputs/TextInput.jsx
import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";

export default function TextInput({ name, label, placeholder, type = "text", value, onChange, error: externalError, ...props }) {
  const inputId = useId();
  
  // Try to get form context, but handle case where it doesn't exist
  const formContext = useFormContext();
  
  // If we have form context, use react-hook-form
  if (formContext) {
    const { control } = formContext;
    const {
      field,
      fieldState: { error },
    } = useController({ name, control });

    return (
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor={inputId}
          style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem" }}
        >
          {label}
        </label>
        <input
          id={inputId}
          type={type}
          {...field}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          {...props}
        />
        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error.message}</p>
        )}
      </div>
    );
  }

  // Fallback to regular input when no form context
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        htmlFor={inputId}
        style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem" }}
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
        {...props}
      />
      {externalError && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>{externalError}</p>
      )}
    </div>
  );
}
