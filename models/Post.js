import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  date: Date,
  imageUrl: String
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
