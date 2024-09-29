import mongoose from "mongoose";
import modelOptions from "./model.options.js";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  modelOptions
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("RefreshToken", refreshTokenSchema);
