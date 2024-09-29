import express from "express";
import CountryController from "../controllers/country.controller.js";
import { checkRoleAndStatus } from "../middlewares/role.middleware.js";

const router = express.Router({ mergeParams: true });
router.get("/", checkRoleAndStatus(), CountryController.fetchAllCountry);
router.get("/:id", CountryController.getCountry);
router.post("/", CountryController.createCountry);
router.put("/:id", CountryController.updateCountry);
router.put("/activate/:id", CountryController.activateCountry);
router.put("/deactivate/:id", CountryController.deactivateCountry);

export default router;
