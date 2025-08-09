import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

likeSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);


