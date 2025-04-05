import React, { useState, useCallback } from 'react';
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
        accept: {
            'image/*': ['.jpeg', '.png'], // Accept only JPEG and PNG images
        },
    });

    return (
        <div {...getRootProps()} style={dropzoneStyle}>
            <input {...getInputProps()} />
            <p>Drag & drop some files here, or click to select files</p>
        </div>
    );
};

const dropzoneStyle: React.CSSProperties = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

const Home: React.FC = () => {
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
    );
};

export default Home;
