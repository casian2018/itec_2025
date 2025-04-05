import React, { useState } from 'react'
import Dropzone from '../components/dropzone'

interface DropzoneProps {
  onFilesAdded: (files: File[]) => Promise<void> | void;
}


const Test = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFilesAdded = async (files: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Files uploaded successfully');
    } else {
      console.error('Error uploading files');
    }
  };

  return (
    <div>
      <h1>Upload Files</h1>
      <Dropzone onFilesAdded={handleFilesAdded} />
      <div>
        {uploadedFiles.map((file, index) => (
          <div key={index}>{file.name}</div>
        ))}
      </div>
    </div>
  )
}

export default Test;