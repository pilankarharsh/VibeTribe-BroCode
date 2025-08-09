import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    display_name: { type: String },
    avatar_url: { type: String },
    bio: { type: String },
    verified: { type: Boolean, default: false },
    followers_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model("User", userSchema);
