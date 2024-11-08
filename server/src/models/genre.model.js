import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Genre",
  mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
      },
      // movies: [
      //   {
      //     type: Schema.Types.ObjectId,
      //     ref: "Movie",
      //   },
      // ],
      status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    modelOptions
  )
);
