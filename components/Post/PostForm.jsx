import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from '../Forms/ImageUpload';

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['active', 'inactive']),
  date: z.string().min(1),
  image: z.any().optional()
});

export default function PostForm({ editId, setEditId, onPostSubmit, posts }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('blob:')) return imageUrl;
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      return `/${imageUrl}`;
    }
    if (imageUrl.startsWith('/')) return imageUrl;
    return imageUrl;
  };

  const onSubmit = async (data) => {
    let imageUrl = '';

    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const res = await axios.post('/api/upload', formData);
        imageUrl = res.data.imageUrl;
      } catch (err) {
        console.error('Image upload failed:', err);
        return;
      }
    } else if (editId) {
      const currentPost = posts.find((post) => post._id === editId);
      imageUrl = currentPost?.imageUrl || '';
    }

    const postData = {
      title: data.title,
      description: data.description,
      status: data.status,
      date: data.date,
      imageUrl
    };

    await onPostSubmit(postData, editId);
    handleCancelEdit();
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

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  // Effect to populate form when editing
  useEffect(() => {
    if (editId) {
      const post = posts.find((p) => p._id === editId);
      if (post) {
        reset({
          title: post.title,
          description: post.description,
          status: post.status,
          date: post.date.split('T')[0]
        });

        if (post.imageUrl) {
          const imageUrl = getImageUrl(post.imageUrl);
          setImagePreview(imageUrl);
        } else {
          setImagePreview(null);
        }
      }
    }
  }, [editId, posts, reset]);

  return (
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
          {errors.title && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Title is required
            </p>
          )}
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
          {errors.description && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Description is required
            </p>
          )}
        </div>

        {/* Status and Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Status</label>
            <select
              {...register('status')}
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
            >
              <option value="">Select Status</option>
              <option value="active">✅ Active</option>
              <option value="inactive">⏸️ Inactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Status is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Date</label>
            <input
              type="date"
              {...register('date')}
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
            />
            {errors.date && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Date is required
              </p>
            )}
          </div>
        </div>

        {/* Image Upload Section */}
        <ImageUpload
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          editId={editId}
        />

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
  );
}
