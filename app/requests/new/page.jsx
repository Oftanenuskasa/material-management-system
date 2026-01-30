'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: 1,
    purpose: '',
    priority: 'MEDIUM',
    notes: '',
    neededBy: ''
  });
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setFetching(true);
      const response = await fetch('/api/materials');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setMaterials(data);
      } else {
        console.error('Unexpected data format:', data);
        setMaterials([]);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to load materials');
      setMaterials([]);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!formData.materialId) {
      setError('Please select a material');
      setLoading(false);
      return;
    }
    
    if (!formData.purpose.trim()) {
      setError('Please enter a purpose');
      setLoading(false);
      return;
    }
    
    if (formData.quantity < 1) {
      setError('Quantity must be at least 1');
      setLoading(false);
      return;
    }
    
    try {
      // Try to submit to the API
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Request created successfully!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create request');
      }
    } catch (err) {
      console.error('Error creating request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMaterialSelect = (materialId) => {
    setFormData(prev => ({
      ...prev,
      materialId
    }));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Request</h1>
        <p className="text-gray-600 mt-2">Request materials from your inventory</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-red-800">{error}</span>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          {/* Material Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Material *
            </label>
            
            {fetching ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-3 text-gray-600">Loading materials from database...</p>
              </div>
            ) : materials.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-3 text-gray-600">No materials found in database</p>
                <button
                  type="button"
                  onClick={() => router.push('/materials/create')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Add New Material
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    onClick={() => handleMaterialSelect(material.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.materialId === material.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{material.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          SKU: <span className="font-mono">{material.sku}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Category: {material.category || 'Uncategorized'}
                        </p>
                      </div>
                      {formData.materialId === material.id && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          Available: {material.quantity} {material.unit}
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          ${parseFloat(material.unitPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Needed *
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Purpose */}
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <textarea
              id="purpose"
              name="purpose"
              rows="3"
              value={formData.purpose}
              onChange={handleChange}
              required
              placeholder="Why do you need this material? What will it be used for?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Priority and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="neededBy" className="block text-sm font-medium text-gray-700 mb-2">
                Needed By (Optional)
              </label>
              <input
                id="neededBy"
                name="neededBy"
                type="date"
                value={formData.neededBy}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special instructions or additional information..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Submit Buttons */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading || !formData.materialId}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Request...
                  </span>
                ) : (
                  'Create Request'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={fetchMaterials}
                disabled={fetching}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition"
              >
                Refresh Materials
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
