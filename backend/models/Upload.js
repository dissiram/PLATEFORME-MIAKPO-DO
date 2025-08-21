import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video", "document"], required: true }
}, { timestamps: true });

export default mongoose.model("Upload", uploadSchema);
