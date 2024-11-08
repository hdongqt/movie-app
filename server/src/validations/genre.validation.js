import { body } from "express-validator";
import { idValidate } from "./id.validation.js";

const createGenreValidate = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Tên thể loại (name) là bắt buộc")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Tên thể loại có ít nhất 1 ký tự và không quá 50 ký tự"),
];

const updateGenreValidate = [
  ...idValidate,
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Tên thể loại (name) là bắt buộc")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Tên thể loại có ít nhất 1 ký tự và không quá 50 ký tự"),
];

export { createGenreValidate, updateGenreValidate };
