import _ from "lodash";
import COMMON_HELPERS from "../../helpers/common.js";
import Movie from "../../models/movie.model.js";
import axios from "axios";
import TransactionService from "../transaction.service.js";
import MovieService from "../movie.service.js";
import PersonService from "../person.service.js";
import { convertLinkToWebp } from "../../helpers/multerUpload.js";
const { handleSpecialChars } = COMMON_HELPERS;

const MovieCrawlService = {};
MovieCrawlService.Movie = Movie;

const createMovie = async (movie) => {
  return await TransactionService.start(async (session) => {
    const { persons, ...movieRest } = await MovieService.handleMovieCrawlData(
      movie
    );
    const { vietnameseName } = movieRest;
    const [movieSave] = await Movie.create(
      [{ ...movieRest, vietnameseName: vietnameseName.normalize("NFC") }],
      { session }
    );
    movieSave.set(
      "persons",
      await PersonService.createPersons(_.get(movieSave, "id"), persons)
    );
    return await movieSave.save({ session });
  });
};

MovieCrawlService.createMovie = createMovie;

MovieCrawlService.createMovies = async (data) => {
  if (data) {
    const asyncResults = [];
    let isError = false;
    for (const item of data) {
      try {
        const isExistMovie = await MovieService.findByOriginName(
          item.originalName
        );
        if (!isExistMovie) {
          const result = await createMovie(item);
          asyncResults.push(result);
        }
      } catch (error) {
        isError = true;
        console.error(`Error creating movie: ${item?.title}`, error);
      }
    }
    if (asyncResults.length < 1 && isError) throw new Error();
    return asyncResults;
  }
  return [];
};

MovieCrawlService.getDetailMovie = async (slug) => {
  const movie = await axios.get(`${process.env.OPHIM_LINK}/phim/${slug}`);
  const data = movie.data;
  const actors = _.get(data, "movie.actor[0]")
    ? data?.movie.actor.map((actorName) => {
        return {
          name: actorName,
          role: "actor",
        };
      })
    : [];
  const creators = _.get(data, "movie.director[0]")
    ? data?.movie.director.map((creatorName) => {
        return {
          name: creatorName,
          role: "creator",
        };
      })
    : [];
  const thumbHandler = await convertLinkToWebp(
    _.get(data, "movie.thumb_url", "")
  );
  const posterHandler = await convertLinkToWebp(
    _.get(data, "movie.poster_url", "")
  );
  return {
    movieType: _.get(data, "movie.tmdb.type") === "movie" ? "single" : "tv",
    originalName: _.get(data, "movie.origin_name", ""),
    vietnameseName: _.get(data, "movie.name", ""),
    overview: handleSpecialChars(_.get(data, "movie.content", "")),
    release: _.get(data, "movie.year", new Date().getFullYear()),
    thumbnailPath: thumbHandler,
    posterPath: posterHandler,
    totalRating: _.get(data, "movie.tmdb.vote_count", 0),
    averageRating: _.get(data, "movie.tmdb.vote_average", 0),
    countries: data?.movie
      ? data.movie.country.map((country) => country.name)
      : [],
    genres: data?.movie ? data.movie.category.map((genre) => genre.name) : [],
    episodes: _.get(data, "episodes[0].server_data")
      ? data.episodes[0].server_data.map((e) => {
          return {
            name: `Tập ${e.name}`,
            path: [e?.link_embed, e?.link_m3u8],
          };
        })
      : [],
    status: "active",
    url: slug,
    persons: [...actors, ...creators],
  };
};

export default MovieCrawlService;
