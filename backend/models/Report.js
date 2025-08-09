import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    reason: { type: String, default: null }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

reportSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);


