import { create } from 'zustand';
import axios from 'axios';

const usePostsStore = create((set) => ({
  posts: [],
  fetchPosts: async (filters = {}) => {
    const res = await axios.get('/api/posts', { params: filters });
    set({ posts: res.data });
  },
  createPost: async (data) => {
    await axios.post('/api/posts', data);
  },
  updatePost: async (id, data) => {
    await axios.put(`/api/posts/${id}`, data);
  },
  deletePost: async (id) => {
    await axios.delete(`/api/posts/${id}`);
  }
}));

export default usePostsStore;
