import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String },
    avatarUrl: { type: String },
    bio: { type: String },
    verified: { type: Boolean, default: false },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
