// File: FileUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !taskTitle || !uploadedBy) {
      return alert("❗ Please fill in all fields and select a file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskTitle", taskTitle);
    formData.append("uploadedBy", uploadedBy);
    formData.append("userId", userId || "unknown");

    try {
      setUploading(true);
      await axios.post("http://localhost:4000/api/uploads", formData);
      alert("✅ File uploaded successfully!");
      // Reset fields
      setFile(null);
      setTaskTitle('');
      setUploadedBy('');
      document.getElementById('fileInput').value = null;
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <h5 className="mb-3">📁 Upload Task File</h5>

      <input
        className="form-control mb-2"
        type="text"
        placeholder="Your name"
        value={uploadedBy}
        onChange={(e) => setUploadedBy(e.target.value)}
      />

      <input
        className="form-control mb-2"
        type="text"
        placeholder="Task title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />

      <input
        className="form-control mb-2"
        type="file"
        id="fileInput"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : '📤 Upload'}
      </button>
    </div>
  );
};

export default FileUpload;
