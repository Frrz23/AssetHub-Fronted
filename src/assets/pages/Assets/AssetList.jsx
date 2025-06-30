import React, { useEffect, useState } from "react";
import { approveAsset, deactivateAsset, deleteAsset, getAssets } from "../../../services/assetService";
import { 
  CheckCircle, 
  Clock, 
  Ban, 
  Trash2, 
  AlertTriangle, 
  Mail, 
  FileText,
  Calendar,
  Building,
  Tag,
  Hash
} from "lucide-react";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [processingAssetId, setProcessingAssetId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await getAssets();
      setAssets(data);
    } catch (err) {
      console.error("Error fetching assets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleApprove = async (id) => {
    setApprovalStatus('notifying');
    setProcessingAssetId(id);
    try {
      await approveAsset(id);
      setApprovalStatus('sent');
      setTimeout(() => setApprovalStatus(null), 3000);
      await fetchAssets();
    } catch {
      setApprovalStatus('failed');
      setTimeout(() => setApprovalStatus(null), 3000);
    } finally {
      setProcessingAssetId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset? This action cannot be undone.")) return;
    
    setProcessingAssetId(id);
    try {
      await deleteAsset(id);
      await fetchAssets();
    } catch {
      alert("❌ Delete failed");
    } finally {
      setProcessingAssetId(null);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this asset?")) return;
    
    setProcessingAssetId(id);
    try {
      await deactivateAsset(id);
      await fetchAssets();
    } catch (error) {
      console.error("Deactivate error:", error);
      alert("❌ Deactivate failed: " + (error.response?.data?.message || error.message));
    } finally {
      setProcessingAssetId(null);
    }
  };

  // Filter and search logic
  const filteredAssets = assets.filter(asset => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'approved' && asset.isApproved) ||
      (filter === 'pending' && !asset.isApproved) ||
      (filter === 'active' && asset.isActive) ||
      (filter === 'inactive' && !asset.isActive);
    
    const matchesSearch = 
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (asset) => {
    if (!asset.isApproved) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    
    if (asset.isApproved && asset.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <Ban className="w-3 h-3" />
        Deactivated
      </span>
    );
  };

  if (loading && assets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading assets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Asset Management</h3>
          </div>
          <div className="text-sm text-gray-500">
            {filteredAssets.length} of {assets.length} assets
          </div>
        </div>

        {/* Status Messages */}
        {approvalStatus && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            approvalStatus === 'notifying' ? 'bg-blue-50 text-blue-700' :
            approvalStatus === 'sent' ? 'bg-green-50 text-green-700' :
            'bg-red-50 text-red-700'
          }`}>
            {approvalStatus === 'notifying' && <Mail className="w-5 h-5 animate-pulse" />}
            {approvalStatus === 'sent' && <CheckCircle className="w-5 h-5" />}
            {approvalStatus === 'failed' && <AlertTriangle className="w-5 h-5" />}
            <span className="font-medium">
              {approvalStatus === 'notifying' && 'Sending approval notification...'}
              {approvalStatus === 'sent' && 'Approval email sent successfully ✨'}
              {approvalStatus === 'failed' && 'Failed to send approval email'}
            </span>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All Assets' },
              { key: 'approved', label: 'Approved' },
              { key: 'pending', label: 'Pending' },
              { key: 'active', label: 'Active' },
              { key: 'inactive', label: 'Inactive' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="flex-1 min-w-0 sm:max-w-xs">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="p-6">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm || filter !== 'all' ? 'No assets match your criteria' : 'No assets found'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <FileText className="w-4 h-4" />
                        Asset Name
                      </div>
                      <div className="font-semibold text-gray-900">{asset.assetName}</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Hash className="w-4 h-4" />
                        Serial Number
                      </div>
                      <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {asset.serialNumber}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Tag className="w-4 h-4" />
                        Category
                      </div>
                      <div className="text-gray-900">{asset.category}</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Building className="w-4 h-4" />
                        Department
                      </div>
                      <div className="text-gray-900">{asset.department}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        Received
                      </div>
                      <div className="text-sm text-gray-900">
                        {new Date(asset.receivedDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {getStatusBadge(asset)}
                      
                      <div className="flex gap-2">
                        {!asset.isApproved && (
                          <button
                            onClick={() => handleApprove(asset.id)}
                            disabled={processingAssetId === asset.id}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {processingAssetId === asset.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                        )}

                        {asset.isApproved && asset.isActive && (
                          <button
                            onClick={() => handleDeactivate(asset.id)}
                            disabled={processingAssetId === asset.id}
                            className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 focus:ring-4 focus:ring-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {processingAssetId === asset.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                            Deactivate
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(asset.id)}
                          disabled={processingAssetId === asset.id}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {processingAssetId === asset.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetList;