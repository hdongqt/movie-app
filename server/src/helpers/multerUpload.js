import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import COMMON_HELPERS from "../helpers/common.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (__, file) => {
    return {
      folder: "movies",
      public_id: COMMON_HELPERS.convertToSlug(file.originalname.split(".")[0]),
      resource_type: "auto", // keep type file
    };
  },
  limits: { fileSize: 5 * 1024 * 1024 }, //limit size 5mb
});

export default multer({ storage: storage });
