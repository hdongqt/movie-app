import express from "express";
import MovieRoute from "./movie.route.js";
import CountryRoute from "./country.route.js";
import GenreRoute from "./genre.route.js";
import PersonRoute from "./person.route.js";
import CrawlRoute from "./crawl.route.js";
import UserRoute from "./user.route.js";
import CommentRoute from "./comment.route.js";
import AuthRoute from "./auth.route.js";

const router = express.Router();

router.use("/movies", MovieRoute);
router.use("/countries", CountryRoute);
router.use("/genres", GenreRoute);
router.use("/persons", PersonRoute);
router.use("/users", UserRoute);
router.use("/crawls", CrawlRoute);
router.use("/comments", CommentRoute);
router.use("/auth", AuthRoute);

export default router;
