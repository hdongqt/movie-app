import express from "express";
import { checkRoleAndStatus } from "../middlewares/role.middleware.js";
import AuthController from "./../controllers/auth.controller.js";
import TokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.post("/signup", checkRoleAndStatus(), AuthController.SignUp);
router.post("/logout", TokenMiddleware.auth, AuthController.LogOut);
router.post("/signin", AuthController.SignIn);
router.get("/info", TokenMiddleware.auth, AuthController.GetInfo);
router.post("/refreshtoken", AuthController.RefreshToken);

export default router;
