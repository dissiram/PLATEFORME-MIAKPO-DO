import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
  status: { type: String, enum: ["En attente", "Acceptée", "Refusée"], default: "En attente" },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
