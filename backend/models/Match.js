import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  talentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  matchedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Match", matchSchema);
