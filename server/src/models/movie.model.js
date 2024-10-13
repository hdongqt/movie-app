import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";
import Country from "./country.model.js";
import Genre from "./genre.model.js";
import COMMON_HELPERS from "../helpers/common.js";
const Movie = mongoose.Schema(
  {
    movieType: {
      type: String,
      enum: ["tv", "single"],
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    vietnameseName: {
      type: String,
    },
    overview: String,
    url: {
      type: String,
      require: true,
      unique: true,
    },
    release: Number,
    thumbnailPath: String,
    posterPath: String,
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    persons: [{ type: Schema.Types.ObjectId, ref: "Person" }],
    countries: [{ type: Schema.Types.ObjectId, ref: "Country" }],
    genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
    status: {
      type: String,
      enum: ["reviewing", "active", "inactive", "terminated"],
      default: "reviewing",
    },
    episodes: [{ type: Schema.Types.ObjectId, ref: "Episode" }],
  },
  modelOptions
);

export default mongoose.model("Movie", Movie);
