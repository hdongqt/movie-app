import { param } from "express-validator";

const idValidate = [
  param("id")
    .exists()
    .withMessage("Id là bắt buộc")
    .isMongoId()
    .withMessage("Id không hợp lệ"),
];

export { idValidate };
