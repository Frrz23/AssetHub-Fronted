import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("/app/audit-log"); // 🔁 Use correct endpoint
        setLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Time</th>
              <th className="border border-gray-300 px-4 py-2">Entity</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
              <th className="border border-gray-300 px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {log.performedAt
                    ? new Date(log.performedAt).toLocaleString()
                    : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {log.entityName || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {log.action || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {log.description || "N/A"}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;
