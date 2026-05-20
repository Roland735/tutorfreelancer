import mongoose from "mongoose";

const PlatformContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PlatformContent ||
  mongoose.model("PlatformContent", PlatformContentSchema);
