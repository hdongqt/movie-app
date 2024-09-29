import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Crawl",
  mongoose.Schema(
    {
      status: {
        type: String,
        enum: ["crawling", "complete", "error"],
        default: "crawling",
      },
      info: String,
      movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
      finishedAt: { type: Date, default: null },
    },
    modelOptions
  )
);
