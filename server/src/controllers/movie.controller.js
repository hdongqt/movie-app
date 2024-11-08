import ResponseHandler from "../handlers/response.handler.js";
import MovieService from "./../services/movie.service.js";
import { Constants } from "../helpers/constants.js";
import COMMON_HELPERS from "../helpers/common.js";
import _ from "lodash";
import MovieCrawlService from "../services/crawl/movie.crawl.service.js";
import TransactionService from "../services/transaction.service.js";

const { RESPONSE_TYPE, STATUS } = Constants;

const MovieController = {};

MovieController.fetchAllMovies = async (req, res) => {
  try {
    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate({
        ...req.query,
        status: Constants.STATUS.ACTIVE,
      });
    const payload = await MovieService.fetchAllMovie(
      convertDataForPagination.pagination,
      convertDataForPagination.searchQuery
    );
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.fetchAllMoviesForAdmin = async (req, res) => {
  try {
    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate(req.query);
    const payload = await MovieService.fetchAllMovie(
      convertDataForPagination.pagination,
      convertDataForPagination.searchQuery
    );
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.getTrendingMovies = async (req, res) => {
  try {
    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate(req.query);
    const payload = await MovieService.getTrendingMovies(
      convertDataForPagination.pagination,
      convertDataForPagination.searchQuery
    );
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.getRecommendMovie = async (__, res) => {
  try {
    const payload = await MovieService.getRecommendMovie();
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const payload =
      req?.user && req.user.role === Constants.ROLE.ADMIN
        ? await MovieService.getMovieForAdmin(id)
        : await MovieService.getMovieForUser(id);
    if (!payload) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Phim không tồn tại",
      });
    }
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.getMovieOfPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate(req.query);
    const payload = await MovieService.getMovieOfPerson(
      convertDataForPagination.pagination,
      id
    );
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.createMovie = async (req, res) => {
  try {
    await TransactionService.start(async () => {
      const { episodes, persons, genres, countries } = req.body;
      let episodesParse = [],
        personsParse = [];
      if (episodes && episodes.length) {
        episodesParse = episodes.map((episode) => {
          if (episode) {
            return JSON.parse(episode);
          } else return { name: "", path: [] };
        });
      }
      if (persons && persons.length) {
        personsParse = persons.map((person) => person && JSON.parse(person));
      }

      const thumbnailFile = req?.files?.find(
        (file) => file.fieldname === "thumbnail"
      );
      const posterFile = req?.files?.find(
        (file) => file.fieldname === "poster"
      );
      const data = {
        ...req.body,
        genres: JSON.parse(genres),
        countries: JSON.parse(countries),
        episodes: episodesParse,
        persons: personsParse,
        thumbnailPath: thumbnailFile?.path || "",
        posterPath: posterFile?.path || "",
      };
      const movieSave = await MovieService.createMovie(data);
      ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.CREATED, {
        payload: movieSave,
      });
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.updateMovie = async (req, res) => {
  try {
    await TransactionService.start(async () => {
      const { id } = req.params;
      const { episodes, persons, genres, countries } = req.body;
      let episodesParse = [],
        personsParse = [];
      if (episodes && episodes.length) {
        episodesParse = episodes.map(
          (episode) => episode && JSON.parse(episode)
        );
      }
      if (persons && persons.length) {
        personsParse = persons.map((person) => person && JSON.parse(person));
      }

      const thumbnailFile = req?.files?.find(
        (file) => file.fieldname === "thumbnail"
      );
      const posterFile = req?.files?.find(
        (file) => file.fieldname === "poster"
      );
      const data = {
        ...req.body,
        genres: JSON.parse(genres),
        countries: JSON.parse(countries),
        episodes: episodesParse,
        persons: personsParse,
        thumbnailPath: thumbnailFile?.path || "",
        posterPath: posterFile?.path || "",
      };
      const movieSave = await MovieService.updateMovie(id, data);

      ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.CREATED, {
        payload: movieSave,
      });
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.deactivateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await MovieService.findOneByIdMovie(id);
    if (!movie) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Phim không tồn tại",
      });
    }
    if (movie.status === STATUS.INACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Phim đã ở trạng thái chưa phê duyệt",
      });
    }
    await MovieService.updateMovieStatus(movie, STATUS.INACTIVE);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Huỷ phê duyệt phim thành công",
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.activateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await MovieService.findOneByIdMovie(id);
    if (!movie) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Phim không tồn tại",
      });
    }
    if (movie.status === STATUS.ACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Phim đã được phê duyệt",
      });
    }
    await MovieService.updateMovieStatus(movie, STATUS.ACTIVE);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Phê duyệt phim thành công",
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.terminatedMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await MovieService.findOneByIdMovie(id);
    if (!movie) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Phim không tồn tại",
      });
    }
    await MovieService.updateMovieStatus(movie, STATUS.TERMINATED);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Xoá phim thành công",
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

MovieController.getSimilarMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movies = await MovieService.getSimilarMovie(id);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: movies,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

export default MovieController;
