import { body } from "express-validator";

const signUpValidate = [
  body("email").trim().exists().isEmail().withMessage("Email không hợp lệ"),
  body("displayName")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Tên hiển thị (displayName) cần có ít nhất 5 kí tự")
    .bail()
    .notEmpty()
    .withMessage("Tên hiển thị (displayName) không hợp lệ"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Mật khẩu (password) cần ít nhẩt 8 kí tự")
    .bail()
    .notEmpty()
    .withMessage("Mật khẩu (password) không hợp lệ"),
];

const signInValidate = [
  body("email").trim().exists().isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Mật khẩu (password) cần ít nhẩt 8 kí tự")
    .bail()
    .notEmpty()
    .withMessage("Mật khẩu (password) không hợp lệ"),
];

export { signUpValidate, signInValidate };
