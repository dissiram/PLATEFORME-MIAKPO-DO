import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  budget: { type: Number },
  skillsRequired: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
