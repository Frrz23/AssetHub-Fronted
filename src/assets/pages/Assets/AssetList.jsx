import React, { useEffect, useState } from "react";
import { getAssets } from "../../../services/assetService";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAssets()
      .then((data) => setAssets(data))
      .catch((err) => setError("Failed to fetch assets"));
  }, []);

  return (
    <div>
      <h2>📋 Asset List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Serial Number</th>
            <th>Category</th>
            <th>Department</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.assetName}</td>
              <td>{asset.serialNumber}</td>
              <td>{asset.category}</td>
              <td>{asset.department}</td>
              <td>{asset.isApproved ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;
