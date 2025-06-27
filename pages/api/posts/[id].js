import connectDB from '../../../lib/mongodb';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const updated = await Post.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted' });
  }
}
