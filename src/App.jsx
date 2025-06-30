import { useState } from "react";
import AssetList from "./assets/pages/Assets/AssetList";
import AssetForm from "./assets/pages/Assets/CreateAsset";
import TestConnection from "./assets/pages/TestConnection";
import Dashboard from "./assets/pages/Assets/Dashboards";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ExcelManager from "./assets/pages/Assets/ExcelManager";
import AuditLogTable from "./assets/pages/Assets/AuditLogTable";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>🚀 AssetHub Dashboard</h1>

        <nav style={{ marginBottom: "16px" }}>
          <Link to="/" style={{ marginRight: 12 }}>
            🏠 Home
          </Link>
          <Link to="/dashboard" style={{ marginRight: 12 }}>
            📊 Dashboard
          </Link>
          <Link to="/test">🔌 Test Connection</Link>
          <Link to="/excel">🔌 Excel</Link>
          <Link to="/audit-logs">🔌 Logs</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <AssetForm
                  onSuccess={() => setRefreshKey((prev) => prev + 1)}
                />
                <hr />
                <AssetList key={refreshKey} />
              </>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<TestConnection />} />
          <Route path="/excel" element={<ExcelManager />} />
          <Route path="/audit-logs" element={<AuditLogTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
