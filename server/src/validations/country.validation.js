import { body } from "express-validator";

const countryValidate = [
  body("name")
    .trim()
    .exists()
    .withMessage("Tên quốc gia (name) không hợp lệ")
    .notEmpty()
    .withMessage("Tên quốc gia (name) không hợp lệ"),
];

export { countryValidate };
