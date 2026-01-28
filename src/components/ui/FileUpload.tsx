import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, FileText, Image, FileSpreadsheet } from 'lucide-react';
import clsx from 'clsx';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  label?: string;
  hint?: string;
}

export default function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  },
  label,
  hint,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesChange(newFiles);
    },
    [files, maxFiles, onFilesChange]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    maxSize,
    accept,
  });

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('image')) return <Image className="w-5 h-5 text-blue-500" />;
    if (type.includes('spreadsheet') || type.includes('excel'))
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    return <File className="w-5 h-5 text-surface-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-2">
          {label}
        </label>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={clsx(
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-surface-200 hover:border-primary-300 hover:bg-surface-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div
            className={clsx(
              'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors',
              isDragActive ? 'bg-primary-100' : 'bg-surface-100'
            )}
          >
            <Upload
              className={clsx(
                'w-6 h-6 transition-colors',
                isDragActive ? 'text-primary-500' : 'text-surface-400'
              )}
            />
          </div>
          <p className="text-sm font-medium text-surface-700 mb-1">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-surface-500">
            or <span className="text-primary-600 font-medium">browse</span> to upload
          </p>
        </div>
      </div>

      {hint && <p className="mt-2 text-xs text-surface-500">{hint}</p>}

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl"
              >
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-surface-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
