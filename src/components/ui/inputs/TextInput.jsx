// components/ui/inputs/TextInput.jsx
import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";

export default function TextInput({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
  error: externalError,
  className = "",
  ...props
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
    } = useController({ name, control });

    return (
      <div className="form-control w-full mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          {...field}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    );
  }

  // Fallback to regular input when no form context
  return (
    <div className="form-control w-full mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          externalError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {externalError && (
        <p className="mt-1 text-sm text-red-600">{externalError}</p>
      )}
    </div>
  );
}
