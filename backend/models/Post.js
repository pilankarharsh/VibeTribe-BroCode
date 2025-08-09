import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, required: true },
    media_urls: { type: [String], default: [] },
    like_count: { type: Number, default: 0 },
    comment_count: { type: Number, default: 0 },
    reports_count: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Post', postSchema);


