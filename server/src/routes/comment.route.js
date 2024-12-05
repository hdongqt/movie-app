import express from "express";
import CommentController from "../controllers/comment.controller.js";
import TokenMiddleware from "../middlewares/token.middleware.js";
const router = express.Router({ mergeParams: true });
router.get("/movie/:movieId", CommentController.fetchAllComment);
router.delete(
  "/terminated/:id",
  TokenMiddleware.auth,
  CommentController.terminatedComment
);
router.post("/", TokenMiddleware.auth, CommentController.createComment);

export default router;
