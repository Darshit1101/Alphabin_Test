export default function PostCard({ post, onEdit, onDelete, getImageUrl }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Post Image */}
        {post.imageUrl && (
          <div className="md:w-48 flex-shrink-0">
            <img
              src={getImageUrl(post.imageUrl)}
              alt="Post image"
              className="w-full h-40 md:h-32 object-cover rounded-xl border-2 border-gray-100 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.error('Post list image failed to load:', getImageUrl(post.imageUrl));
                console.error('Original post.imageUrl:', post.imageUrl);
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Post list image loaded successfully:', getImageUrl(post.imageUrl));
              }}
            />
          </div>
        )}

        {/* Post Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(post)}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(post._id)}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">{post.description}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  post.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                }`}
              ></span>
              <span className="font-medium text-gray-700">
                {post.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
