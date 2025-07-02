export default function PostFilters({ filters, onFilterChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🔍 <span>Filter Posts</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={onFilterChange}
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
          >
            <option value="">🔄 All Status</option>
            <option value="active">✅ Active</option>
            <option value="inactive">⏸️ Inactive</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
