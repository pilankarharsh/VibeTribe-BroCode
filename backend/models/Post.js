import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, required: true },
    mediaUrls: { type: [String], default: [] },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    reportsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Performance indexes for feed queries
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ createdAt: -1, reportsCount: 1 });
postSchema.index({ likeCount: -1, createdAt: -1 });
postSchema.index({ reportsCount: 1, likeCount: -1, createdAt: -1 });

export default mongoose.model('Post', postSchema);


