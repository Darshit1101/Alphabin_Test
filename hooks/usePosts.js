import { useState, useEffect } from 'react';
import usePostsStore from '../store/usePostsStore';

export function usePosts() {
  const { posts, fetchPosts, createPost, updatePost, deletePost } = usePostsStore();
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPosts(filters);
  }, [filters, fetchPosts]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePostSubmit = async (postData, editId) => {
    if (editId) {
      await updatePost(editId, postData);
      setEditId(null);
    } else {
      await createPost(postData);
    }
    await fetchPosts(filters);
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    // Scroll to top to show the edit form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    await fetchPosts(filters);
  };

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

  return {
    posts,
    filters,
    editId,
    setEditId,
    handleFilterChange,
    handlePostSubmit,
    handleEdit,
    handleDelete,
    getImageUrl
  };
}
