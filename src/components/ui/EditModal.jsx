import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  title = "Edit Data", 
  fields = [],
  initialData = {},
  isLoading = false
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && (!formData[field.key] || formData[field.key].toString().trim() === '')) {
        newErrors[field.key] = `${field.label} wajib diisi`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-4">
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[field.key] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      >
                        <option value="">Pilih {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'number' ? (
                      <input
                        type="number"
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[field.key] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={field.placeholder}
                        disabled={isLoading}
                        min={field.min}
                        max={field.max}
                      />
                    ) : field.type === 'boolean' ? (
                      <select
                        value={formData[field.key] !== undefined ? formData[field.key].toString() : ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value === 'true')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[field.key] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      >
                        <option value="true">Aktif</option>
                        <option value="false">Tidak Aktif</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[field.key] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={field.placeholder}
                        disabled={isLoading}
                      />
                    )}
                    
                    {errors[field.key] && (
                      <p className="text-red-500 text-sm mt-1">{errors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}