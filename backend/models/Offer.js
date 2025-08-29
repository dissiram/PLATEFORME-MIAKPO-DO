import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  category: String,
  contractType: String,
  location: String,
  salary: String,
  skills: String,
  deadline: Date,
  image: String,
  attachments: [String],
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
