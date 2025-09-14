// components/ui/inputs/TextAreaInput.jsx
import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";

export default function TextAreaInput({
  name,
  label,
  placeholder,
  rows = 4,
  className = "",
  value,
  onChange,
  error: externalError,
  ...props
}) {
  const textareaId = useId();
  
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
      <div className={`${className}`}>
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        <textarea
          id={textareaId}
          {...field}
          rows={rows}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder={placeholder}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
      </div>
    );
  }

  // Fallback to regular textarea when no form context
  return (
    <div className={`${className}`}>
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        name={name}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder={placeholder}
        {...props}
      />
      {externalError && <p className="text-red-500 text-sm mt-2">{externalError}</p>}
    </div>
  );
}
