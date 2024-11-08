import { body, check } from "express-validator";
import { idValidate } from "./id.validation.js";

const createMovieValidation = [
  body("vietnameseName")
    .trim()
    .notEmpty()
    .withMessage("Tên phim (vietnameseName) không được để trống")
    .isLength({ max: 150 })
    .withMessage("Tên phim (vietnameseName) không quá 150 ký tự"),
  body("originalName")
    .trim()
    .notEmpty()
    .withMessage("Tên quốc tế (originalName) không được để trống")
    .isLength({ max: 150 })
    .withMessage("Tên quốc tế (originalName) không quá 150 ký tự"),
  body("movieType")
    .isIn(["tv", "single"])
    .withMessage("Loại phim (movieType) không hợp lệ"),
  check("genres").exists().withMessage("Chọn thể loại phim (genres)"),
  check("countries").exists().withMessage("Chọn quốc gia sản xuất (countries)"),
  body("overview")
    .trim()
    .notEmpty()
    .withMessage("Giới thiệu phim không được để trống"),
  check("episodes")
    .isArray({ min: 1 })
    .withMessage("Phải có ít nhất một tập phim")
    .custom((value) => {
      value &&
        value.forEach((episodeString, index) => {
          let episode;
          try {
            episode = JSON.parse(episodeString);
          } catch (error) {
            throw new Error(`Tập phim ở vị trí ${index + 1} không hợp lệ`);
          }
          if (!episode.name) {
            throw new Error(`Tên tập vị trí ${index + 1} không được trống`);
          }
          if (episode.path) {
            const urlPattern =
              /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\:[0-9]{1,5})?(\/.*)?$/;
            if (!urlPattern.test(episode.path)) {
              throw new Error(`Link tập vị trí ${index + 1} không hợp lệ`);
            }
          }
        });
      return true;
    }),
];

const updateMovieValidation = [...idValidate, createMovieValidation];

export { createMovieValidation, updateMovieValidation };
