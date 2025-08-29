import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  description: String
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  startDate: String,
  endDate: String
});

const skillSchema = new mongoose.Schema({
  name: String,
  progress: Number
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  github: String,
  liveDemo: String
});

const certificationSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  year: String
});

const languageSchema = new mongoose.Schema({
  name: String,
  progress: Number
});

const resumeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // lien avec l'utilisateur
  profileInfo: {
    fullName: String,
    designation: String,
    summary: String
  },
  contactInfo: {
    email: String,
    phone: String
  },
  workExperience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
  languages: [languageSchema],
  interests: [String],
  isPublic: { type: Boolean, default: false } // optionnel pour CV visibles publiquement
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
