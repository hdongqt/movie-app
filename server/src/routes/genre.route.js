import express from "express";
import GenreController from "../controllers/genre.controller.js";
import TokenMiddleware from "../middlewares/token.middleware.js";
import RequestHandler from "../handlers/request.handler.js";
import {
  createGenreValidate,
  updateGenreValidate,
} from "../validations/genre.validation.js";

const router = express.Router({ mergeParams: true });
router.get("/", GenreController.fetchAllGenre);
router.get("/:id", GenreController.getGenre);
router.post(
  "/",
  [TokenMiddleware.checkIsAdmin, createGenreValidate, RequestHandler.validate],
  GenreController.createGenre
);
router.put(
  "/:id",
  [TokenMiddleware.checkIsAdmin, updateGenreValidate, RequestHandler.validate],
  GenreController.updateGenre
);
router.put(
  "/activate/:id",
  TokenMiddleware.checkIsAdmin,
  GenreController.activateGenre
);
router.put(
  "/deactivate/:id",
  TokenMiddleware.checkIsAdmin,
  GenreController.deactivateGenre
);

export default router;
