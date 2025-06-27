import connectDB from '../../../lib/mongodb';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const { status, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const posts = await Post.find(filter);
    res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const newPost = await Post.create(req.body);
    res.status(201).json(newPost);
  }
}
