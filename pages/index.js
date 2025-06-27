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

  const onSubmit = async (data) => {
    let imageUrl = '';

    if (data.image && data.image[0]) {
      const formData = new FormData();
      formData.append('image', data.image[0]);

      try {
        const res = await axios.post('/api/upload', formData);
        imageUrl = res.data.imageUrl;
      } catch (err) {
        console.error('Image upload failed:', err);
        return;
      }
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
      date: '',
      image: undefined
    });
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
      date: post.date.split('T')[0],
      image: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancelEdit = () => {
    reset();
    setEditId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Post' : 'Create Post'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Title"
          {...register('title')}
          className="w-full border p-2 rounded"
        />
        {errors.title && <p className="text-red-500 text-sm">Title is required</p>}

        <textarea
          placeholder="Description"
          {...register('description')}
          className="w-full border p-2 rounded"
        />
        {errors.description && <p className="text-red-500 text-sm">Description is required</p>}

        <select {...register('status')} className="w-full border p-2 rounded">
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm">Status is required</p>}

        <input type="date" {...register('date')} className="w-full border p-2 rounded" />
        {errors.date && <p className="text-red-500 text-sm">Date is required</p>}

        <input
          type="file"
          {...register('image')}
          accept="image/*"
          ref={fileInputRef}
        />

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? 'Update' : 'Submit'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-2">Filters</h3>
      <div className="flex gap-4 mb-6">
        <select
          name="status"
          onChange={handleFilterChange}
          className="border p-2 rounded w-1/3"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          type="date"
          name="startDate"
          onChange={handleFilterChange}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="date"
          name="endDate"
          onChange={handleFilterChange}
          className="border p-2 rounded w-1/3"
        />
      </div>

      <h3 className="text-xl font-semibold mb-4">Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow-sm">
            <h4 className="text-lg font-bold">{post.title}</h4>
            <p>{post.description}</p>
            <p className="text-sm text-gray-600">Status: {post.status}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date(post.date).toLocaleDateString()}
            </p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="uploaded" className="mt-2 rounded w-32" />
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(post)}
                className="text-sm bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(post._id).then(fetchPosts)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
