import React, { useState } from 'react';
import { downloadAssetExcel, uploadAssetExcel } from '../../../services/assetService';

const ExcelManager = () => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const handleDownload = async () => {
    try {
      const response = await downloadAssetExcel();
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'AssetExport.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadAssetExcel(file);
      alert('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed.');
    }
    setUploading(false);
  };

  return (
    <div>
      <h2>📂 Excel Import/Export</h2>

      <button onClick={handleDownload}>⬇️ Export to Excel</button>

      <div style={{ marginTop: '1rem' }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : '⬆️ Upload Excel'}
        </button>
      </div>
    </div>
  );
};

export default ExcelManager;
