'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert('Report generated! This would show data based on your selections.');
      setLoading(false);
    }, 1000);
  };

  const exportReport = (format) => {
    alert(`Exporting report as ${format.toUpperCase()}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="inventory">Inventory Report</option>
              <option value="requests">Request Report</option>
              <option value="usage">Usage Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={generateReport}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Export PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">-</div>
            <div className="text-sm text-gray-600">Total Materials</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">-</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">-</div>
            <div className="text-sm text-gray-600">Low Stock Items</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">-</div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Generate a report to see actual data
        </p>
      </div>
    </div>
  );
}
