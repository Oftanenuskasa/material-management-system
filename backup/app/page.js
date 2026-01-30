import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Material Management System
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Efficiently manage your materials inventory with advanced features.
            Built with Next.js, Tailwind CSS, and PostgreSQL.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              📊 Go to Dashboard
            </Link>
            <Link
              href="/materials"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              📦 View Materials
            </Link>
            <Link
              href="/materials/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              ➕ Add New Material
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">Advanced Search & Filter</h3>
              <p className="text-gray-600">
                Search by name, description, supplier. Filter by category and price range.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-green-600 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Dashboard & Reports</h3>
              <p className="text-gray-600">
                Visual dashboard with statistics, charts, and inventory health indicators.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-purple-600 text-3xl mb-4">📥</div>
              <h3 className="text-xl font-semibold mb-3">Export & Import</h3>
              <p className="text-gray-600">
                Export your inventory to CSV format for external analysis and reporting.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Features Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Full CRUD Operations</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Advanced Search & Filters</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Dashboard with Analytics</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>CSV Export Functionality</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Toast Notifications</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Responsive Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
