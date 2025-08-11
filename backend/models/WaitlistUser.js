import mongoose from 'mongoose';

const WaitlistUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('WaitlistUser', WaitlistUserSchema);


