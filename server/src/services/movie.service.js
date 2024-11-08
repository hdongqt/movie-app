import ResponseHandler from "../handlers/response.handler.js";
import Movie from "../models/movie.model.js";
import { Constants } from "../helpers/constants.js";
import _ from "lodash";
import COMMON_HELPERS from "../helpers/common.js";
import mongoose from "mongoose";
import TransactionService from "./transaction.service.js";
import CountryService from "./country.service.js";
import GenreService from "./genre.service.js";
import EpisodeService from "./episode.service.js";
import PersonService from "./person.service.js";

const { RESPONSE_TYPE, MOVIE_TYPE } = Constants;
const MovieService = {};

MovieService.Movie = Movie;

MovieService.fetchAllMovie = async (paginationOptions, params) => {
  const { status, genre, searchBy, sortBy, year, keyword } = params;
  const matchOption = {};
  if (genre) {
    matchOption["genres.id"] = {
      $in: genre
        .split(",")
        .map((id) => mongoose.Types.ObjectId.createFromHexString(id)),
    };
  }
  const yearInt = _.parseInt(year);
  if (yearInt) {
    matchOption.release = yearInt;
  }
  if (status) matchOption.status = status;
  else matchOption.status = { $ne: "terminated" };
  if (searchBy) {
    switch (searchBy) {
      case MOVIE_TYPE.SINGLE:
        matchOption.movieType = MOVIE_TYPE.SINGLE;
        break;
      case Constants.MOVIE_TYPE.TV:
        matchOption.movieType = MOVIE_TYPE.TV;
        break;
      default:
        break;
    }
  }
  if (keyword)
    matchOption.$or = [
      { vietnameseName: { $regex: `.*${keyword}.*`, $options: "i" } },
      { originalName: { $regex: `.*${keyword}.*`, $options: "i" } },
    ];
  let queryOp = [
    {
      $lookup: {
        from: "genres",
        localField: "genres",
        foreignField: "_id",
        as: "genres",
      },
    },
    {
      $addFields: {
        genres: {
          $map: {
            input: "$genres",
            as: "genre",
            in: {
              id: "$$genre._id",
              name: "$$genre.name",
              status: "$$genre.status",
            },
          },
        },
      },
    },
    {
      $match: {
        ...matchOption,
      },
    },
    {
      $unset: ["episodes", "persons", "countries", "genres", "releaseYear"],
    },
  ];

  return await COMMON_HELPERS.paginateData({
    model: Movie,
    queryOptions: queryOp,
    paginationOptions: paginationOptions,
    sortBy: sortBy,
  });
};

MovieService.findOneByIdMovie = async (id) => {
  return await Movie.findOne({
    _id: id,
    status: { $ne: "terminated" },
  });
};

MovieService.findByOriginName = async (originName) => {
  return await Movie.findOne({
    originalName: originName,
    status: { $ne: "terminated" },
  });
};

