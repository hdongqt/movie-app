import express from "express";
import PersonController from "./../controllers/person.controller.js";
import RequestHandler from "../handlers/request.handler.js";
import { idValidate } from "../validations/id.validation.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/:id",
  [idValidate, RequestHandler.validate],
  PersonController.getPerson
);

export default router;
