import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Comment",
  mongoose.Schema(
    {
      content: {
        type: String,
        require: true,
        maxLength: 250,
      },
      user: { type: Schema.Types.ObjectId, ref: "User" },
      parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
      },
      replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
      movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
      status: { type: String, enum: ["active", "inactive"], default: "active" },
    },

    modelOptions
  )
);
