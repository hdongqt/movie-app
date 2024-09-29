import express from "express";
import CrawlController from "../controllers/crawl.controller.js";
const router = express.Router({ mergeParams: true });

router.get("/", CrawlController.fetchAllCrawls);
router.post("/", CrawlController.createCrawl);
router.get("/:id", CrawlController.getCrawl);

export default router;
