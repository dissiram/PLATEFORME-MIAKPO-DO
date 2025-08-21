import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  type: { type: String, enum: ["text", "image", "video", "link", "section"], required: true },
  title: { type: String },
  content: { type: String },
  color: { type: String },
  size: {
    width: { type: Number, default: 300 },
    height: { type: Number, default: 150 }
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  }
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  photo: { type: String },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  blocks: [blockSchema]
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);
