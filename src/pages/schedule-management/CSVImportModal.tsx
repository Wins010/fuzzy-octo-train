import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { importPapersFromCSV, getAllTechnicalSessions } from '@/services/scheduleService';
import { CSVImportResult } from '@/types';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export default function CSVImportModal({
  isOpen,
  onClose,
  onImportComplete,
}: CSVImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setSelectedFile(null);
    setCsvContent('');
    setPreviewData([]);
    setImportResult(null);
    setValidationError('');
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setValidationError('Please select a CSV file');
      return;
    }

    setSelectedFile(file);
    setValidationError('');
    setImportResult(null);

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      parsePreview(content);
    };
    reader.readAsText(file);
  };

  const parsePreview = (content: string) => {
    const lines = content.trim().split('\n');
    const preview = lines.slice(0, 6).map((line) => {
      // Simple CSV parsing for preview
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
    setPreviewData(preview);
  };

  const validateCSV = (): string | null => {
    if (!csvContent) {
      return 'No file selected';
    }

    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      return 'CSV file must contain at least a header and one data row';
    }

    const header = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const expectedHeaders = ['Session ID', 'Paper ID', 'Paper Title', 'Authors'];

    for (let i = 0; i < expectedHeaders.length; i++) {
      if (header[i] !== expectedHeaders[i]) {
        return `Invalid CSV header. Expected: ${expectedHeaders.join(', ')}`;
      }
    }

    // Check if sessions exist
    const sessions = getAllTechnicalSessions();
    const sessionIds = new Set(sessions.map((s) => s.id));

    for (let i = 1; i < Math.min(lines.length, 10); i++) {
      const values = lines[i].split(',');
      if (values.length < 4) continue;

      const sessionId = values[0].trim().replace(/"/g, '');
      if (sessionId && !sessionIds.has(sessionId)) {
        return `Session ID "${sessionId}" not found. Please create the session first.`;
      }
    }

    return null;
  };

  const handleImport = async () => {
    const validationErr = validateCSV();
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    setIsLoading(true);
    setValidationError('');

    try {
      const result = importPapersFromCSV(csvContent);
      setImportResult(result);

      if (result.success || result.importedCount > 0) {
        onImportComplete();
      }
    } catch (error: any) {
      setValidationError(error.message || 'Failed to import CSV');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `Session ID,Paper ID,Paper Title,Authors
ts-example-001,P-001,"Machine Learning in Healthcare","John Doe, Jane Smith"
ts-example-001,P-002,"Deep Learning Applications","Alice Johnson"
ts-example-002,P-003,"Natural Language Processing","Bob Williams, Charlie Brown"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'papers-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Papers from CSV"
      size="xl"
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">CSV Format Instructions</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>CSV must have headers: Session ID, Paper ID, Paper Title, Authors</li>
            <li>Session must exist before importing papers</li>
            <li>Paper IDs must be unique within each session</li>
            <li>Authors should be comma-separated within quotes</li>
          </ul>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadTemplate}
            className="mt-3 text-blue-700 hover:text-blue-900"
            leftIcon={<FileText className="w-4 h-4" />}
          >
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Select CSV File
          </label>
          <div
            className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-primary-500" />
                <div className="text-left">
                  <p className="font-medium text-surface-900">{selectedFile.name}</p>
                  <p className="text-sm text-surface-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setCsvContent('');
                    setPreviewData([]);
                    setImportResult(null);
                    setValidationError('');
                  }}
                  className="p-1 hover:bg-surface-100 rounded"
                >
                  <X className="w-4 h-4 text-surface-500" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                <p className="text-surface-700 font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-surface-500">CSV files only</p>
              </div>
            )}
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-900 mb-1">Validation Error</h4>
              <p className="text-sm text-red-700">{validationError}</p>
            </div>
          </div>
        )}

        {/* Preview */}
        {previewData.length > 0 && !importResult && (
          <div>
            <h4 className="text-sm font-medium text-surface-700 mb-3">Preview (First 5 rows)</h4>
            <div className="border border-surface-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-50 border-b border-surface-200">
                    <tr>
                      {previewData[0]?.map((header, i) => (
                        <th
                          key={i}
                          className="px-4 py-2 text-left font-medium text-surface-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1).map((row, i) => (
                      <tr key={i} className="border-b border-surface-100 last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 text-surface-600">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Import Result */}
        {importResult && (
          <div
            className={`rounded-lg p-4 border ${
              importResult.success
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {importResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4
                  className={`text-sm font-medium mb-2 ${
                    importResult.success ? 'text-green-900' : 'text-yellow-900'
                  }`}
                >
                  {importResult.success
                    ? 'Import Completed Successfully'
                    : 'Import Completed with Errors'}
                </h4>
                <p
                  className={`text-sm mb-3 ${
                    importResult.success ? 'text-green-700' : 'text-yellow-700'
                  }`}
                >
                  Successfully imported {importResult.importedCount} paper(s)
                </p>

                {importResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-surface-900">Errors:</h5>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {importResult.errors.map((error, i) => (
                        <div
                          key={i}
                          className="text-xs bg-white rounded px-3 py-2 border border-surface-200"
                        >
                          <span className="font-medium">Line {error.line}:</span>{' '}
                          {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalFooter className="-mx-6 -mb-6 mt-6">
        <Button variant="secondary" onClick={handleClose}>
          {importResult ? 'Close' : 'Cancel'}
        </Button>
        {!importResult && (
          <Button
            onClick={handleImport}
            isLoading={isLoading}
            disabled={!selectedFile}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Import Papers
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
