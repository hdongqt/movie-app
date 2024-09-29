import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Episode",
  mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      path: {
        type: String,
      },
      status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    modelOptions
  )
);
