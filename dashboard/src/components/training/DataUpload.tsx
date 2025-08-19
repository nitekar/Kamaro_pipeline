import React, { useState } from 'react';
import { UploadIcon, FileTextIcon, XIcon, CheckIcon, AlertCircleIcon } from 'lucide-react';
interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}
export function DataUpload({
  onDataUploaded
}: {
  onDataUploaded: (dataset: any) => void;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      status: 'uploading' as const,
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
    // Simulate file upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prevFiles => {
          const updatedFiles = prevFiles.map(f => {
            if (f.id === file.id) {
              const newProgress = (f.progress || 0) + 10;
              if (newProgress >= 100) {
                clearInterval(interval);
                return {
                  ...f,
                  progress: 100,
                  status: 'success' as const
                };
              }
              return {
                ...f,
                progress: newProgress
              };
            }
            return f;
          });
          // Check if all files are uploaded
          const allComplete = updatedFiles.every(f => f.status === 'success' || f.status === 'error');
          if (allComplete) {
            setUploadComplete(true);
          }
          return updatedFiles;
        });
      }, 300);
    });
  };
  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const handleStartTraining = () => {
    // Prepare dataset information
    const dataset = {
      name: files.length > 0 ? files[0].name : 'Custom Dataset',
      size: files.reduce((total, file) => total + parseInt(file.size), 0) + ' bytes',
      records: Math.floor(Math.random() * 5000) + 10000,
      files: files.map(file => ({
        name: file.name,
        size: file.size
      }))
    };
    onDataUploaded(dataset);
    setFiles([]);
    setUploadComplete(false);
  };
  return <div className="space-y-4">
      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <div className="space-y-2">
          <div className="mx-auto flex justify-center">
            <UploadIcon size={36} className="text-gray-400" />
          </div>
          <p className="text-gray-700">
            Drag and drop your data files here, or{' '}
            <label className="text-blue-600 cursor-pointer hover:text-blue-800">
              browse
              <input type="file" className="hidden" onChange={handleFileChange} multiple accept=".csv,.xlsx,.json" />
            </label>
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: CSV, Excel, JSON (max 50MB)
          </p>
        </div>
      </div>
      {files.length > 0 && <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="text-sm font-medium text-gray-700">
              Uploaded Files
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {files.map(file => <li key={file.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FileTextIcon size={18} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {file.status === 'uploading' && <div className="w-24 mr-4">
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{
                  width: `${file.progress}%`
                }}></div>
                      </div>
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {file.progress}%
                      </p>
                    </div>}
                  {file.status === 'success' && <CheckIcon size={18} className="text-green-500 mr-2" />}
                  {file.status === 'error' && <AlertCircleIcon size={18} className="text-red-500 mr-2" />}
                  <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => removeFile(file.id)}>
                    <XIcon size={16} className="text-gray-400" />
                  </button>
                </div>
              </li>)}
          </ul>
        </div>}
      {uploadComplete && <div className="mt-4 text-center">
          <button onClick={handleStartTraining} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Use New Data & Start Training
          </button>
        </div>}
    </div>;
}