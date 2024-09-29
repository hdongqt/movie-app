import mongoose from "mongoose";
import Movie from "../src/models/movie.model.js";
import Country from "../src/models/country.model.js";
import Episode from "../src/models/episode.model.js";
import Genre from "../src/models/genre.model.js";
import User from "../src/models/user.model.js";
import Comment from "../src/models/comment.model.js";

const seedData = async () => {
  const user = new User({
    email: "test@gmail.com",
    displayName: "Test",
    role: "user",
  });
  user.setPassword("123456");
  await user.save();
};

export async function up() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    await seedData();
  } catch (error) {
    console.log(error);
  }
}

export async function down(db, __) {
  // Xóa bảng movies khỏi cơ sở dữ liệu
  try {
    await db.dropCollection("movies");
    await db.dropCollection("countries");
    await db.dropCollection("episodes");
    await db.dropCollection("genres");
    await db.dropCollection("images");
    await db.dropCollection("people");
    await db.dropCollection("comments");
    await db.dropCollection("users");
  } catch (error) {
    console.log(error);
  }
}
