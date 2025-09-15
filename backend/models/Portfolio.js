import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  content: { type: String, default: "" },
  size: { type: String, default: "medium" },
  bgColor: { type: String, default: "bg-white" },
});

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ lien avec utilisateur
  title: { type: String, required: true },
  profile: {
    name: { type: String, default: "" },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  blocks: [blockSchema],
  public: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);
