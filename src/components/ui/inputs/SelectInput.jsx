// components/ui/inputs/SelectInput.jsx
import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";

export default function SelectInput({ name, label, options, placeholder, value, onChange, error: externalError, ...props }) {
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
      <div className="form-control w-full mb-4">
        {label && (
          <label className="label" htmlFor={inputId}>
            <span className="label-text font-semibold">{label}</span>
          </label>
        )}

        <select
          id={inputId}
          {...field}
          style={{
            border: "1px solid #ccc",
          }}
          className={`select select-bordered w-full bg-white text-gray-900 ${
            error ? "select-error" : ""
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error.message}</span>
          </label>
        )}
      </div>
    );
  }

  // Fallback to regular select when no form context
  return (
    <div className="form-control w-full mb-4">
      {label && (
        <label className="label" htmlFor={inputId}>
          <span className="label-text font-semibold">{label}</span>
        </label>
      )}

      <select
        id={inputId}
        name={name}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          border: "1px solid #ccc",
        }}
        className={`select select-bordered w-full bg-white text-gray-900 ${
          externalError ? "select-error" : ""
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {externalError && (
        <label className="label">
          <span className="label-text-alt text-error">{externalError}</span>
        </label>
      )}
    </div>
  );
}
