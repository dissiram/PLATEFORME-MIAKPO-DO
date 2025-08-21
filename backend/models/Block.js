// models/Block.js
import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "image", "video"],
    required: true,
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  size: {
    width: { type: Number, default: 200 },
    height: { type: Number, default: 200 },
  },
  content: {
    type: String, // texte ou URL (ex: image uploadée)
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("Block", blockSchema);
