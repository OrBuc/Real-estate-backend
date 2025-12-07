import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, enum: ["available", "sold", "זמין", "נמכר"], default: "available" },
  image: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model("Property", propertySchema);
