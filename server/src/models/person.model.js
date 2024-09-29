import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Person",
  mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      status: { type: String, enum: ["active", "inactive"], default: "active" },
      movies: [
        {
          _id: false,
          movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
          nameCharacter: String,
          role: { type: String, enum: ["actor", "creator"], default: "actor" },
        },
      ],
    },
    modelOptions
  )
);
