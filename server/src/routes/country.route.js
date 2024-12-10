import express from "express";
import CountryController from "../controllers/country.controller.js";
import TokenMiddleware from "../middlewares/token.middleware.js";
import { countryValidate } from "../validations/country.validation.js";
import { idValidate } from "../validations/id.validation.js";
import RequestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });
router.get(
  "/",
  TokenMiddleware.checkIsAdmin,
  CountryController.fetchAllCountry
);
router.get("/:id", CountryController.getCountry);
router.post(
  "/",
  [TokenMiddleware.checkIsAdmin, countryValidate, RequestHandler.validate],
  CountryController.createCountry
);
router.put(
  "/:id",
  [
    TokenMiddleware.checkIsAdmin,
    [...idValidate, ...countryValidate],
    RequestHandler.validate,
  ],
  CountryController.updateCountry
);
router.put(
  "/activate/:id",
  TokenMiddleware.checkIsAdmin,
  CountryController.activateCountry
);
router.put(
  "/deactivate/:id",
  TokenMiddleware.checkIsAdmin,
  CountryController.deactivateCountry
);

export default router;
