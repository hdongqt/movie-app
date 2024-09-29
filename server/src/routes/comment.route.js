import express from "express";
import CommentController from "../controllers/comment.controller.js";
import { checkRoleAndStatus } from "../middlewares/role.middleware.js";
import TokenMiddleware from "../middlewares/token.middleware.js";
const router = express.Router({ mergeParams: true });
router.get("/movie/:movieId", CommentController.fetchAllComment);
// router.get("/:id", CommentController.getGenre);
// router.post("/", CommentController.createGenre);
router.post("/", TokenMiddleware.auth, CommentController.createComment);
// router.put("/activate/:id", CommentController.activateGenre);
// router.put("/deactivate/:id", CommentController.deactivateGenre);

export default router;
