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

export default mongoose.model('Post', postSchema);


