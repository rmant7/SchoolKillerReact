import React, { useState } from 'react';
import axios from 'axios';

const CheckSolution: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadResult, setUploadResult] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            setFiles(selectedFiles);
        }
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        files.forEach((file) => formData.append('file', file));

        try {
            const response = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadResult(response.data.success);
            sessionStorage.setItem('user_id', response.data.user_id);
        } catch (error) {
            console.error("Error uploading files:", error);
            setUploadResult("File upload failed.");
        }
    };

    return (
        <div>
            <h2>Check Solution Page</h2>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload Files</button>
            {uploadResult && <p>{uploadResult}</p>}
        </div>
    );
};

export default CheckSolution;
