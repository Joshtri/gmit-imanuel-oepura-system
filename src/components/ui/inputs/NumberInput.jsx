// components/ui/inputs/NumberInput.jsx
import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";

export default function NumberInput({
  name,
  label,
  placeholder,
  min,
  max,
  step = 1,
  value,
  onChange,
  error: externalError,
}) {
  const inputId = useId();
  
  // Try to get form context, but handle case where it doesn't exist
  const formContext = useFormContext();
  
  // If we have form context, use react-hook-form
  if (formContext) {
    const { control } = formContext;
    const {
      field,
      fieldState: { error },
    } = useController({
      name,
      control,
      rules: {
        valueAsNumber: true, // This ensures the value is converted to a number
      },
    });

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
          type="number"
          {...field}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
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
        type="number"
        name={name}
        value={value || ""}
        onChange={(e) => onChange?.(Number(e.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      {externalError && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>{externalError}</p>
      )}
    </div>
  );
}
