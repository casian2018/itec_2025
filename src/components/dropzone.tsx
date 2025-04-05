// /components/Dropzone.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png'], 'application/pdf': ['.pdf'] },
  });

  return (
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      <p>📁 Drag & drop files, or click to select</p>
    </div>
  );
};

const dropzoneStyle: React.CSSProperties = {
  border: '2px dashed #999',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default Dropzone;
