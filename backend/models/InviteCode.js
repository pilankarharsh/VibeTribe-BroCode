import mongoose from "mongoose";

const inviteCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    isUsed: { type: Boolean, default: false },
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    intendedFor: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("InviteCode", inviteCodeSchema);