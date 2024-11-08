import express from "express";
import MovieController from "./../controllers/movie.controller.js";
import TokenMiddleware from "../middlewares/token.middleware.js";
import multerUpload from "./../helpers/multerUpload.js";
import {
  createMovieValidation,
  updateMovieValidation,
} from "../validations/movie.validation.js";
import RequestHandler from "../handlers/request.handler.js";
const router = express.Router({ mergeParams: true });

router.get("/recommend", MovieController.getRecommendMovie);
router.get("/trending", MovieController.getTrendingMovies);
router.get("/similar/:id", MovieController.getSimilarMovie);
router.get("/", MovieController.fetchAllMovies);
router.get("/person/:id", MovieController.getMovieOfPerson);
router.get("/create", MovieController.createMovie);
router.put("/activate/:id", MovieController.activateMovie);
router.put("/deactivate/:id", MovieController.deactivateMovie);
router.delete("/terminated/:id", MovieController.terminatedMovie);
router.get("/get-for-admin", MovieController.fetchAllMoviesForAdmin);
router.get(
  "/get-for-admin/:id",
  TokenMiddleware.auth,
  MovieController.getMovie
);
router.get("/:id", MovieController.getMovie);
router.post(
  "/",
  [multerUpload.any(), createMovieValidation, RequestHandler.validate],
  MovieController.createMovie
);
router.put(
  "/:id",
  [multerUpload.any(), updateMovieValidation, RequestHandler.validate],
  MovieController.updateMovie
);

export default router;
