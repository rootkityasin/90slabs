export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome to the 90sLabs Request content management system. Select a section from the sidebar to start editing.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {/* Quick Stats or Shortcuts could go here */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-2">Website Status</h3>
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full text-xs font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </div>
                </div>
            </div>
        </div>
    )
}
