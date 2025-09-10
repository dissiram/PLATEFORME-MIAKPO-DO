import mongoose from "mongoose";

const OfferClickSchema = new mongoose.Schema(
  {
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    clickedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("OfferClick", OfferClickSchema);
