import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["user","announcer","admin"], default: "user" },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" }
}, { timestamps: true });

// Hash password avant save
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Comparer password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
