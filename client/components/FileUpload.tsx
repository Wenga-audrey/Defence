import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, X, CheckCircle } from "@/lib/icons";

interface FileUploadProps {
  onFileUpload?: (files: File[]) => void;
  acceptedTypes?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export default function FileUpload({
  onFileUpload,
  acceptedTypes = ".pdf,.doc,.docx,.txt,.jpg,.png",
  maxFiles = 5,
  maxSize = 10
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(newFiles);
      setUploading(false);
      
      if (onFileUpload) {
        onFileUpload(newFiles);
      }
    }, 1000);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    if (onFileUpload) {
      onFileUpload(newFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-mindboost-green transition-colors">
      <CardContent className="p-6">
        <div
          className={`text-center ${dragActive ? 'bg-mindboost-green/10' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Files
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop files here, or click to select files
          </p>
          
          <Button
            onClick={openFileDialog}
            className="bg-mindboost-green hover:bg-mindboost-green/90"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Choose Files"}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleChange}
            className="hidden"
          />
          
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max {maxSize}MB each)
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
