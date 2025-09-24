import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "announcer", "admin"], default: "user" },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
