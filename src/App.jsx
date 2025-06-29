import { useState } from "react";
import AssetList from "./assets/pages/Assets/AssetList";
import AssetForm from "./assets/pages/Assets/CreateAsset";
import TestConnection from "./assets/pages/TestConnection";



function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h1>🚀 AssetHub Dashboard</h1>
      <AssetForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
      <hr />
      <AssetList key={refreshKey} />
    </div>
  );
}

export default App;
