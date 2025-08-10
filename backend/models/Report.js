import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    reason: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

reportSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);


