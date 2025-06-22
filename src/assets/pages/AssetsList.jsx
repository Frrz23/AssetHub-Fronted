// src/pages/AssetsList.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AssetsList = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/asset'); // 💡 Adjust endpoint as needed
        setAssets(response.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div>
      <h2>Asset List</h2>
      <ul>
        {assets.map((asset) => (
          <li key={asset.id}>{asset.assetName}</li>
        ))}
      </ul>
    </div>
  );
};

export default AssetsList;
