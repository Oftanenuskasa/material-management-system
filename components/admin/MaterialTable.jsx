'use client'

import { useState } from 'react'

export default function MaterialTable({
  materials,
  loading,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
  pagination,
  onPageChange
}) {
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    // In a real app, you would trigger API call with new sort
  }

  const handleFilter = (field, value) => {
    onFilterChange({ ...filters, [field]: value })
  }

  const getStatusColor = (status, quantity, minStockLevel) => {
    if (status === 'DISCONTINUED') return 'bg-gray-100 text-gray-800'
    if (quantity === 0) return 'bg-red-100 text-red-800'
    if (quantity <= minStockLevel) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (status, quantity, minStockLevel) => {
    if (status === 'DISCONTINUED') return 'Discontinued'
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= minStockLevel) return 'Low Stock'
    return 'In Stock'
  }

  return (
    <div className="overflow-x-auto">
      {/* Filters */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, SKU, or description..."
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.search || ''}
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>
          <div>
            <select
              className="px-3 py-2 border rounded-lg"
              value={filters.category || ''}
              onChange={(e) => handleFilter('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="ELECTRICAL">Electrical</option>
              <option value="PLUMBING">Plumbing</option>
              <option value="CONSTRUCTION">Construction</option>
              <option value="TOOLS">Tools</option>
              <option value="SAFETY">Safety Equipment</option>
            </select>
          </div>
          <div>
            <select
              className="px-3 py-2 border rounded-lg"
              value={filters.status || ''}
              onChange={(e) => handleFilter('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>
          <button
            onClick={() => handleFilter('search', '')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('sku')}>
              SKU {sortField === 'sku' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('category')}>
              Category {sortField === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('quantity')}>
              Quantity {sortField === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('unitPrice')}>
              Price {sortField === 'unitPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="8" className="px-6 py-8 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </td>
            </tr>
          ) : materials.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                No materials found. Try adjusting your filters or add a new material.
              </td>
            </tr>
          ) : (
            materials.map((material) => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{material.sku}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{material.name}</div>
                  {material.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {material.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {material.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {material.quantity} {material.unit}
                  </div>
                  <div className="text-xs text-gray-500">
                    Min: {material.minStockLevel}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(material.status, material.quantity, material.minStockLevel)}`}>
                    {getStatusText(material.status, material.quantity, material.minStockLevel)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${parseFloat(material.unitPrice).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {material.createdBy?.name || 'System'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(material.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(material)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(material.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span> of{' '}
              <span className="font-medium">{pagination.total}</span> materials
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className={`px-3 py-1 rounded ${pagination.hasPrev ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum
                if (pagination.pages <= 5) {
                  pageNum = i + 1
                } else if (pagination.page <= 3) {
                  pageNum = i + 1
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i
                } else {
                  pageNum = pagination.page - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1 rounded ${pagination.page === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className={`px-3 py-1 rounded ${pagination.hasNext ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
