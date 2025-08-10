import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('Comment', commentSchema);


