import React, { useEffect } from 'react';
import api from '../../api/axios';

const TestConnection = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/assets');
        console.log('✅ Connected! Response:', response.data);
        alert('✅ Connected to ABP backend successfully!');
      } catch (error) {
        console.error('❌ Failed to connect:', error);
        alert('❌ Connection failed. Check console.');
      }
    };

    testConnection();
  }, []);

  return <div>Testing connection to backend...</div>;
};

export default TestConnection;
