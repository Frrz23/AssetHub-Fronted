import React, { useState } from 'react';
import { createAsset } from '../../../services/assetService';
import { CheckCircle, AlertCircle, Mail, Plus } from 'lucide-react';

const AssetForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    assetName: '',
    serialNumber: '',
    category: '',
    department: '',
    receivedDate: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.assetName.trim()) {
      newErrors.assetName = 'Asset name is required';
    } else if (form.assetName.length < 2) {
      newErrors.assetName = 'Asset name must be at least 2 characters';
    }
    
    if (!form.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    } else if (!/^[A-Za-z0-9-_]+$/.test(form.serialNumber)) {
      newErrors.serialNumber = 'Serial number can only contain letters, numbers, hyphens, and underscores';
    }
    
    if (!form.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!form.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!form.receivedDate) {
      newErrors.receivedDate = 'Received date is required';
    } else {
      const selectedDate = new Date(form.receivedDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (selectedDate > today) {
        newErrors.receivedDate = 'Received date cannot be in the future';
      }
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccess('');
    
    try {
      setEmailStatus('sending');
      await createAsset(form);
      setSuccess('Asset created successfully!');
      setEmailStatus('sent');
      
      setTimeout(() => {
        setEmailStatus(null);
        setSuccess('');
      }, 5000);

      setForm({
        assetName: '',
        serialNumber: '',
        category: '',
        department: '',
        receivedDate: '',
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setErrors({ 
        submit: err.response?.data?.error?.message || 'Error creating asset. Please try again.' 
      });
      setEmailStatus('failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Computer Hardware',
    'Office Equipment',
    'Furniture',
    'Vehicles',
    'Software',
    'Mobile Devices',
    'Network Equipment',
    'Other'
  ];

  const departments = [
    'IT',
    'HR',
    'Finance',
    'Marketing',
    'Operations',
    'Sales',
    'Legal',
    'Admin'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Plus className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Add New Asset</h3>
      </div>

      {/* Status Messages */}
      {emailStatus && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
          emailStatus === 'sending' ? 'bg-blue-50 text-blue-700' :
          emailStatus === 'sent' ? 'bg-green-50 text-green-700' :
          'bg-red-50 text-red-700'
        }`}>
          {emailStatus === 'sending' && <Mail className="w-5 h-5 animate-pulse" />}
          {emailStatus === 'sent' && <CheckCircle className="w-5 h-5" />}
          {emailStatus === 'failed' && <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">
            {emailStatus === 'sending' && 'Sending notification email...'}
            {emailStatus === 'sent' && 'Email notification sent successfully ✨'}
            {emailStatus === 'failed' && 'Failed to send notification email'}
          </span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-700 flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{errors.submit}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Asset Name *
            </label>
            <input
              name="assetName"
              type="text"
              placeholder="Enter asset name"
              value={form.assetName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.assetName ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.assetName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.assetName}
              </p>
            )}
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Serial Number *
            </label>
            <input
              name="serialNumber"
              type="text"
              placeholder="Enter serial number"
              value={form.serialNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.serialNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.serialNumber && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.serialNumber}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department *
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select a department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.department}
              </p>
            )}
          </div>

          {/* Received Date */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Received Date *
            </label>
            <input
              name="receivedDate"
              type="date"
              value={form.receivedDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full md:w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.receivedDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.receivedDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.receivedDate}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center gap-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Asset...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Asset
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetForm;