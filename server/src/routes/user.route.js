import express from "express";
import UserController from "../controllers/user.controller.js";
const router = express.Router({ mergeParams: true });
import TokenMiddleware from "../middlewares/token.middleware.js";

router.get("/", UserController.fetchAllUser);
router.put(
  "/update-profile",
  TokenMiddleware.auth,
  UserController.updateProfile
);
router.get(
  "/favorites",
  TokenMiddleware.auth,
  UserController.fetchFavoriteMovies
);
router.post("/favorites", TokenMiddleware.auth, UserController.addFavorite);
router.delete(
  "/favorites/:id",
  TokenMiddleware.auth,
  UserController.deleteMovieFromFavorites
);
router.get("/:id", UserController.getUser);
router.put("/activate/:id", UserController.activateUser);
router.put("/deactivate/:id", UserController.deactivateUser);

export default router;
