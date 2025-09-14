import { X } from "lucide-react";

export default function ViewModal({ 
  isOpen, 
  onClose, 
  title = "Detail Data", 
  data = [] 
}) {
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
          <div className="p-4">
            <div className="space-y-3">
              {data.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    {item.label}:
                  </span>
                  <span className="text-sm text-gray-900 text-right max-w-[200px] break-words">
                    {item.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}