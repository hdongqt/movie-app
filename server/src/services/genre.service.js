import responseHandler from "../handlers/response.handler.js";
import Genre from "../models/genre.model.js";
import Movie from "../models/movie.model.js";
import { Constants } from "../helpers/constants.js";
import _ from "lodash";
const { RESPONSE_TYPE } = Constants;
import COMMON_HELPERS from "../helpers/common.js";
import TransactionService from "./transaction.service.js";

const GenreService = {};

GenreService.Genre = Genre;

GenreService.findById = async (id) => {
  return await Genre.findById(id);
};

GenreService.fetchAllGenre = async (paginationOptions, payload) => {
  const { status = Constants.STATUS.ACTIVE, keyword, sortBy } = payload;
  const select = "-movies";
  let queryOp = {};
  if (status) queryOp.status = status;
  if (keyword) queryOp.name = { $regex: new RegExp(keyword, "i") };
  return await COMMON_HELPERS.paginateData({
    model: Genre,
    queryOptions: queryOp,
    paginationOptions: paginationOptions,
    select: select,
    sortBy: sortBy,
  });
};

GenreService.getGenre = async (id) => {
  const genre = await Genre.findById(id);
  if (!genre) {
    return null;
  }
  return genre.toJSON();
};

GenreService.createGenre = async (payload) => {
  const { name } = payload;
  const genre = new Genre({
    name: name,
  });
  const genreSave = await genre.save();
  return {
    ...genreSave._doc,
    id: genreSave.id,
  };
};

GenreService.updateGenre = async (genre, payload) => {
  const { name } = payload;
  Object.assign(genre, { name });
  const genreSave = await genre.save();
  return {
    ...genreSave._doc,
    id: genreSave.id,
  };
};

GenreService.updateGenreStatus = async (genre, status) => {
  Object.assign(genre, {
    status: status,
  });
  const genreSave = await genre.save();
  return _.omit(
    {
      ...genreSave._doc,
      id: genreSave.id,
    },
    ["_id"]
  );
};

GenreService.createGenres = async (listGenres) => {
  const session = TransactionService.getSession();
  if (listGenres) {
    let genreIds = [];
    for (const genreName of listGenres) {
      let genre =
        (await Genre.findOne({
          name: { $regex: new RegExp("^" + genreName + "$", "i") },
        })) || (await Genre.create([{ name: genreName }], { session }))[0];
      genreIds.push(genre._id);
    }
    return genreIds;
  }
  return [];
};

GenreService.getIdOfListName = async (listNames) => {
  var regexNames = listNames.map((name) => new RegExp(name, "i"));
  const data = await Genre.find({ name: { $in: regexNames } });
  if (!data) return null;
  return data.map((g) => g.id);
};

export default GenreService;