MovieService.getTrendingMovies = async (paginationOptions) => {
  let queryOp = [
    {
      $match: {
        status: "active",
        createdAt: {
          $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $sort: { averageRating: -1, totalRating: -1 },
    },
  ];
  return await COMMON_HELPERS.paginateData({
    model: Movie,
    queryOptions: queryOp,
    paginationOptions: paginationOptions,
    select: "-episodes -persons -countries -genres",
  });
};

MovieService.getRecommendMovie = async () => {
  const genres = await Movie.aggregate([
    { $match: { status: "active" } },
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        count: { $sum: 1 },
        movies: { $addToSet: "$_id" },
      },
    },
    { $match: { count: { $gte: 3 } } },
    { $sample: { size: 10 } },
    { $unset: ["movies"] },
  ]);
  if (!genres || genres.length === 0)
    return await Movie.find({
      status: "active",
    })
      .select("-episodes -persons -countries -genres")
      .limit(2);
  const listIdGenres = genres.map(async (item) => {
    return await Movie.aggregate([
      { $match: { genres: item._id, status: "active" } },
      {
        $lookup: {
          from: "genres",
          localField: "genres",
          foreignField: "_id",
          as: "genres",
        },
      },
      {
        $addFields: {
          id: "$_id",
          genres: {
            $map: {
              input: "$genres",
              as: "genre",
              in: {
                id: "$$genre._id",
                name: "$$genre.name",
                status: "$$genre.status",
              },
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      { $unset: ["episodes", "persons", "countries", "_id", "-genres"] },
    ]);
  });
  const result = await Promise.all(listIdGenres);
  if (!result || result.length < 1) return [];
  const mergedResult = result.flat();
  const uniqueList = _.uniqBy(mergedResult, "id");
  return _.slice(uniqueList, 0, 15);
};

MovieService.getSimilarMovie = async (id) => {
  const movie = await Movie.findOne({
    _id: mongoose.Types.ObjectId.createFromHexString(id),
  });
  let result = [];
  if (movie) {
    if (
      movie?.originalName &&
      movie.originalName.toLowerCase().includes("(season")
    ) {
      const nameFind = movie.originalName
        .toLowerCase()
        .split("(season")[0]
        .trim();
      result = await Movie.find({
        originalName: new RegExp(nameFind, "i"),
      }).select("-episodes -persons -countries -genres");
    }
    const genreIds = _.get(movie, "genres");
    const typeOfMovie = _.get(movie, "movieType");
    const resultIds = result.map((movie) => movie._id);
    const similarGenre = await Movie.aggregate([
      {
        $match: {
          _id: {
            $ne: mongoose.Types.ObjectId.createFromHexString(id),
            $nin: resultIds,
          },
          status: "active",
          genres: {
            $in: genreIds,
          },
          movieType: typeOfMovie,
        },
      },
      {
        $addFields: {
          id: "$_id",
        },
      },
      {
        $unset: ["episodes", "persons", "countries", "_id", "genres"],
      },
      { $sort: { createdAt: -1 } },
      { $limit: 30 },
    ]);
    return _.slice([...result, ...similarGenre], 0, 5);
  }
  return [];
};

MovieService.getMovieForUser = async (idMovie) => {
  const movie = await Movie.findOne({
    _id: idMovie,
    status: { $ne: "terminated" },
  })
    .populate({
      path: "persons",
    })
    .populate({
      path: "genres",
      select: "-movies",
    })
    .populate({
      path: "countries",
      select: "-movies",
    })
    .populate({
      path: "episodes",
      select: "-movies",
    });
  return await COMMON_HELPERS.transformMovies(movie, false);
};

MovieService.getMovieForAdmin = async (idMovie) => {
  const movie = await Movie.findOne({
    _id: idMovie,
    status: { $ne: "terminated" },
  })
    .populate({
      path: "persons",
    })
    .populate({
      path: "genres",
      select: "-movies",
    })
    .populate({
      path: "countries",
      select: "-movies",
    })
    .populate({
      path: "episodes",
      select: "-movies",
    });
  return await COMMON_HELPERS.transformMovies(movie, true);
};

MovieService.getMovieOfPerson = async (paginationOptions, idPerson) => {
  const select = "-persons -episodes -countries -genres";
  const queryOp = {
    persons: mongoose.Types.ObjectId.createFromHexString(idPerson),
    status: "active",
  };
  const populate = {
    path: "genres",
    select: "-movies",
  };
  return await COMMON_HELPERS.paginateData({
    model: Movie,
    queryOptions: queryOp,
    paginationOptions: paginationOptions,
    select: select,
    populate: populate,
  });
};

MovieService.createMovie = async (movie) => {
  const session = TransactionService.getSession();
  const { persons, ...movieRest } = await MovieService.handleMovieDataForm(
    movie
  );
  const [movieSave] = await Movie.create([movieRest], { session });
  movieSave.set(
    "persons",
    await PersonService.createPersons(_.get(movieSave, "id"), persons)
  );
  const movieResult = await movieSave.save({ session });
  return movieResult;
};

MovieService.updateMovie = async (id, movie) => {
  try {
    const session = TransactionService.getSession();
    if (!session) {
      throw new Error("Transaction không tồn tại");
    }

    const movieFind = await MovieService.Movie.findById(id);
    if (!movieFind) {
      throw new Error("Phim không tồn tại");
    }

    const { isChangeThumbnail, isChangePoster, thumbnailPath, posterPath } =
      movie;

    Object.assign(movieFind, {
      overview: movie.overview,
      movieType: movie.movieType,
      vietnameseName: movie.vietnameseName,
      originalName: movie.originalName,
      countries: movie.countries,
      genres: movie.genres,
      release: movie.release,
      episodesNew: movie.episodes,
      personsNew: movie.persons,
      thumbnailPath: JSON.parse(isChangeThumbnail)
        ? thumbnailPath
        : movieFind.thumbnailPath,
      posterPath: JSON.parse(isChangePoster)
        ? posterPath
        : movieFind.posterPath,
    });

    const movieHandle = await MovieService.handleMovieDataForm(movieFind);
    const movieResult = await movieHandle.save({ session });
    return movieResult;
  } catch (error) {
    throw error;
  }
};
MovieService.updateMovieStatus = async (movie, status) => {
  Object.assign(movie, {
    status: status,
  });
  const movieSave = await movie.save();
  return {
    ...movieSave._doc,
    id: movieSave.id,
  };
};

MovieService.handleMovieCrawlData = async (movie) => {
  movie.countries = await CountryService.saveNewListCountries(movie?.countries);
  movie.genres = await GenreService.createGenres(movie?.genres);
  movie.episodes = await EpisodeService.createEpisodes(movie?.episodes);
  return movie;
};

MovieService.handleMovieDataForm = async (movie) => {
  const { countries, genres, personsNew, episodes, id, episodesNew } = movie;

  //check ids country,
  const existingCountries = await CountryService.Country.find({
    _id: { $in: countries },
  });
  const existingCountryIds = existingCountries.map((country) => country.id);
  const nonExistingCountries = countries.filter(
    (id) => !existingCountryIds.includes(id.toString())
  );
  //check ids genre
  const existingGenres = await GenreService.Genre.find({
    _id: { $in: genres },
  });

  const existingGenreIds = existingGenres.map((genre) => genre.id);
  const nonExistingGenres = genres.filter(
    (id) => !existingGenreIds.includes(id.toString())
  );
  //handle error message
  if (nonExistingGenres.length || nonExistingCountries.length) {
    let message = nonExistingGenres.length
      ? `Thể loại ${nonExistingGenres} không hợp lệ\n`
      : "";
    if (nonExistingCountries.length)
      message = `${message}Quốc gia ${nonExistingCountries} không hợp lệ`;
    throw ResponseHandler.generateError(RESPONSE_TYPE.BAD_REQUEST, message);
  }
  //handle episode of movie
  // if update delete all episode of movie before add new
  if (id) {
    await EpisodeService.deleteByIds(episodes);
    movie.episodes = await EpisodeService.createEpisodes(episodesNew);
    await PersonService.deleteByIds(id);
    await PersonService.createPersons(id, personsNew);
  } else movie.episodes = await EpisodeService.createEpisodes(episodes);
  return movie;
};

export default MovieService;
