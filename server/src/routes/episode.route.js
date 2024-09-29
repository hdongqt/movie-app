import express from "express";
import EpisodeController from "../controllers/episode.controller.js";
import { checkRoleAndStatus } from "../middlewares/role.middleware.js";
const router = express.Router({ mergeParams: true });
router.get("/", checkRoleAndStatus(), EpisodeController.fetchAllEpisode);
router.get("/:id", EpisodeController.getEpisode);
router.post("/", EpisodeController.createEpisode);
router.put("/:id", EpisodeController.updateEpisode);
export default router;
