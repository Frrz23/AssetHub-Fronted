import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AssetList from "./assets/pages/Assets/AssetList";
import AssetForm from "./assets/pages/Assets/CreateAsset";
import TestConnection from "./assets/pages/TestConnection";
import Dashboard from "./assets/pages/Assets/Dashboards";
import ExcelManager from "./assets/pages/Assets/ExcelManager";
import AuditLogTable from "./assets/pages/Assets/AuditLogTable";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar />

        <main className="max-w-6xl mx-auto p-6 mt-8">
          <Routes>
            <Route path="/" element={<SectionCard><Dashboard /></SectionCard>} />
            <Route path="/assets" element={<AssetManagementPage />} />
            <Route path="/assets/create" element={<CreateAssetPage />} />
            <Route path="/test" element={<SectionCard><TestConnection /></SectionCard>} />
            <Route path="/excel" element={<SectionCard><ExcelManager /></SectionCard>} />
            <Route path="/audit-logs" element={<SectionCard><AuditLogTable /></SectionCard>} />
          </Routes>
        </main>

        <footer className="text-center py-8 text-sm text-gray-500 border-t mt-10">
          © 2025 AssetHub. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

// 🔹 Top Navigation Bar
const Navbar = () => {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", path: "/", icon: "📊" },
    { label: "Assets", path: "/assets", icon: "📦" },
    { label: "Test", path: "/test", icon: "🔌" },
    { label: "Excel", path: "/excel", icon: "📥" },
    { label: "Logs", path: "/audit-logs", icon: "📜" },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">🚀 AssetHub</h1>
        <div className="flex gap-4">
          {navItems.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`px-3 py-2 rounded-md font-medium transition 
                ${location.pathname === path
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-500 hover:bg-gray-100"}`}
            >
              {icon} {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

// 🔹 Reusable Card Wrapper
const SectionCard = ({ children }) => (
  <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
    {children}
  </div>
);

// 🔹 Asset Management Page
function AssetManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📦 Asset Management</h2>
        <Link
          to="/assets/create"
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-500 transition"
        >
          ➕ Create Asset
        </Link>
      </div>

      <SectionCard>
        <AssetList />
      </SectionCard>
    </div>
  );
}

// 🔹 Create Asset Page with Back Button
function CreateAssetPage() {
  const navigate = useNavigate();

  return (
    <SectionCard>
      <div className="mb-4">
        <button
          onClick={() => navigate("/assets")}
          className="text-indigo-600 hover:underline"
        >
          ← Back to Asset Management
        </button>
      </div>
      <AssetForm />
    </SectionCard>
  );
}

export default App;
