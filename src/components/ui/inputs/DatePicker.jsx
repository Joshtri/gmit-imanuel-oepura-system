import { forwardRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import { formatUtils } from "@/lib/formatUtils";

const DatePicker = forwardRef(function DatePicker(
  {
    name,
    placeholder = "Pilih tanggal",
    className = "",
    label,
    required,
    leftIcon,
    value,
    onChange,
    error: externalError,
    ...props
  },
  ref
) {
  // Try to get form context, but handle case where it doesn't exist
  const formContext = useFormContext();

  const formatDisplayDate = (dateValue) => {
    if (!dateValue) return "";

    try {
      const date = new Date(dateValue);
      return formatUtils.formatDate(date, "DD/MM/YYYY");
    } catch (error) {
      return dateValue;
    }
  };

  // If we have form context, use react-hook-form
  if (formContext) {
    const { control } = formContext;
    const {
      field,
      fieldState: { error },
    } = useController({ name, control });

    const handleChange = (e) => {
      field.onChange(e.target.value);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type="date"
            {...field}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full ${leftIcon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? "border-red-500 focus:ring-red-500" : ""
            } ${className}`}
            {...props}
            style={{
              colorScheme: "light", // Ensures consistent styling across browsers
            }}
          />

          {field.value && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
              {formatDisplayDate(field.value)}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
      </div>
    );
  }

  // Fallback to regular input when no form context
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type="date"
          name={name}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${leftIcon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            externalError ? "border-red-500 focus:ring-red-500" : ""
          } ${className}`}
          {...props}
          style={{
            colorScheme: "light", // Ensures consistent styling across browsers
          }}
        />

        {value && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
            {formatDisplayDate(value)}
          </div>
        )}
      </div>

      {externalError && <p className="text-sm text-red-500 mt-1">{externalError}</p>}
    </div>
  );
});

export default DatePicker;
