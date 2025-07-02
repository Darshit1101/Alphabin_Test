import { Layout, Header, PostForm, Divider, PostFilters, PostList } from '../components';
import { usePosts } from '../hooks/usePosts';

export default function Home() {
  const {
    posts,
    filters,
    editId,
    setEditId,
    handleFilterChange,
    handlePostSubmit,
    handleEdit,
    handleDelete,
    getImageUrl
  } = usePosts();

  return (
    <Layout title="Post Management System">
      <Header />

      <PostForm
        editId={editId}
        setEditId={setEditId}
        onPostSubmit={handlePostSubmit}
        posts={posts}
      />

      <Divider />

      <PostFilters filters={filters} onFilterChange={handleFilterChange} />

      <PostList
        posts={posts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getImageUrl={getImageUrl}
      />
    </Layout>
  );
}
