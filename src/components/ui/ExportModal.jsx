import React, { useState } from 'react';
import { X, Download, CheckSquare, Square, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from './Button';
import { exportData, getAvailableFormats } from '@/utils/exportUtils';

export default function ExportModal({
  isOpen,
  onClose,
  data = [],
  columns = [],
  exportColumns = null,
  filename = 'export',
  title = 'Export Data',
}) {
  const [selectedFormat, setSelectedFormat] = useState('xlsx');
  const [selectedColumns, setSelectedColumns] = useState((exportColumns || columns).map(col => col.key));
  const [isExporting, setIsExporting] = useState(false);
  const [includeTitle, setIncludeTitle] = useState(true);
  const [customTitle, setCustomTitle] = useState(title);

  const formats = getAvailableFormats();
  const columnsToUse = exportColumns || columns;

  // Toggle column selection
  const toggleColumn = (columnKey) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Select/deselect all columns
  const toggleAllColumns = () => {
    setSelectedColumns(prev =>
      prev.length === columnsToUse.length ? [] : columnsToUse.map(col => col.key)
    );
  };

  // Handle export
  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      alert('Pilih minimal satu kolom untuk diekspor');
      return;
    }

    setIsExporting(true);
    try {
      const options = {
        selectedColumns,
        title: includeTitle ? customTitle : null,
        orientation: selectedColumns.length > 6 ? 'landscape' : 'portrait',
      };

      const result = await exportData(selectedFormat, data, columnsToUse, filename, options);

      if (result.success) {
        onClose();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Terjadi kesalahan saat mengekspor data');
    } finally {
      setIsExporting(false);
    }
  };

  // Reset modal state when closed
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedColumns(columnsToUse.map(col => col.key));
      setSelectedFormat('xlsx');
      setIncludeTitle(true);
      setCustomTitle(title);
    }
  }, [isOpen, columnsToUse, title]);

  if (!isOpen) return null;

  const isAllSelected = selectedColumns.length === columnsToUse.length;
  const isPartialSelected = selectedColumns.length > 0 && selectedColumns.length < columnsToUse.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Export Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Format Export
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedFormat === format.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{format.icon}</span>
                    <span className="font-medium">{format.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title Options (PDF/DOCX only) */}
          {(selectedFormat === 'pdf' || selectedFormat === 'docx') && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setIncludeTitle(!includeTitle)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  {includeTitle ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                  Sertakan judul
                </button>
              </div>
              {includeTitle && (
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan judul dokumen"
                />
              )}
            </div>
          )}

          {/* Column Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Pilih Kolom ({selectedColumns.length}/{columnsToUse.length})
              </label>
              <button
                onClick={toggleAllColumns}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {isAllSelected ? 'Batalkan Semua' : 'Pilih Semua'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {columnsToUse.map((column) => (
                  <label
                    key={column.key}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <button
                      onClick={() => toggleColumn(column.key)}
                      className="flex items-center"
                    >
                      {selectedColumns.includes(column.key) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <span className="text-sm text-gray-700">{column.label}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      ({column.type || 'text'})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Data Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between mb-1">
                <span>Total baris:</span>
                <span className="font-medium">{data.length}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Kolom yang dipilih:</span>
                <span className="font-medium">{selectedColumns.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-medium uppercase">{selectedFormat}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Batal
          </Button>
          <Button
            onClick={handleExport}
            isLoading={isExporting}
            loadingText="Mengekspor..."
            disabled={selectedColumns.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
}