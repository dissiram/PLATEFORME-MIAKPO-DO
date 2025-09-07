import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
  status: { type: String, default: "En attente" }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
