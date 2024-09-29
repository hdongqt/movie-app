import express from "express";
import PersonController from "./../controllers/person.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/:id", PersonController.getPerson);

export default router;
