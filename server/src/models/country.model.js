import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Country",
  mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      movies: [
        {
          type: Schema.Types.ObjectId,
          ref: "Movie",
        },
      ],
      status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    modelOptions
  )
);
