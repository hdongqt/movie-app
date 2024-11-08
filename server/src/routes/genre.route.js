import express from "express";
import GenreController from "../controllers/genre.controller.js";
import { checkRoleAndStatus } from "../middlewares/role.middleware.js";
import RequestHandler from "../handlers/request.handler.js";
import {
  createGenreValidate,
  updateGenreValidate,
} from "../validations/genre.validation.js";

const router = express.Router({ mergeParams: true });
router.get("/", checkRoleAndStatus(), GenreController.fetchAllGenre);
router.get("/:id", GenreController.getGenre);
router.post(
  "/",
  [createGenreValidate, RequestHandler.validate],
  GenreController.createGenre
);
router.put(
  "/:id",
  [updateGenreValidate, RequestHandler.validate],
  GenreController.updateGenre
);
router.put("/activate/:id", GenreController.activateGenre);
router.put("/deactivate/:id", GenreController.deactivateGenre);

export default router;
