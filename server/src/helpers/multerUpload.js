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
      resource_type: "auto",
      transformation: [{ quality: 80, fetch_format: "webp" }],
    };
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb
});

const convertLinkToWebp = async (url) => {
  if (!url) return null;
  try {
    const uploadResponse = await cloudinary.uploader.upload(url, {
      resource_type: "image",
      transformation: [{ quality: 80, fetch_format: "webp" }],
    });
    return uploadResponse.secure_url || null;
  } catch (error) {
    console.error("Error processing the image:", error);
    throw error;
  }
};

export { convertLinkToWebp };
export default multer({ storage: storage });
