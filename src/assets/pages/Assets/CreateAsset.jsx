// src/components/AssetForm.jsx
import React, { useState } from 'react';
import { createAsset } from '../../../services/assetService';

const AssetForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    assetName: '',
    serialNumber: '',
    category: '',
    department: '',
    receivedDate: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createAsset(form);
      setSuccess('Asset created successfully!');
      setForm({
        assetName: '',
        serialNumber: '',
        category: '',
        department: '',
        receivedDate: '',
      });
      if (onSuccess) onSuccess(); // Refresh list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || 'Error creating asset');
    }
  };

  return (
    <div>
      <h3>➕ Add New Asset</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="assetName" placeholder="Asset Name" value={form.assetName} onChange={handleChange} required />
        <input name="serialNumber" placeholder="Serial Number" value={form.serialNumber} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <input name="receivedDate" type="date" value={form.receivedDate} onChange={handleChange} required />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AssetForm;
