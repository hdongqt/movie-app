import { body } from "express-validator";

const createCommentValidate = [
  movieId,
  content,
  body("parentId")
    .optional()
    .isMongoId()
    .withMessage("Id trả lời (parentId) không hợp lệ"),
  body("movieId")
    .notEmpty()
    .withMessage("Id phim (movieId) bắt buộc")
    .isMongoId()
    .withMessage("Id phim (movieId) không hợp lệ"),
  body("content")
    .notEmpty()
    .withMessage("Nội dung bình luận (content) là bắt buộc")
    .isLength({ max: 250 })
    .withMessage("Nội dung bình luận không được vượt quá 250 kí tự"),
];

export { createCommentValidate };
