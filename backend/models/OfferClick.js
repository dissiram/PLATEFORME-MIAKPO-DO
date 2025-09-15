// models/OfferClick.js
const OfferClickSchema = new mongoose.Schema(
  {
    offer: {  
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