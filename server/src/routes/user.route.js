import express from "express";
import UserController from "../controllers/user.controller.js";
const router = express.Router({ mergeParams: true });
router.get("/", UserController.fetchAllUser);
router.get("/:id", UserController.getUser);
router.put("/:id", UserController.updateUser);
router.put("/activate/:id", UserController.activateUser);
router.put("/deactivate/:id", UserController.deactivateUser);

export default router;
