import mongoose from "mongoose";

const SocialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url:  { type: String, default: "" }
}, { _id: false });

const BlockSchema = new mongoose.Schema({
  type:    { type: String, enum: ["link", "image", "video", "text", "section"], required: true },
  title:   { type: String, default: "" },
  content: { type: String, default: "" }, // texte, URL, etc. (pour media: on mettra un fileId)
  color:   { type: String, default: "#ffffff" },

  // Grille (snap-to-grid friendly)
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  size: {
    w: { type: Number, default: 1 }, // nb de colonnes
    h: { type: Number, default: 1 }  // nb de rangées
  }
}, { _id: true, timestamps: true });

const PageSchema = new mongoose.Schema({
  slug:   { type: String, unique: true, index: true },
  name:   { type: String, required: true },
  desc:   { type: String, default: "" },
  // photo de profil: référence GridFS (optionnel)
  photoFileId: { type: String, default: "" },

  socials: [SocialSchema],
  blocks:  [BlockSchema],

//   PageSchema.index({ slug: 1 }, { unique: true });

  // multi-utilisateur si besoin
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  publishedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("Page", PageSchema);
