import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import usePostsStore from '../store/usePostsStore';
import axios from 'axios';

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['active', 'inactive']),
  date: z.string().min(1),
  image: z.any().optional()
});

export default function Home() {
  const { posts, fetchPosts, createPost, updatePost, deletePost } = usePostsStore();
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    fetchPosts(filters);
  }, [filters]);

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // already a blob URL (for new file previews), return as is
    if (imageUrl.startsWith('blob:')) {
      return imageUrl;
    }

    // relative pat, ensure it starts with /
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      return `/${imageUrl}`;
    }

    // already starts with /, return as is
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }

    // return as is (for absolute URLs)
    return imageUrl;
  };

  const onSubmit = async (data) => {
    console.log('Form data', data);
    console.log('Selected file', selectedFile);
    let imageUrl = '';

    // Use selectedFile state instead of form data for image
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const res = await axios.post('/api/upload', formData);
        imageUrl = res.data.imageUrl;
        console.log('Image uploaded successfully:', imageUrl);
      } catch (err) {
        console.error('Image upload failed:', err);
        return;
      }
    } else if (editId) {
      // If editing and no new file selected, preserve existing image
      const currentPost = posts.find(post => post._id === editId);
      imageUrl = currentPost?.imageUrl || '';
      console.log('Preserving existing image:', imageUrl);
    } else {
      console.log('No image selected');
    }

    const postData = {
      title: data.title,
      description: data.description,
      status: data.status,
      date: data.date,
      imageUrl
    };

    if (editId) {
      await updatePost(editId, postData);
      setEditId(null);
    } else {
      await createPost(postData);
    }

    reset({
      title: '',
      description: '',
      status: '',
      date: ''
    });
    setSelectedFile(null);
    // Clean up object URL if it exists
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    fetchPosts();
  };


  const handleEdit = (post) => {
    setEditId(post._id);
    reset({
      title: post.title,
      description: post.description,
      status: post.status,
      date: post.date.split('T')[0]
    });
    setSelectedFile(null);

    // Show existing image in preview when editing
    if (post.imageUrl) {
      const imageUrl = getImageUrl(post.imageUrl);
      setImagePreview(imageUrl);
      console.log('Setting existing image preview:', imageUrl);
      console.log('Original imageUrl from post:', post.imageUrl);
    } else {
      setImagePreview(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Scroll to top to show the edit form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCancelEdit = () => {
    reset({
      title: '',
      description: '',
      status: '',
      date: ''
    });

    setEditId(null);
    setSelectedFile(null);

    // Clean up object URL if it exists to prevent memory leaks
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    console.log('Selected File:', file.name, 'Type:', file.type, 'Size:', file.size);

    try {
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setImagePreview(previewUrl);
    } catch (error) {
      console.error('Error generating preview:', error);
      setSelectedFile(null);
      setImagePreview(null);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Post Management System
          </h1>
          <p className="text-gray-600">Create, edit, and manage your posts with ease</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-3 h-3 rounded-full ${editId ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <h2 className="text-2xl font-bold text-gray-800">
              {editId ? 'Edit Post' : 'Create New Post'}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                placeholder="Enter post title..."
                {...register('title')}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
              />
              {errors.title && <p className="text-red-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Title is required
              </p>}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                placeholder="Write your post description..."
                {...register('description')}
                rows="4"
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Description is required
              </p>}
            </div>

            {/* Status and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Status</label>
                <select {...register('status')} className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white">
                  <option value="">Select Status</option>
                  <option value="active">✅ Active</option>
                  <option value="inactive">⏸️ Inactive</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Status is required
                </p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Date</label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                />
                {errors.date && <p className="text-red-500 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Date is required
                </p>}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Upload Image</label>

              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group">
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="h-8 w-8 text-blue-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">Click to upload</span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg inline-block">📁 PNG, JPG</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative inline-block group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-48 h-48 object-contain rounded-2xl border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300"
                      style={{ backgroundColor: '#f0f0f0' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.error('Image preview failed to load.');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (imagePreview && imagePreview.startsWith('blob:')) {
                          URL.revokeObjectURL(imagePreview);
                        }
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-lg"
                      title="Remove image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 text-green-700">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium">
                        {selectedFile
                          ? `🆕 New image selected: ${selectedFile.name}`
                          : editId
                            ? "📷 Current image (no changes made)"
                            : "✅ Image selected"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (imagePreview && imagePreview.startsWith('blob:')) {
                        URL.revokeObjectURL(imagePreview);
                      }
                      setImagePreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    {editId ? "🔄 Change image" : "🔄 Choose different image"}
                  </button>
                </div>
              )}

            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {editId ? '✅ Update Post' : '🚀 Create Post'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center my-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <span className="px-6 text-gray-500 font-medium">Filters & Posts</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🔍 <span>Filter Posts</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Status</label>
              <select
                name="status"
                onChange={handleFilterChange}
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
                onChange={handleFilterChange}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                onChange={handleFilterChange}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Posts Section */}
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
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No posts yet</h4>
              <p className="text-gray-500">Create your first post to get started!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post, index) => (
                <div key={post._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 transition-all duration-300 group">
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
                            onClick={() => handleEdit(post)}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deletePost(post._id).then(fetchPosts)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 leading-relaxed">{post.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${post.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                          <span className="font-medium text-gray-700">
                            {post.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}