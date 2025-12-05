export default function ProcessingHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900">Plagiarism Detector</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <button className="text-gray-700 font-medium hover:text-gray-900 transition-colors">Dashboard</button>
          <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">New Analysis</button>
          <button className="text-gray-700 font-medium hover:text-gray-900 transition-colors">History</button>
          <button className="text-gray-700 font-medium hover:text-gray-900 transition-colors">Help</button>

          {/* User Avatar */}
          <button className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center text-white font-semibold hover:opacity-80 transition-opacity">
            U
          </button>
        </nav>
      </div>
    </header>
  )
}
