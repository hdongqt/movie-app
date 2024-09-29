import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";
import multer from "multer";
import routes from "./src/routes/index.js";
import ErrorMiddleware from "./src/middlewares/error.middleware.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(ErrorMiddleware.handleErrorBodyPost);

app.use("/api/v1", routes);
app.use("/", (__, res) => {
  res.send("<div>Welcome to the Bronze Film</div>");
});
const port = process.env.PORT || 5000;

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("mongodb connect");
    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
