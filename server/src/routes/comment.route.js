import express from "express";
import CommentController from "../controllers/comment.controller.js";
import TokenMiddleware from "../middlewares/token.middleware.js";
const router = express.Router({ mergeParams: true });
router.get("/movie/:movieId", CommentController.fetchAllComment);
router.post("/", TokenMiddleware.auth, CommentController.createComment);
// router.put("/deactivate/:id", CommentController.deactivateGenre);

export default router;
