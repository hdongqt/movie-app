import express from "express";
import CrawlController from "../controllers/crawl.controller.js";
import TokenMiddleware from "../middlewares/token.middleware.js";
import { body } from "express-validator";
const router = express.Router({ mergeParams: true });

router.get("/", TokenMiddleware.checkIsAdmin, CrawlController.fetchAllCrawls);
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
router.get("/:id", TokenMiddleware.checkIsAdmin, CrawlController.getCrawl);

export default router;
