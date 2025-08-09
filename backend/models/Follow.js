import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
  {
    follower_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followed_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

followSchema.index({ follower_id: 1, followed_id: 1 }, { unique: true });

export default mongoose.model('Follow', followSchema);


