import express from "express";
import AuthController from "./../controllers/auth.controller.js";
import TokenMiddleware from "../middlewares/token.middleware.js";
import RequestHandler from "../handlers/request.handler.js";
import {
  signUpValidate,
  signInValidate,
} from "../validations/auth.validation.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/signup",
  [signUpValidate, RequestHandler.validate],
  AuthController.SignUp
);
router.post("/logout", TokenMiddleware.auth, AuthController.LogOut);
router.post(
  "/signin",
  [signInValidate, RequestHandler.validate],
  AuthController.SignIn
);
router.get("/info", TokenMiddleware.auth, AuthController.GetInfo);
router.post("/refreshtoken", AuthController.RefreshToken);

export default router;
