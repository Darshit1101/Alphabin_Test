import PostCard from './PostCard';

export default function PostList({ posts, onEdit, onDelete, getImageUrl }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        📝 <span>Your Posts</span>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </span>
      </h3>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-600 mb-2">No posts yet</h4>
          <p className="text-gray-500">Create your first post to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
