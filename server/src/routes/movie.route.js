import express from "express";
import MovieController from "./../controllers/movie.controller.js";
import TokenMiddleware from "../middlewares/token.middleware.js";
import multerUpload from "./../helpers/multerUpload.js";

const router = express.Router({ mergeParams: true });

router.get("/recommend", MovieController.getRecommendMovie);
router.get("/trending", MovieController.getTrendingMovies);
router.get("/similar/:id", MovieController.getSimilarMovie);
router.get("/get-for-user", MovieController.fetchAllMovies);
router.get("/person/:id", MovieController.getMovieOfPerson);
router.get("/create", MovieController.createMovie);
router.put("/activate/:id", MovieController.activateMovie);
router.put("/deactivate/:id", MovieController.deactivateMovie);
router.delete("/terminated/:id", MovieController.terminatedMovie);
router.get(
  "/get-for-admin/:id",
  TokenMiddleware.auth,
  MovieController.getMovie
);
router.get("/:id", MovieController.getMovie);
router.get("/get-for-admin", MovieController.fetchAllMoviesForAdmin);
router.post("/", multerUpload.any(), MovieController.createMovie);
router.put("/:id", multerUpload.any(), MovieController.updateMovie);

export default router;
