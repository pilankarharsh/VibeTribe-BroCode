import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
  {
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

followSchema.index({ followerId: 1, followedId: 1 }, { unique: true });
// Performance index for feed queries
followSchema.index({ followerId: 1 });

export default mongoose.model('Follow', followSchema);


