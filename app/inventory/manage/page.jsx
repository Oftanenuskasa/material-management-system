'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ManageInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/materials?limit=1000');
      const data = await response.json();
      setInventory(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const updateStock = async (materialId, newQuantity) => {
    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      if (response.ok) {
        fetchInventory(); // Refresh inventory
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleAdjustStock = (materialId, adjustment) => {
    const material = inventory.find(m => m.id === materialId);
    if (material) {
      const newQuantity = Math.max(0, material.quantity + adjustment);
      updateStock(materialId, newQuantity);
    }
  };

  if (loading) return <div className="p-6">Loading inventory...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Inventory</h1>
        <Link
          href="/materials/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add New Material
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((material) => (
                <tr key={material.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{material.name}</div>
                    <div className="text-sm text-gray-500">{material.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {material.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {material.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-semibold">
                      {material.quantity} {material.unit}
                    </div>
                    <div className="text-sm text-gray-500">
                      Min: {material.minStockLevel}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      material.quantity === 0 ? 'bg-red-100 text-red-800' :
                      material.quantity <= material.minStockLevel ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {material.quantity === 0 ? 'OUT OF STOCK' :
                       material.quantity <= material.minStockLevel ? 'LOW STOCK' :
                       'AVAILABLE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAdjustStock(material.id, 1)}
                        className="px-3 py-1 text-green-600 hover:text-green-900 border border-green-600 rounded hover:bg-green-50"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleAdjustStock(material.id, -1)}
                        className="px-3 py-1 text-red-600 hover:text-red-900 border border-red-600 rounded hover:bg-red-50"
                      >
                        -1
                      </button>
                      <Link
                        href={`/materials/${material.id}`}
                        className="px-3 py-1 text-blue-600 hover:text-blue-900 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
