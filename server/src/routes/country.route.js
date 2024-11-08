import express from "express";
import CountryController from "../controllers/country.controller.js";
import { checkRoleAndStatus } from "../middlewares/role.middleware.js";
import { countryValidate } from "../validations/country.validation.js";
import { idValidate } from "../validations/id.validation.js";
import RequestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });
router.get("/", checkRoleAndStatus(), CountryController.fetchAllCountry);
router.get("/:id", CountryController.getCountry);
router.post(
  "/",
  [countryValidate, RequestHandler.validate],
  CountryController.createCountry
);
router.put(
  "/:id",
  [[...idValidate, ...countryValidate], RequestHandler.validate],
  CountryController.updateCountry
);
router.put("/activate/:id", CountryController.activateCountry);
router.put("/deactivate/:id", CountryController.deactivateCountry);

export default router;
