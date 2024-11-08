import express from "express";
import CrawlController from "../controllers/crawl.controller.js";
import { body } from "express-validator";
const router = express.Router({ mergeParams: true });

router.get("/", CrawlController.fetchAllCrawls);
router.post(
  "/",
  [
    body("page")
      .exists({ checkFalsy: true })
      .withMessage("Trang crawl không hợp lệ")
      .isInt({ gt: 0 })
      .withMessage("Trang crawl phải là một số nguyên dương"),
  ],
  CrawlController.createCrawl
);
router.get("/:id", CrawlController.getCrawl);

export default router;
